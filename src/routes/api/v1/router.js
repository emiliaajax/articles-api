import express from 'express'
import { router as postsRouter } from './posts-router.js'
import { router as usersRouter } from './users-router.js'
import { router as webhooksRouter } from './webhooks-router.js'

export const router = express.Router()

router.use('/', postsRouter)
router.use('/auth', usersRouter)
router.use('/webhooks', webhooksRouter)
