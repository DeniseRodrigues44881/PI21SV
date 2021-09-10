const errors = require('./errors/errors')

module.exports = function (localDB, spoonacularDB) {
    if (!localDB) {
        throw "Invalid localDB object"
    }
    if (!spoonacularDB) {
        throw "Invalid spoonacularDB object"
    }

    return {
        getPopular: getPopular,                         //spoonacularDB
        searchByName: searchByName,                     //spoonacularDB
        createGroup: createGroup,                       //localDB
        editGroup: editGroup,                           //localDB
        deleteGroup: deleteGroup,                       //localDB
        listGroups: listGroups,                         //localDB
        getGroup: getGroup,                             //localDB
        addRecipe: addRecipe,                           //spoonacularDB && localDB
        removeRecipe: removeRecipe,                     //localDB
        getRecipesByAverage: getRecipesByAverage,       //spoonacularDB && localDB
        getRecipe: getRecipe                            //spoonacularDB
    }

    async function getPopular() {
        return await spoonacularDB.getPopular()
    }

    async function searchByName(name) {
        return await spoonacularDB.searchByName(name)
    }

    async function createGroup(groupName, groupDescription) {
        const result = await localDB.createGroup(groupName, groupDescription)
        return { 'id': result._id, 'result': result.result }
    }

    async function editGroup(groupId, groupName, groupDescription) {
        const group = await localDB.editGroup(groupId, groupName, groupDescription)
        return {
            id: group._id,
            name: group._source.name,
            description: group._source.description,
            recipes: group._source.recipes
        }
    }

    async function deleteGroup(groupId) {
        return await localDB.deleteGroup(groupId)
    }

    async function listGroups() {
        const groups = await localDB.listGroups()
        let res = []
        groups.forEach(element => {
            res.push(
                {
                    id: element._id,
                    name: element._source.name,
                    description: element._source.description,
                    recipes: element._source.recipes
                }
            )
        });
        return res
    }

    async function getGroup(groupId) {
        const group = await localDB.getGroup(groupId)
        if (group)
            return {
                id: group._id,
                name: group._source.name,
                description: group._source.description,
                recipes: group._source.recipes
            }
        return null
    }

    async function addRecipe(groupId, recipeId) {
        let group = await getGroup(groupId)

        const found = searchRecipes(group.recipes, recipeId)
        if (found) return errors.DUPLICATE_RECIPE(groupId, recipeId)

        spoonacularDB.getRecipe(recipeId, true).then(recipe => {
            let recipes
            if (group.recipes) {
                recipes = group.recipes
                recipes.push(recipe)
            } else {
                recipes = [recipe]
            }
            localDB.addRecipe(groupId, recipes, (err, group) => {
                if (err) return err
                return group
            })
        })
        return true
    }

    async function removeRecipe(groupId, recipeId) {
        const group = await localDB.removeRecipe(groupId, recipeId)
        if (group)
            return {
                id: group._id,
                name: group._source.name,
                description: group._source.description,
                recipes: group._source.recipes
            }
        return null
    }

    async function getRecipesByAverage(groupId, min, max) {
        return await localDB.getRecipesByAverage(groupId, min, max)
    }

    async function getRecipe(recipeId) {
        return await spoonacularDB.getRecipe(recipeId, true)
    }

    function searchRecipes(recipes, recipeId) {
        if (recipes) {
            for (let i = 0; i < recipes.length; i++)
                if (recipes[i].id == recipeId)
                    return true
        }
        return false
    }
}
