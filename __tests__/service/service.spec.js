const mockLocalDB = {
    createGroup: async (name, description) => mockResult(null, 'created'),
    editGroup: async (groupId, name, description) => mockGroup(groupId, name, description),
    deleteGroup: async (groupId) => true,
    listGroups: async () => [mockGroup(0), mockGroup(1), mockGroup(2), mockGroup(3)],
    getGroup: async (groupId) => mockGroup(groupId),
    addRecipe: async (groupId, recipeId) => mockGroup(groupId),
    removeRecipe: async (groupId, recipeId) => mockGroup(groupId),
    getRecipesByAverage: async (groupId, min, max) => { results: [mockRecipe, mockRecipe, mockRecipe] },
}

const mockSpoonacularDB = {
    getPopular: async () => mockPopularRecipes,
    searchByName: async (name) => mockSearchBeef,
    getRecipe: async (id, simpleFlag) => mockRecipe,
}

const errors = require('pi-2021-2-li51n-trab-p1-pi2021-2-li51n-g01/errors/errors')
const services = require('pi-2021-2-li51n-trab-p1-pi2021-2-li51n-g01/trinkas-services')(mockLocalDB, mockSpoonacularDB, errors)

describe('Getting popular recipes', () => {
    test('gettting a list of the most popular recipes', done => {
        services.getPopular().then(recipes => {
            expect(recipes.offset).toBeDefined()
            expect(recipes.number).toBeDefined()
            expect(recipes.totalResults).toBeDefined()

            expect(recipes.results.constructor).toBe(Array)
            expect(recipes.results.length).toBe(recipes.number)
            recipes.results.forEach((result) => {
                expect(result).toBeTruthy()
                expect(result.id).toBeDefined()
                expect(result.title).toBeDefined()
                expect(result.image).toBeDefined()
                expect(result.imageType).toBeDefined()
            })

            done()
        })
    })
})

describe('Searching for a recipe', () => {
    test('searching for a recipe with a limit of 50 results', done => {
        services.searchByName('beef').then(recipes => {
            expect(recipes.offset).toBeDefined()
            expect(recipes.number).toBeDefined()
            expect(recipes.totalResults).toBeDefined()

            expect(recipes.results.constructor).toBe(Array)
            expect(recipes.results.length).toBe(recipes.number)
            recipes.results.forEach((result) => {
                expect(result).toBeTruthy()
                expect(result.id).toBeDefined()
                expect(result.title).toBeDefined()
                expect(result.image).toBeDefined()
                expect(result.imageType).toBeDefined()
            })

            done()
        })
    })
})

describe('Group creation', () => {
    test('creating a group', done => {
        services.createGroup('name', 'description').then(result => {
            expect(result.id).toBeGreaterThanOrEqual(0)
            expect(result.result).toBe('created')

            done()
        })
    })
})

describe('Group editing', () => {
    test('editing a group', done => {
        services.editGroup(0, 'name', 'description').then(group => {
            expect(group.id).toBe(0)
            expect(group.name).toBe('name')
            expect(group.description).toBe('description')
            expect(group.recipes.constructor).toBe(Array)

            done()
        })
    })
})

describe('Deleting a Group', () => {
    test('deleting a single group using its id', done => {
        services.deleteGroup(0).then(bool => {
            expect(bool).toBeTruthy()

            done()
        })
    })
})

describe('List all Groups', () => {
    test('getting a list with all existing groups', done => {
        services.listGroups(0).then(groups => {
            expect(groups.constructor).toBe(Array)
            expect(groups.length).toBe(4)
            groups.forEach((group) => {
                expect(group).toBeTruthy()
                expect(group.id).toBeDefined()
                expect(group.name).toBe('name')
                expect(group.description).toBe('description')
                expect(group.recipes.constructor).toBe(Array)
            })

            done()
        })
    })
})

describe('Get specific group', () => {
    test('getting a specific group using its id', done => {
        services.getGroup(0).then(group => {
            expect(group.id).toBe(0)
            expect(group.name).toBe('name')
            expect(group.description).toBe('description')
            expect(group.recipes.constructor).toBe(Array)

            done()
        })
    })
})

