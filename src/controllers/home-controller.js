import { LinkBuilder } from '../util/link-builder.js'

export class HomeController {
  /**
   * The link builder.
   */
  #linkBuilder

  /**
   * Initializes a new instance.
   *
   * @param {LinkBuilder} linkBuilder A link builder instantiated from a class with the same capabilites as LinkBuilder.
   */
  constructor(linkBuilder) {
    this.#linkBuilder = linkBuilder
  }

  /**
   * API entrypoint.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  index (req, res, next) {
    try {
      this.#linkBuilder.addSelfLinkGetMethod()
      this.#linkBuilder.addArticlesPageLink('/articles')
      this.#linkBuilder.addCreateArticleLink('/articles')
      this.#linkBuilder.addRegisterUserLink('/users/register')
      this.#linkBuilder.addLoginUserLink('/users/login')

      const response = {
        _links: this.#linkBuilder.build()
      }

      res
        .json(response)
    } catch (error) {
      next(error)
    }
  }
}
