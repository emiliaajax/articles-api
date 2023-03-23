import express from 'express'

export const router = express.Router()

/**
 * Resolves a PostsController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a TasksController object.
 */
const resolvePostsController = (req) => req.app.get('container').resolve('PostsController')

router.param('id', (req, res, next, id) => resolvePostsController(req).loadPost(req, res, next, id))