describe('Recipe adding', () => {
    test('adding a recipe', done => {
        services.addRecipe(0, 0).then(result => {
            expect(result).toBeTruthy()
            done()
        })
    })
})

describe('Removing a recipe', () => {
    test('removing a recipe from a group', done => {
        services.removeRecipe(0, 0).then(group => {
            expect(group.id).toBe(0)
            expect(group.name).toBe('name')
            expect(group.description).toBe('description')
            expect(group.recipes.constructor).toBe(Array)

            done()
        })
    })
})

describe('Get recipes by range', () => {
    test('getting recipes in a given calorie range from a group', done => {
        services.getRecipesByAverage(0, 1, 10000).then(recipes => {
            done()
        })
    })
})

describe('Get a recipe from ID', () => {
    test('getting a recipe with cooking instructions', done => {
        services.getRecipe(715424).then(recipe => {
            expect(recipe).toBeTruthy()
            expect(recipe.id).toBeDefined()
            expect(recipe.title).toBeDefined()
            expect(recipe.summary).toBeDefined()
            expect(recipe.image).toBeDefined()
            expect(recipe.calories).toBeDefined()
            expect(recipe.sourceUrl).toBeDefined()

            expect(recipe.extendedIngredients.constructor).toBe(Array)
            recipe.extendedIngredients.forEach((ingredient) => {
                expect(ingredient).toBeTruthy()
                expect(ingredient.id).toBeDefined()
                expect(ingredient.aisle).toBeDefined()
                expect(ingredient.image).toBeDefined()
                expect(ingredient.name).toBeDefined()
                expect(ingredient.amount).toBeDefined()
            })

            done()
        })
    })
})

function mockResult(id, message) {
    return {
        _id: (id == 0 | id) ? id : 0,
        result: message
    }
}

function mockGroup(id, name, description) {
    return {
        _id: (id == 0 | id) ? id : 0,
        _source: {
            name: (name) ? name : 'name',
            description: (description) ? description : 'description',
            recipes: []
        }
    }
}

const mockPopularRecipes = {
    "results": [
        {
            "id": 715424,
            "title": "The Best Chili",
            "image": "https://spoonacular.com/recipeImages/715424-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 776505,
            "title": "Sausage & Pepperoni Stromboli",
            "image": "https://spoonacular.com/recipeImages/776505-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715449,
            "title": "How to Make OREO Turkeys for Thanksgiving",
            "image": "https://spoonacular.com/recipeImages/715449-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715560,
            "title": "World’s Greatest Lasagna Roll Ups",
            "image": "https://spoonacular.com/recipeImages/715560-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 716410,
            "title": "Cannoli Ice Cream w. Pistachios & Dark Chocolate",
            "image": "https://spoonacular.com/recipeImages/716410-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715467,
            "title": "Turkey Pot Pie",
            "image": "https://spoonacular.com/recipeImages/715467-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715419,
            "title": "Slow Cooker Spicy Hot Wings",
            "image": "https://spoonacular.com/recipeImages/715419-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 775585,
            "title": "Crockpot \"Refried\" Beans",
            "image": "https://spoonacular.com/recipeImages/775585-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 716423,
            "title": "Grilled Zucchini with Goat Cheese and Balsamic-Honey Syrup",
            "image": "https://spoonacular.com/recipeImages/716423-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715421,
            "title": "Cheesy Chicken Enchilada Quinoa Casserole",
            "image": "https://spoonacular.com/recipeImages/715421-312x231.jpg",
            "imageType": "jpg"
        }
    ],
    "offset": 0,
    "number": 10,
    "totalResults": 5076
}

