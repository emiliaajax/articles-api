import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import createError from 'http-errors'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import { container } from './config/bootstrap.js'

try {
  await connectDB(container.resolve('ConnectionString'))

  const app = express()
  
  app.set('container', container)

  app.use(helmet())

  app.use(logger('dev'))

  app.use(express.json())

  app.use('/', router)

  app.use(function (err, req, res, next) {
    if (!err.status) {
      const cause = err
      err = createError(500)
      err.cause = cause
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }

    // Development only!
    // Only providing detailed error in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        cause: err.cause ? JSON.stringify(err.cause, Object.getOwnPropertyNames(err.cause)) : undefined,
        stack: err.stack
      })
  })

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
