
export class LinkBuilder {
  #links = {}

  addSelfLink(url) {
    this.#links.self = {
      href: url,
      rel: 'self',
      method: 'GET'
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
    return this.#links
  }
}