const mockSearchBeef = {
    "results": [
        {
            "id": 715446,
            "title": "Slow Cooker Beef Stew",
            "image": "https://spoonacular.com/recipeImages/715446-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 769774,
            "title": "Shredded Roast Beef Stuffed Sweet Potatoes (Whole 30 & PALEO)",
            "image": "https://spoonacular.com/recipeImages/769774-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715447,
            "title": "Easy Vegetable Beef Soup",
            "image": "https://spoonacular.com/recipeImages/715447-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 641975,
            "title": "Easy Ginger Beef Broccoli",
            "image": "https://spoonacular.com/recipeImages/641975-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 640141,
            "title": "Corned Beef Ribs With Brown Sugar and Mustard Glaze",
            "image": "https://spoonacular.com/recipeImages/640141-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715523,
            "title": "Chorizo and Beef Quinoa Stuffed Pepper",
            "image": "https://spoonacular.com/recipeImages/715523-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 1000566,
            "title": "Easy Instant Pot Beef Tips and Rice",
            "image": "https://spoonacular.com/recipeImages/1000566-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 633559,
            "title": "Baked Corned Beef with Sauteed Cabbage and Baked New Potatoes",
            "image": "https://spoonacular.com/recipeImages/633559-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 660266,
            "title": "Slow Cooked Corned Beef and Cabbage",
            "image": "https://spoonacular.com/recipeImages/660266-312x231.jpg",
            "imageType": "jpg"
        },
        {
            "id": 646589,
            "title": "Hearty, Healthy Beef Stew",
            "image": "https://spoonacular.com/recipeImages/646589-312x231.jpg",
            "imageType": "jpg"
        }
    ],
    "offset": 0,
    "number": 10,
    "totalResults": 109
}

