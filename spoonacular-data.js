const urllib = require('urllib')
const errors = require('./errors/errors')

module.exports = function (accessKey) {
    if (!accessKey) {
        throw "Invalid accessKey"
    }

    async function getPopular() {
        const response = await urllib.request(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${accessKey}&sort=popularity`)
        return JSON.parse(response.data)
    }
    
    async function searchByName(name) {
        const response = await urllib.request(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${accessKey}&titleMatch=${name}`)
        return JSON.parse(response.data)
    }
    
    async function getRecipe(id, simpleFlag) {
        const response = await urllib.request(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${accessKey}&includeNutrition=true`)
        const parsedData = JSON.parse(response.data)
        if (!parsedData) return errors.NOT_FOUND(recipeId)
    
        if (simpleFlag) {
            return {
                "id": parsedData.id,
                "title": parsedData.title,
                "summary": parsedData.summary,
                "image": parsedData.image,
                "calories": extractCalories(parsedData),
                "sourceUrl": parsedData.sourceUrl//,
                //"extendedIngredients": parsedData.extendedIngredients
            }
    
        } else {
            return parsedData
        }
    }
    
    function extractCalories(data) {
        const calories = data.nutrition.nutrients.find(nutrient => nutrient.name == "Calories")
        if (calories) return calories.amount
        return "unavailable"
    }

    return {
        getPopular: getPopular,
        searchByName: searchByName,
        getRecipe: getRecipe
    }
}

