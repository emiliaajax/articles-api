
export class LinkBuilder {
  #links = {}

  addSelfLinkGetMethod(url) {
    this.#links.self = {
      href: url,
      rel: 'self',
      method: 'GET'
    }
  }

  addSelfLinkPostMethod(url) {
    this.#links.self = {
      href: url,
      rel: 'self',
      method: 'POST'
    }
  }

  addSelfLinkPutMethod(url) {
    this.#links.self = {
      href: url,
      rel: 'self',
      method: 'PUT'
    }
  }

  addSingleArticleLink(url) {
    this.#links.post = {
      href: url,
      rel: 'article',
      method: 'GET'
    }
  }

  addArticleLinks(url, posts) {
    this.#links.posts = posts.map((post) => ({
      href: `${url}/${post.id}`,
      rel: 'article',
      method: 'GET'
    }))
  }

  addPrevPageLink(url) {
    this.#links.prevPage = {
      href: url,
      rel: 'prev',
      method: 'GET'
    }
  }

  addNextPageLink(url) {
    this.#links.nextPage = {
      href: url,
      rel: 'next',
      method: 'GET'
    }
  }

  addCreateArticleLink(url) {
    this.#links.createArticle = {
      href: url,
      rel: 'create-article',
      method: 'POST'
    }
  }

  addUpdateArticleLink(url) {
    this.#links.updateArticle = {
      href: url,
      rel: 'update-article',
      method: 'PUT'
    }
  }

  addDeleteArticleLink(url) {
    this.#links.deleteArticle = {
      href: url,
      rel: 'delete-article',
      method: 'DELETE'
    }
  }

  addRegisterUserLink(url) {
    this.#links.register = {
      href: url,
      rel: 'register',
      method: 'POST'
    }
  }

  addLoginUserLink(url) {
    this.#links.login = {
      href: url,
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
