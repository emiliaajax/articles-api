import express from 'express'
import { router as postsRouter } from './postsRouter.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/posts', postsRouter)
