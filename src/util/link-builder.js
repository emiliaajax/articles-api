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
   * Add a self link to the link object.
   *
   * @param {string} [url=''] The URL for the self link.
   * @param {string} method The CRUD method.
   */
  addSelfLink(url = '', method) {
    this.#links.self = {
      href: `${this.#baseUrl}${url}`,
      rel: 'self',
      method
    }
  }

  /**
   * Add an API entry point link to the link object.
   */
  addAPIEntrypointLink() {
    this.#links.api = {
      href: this.#baseUrl,
      rel: 'api-entrypoint',
      method: 'GET',
      authenticationRequired: false
    }
  }

  /**
   * Add a single article link to the link object.
   *
   * @param {string} [url=''] - The URL for the single article link.
   */
  addGetArticleLink(url = '') {
    this.#links.article = {
      href: `${this.#baseUrl}${url}`,
      rel: 'article',
      method: 'GET',
      authenticationRequired: false
    }
  }

  /**
   * Add multiple article links to the link object.
   *
   * @param {string} [url=''] The URL for the article links.
   * @param {Array} posts An array of post objects.
   */
  addArticleLinks(url = '', articles) {
    this.#links.articles = articles.map((article) => ({
      href: `${this.#baseUrl}${url}/${article.id}`,
      rel: 'article',
      method: 'GET',
      authenticationRequired: false
    }))
  }

  /**
   * Add an articles page link to the link object.
   *
   * @param {string} [url=''] The URL for the articles page link.
   */
  addArticlesPageLink(url = '') {
    this.#links.articles = {
      href: `${this.#baseUrl}${url}`,
      rel: 'articles-page',
      method: 'GET',
      authenticationRequired: false
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
      method: 'GET',
      authenticationRequired: false
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
      method: 'GET',
      authenticationRequired: false
    }
  }

  /**
   * Add a author link to the link object.
   *
   * @param {string} [url=''] The URL for the author link.
   */
  addAuthorLink(url = '') {
    this.#links.author = {
      href: `${this.#baseUrl}${url}`,
      rel: 'article-author',
      method: 'GET',
      authenticationRequired: false
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
      method: 'POST',
      authenticationRequired: true
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
      method: 'PUT',
      authenticationRequired: true
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
      method: 'DELETE',
      authenticationRequired: true
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
      method: 'POST',
      authenticationRequired: false
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
      method: 'POST',
      authenticationRequired: false
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
