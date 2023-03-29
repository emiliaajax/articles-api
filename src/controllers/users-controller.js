import createError from 'http-errors'

export class UsersController {
  #service
  #linkBuilder
  #endpoint

  constructor (service, linkBuilder, endpoint) {
    this.#service = service
    this.#linkBuilder = linkBuilder
    this.#endpoint = endpoint
  }

  async login(req, res, next) {
    try {
      const accessToken = await this.#service.authenticate(req.body.email, req.body.password)

      this.#linkBuilder.addSelfLinkPostMethod(`${this.#endpoint}${req.route.path}`)
      this.#linkBuilder.addAPIEntrypointLink()

      const response = {
        accessToken,
        _links: this.#linkBuilder.build()
      }

      res
        .status(201)
        .json(response)
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
  
      this.#linkBuilder.addSelfLinkPostMethod(`${this.#endpoint}${req.route.path}`)
      this.#linkBuilder.addLoginUserLink(`${this.#endpoint}/login`)

      const response = {
        _links: this.#linkBuilder.build()
      }

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
