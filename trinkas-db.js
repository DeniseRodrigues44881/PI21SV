const errors = require('./errors/errors')
const fetch = require('node-fetch')

const host = 'localhost'
const port = 9200
const baseUrl = `http://${host}:${port}`

module.exports = function (host, port) {

    if (!host) {
        throw "Invalid host"
    }
    if (!port) {
        throw "Invalid port"
    }

    const IdGenerator = {
        id: 0,
        initialized: false,
        newId: function () { return this.id++ },
        changeState: function (value) {
            this.initialized = true
            this.id = value
        }
    }

    async function startIdGenerator() {
        const response = await fetch(`${baseUrl}/groups/_search`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            content: {
                "query": {
                    "match_all": {}
                }
            }
        })
        try {
            const groups = await response.json().then(res => res.hits.hits)
            let lastId = -1
            if (groups) {
                groups.forEach(element => {
                    if (element._id > lastId) lastId = element._id
                });
            }
        } catch (e) {
            lastId = 0
        }
        
        IdGenerator.changeState(++lastId)
    }

    async function createGroup(name, desc) {
        if (IdGenerator.initialized == false) await startIdGenerator()
        const response = await fetch(`${baseUrl}/groups/_doc/${IdGenerator.newId()}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": name,
                "description": desc,
                "recipes": []
            })
        })
        return response.json()
    }

    async function editGroup(groupId, name, desc) {
        const response = await fetch(`${baseUrl}/groups/_update/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "script": {
                    "source": "ctx._source.name = params.name; ctx._source.description = params.desc",
                    "lang": "painless",
                    "params": {
                        "name": name,
                        "desc": desc
                    }
                }
            })
        })
        return response.json()
    }

    async function deleteGroup(groupId) {
        const response = await fetch(`${baseUrl}/groups/_doc/${groupId}`, {
            method: 'DELETE'
        })
        return response.json()
    }

    async function listGroups() {
        const response = await fetch(`${baseUrl}/groups/_search?size=100`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.json().then(res => res.hits.hits)
    }

    async function getGroup(groupId) {
        const response = await fetch(`${baseUrl}/groups/_doc/${groupId}`, {
            method: 'GET'
        })
        return response.json().then(res => (res.found) ? res : null)
    }

    async function addRecipe(groupId, recipes) {
        const response = await fetch(`${baseUrl}/groups/_update/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "script": {
                    "source": "ctx._source.recipes = params.recipes;",
                    //"source": "ctx._source.recipes.add(params.recipe);",
                    "lang": "painless",
                    "params": {
                        "recipes": recipes
                    }
                }
            })
        })
        return response.json()
    }

    async function removeRecipe(groupId, recipes) {
        const response = await fetch(`${baseUrl}/groups/_update/${groupId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "script": {
                    "source": "ctx._source.recipes = params.recipes",
                    "lang": "painless",
                    "params": {
                        "recipes": recipes
                    }
                }
            })
        })
        return response.json()
    }

    async function getRecipesByAverage(groupId, min, max, cb) {
        if (isNaN(min) | isNaN(max) | min > max) return errors.BAD_REQUEST()

        await getGroup(groupId, (err, group) => {
            if (err) return err

            const recipes = group.recipes
            const selected = recipes.filter(recipe => recipe.calories >= parseFloat(min) && recipe.calories <= parseFloat(max))
            selected.sort(function (a, b) { return b.calories - a.calories })

            return { results: selected }
        })
    }

    return {
        createGroup: createGroup,
        editGroup: editGroup,
        deleteGroup: deleteGroup,
        listGroups: listGroups,
        getGroup: getGroup,
        addRecipe: addRecipe,
        removeRecipe: removeRecipe,
        getRecipesByAverage: getRecipesByAverage
    }
}







