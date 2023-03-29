import express from 'express'

export const router = express.Router()

/**
 * Resolves a PostsController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a PostsController object.
 */
const resolveArticlesController = (req) => req.app.get('container').resolve('ArticlesController')

router.param('id', (req, res, next, id) => resolveArticlesController(req).loadArticle(req, res, next, id))

router.get('/', (req, res, next) => resolveArticlesController(req).findAll(req, res, next))

router.get('/:id', (req, res, next) => resolveArticlesController(req).find(req, res, next))

router.post('/',
  (req, res, next) => resolveArticlesController(req).authenticate(req, res, next),
  (req, res, next) => resolveArticlesController(req).create(req, res, next)
)

router.put('/:id',
  (req, res, next) => resolveArticlesController(req).authenticate(req, res, next),
  (req, res, next) => resolveArticlesController(req).authorize(req, res, next),
  (req, res, next) => resolveArticlesController(req).update(req, res, next)
)

router.delete('/:id',
  (req, res, next) => resolveArticlesController(req).authenticate(req, res, next),
  (req, res, next) => resolveArticlesController(req).authorize(req, res, next),
  (req, res, next) => resolveArticlesController(req).delete(req, res, next)
)
