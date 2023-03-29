import createError from 'http-errors'

export class UsersController {
  #service
  #linkBuilder

  constructor (service, linkBuilder) {
    this.#service = service
    this.#linkBuilder = linkBuilder
  }

  async login(req, res, next) {
    try {
      const accessToken = await this.#service.authenticate(req.body.email, req.body.password)

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
  
      this.#linkBuilder.addSelfLinkPostMethod(`${req.protocol}://${req.get('host')}${req.baseUrl}${req.route.path}`)
      this.#linkBuilder.addLoginUserLink(`${req.protocol}://${req.get('host')}${req.baseUrl}/login`)

      const response = {
        _links: this.#linkBuilder.build()
      }

      this.#linkBuilder.reset()

      res
        .status(201)
        .json(response)
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
