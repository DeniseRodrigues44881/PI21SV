module.exports = function (services) {

    if (!services) {
        throw "Invalid TasksServices object"
    }

    const router = require('express').Router()
    //const users = require('users.json').init()

    router.get('/popular', (req, rsp, _) => {
        services.getPopular(req.query.limit || 10)
            .then(res => {
                rsp.render('popular', { title: "Top 10 Recipes", recipes: res.results })
            })
    })

    router.get('/search', (req, rsp, _) => {
        services.searchByName(req.query.text)
            .then(res => {
                rsp.render('home', { title: "Trinkas", search: req.query.text, recipes: res.results, total: res.totalResults, action: "search", viewGroups: "group/list", popular: "popular" })
            })
    })

    router.post('/group', (req, rsp, _) => {
        if (!req.body.name) {
            sendBadRequest(req, rsp)
        } else {
            services.createGroup(req.body.name, req.body.desc || "")
                .then(_ => {
                    rsp.status(201)
                    rsp.redirect("list")
                })
        }
    })

    router.get('/group/create', (req, rsp, _) => {
        rsp.render('new-group', { title: "Create a new group" })
    })

    router.put('/group/:groupId', (req, rsp, _) => {
        if (!req.body.name && !req.body.desc) {
            rsp.status(400)
            rsp.json({})
        } else {
            services.editGroup(req.params.groupId, req.body.name, req.body.desc)
                .then(res => {
                    if (res) {
                        rsp.json(res)
                    } else {
                        sendNotFound(req, rsp)
                    }
                })
        }
    })

    router.post('/group/:groupId/delete', (req, rsp, _) => {
        services.deleteGroup(req.params.groupId)
            .then(res => {
                if (res.result == 'not_found') {
                    sendNotFound(req, rsp)
                } else {
                    rsp.redirect("../list")
                }
            })
    })

    router.get('/group/list', (req, rsp, _) => {
        services.listGroups()
            .then(res => {
                rsp.render('groups', { title: "Your groups", groups: res })
            })
    })

    router.get('/group/:groupId', (req, rsp, _) => {
        const a = services.getGroup(req.params.groupId)
            .then(res => {
                if (res) {
                    const group = res
                    rsp.render('group', { title: "Group details", name: group.name, description: group.description, recipes: group.recipes })
                } else {
                    sendNotFound(req, rsp)
                }
            })

        /*services.getRecipe(req.params.recipeId)
            .then(res => {
                if (res) {
                    rsp.render('recipe', { title: "Recipe details", name: res.name, summary: res.summary, url: res.url })
                } else {
                    sendNotFound(req, rsp)
                }
            })*/
    })

    router.post('/group/recipe', (req, rsp, _) => {
        if (req.body.recipeId == undefined) {
            sendBadRequest(req, rsp)
        } else {
            services.addRecipe(req.body.groupId, req.body.recipeId)
                .then(res => {
                    if (res) {
                        if (res == "duplicate") {
                            rsp.status(409)
                            rsp.json({})
                        } else {
                            rsp.redirect(`../group/${req.body.groupId}`)
                        }
                    } else {
                        sendNotFound(req, rsp)
                    }
                })
        }
    })

    router.post('/group/:groupId/:recipeId/delete', (req, rsp, _) => {
        services.removeRecipe(req.params.groupId, req.params.recipeId)
            .then(res => {
                if (res) {
                    rsp.json(res)
                } else {
                    sendNotFound(req, rsp)
                }
            })
    })

    router.get('/group/:groupId/recipe/range', (req, rsp, _) => {
        const groupId = req.params.groupId
        const min = req.query.min
        const max = req.query.max

        if (!min) min = 0
        if (!max) max = Number.MAX_VALUE

        services.getRecipesByAverage(req.params.groupId, min, max)
            .then(res => {
                if (res) {
                    if (res == "no-content") {
                        rsp.status(204)
                        rsp.json({})
                    } else {
                        rsp.json(res)
                    }
                } else {
                    sendNotFound(req, rsp)
                }
            })
    })

    router.get('/recipe/:recipeId', (req, rsp, _) => {
        services.getRecipe(req.params.recipeId)
            .then(res => {
                if (res) {
                    const recipe = res
                    services.listGroups()
                        .then(res2 => {
                            rsp.render('recipe', { title: "Recipe details", recipeId: req.params.recipeId, recipeName: recipe.title, image: recipe.image, summary: recipe.summary, url: recipe.sourceUrl, groups: res2 })
                        })
                } else {
                    sendNotFound(req, rsp)
                }
            })
    })

    router.get('/login', (req, rsp, _) => {
        rsp.render('login', { title: "Login", home: "/trinkas/app", login: "../login", logout: "../logout", register: "../register" })
    })

    router.get('/', (req, rsp, _) => {
        rsp.render('home', { title: "Trinkas", login: "app/login", viewGroups: "app/group/list", searchPath: "app/search", popular: "app/popular" })
    })

    router.delete('/users/:username/group/:gId', isAuthenticated, handlerUserRemoveGroup)
    router.get('/users/:username/group/:gID', isAuthenticated, handlerUserGroupGetDetails)
    router.delete('/users/:username/group/:groupID/recipes/:recipeID', isAuthenticated, handlerUserGroupRemoveRecipe)
    router.get('/users/:username', isAuthenticated, handlerUserDetails)
    router.post('/users/:username', isAuthenticated, handlerUserAddGroup)

    function Error(msg, uri) {
        this.error = msg;
        this.uri = uri;
    }

    function sendBadRequest(req, rsp) {
        rsp.status(400).json(new Error("Bad request", req.originalUrl));
    }

    function sendNotFound(req, rsp) {
        rsp.status(404).json(new Error("Resource not found", req.originalUrl));
    }

    function sendChangeSuccess(req, rsp, id, changeType, urlSuffix = "") {
        rsp.json({
            status: `group with id ${id} ${changeType}`,
            uri: req.originalUrl + urlSuffix,
        });
    }

    function isAuthenticated(req, rsp, next) {
        if (req.username) next()
        else rsp.redirect('/trinkas/app/login')
    }

    function handlerUserGroupGetDetails(req, rsp, next) {
        const username = req.params.username
        const groupID = req.params.gID

        services.getGroupFromUser(username, groupID)
            .then(() => services.getGroup(groupID))
            .then(group => {
                if (req.user.username != username)
                    rsp.render('userGroupRecipesNoPerms', { "group": group })
                else
                    rsp.render('userGroupRecipes', { "group": group })

            })
            .catch(next)
    }

    function handlerUserGroupRemoveRecipe(req, rsp, next) {
        const username = req.params.username
        if (req.user.username != username) return
        const groupId = req.params.gID
        const recipeId = req.params.recipeId
        services
            .removeRecipe(groupId, recipeId)
            .then(() => rsp.redirect('/trinkas/app/users/' + username + '/group/' + group))
            .catch(next)
    }

    function handlerUserRemoveGroup(req, rsp, next) {
        const username = req.params.username
        if (req.user.username != username) return
        services
            .deleteGroup(req.params.groupId)
            .then(users.deleteGroup(username, req.params.groupId))
            .then(() => rsp.redirect('/trinkas/app/users/' + username))
            .catch(next)
    }

    function handlerUserAddGroup(req, rsp, next) {
        const username = req.params.username
        if (req.user.username != username) return
        const groupName = req.body.groupName
        const groupDescription = req.body.groupDescription
        services
            .createGroup(groupName, groupDescription)
            .then(group => users.addGroup(username, group))
            .then(() => resp.redirect('/trinkas/app/users/' + username))
            .then((group) => {
                rsp.redirect('/trinkas/app/users/' + username)
            })
            .catch(next)
    }

    function handlerUserDetails(req, rsp, next) {
        const username = req.params.username
        users
            .getUser(username)
            .then(user => {
                if (!user) {
                    const err = new Error('There is no user with username: ' + username)
                    err.status = 404
                    return next(err)
                }
                rsp.render('userDetails', user)
                if (req.user.username != username)
                    resp.render('userDetailsNoPerms', user)
                else
                    resp.render('userDetails', user)
            })
            .catch(next)
    }

    return router
}