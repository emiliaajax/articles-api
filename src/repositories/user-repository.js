import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { UserModel } from '../models/user-model.js'
import bcrypt from 'bcryptjs'

export class UserRepository extends MongooseRepositoryBase {
  constructor (model = UserModel) {
    super(model)
  }

  async authenticate (email, password) {
    return this._model.authenticate(email, password)
  }

  // Override
  async insert (data) {
    this._ensureValidPropertyNames(data)

    const user = await this._model.create(data)

    user.password = await bcrypt.hash(user.password, 10)

    user.save()
  }
}
