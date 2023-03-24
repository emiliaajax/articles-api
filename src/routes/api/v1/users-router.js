import express from 'express'

export const router = express.Router()

/**
 * Resolves a UsersController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a UsersController object.
 */
const resolveUsersController = (req) => req.app.get('container').resolve('UsersController')

router.post('/register', (req, res, next) => resolveUsersController(req).register(req, res, next))

router.post('/login', (req, res, next) => resolveUsersController(req).login(req, res, next))
