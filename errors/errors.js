module.exports = {
    BAD_REQUEST: badRequest,
    BAD_GROUP_ID: badGroupID,
    BAD_RECIPE_ID: badRecipeID,
    GROUP_NOT_FOUND: groupNotFound,
    RECIPE_NOT_FOUND: recipeNotFound,
    DUPLICATE_RECIPE: duplicateRecipe
}

function badRequest() {
    return {
        code: 400,
        error: `Bad Request :(`
    }
}

function badGroupID(id) {
    return {
        code: 400,
        error: `${id} is not a valid group ID`
    }
}

function badRecipeID(id) {
    return {
        code: 400,
        error: `${id} is not a valid recipe ID`
    }
}

function groupNotFound(id) {
    return {
        code: 404,
        error: `group ${id} not found`
    }
}

function recipeNotFound(id) {
    return {
        code: 404,
        error: `recipe ${id} not found`
    }
}

function duplicateRecipe(groupId, recipeId) {
    return {
        code: 409,
        error: `Recipe with ID: ${recipeId.toString()} already exists in group with ID: ${groupId.toString()}.`
    }
}