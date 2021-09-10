module.exports = function (services) {

    if (!services) {
        throw "Invalid services object"
    }

    const router = require('express').Router()

    router.get('/popular', (req, rsp, _) => {
        services.getPopular()
            .then(res => rsp.json(res))
    })

    router.get('/search', (req, rsp, _) => {
        const name = req.query.name

        services.searchByName(name)
            .then(res => rsp.json(res))
    })

    router.post('/group', (req, rsp, _) => {
        const obj = req.body
        const groupName = obj.name
        const groupDescription = obj.description

        if (!groupName) {
            rsp.status(400)
            rsp.json({})
        } else {
            services.createGroup(groupName, groupDescription || "")
                .then(res => {
                    rsp.status(201)
                    rsp.json(res)
                })
        }
    })

    router.put('/group/:groupId', (req, rsp, _) => {
        const groupId = req.params.groupId
        const groupName = req.body.name
        const groupDescription = req.body.description

        services.editGroup(groupId, groupName, groupDescription)
            .then(res => rsp.json(res))
    })

    router.delete('/group/:groupId', (req, rsp, _) => {
        const groupId = req.params.groupId

        services.deleteGroup(groupId)
            .then(res => rsp.json(res))
    })

    router.get('/group/list', (req, rsp, _) => {
        services.listGroups()
            .then(res => rsp.json(res))
    })

    router.get('/group/:groupId', (req, rsp, _) => {
        const groupId = req.params.groupId

        services.getGroup(groupId)
            .then(res => rsp.json(res))
    })

    router.post('/group/:groupId/recipe', (req, rsp, _) => {
        const groupId = req.params.groupId
        const recipeId = req.body.recipeId

        services.addRecipe(groupId, recipeId)
            .then(res => rsp.json(res))
    })

    router.delete('/group/:groupId/recipe/:recipeId', (req, rsp, _) => {
        const groupId = req.params.groupId
        const recipeId = req.params.recipeId

        services.removeRecipe(groupId, recipeId)
            .then(res => rsp.json(res))
    })

    router.get('/group/:groupId/recipe/range', (req, rsp, _) => {
        const groupId = req.params.groupId
        const min = req.query.min
        const max = req.query.max

        if (!min) min = 0
        if (!max) max = Number.MAX_VALUE

        services.getRecipesByAverage(groupId, min, max)
            .then(res => rsp.json(res))
    })

    router.get('/recipe/:recipeId', (req, rsp, _) => {
        const recipeId = req.params.recipeId

        services.getRecipe(recipeId)
            .then(res => rsp.json(res))
    })

    router.get('/', (req, rsp, _) => {
        rsp
            .status(200)
            .json({
                'name': 'TRINKAS api',
                'version': '1.0.0',
                'description': 'PI TRINKAS API running'
            })
    })

    return router
}