import express from 'express'
import { router as postsRouter } from './posts-router.js'
import { router as usersRouter } from './users-router.js'

export const router = express.Router()

// router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/', postsRouter)
router.use('/auth', usersRouter)
