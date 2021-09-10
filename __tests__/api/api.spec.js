const frisby = require('frisby');
const serverBase = 'http://localhost:1904'
const Joi = frisby.Joi

test('verify covida-server is running', function () {
    return frisby.get(`${serverBase}/trinkas/api`)
        .expect('status', 200)
})

describe('Getting popular recipes', () => {
    test('gettting a list of the most popular recipes', () => {
        return frisby.get(`${serverBase}/trinkas/api/popular`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                results: Joi.array().required(),
                offset: Joi.number().required(),
                number: Joi.number().required(),
                totalResults: Joi.number().required()
            })
            .expect('jsonTypes', 'results.*', {
                id: Joi.number().required(),
                title: Joi.string().required(),
                image: Joi.string().required(),
                imageType: Joi.string().required()
            })
    })
})

describe('Searching for a recipe', () => {
    test('searching for a recipe with a limit of 50 results', () => {
        return frisby.get(`${serverBase}/trinkas/api/search?name=beef`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                results: Joi.array().required(),
                offset: Joi.number().required(),
                number: Joi.number().required(),
                totalResults: Joi.number().required()
            })
            .expect('jsonTypes', 'results.*', {
                id: Joi.number().required(),
                title: Joi.string().required(),
                image: Joi.string().required(),
                imageType: Joi.string().required()
            })
    })
})

let createdGroup1
let createdGroup2

