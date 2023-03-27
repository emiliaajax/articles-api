import { MongooseServiceBase } from './mongoose-service-base.js'
import { PostRepository } from '../repositories/post-repository.js'
import jwt from 'jsonwebtoken'

export class PostsService extends MongooseServiceBase {
  constructor (repository = new PostRepository()) {
    super(repository)
  }

  // Override
  async get (page = "1", perPage = "20") {
    page = parseInt(page)
    perPage = parseInt(perPage)

    if (perPage > 100) {
      perPage = 100
    }

    const filter = {}
    const projection = {}
    const options = {
      limit: perPage,
      skip: (page - 1) * perPage
    }

    return this._repository.get(filter, projection, options)
  }

  async countTotalPosts(filter) {
    return this._repository.count(filter)
  }

  authenticateJWT(authenticationScheme, token) {
    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme')
    }

    const payload = jwt.verify(token, 
      Buffer.from(process.env.PUBLIC_KEY, 'base64').toString('ascii'),
      {
        algorithms: 'RS256'
      }
    )

    return {
      id: payload.sub
    }
  }
}
