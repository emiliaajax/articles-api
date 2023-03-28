
export class WebhooksController {
  #service

  constructor(service) {
    this.#service = service
  }

  async register(req, res, next) {
    try {
      await this.#service.insert(req.body.url)

      res
        .status(201)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
