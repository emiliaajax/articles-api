import createError from 'http-errors'

export class UsersController {
  #service

  constructor (service) {
    this.#service = service
  }

  async login(req, res, next) {
    try {
      const accessToken = await this.#service.authenticate(req.body.email, req.body.password)

      console.log(accessToken)

      res
        .status(201)
        .json(accessToken)
    } catch (error) {
      const err = createError(401)
      err.cause = error
      err.message = 'Invalid email or password'
      next(err)
    }
  }

  async register(req, res, next) {
    try {
      await this.#service.insert({ email: req.body.email, password: req.body.password })

      res
        .status(201)
        .end()
    } catch (error) {
      let err = error
      if (err.code === 11000) {
        err = createError(409)
        err.message = 'Email is already in use'
      } else if (error.name === 'ValidationError') {
        err = createError(400)
      }

      next(err)
    }
  }
}