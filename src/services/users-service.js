import { MongooseServiceBase } from './mongoose-service-base.js'
import { UserRepository } from '../repositories/user-repository.js'

export class UsersService extends MongooseServiceBase {
  constructor (repository = new UserRepository()) {
    super(repository)
  }

  async authenticate (email, password) {
    const user = this._repository.authenticate(email, password)

    const payload = {
      sub: user.id
    }

    const accessToken = this.#generateAccessToken(payload)

    return accessToken
  }

  #generateAccessToken (payload) {
    return jwt.sign(payload, Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('ascii'), {
      algorithm: 'RS256',
      expiresIn: process.env.PRIVATE_KEY_LIFE
    })
  }
}