describe('Group creation', () => {
    test('creating a group', () => {
        return frisby.post(`${serverBase}/trinkas/api/group`, {
            name: 'new',
            description: 'new group for testing purposes'
        })
            .expect('status', 201)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                id: Joi.number().required(),
                result: Joi.string().required()
            })
            .then((res) => {
                createdGroup1 = res.json.created;
            })
    })

    test('creating another group', () => {
        return frisby.post(`${serverBase}/trinkas/api/group`, {
            name: 'new',
            description: 'new group for testing purposes'
        })
            .expect('status', 201)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                id: Joi.number().required(),
                result: Joi.string().required()
            })
            .then((res) => {
                createdGroup2 = res.json.created;
            })
    })

    test('bad request to create group', () => {
        return frisby.post(`${serverBase}/trinkas/api/group`, {})
            .expect('status', 400)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
})
/*
describe('Group editing', () => {
    test('editing a group', () => {
        return frisby.put(`${serverBase}${createdGroup1}`, {
            name: 'edited',
            description: 'edited'
        })
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                edited: `${createdGroup1}`
            })
    })

    test('giving an invalid ID', () => {
        return frisby.put(`${serverBase}/trinkas/api/group/rjdjdgf`, {})
            .expect('status', 400)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })

    test('trying to edit non-existent group', () => {
        return frisby.put(`${serverBase}/trinkas/api/group/${parseIDfromPath(createdGroup1) + 5}`, {})
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
})

describe('Deleting a group', () => {
    test('deleting a single group using its id', () => {
        return frisby.del(`${serverBase}${createdGroup1}`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                deleted: Joi.string().required()
            })
    })

    test('giving an invalid ID', () => {
        return frisby.del(`${serverBase}/trinkas/api/group/rjdjdgf`, {})
            .expect('status', 400)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })

    test('trying to delete non-existent group', () => {
        return frisby.del(`${serverBase}/trinkas/api/group/${parseIDfromPath(createdGroup1) + 5}`, {})
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
})

describe('List all groups', () => {
    test('getting a list with all existing groups', () => {
        return frisby.get(`${serverBase}/trinkas/api/group/list`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', '*', {
                id: Joi.number().required(),
                name: Joi.string().required(),
                description: Joi.string().required(),
                recipes: Joi.array().required()
            })
    })
})

describe('Get specific group', () => {
    test('getting a specific group using its id', () => {
        return frisby.get(`${serverBase}${createdGroup2}`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                id: parseIDfromPath(createdGroup2),
                name: Joi.string().required(),
                description: Joi.string().required(),
                recipes: Joi.array().required()
            })
    })

    test('trying to get a non-existent group', () => {
        return frisby.get(`${serverBase}/trinkas/api/group/${parseIDfromPath(createdGroup1) + 5}`, {})
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
})
/*
describe('Recipe adding', () => {
    test('adding a recipe', () => {
        return frisby.post(`${serverBase}${createdGroup2}/recipe`, {
            recipeId: 715424
        })
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                id: parseIDfromPath(createdGroup2),
                name: Joi.string().required(),
                description: Joi.string().required(),
                recipes: Joi.array().required()
            })
    })

    test('adding another recipe', () => {
        return frisby.post(`${serverBase}${createdGroup2}/recipe`, {
            recipeId: 776505
        })
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                id: parseIDfromPath(createdGroup2),
                name: Joi.string().required(),
                description: Joi.string().required(),
                recipes: Joi.array().required()
            })
    })

    test('trying to add recipe to a non-existent group', () => {
        return frisby.post(`${serverBase}/trinkas/api/group/${parseIDfromPath(createdGroup1) + 5}/recipe`, {
            recipeId: 776505
        })
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
})

describe('Removing a recipe', () => {
    test('removing a recipe from a group', () => {
        return frisby.del(`${serverBase}${createdGroup2}/recipe/715424`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                deleted: Joi.string().required()
            })
    })

    test('giving an invalid group ID', () => {
        return frisby.del(`${serverBase}/trinkas/api/group/rjdjdgf/recipe/715424`, {})
            .expect('status', 400)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })

    test('trying to remove recipe from non-existent group', () => {
        return frisby.del(`${serverBase}/trinkas/api/group/${parseIDfromPath(createdGroup1) + 5}/recipe/715424`, {})
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })

    test('giving an invalid recipe ID', () => {
        return frisby.del(`${serverBase}${createdGroup2}/recipe/rjdjdgf`, {})
            .expect('status', 400)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })

    test('trying to remove non-existent recipe from group', () => {
        return frisby.del(`${serverBase}${createdGroup2}/recipe/999`, {})
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
})
/*
describe('Get recipes by range', () => {
    test('getting recipes in a given calorie range from a group', () => {
        return frisby.get(`${serverBase}${createdGroup2}/recipe/range?min=1&max=100000`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                results: Joi.array().required(),
            })
            .expect('jsonTypes', 'results.*', {
                id: Joi.number().required(),
                title: Joi.string().required(),
                summary: Joi.string().required(),
                image: Joi.string().required(),
                calories: Joi.number().required()
            })
    })

    test('trying to get recipes from non-existent group', () => {
        return frisby.get(`${serverBase}/trinkas/api/group/${parseIDfromPath(createdGroup1) + 5}/recipe/range?min=1&max=100000`)
            .expect('status', 404)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })

    test('trying to get recipes with bad calorie limits', () => {
        return frisby.get(`${serverBase}/trinkas/api/group/${parseIDfromPath(createdGroup1) + 5}/recipe/range?min=100000&max=1`)
            .expect('status', 400)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
})

describe('Get recipe from Id', () => {
    test('getting a recipe with cooking instructions', () => {
        return frisby.get(`${serverBase}/trinkas/api/recipe/715424`)
            .expect('status', 200)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            .expect('jsonTypes', {
                id: Joi.number().required(),
                title: Joi.string().required(),
                summary: Joi.string().required(),
                image: Joi.string().required(),
                calories: Joi.number().required(),
                sourceUrl: Joi.string().required(),
                extendedIngredients: Joi.array().required(),
            })
            .expect('jsonTypes', 'extendedIngredients.*', {
                id: Joi.number().required(),
                aisle: Joi.string().required(),
                image: Joi.string().required(),
                name: Joi.string().required(),
                amount: Joi.number().required()
            })
    })
})
*/
function parseIDfromPath(path) {
    const parts = path.split('/')
    return parseInt(parts[parts.length - 1])
}