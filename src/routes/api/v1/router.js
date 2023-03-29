import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as postsRouter } from './posts-router.js'
import { router as usersRouter } from './users-router.js'
import { router as webhooksRouter } from './webhooks-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/articles', postsRouter)
router.use('/users', usersRouter)
router.use('/webhooks', webhooksRouter)