const mockRecipe = {
    "id": 715424,
    "title": "The Best Chili",
    "summary": "The recipe The Best Chili is ready <b>in about 2 hours and 10 minutes</b> and is definitely a spectacular <b>gluten free and dairy free</b> option for lovers of American food. For <b>$2.01 per serving</b>, this recipe <b>covers 29%</b> of your daily requirements of vitamins and minerals. This recipe makes 8 servings with <b>323 calories</b>, <b>33g of protein</b>, and <b>7g of fat</b> each. This recipe from Pink When has 65475 fans. It works well as a rather cheap main course. It can be enjoyed any time, but it is especially good for <b>The Super Bowl</b>. A mixture of group pepper, oregano, tomato paste, and a handful of other ingredients are all it takes to make this recipe so flavorful. To use up the white sugar you could follow this main course with the <a href=\"https://spoonacular.com/recipes/whole-wheat-refined-sugar-free-sugar-cookies-557184\">Whole Wheat Refined Sugar Free Sugar Cookies</a> as a dessert. All things considered, we decided this recipe <b>deserves a spoonacular score of 97%</b>. This score is outstanding. Try <a href=\"https://spoonacular.com/recipes/5th-annual-chili-contest-entry-2-jamaican-jerk-chili-+-weekly-menu-612833\">5th Annual Chili Contest: Entry #2 – Jamaican Jerk Chili + Weekly Menu</a> for similar recipes.",
    "image": "https://spoonacular.com/recipeImages/715424-556x370.jpg",
    "calories": 322.83,
    "sourceUrl": "http://www.pinkwhen.com/the-best-chili-recipe/",
    "extendedIngredients": [
        {
            "id": 10211821,
            "aisle": "Produce",
            "image": "bell-pepper-orange.png",
            "consistency": "solid",
            "name": "bell pepper",
            "nameClean": "bell pepper",
            "original": "1/4 cup bell pepper",
            "originalString": "1/4 cup bell pepper",
            "originalName": "bell pepper",
            "amount": 0.25,
            "unit": "cup",
            "meta": [
            ],
            "metaInformation": [
            ],
            "measures": {
                "us": {
                    "amount": 0.25,
                    "unitShort": "cups",
                    "unitLong": "cups"
                },
                "metric": {
                    "amount": 59.147,
                    "unitShort": "ml",
                    "unitLong": "milliliters"
                }
            }
        },
        {
            "id": 16034,
            "aisle": "Canned and Jarred",
            "image": "kidney-beans.jpg",
            "consistency": "solid",
            "name": "canned kidney beans",
            "nameClean": "canned kidney beans",
            "original": "1 (15 oz) can kidney beans",
            "originalString": "1 (15 oz) can kidney beans",
            "originalName": "kidney beans",
            "amount": 15,
            "unit": "oz",
            "meta": [
                "canned"
            ],
            "metaInformation": [
                "canned"
            ],
            "measures": {
                "us": {
                    "amount": 15,
                    "unitShort": "oz",
                    "unitLong": "ounces"
                },
                "metric": {
                    "amount": 425.243,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 16044,
            "aisle": "Canned and Jarred",
            "image": "pinto-beans.jpg",
            "consistency": "solid",
            "name": "canned pinto beans",
            "nameClean": "canned pinto beans",
            "original": "1 (15 oz) can pinto beans",
            "originalString": "1 (15 oz) can pinto beans",
            "originalName": "pinto beans",
            "amount": 15,
            "unit": "oz",
            "meta": [
                "canned"
            ],
            "metaInformation": [
                "canned"
            ],
            "measures": {
                "us": {
                    "amount": 15,
                    "unitShort": "oz",
                    "unitLong": "ounces"
                },
                "metric": {
                    "amount": 425.243,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 2031,
            "aisle": "Spices and Seasonings",
            "image": "chili-powder.jpg",
            "consistency": "solid",
            "name": "cayenne pepper",
            "nameClean": "ground cayenne pepper",
            "original": "1/4 tsp cayenne pepper",
            "originalString": "1/4 tsp cayenne pepper",
            "originalName": "cayenne pepper",
            "amount": 0.25,
            "unit": "tsp",
            "meta": [
            ],
            "metaInformation": [
            ],
            "measures": {
                "us": {
                    "amount": 0.25,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                },
                "metric": {
                    "amount": 0.25,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                }
            }
        },
        {
            "id": 2009,
            "aisle": "Spices and Seasonings",
            "image": "chili-powder.jpg",
            "consistency": "solid",
            "name": "chili powder",
            "nameClean": "chili powder",
            "original": "1/2 Tbsp chili powder",
            "originalString": "1/2 Tbsp chili powder",
            "originalName": "chili powder",
            "amount": 0.5,
            "unit": "Tbsp",
            "meta": [
            ],
            "metaInformation": [
            ],
            "measures": {
                "us": {
                    "amount": 0.5,
                    "unitShort": "Tbsps",
                    "unitLong": "Tbsps"
                },
                "metric": {
                    "amount": 0.5,
                    "unitShort": "Tbsps",
                    "unitLong": "Tbsps"
                }
            }
        },
        {
            "id": 1002014,
            "aisle": "Spices and Seasonings",
            "image": "ground-cumin.jpg",
            "consistency": "solid",
            "name": "cumin",
            "nameClean": "cumin",
            "original": "1 1/2 tsp cumin",
            "originalString": "1 1/2 tsp cumin",
            "originalName": "cumin",
            "amount": 1.5,
            "unit": "tsp",
            "meta": [
            ],
            "metaInformation": [
            ],
            "measures": {
                "us": {
                    "amount": 1.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                },
                "metric": {
                    "amount": 1.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                }
            }
        },
        {
            "id": 23557,
            "aisle": "Meat",
            "image": "fresh-ground-beef.jpg",
            "consistency": "solid",
            "name": "lean ground beef",
            "nameClean": "95 percent lean ground beef",
            "original": "2 lbs lean ground beef",
            "originalString": "2 lbs lean ground beef",
            "originalName": "lean ground beef",
            "amount": 2,
            "unit": "lbs",
            "meta": [
                "lean"
            ],
            "metaInformation": [
                "lean"
            ],
            "measures": {
                "us": {
                    "amount": 2,
                    "unitShort": "lb",
                    "unitLong": "pounds"
                },
                "metric": {
                    "amount": 907.185,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 11282,
            "aisle": "Produce",
            "image": "brown-onion.png",
            "consistency": "solid",
            "name": "onions",
            "nameClean": "onion",
            "original": "1 1/2 cups chopped onions",
            "originalString": "1 1/2 cups chopped onions",
            "originalName": "chopped onions",
            "amount": 1.5,
            "unit": "cups",
            "meta": [
                "chopped"
            ],
            "metaInformation": [
                "chopped"
            ],
            "measures": {
                "us": {
                    "amount": 1.5,
                    "unitShort": "cups",
                    "unitLong": "cups"
                },
                "metric": {
                    "amount": 354.882,
                    "unitShort": "ml",
                    "unitLong": "milliliters"
                }
            }
        },
        {
            "id": 2027,
            "aisle": "Produce;Spices and Seasonings",
            "image": "oregano.jpg",
            "consistency": "solid",
            "name": "oregano",
            "nameClean": "oregano",
            "original": "1/2 tsp oregano",
            "originalString": "1/2 tsp oregano",
            "originalName": "oregano",
            "amount": 0.5,
            "unit": "tsp",
            "meta": [
            ],
            "metaInformation": [
            ],
            "measures": {
                "us": {
                    "amount": 0.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                },
                "metric": {
                    "amount": 0.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                }
            }
        },
        {
            "id": 1002030,
            "aisle": "Spices and Seasonings",
            "image": "pepper.jpg",
            "consistency": "solid",
            "name": "pepper",
            "nameClean": "black pepper",
            "original": "1 tsp group black pepper",
            "originalString": "1 tsp group black pepper",
            "originalName": "group black pepper",
            "amount": 1,
            "unit": "tsp",
            "meta": [
                "black"
            ],
            "metaInformation": [
                "black"
            ],
            "measures": {
                "us": {
                    "amount": 1,
                    "unitShort": "tsp",
                    "unitLong": "teaspoon"
                },
                "metric": {
                    "amount": 1,
                    "unitShort": "tsp",
                    "unitLong": "teaspoon"
                }
            }
        },
        {
            "id": 11886,
            "aisle": "Beverages",
            "image": "tomato-juice.jpg",
            "consistency": "liquid",
            "name": "tomato juice",
            "nameClean": "tomato juice",
            "original": "1 (46 oz) can tomato juice",
            "originalString": "1 (46 oz) can tomato juice",
            "originalName": "tomato juice",
            "amount": 46,
            "unit": "oz",
            "meta": [
                "canned"
            ],
            "metaInformation": [
                "canned"
            ],
            "measures": {
                "us": {
                    "amount": 46,
                    "unitShort": "oz",
                    "unitLong": "ounces"
                },
                "metric": {
                    "amount": 1.304,
                    "unitShort": "kilogram",
                    "unitLong": "kilograms"
                }
            }
        },
        {
            "id": 11887,
            "aisle": "Pasta and Rice",
            "image": "tomato-paste.jpg",
            "consistency": "solid",
            "name": "tomato paste",
            "nameClean": "tomato paste",
            "original": "2 (6oz) cans tomato paste",
            "originalString": "2 (6oz) cans tomato paste",
            "originalName": "tomato paste",
            "amount": 12,
            "unit": "oz",
            "meta": [
                "canned"
            ],
            "metaInformation": [
                "canned"
            ],
            "measures": {
                "us": {
                    "amount": 12,
                    "unitShort": "oz",
                    "unitLong": "ounces"
                },
                "metric": {
                    "amount": 340.194,
                    "unitShort": "g",
                    "unitLong": "grams"
                }
            }
        },
        {
            "id": 14412,
            "aisle": "Beverages",
            "image": "water.png",
            "consistency": "liquid",
            "name": "water",
            "nameClean": "water",
            "original": "1 cup water",
            "originalString": "1 cup water",
            "originalName": "water",
            "amount": 1,
            "unit": "cup",
            "meta": [
            ],
            "metaInformation": [
            ],
            "measures": {
                "us": {
                    "amount": 1,
                    "unitShort": "cup",
                    "unitLong": "cup"
                },
                "metric": {
                    "amount": 236.588,
                    "unitShort": "ml",
                    "unitLong": "milliliters"
                }
            }
        },
        {
            "id": 19335,
            "aisle": "Baking",
            "image": "sugar-in-bowl.png",
            "consistency": "solid",
            "name": "white sugar",
            "nameClean": "sugar",
            "original": "1/2 tsp white sugar",
            "originalString": "1/2 tsp white sugar",
            "originalName": "white sugar",
            "amount": 0.5,
            "unit": "tsp",
            "meta": [
                "white"
            ],
            "metaInformation": [
                "white"
            ],
            "measures": {
                "us": {
                    "amount": 0.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                },
                "metric": {
                    "amount": 0.5,
                    "unitShort": "tsps",
                    "unitLong": "teaspoons"
                }
            }
        }
    ]
}
