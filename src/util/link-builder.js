
export class LinkBuilder {
  #links = {}
  #baseUrl

  constructor(baseUrl) {
    this.#baseUrl = baseUrl
  }

  addSelfLinkGetMethod(url = '') {
    this.#links.self = {
      href: `${this.#baseUrl}${url}`,
      rel: 'self',
      method: 'GET'
    }
  }

  addSelfLinkPostMethod(url = '') {
    this.#links.self = {
      href: `${this.#baseUrl}${url}`,
      rel: 'self',
      method: 'POST'
    }
  }

  addSelfLinkPutMethod(url = '') {
    this.#links.self = {
      href: `${this.#baseUrl}${url}`,
      rel: 'self',
      method: 'PUT'
    }
  }

  addAPIEntrypointLink() {
    this.#links.api = {
      href: this.#baseUrl,
      rel: 'api-entrypoint',
      method: 'GET'
    }
  }

  addSingleArticleLink(url = '') {
    this.#links.post = {
      href: `${this.#baseUrl}${url}`,
      rel: 'article',
      method: 'GET'
    }
  }

  addArticleLinks(url = '', posts) {
    this.#links.posts = posts.map((post) => ({
      href: `${this.#baseUrl}${url}/${post.id}`,
      rel: 'article',
      method: 'GET'
    }))
  }

  addArticlesPageLink(url = '') {
    this.#links.post = {
      href: `${this.#baseUrl}${url}`,
      rel: 'articles-page',
      method: 'GET'
    }
  }

  addPrevPageLink(url = '') {
    this.#links.prevPage = {
      href: `${this.#baseUrl}${url}`,
      rel: 'prev',
      method: 'GET'
    }
  }

  addNextPageLink(url = '') {
    this.#links.nextPage = {
      href: `${this.#baseUrl}${url}`,
      rel: 'next',
      method: 'GET'
    }
  }

  addCreateArticleLink(url = '') {
    this.#links.createArticle = {
      href: `${this.#baseUrl}${url}`,
      rel: 'create-article',
      method: 'POST'
    }
  }

  addUpdateArticleLink(url = '') {
    this.#links.updateArticle = {
      href: `${this.#baseUrl}${url}`,
      rel: 'update-article',
      method: 'PUT'
    }
  }

  addDeleteArticleLink(url = '') {
    this.#links.deleteArticle = {
      href: `${this.#baseUrl}${url}`,
      rel: 'delete-article',
      method: 'DELETE'
    }
  }

  addRegisterUserLink(url = '') {
    this.#links.register = {
      href: `${this.#baseUrl}${url}`,
      rel: 'register',
      method: 'POST'
    }
  }

  addLoginUserLink(url = '') {
    this.#links.login = {
      href: `${this.#baseUrl}${url}`,
      rel: 'login',
      method: 'POST'
    }
  }

  build() {
    const links = Object.assign({}, this.#links)
    this.#links = {}

    return links
  }
}
