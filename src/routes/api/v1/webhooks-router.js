import express from 'express'

export const router = express.Router()

/**
 * Resolves a WebhooksController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a WebhooksController object.
 */
const resolveWebhooksController = (req) => req.app.get('container').resolve('WebhooksController')

router.post('/',
  (req, res, next) => resolveWebhooksController(req).authenticate(req, res, next),
  (req, res, next) => resolveWebhooksController(req).register(req, res, next)
)
