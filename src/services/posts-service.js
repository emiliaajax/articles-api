import { MongooseServiceBase } from './mongoose-service-base.js'
import { PostRepository } from '../repositories/post-repository.js'
import jwt from 'jsonwebtoken'

export class PostsService extends MongooseServiceBase {
  constructor (repository = new PostRepository()) {
    super(repository)
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
