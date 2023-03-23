import express from 'express'

export const router = express.Router()

/**
 * Resolves a PostsController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a PostsController object.
 */
const resolvePostsController = (req) => req.app.get('container').resolve('PostsController')

router.param('id', (req, res, next, id) => resolvePostsController(req).loadPost(req, res, next, id))

router.get('/', (req, res, next) => resolvePostsController(req).findAll(req, res, next))

router.get('/:id', (req, res, next) => resolvePostsController(req).find(req, res, next))

router.post('/', (req, res, next) => resolvePostsController(req).create(req, res, next))

// DELETE tasks/:id
router.delete('/:id', (req, res, next) => resolvePostsController(req).delete(req, res, next))
