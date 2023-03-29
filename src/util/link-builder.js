/**
 * Represents a link builder.
 */
export class LinkBuilder {
  /**
   * The links object.
   */
  #links = {}
  /**
   * The base url.
   */
  #baseUrl

  /**
   * Creates an instance representing a LinkBuilder.
   *
   * @param {string} baseUrl The base URL for the links.
   */
  constructor(baseUrl) {
    this.#baseUrl = baseUrl
  }

  /**
   * Add a self link with a GET method to the link object.
   *
   * @param {string} [url=''] The URL for the self link.
   */
  addSelfLinkGetMethod(url = '') {
    this.#links.self = {
      href: `${this.#baseUrl}${url}`,
      rel: 'self',
      method: 'GET'
    }
  }

  /**
   * Add a self link with a POST method to the link object.
   *
   * @param {string} [url=''] The URL for the self link.
   */
  addSelfLinkPostMethod(url = '') {
    this.#links.self = {
      href: `${this.#baseUrl}${url}`,
      rel: 'self',
      method: 'POST'
    }
  }

  /**
   * Add a self link with a PUT method to the link object.
   *
   * @param {string} [url=''] The URL for the self link.
   */
  addSelfLinkPutMethod(url = '') {
    this.#links.self = {
      href: `${this.#baseUrl}${url}`,
      rel: 'self',
      method: 'PUT'
    }
  }

  /**
   * Add an API entry point link to the link object.
   */
  addAPIEntrypointLink() {
    this.#links.api = {
      href: this.#baseUrl,
      rel: 'api-entrypoint',
      method: 'GET'
    }
  }

  /**
   * Add a single article link to the link object.
   *
   * @param {string} [url=''] - The URL for the single article link.
   */
  addSingleArticleLink(url = '') {
    this.#links.post = {
      href: `${this.#baseUrl}${url}`,
      rel: 'article',
      method: 'GET'
    }
  }

  /**
   * Add multiple article links to the link object.
   *
   * @param {string} [url=''] The URL for the article links.
   * @param {Array} posts An array of post objects.
   */
  addArticleLinks(url = '', posts) {
    this.#links.posts = posts.map((post) => ({
      href: `${this.#baseUrl}${url}/${post.id}`,
      rel: 'article',
      method: 'GET'
    }))
  }

  /**
   * Add an articles page link to the link object.
   *
   * @param {string} [url=''] The URL for the articles page link.
   */
  addArticlesPageLink(url = '') {
    this.#links.post = {
      href: `${this.#baseUrl}${url}`,
      rel: 'articles-page',
      method: 'GET'
    }
  }

  /**
   * Add a previous page link to the link object.
   *
   * @param {string} [url=''] The URL for the previous page link.
   */
  addPrevPageLink(url = '') {
    this.#links.prevPage = {
      href: `${this.#baseUrl}${url}`,
      rel: 'prev',
      method: 'GET'
    }
  }

  /**
   * Add a next page link to the link object.
   *
   * @param {string} [url=''] The URL for the next page link.
   */
  addNextPageLink(url = '') {
    this.#links.nextPage = {
      href: `${this.#baseUrl}${url}`,
      rel: 'next',
      method: 'GET'
    }
  }
    
  /**
   * Add a create article link to the link object.
   *
   * @param {string} [url=''] The URL for the create article link.
   */
  addCreateArticleLink(url = '') {
    this.#links.createArticle = {
      href: `${this.#baseUrl}${url}`,
      rel: 'create-article',
      method: 'POST'
    }
  }

  /**
   * Add an update article link to the link object.
   *
   * @param {string} [url=''] The URL for the update article link.
   */
  addUpdateArticleLink(url = '') {
    this.#links.updateArticle = {
      href: `${this.#baseUrl}${url}`,
      rel: 'update-article',
      method: 'PUT'
    }
  }

  /**
   * Add a delete article link to the link object.
   *
   * @param {string} [url=''] The URL for the delete article link.
   */
  addDeleteArticleLink(url = '') {
    this.#links.deleteArticle = {
      href: `${this.#baseUrl}${url}`,
      rel: 'delete-article',
      method: 'DELETE'
    }
  }

  /**
   * Add a register user link to the link object.
   *
   * @param {string} [url=''] The URL for the register user link.
   */
  addRegisterUserLink(url = '') {
    this.#links.register = {
      href: `${this.#baseUrl}${url}`,
      rel: 'register',
      method: 'POST'
    }
  }

  /**
   * Add a login user link to the link object.
   *
   * @param {string} [url=''] The URL for the login user link.
   */
  addLoginUserLink(url = '') {
    this.#links.login = {
      href: `${this.#baseUrl}${url}`,
      rel: 'login',
      method: 'POST'
    }
  }

  /**
   * Returns the link object and resets it.
   *
   * @returns {object} The links object.
   */
  build() {
    const links = Object.assign({}, this.#links)
    this.#links = {}

    return links
  }
}
