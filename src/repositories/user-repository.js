import { MongooseRepositoryBase } from './mongoose-repository-base.js'
import { UserModel } from '../models/user-model.js'

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

    const user = this._model.create(data)

    user.password = await bcrypt.hash(user.password, 10)

    await user.save()

    return user
  }
}
