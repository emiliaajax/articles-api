import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isAlphanumeric, 'Usernames can only contain letters and numbers']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be at least 10 characters'],
    maxlength: [2000, 'The password must be less than 2000 characters']
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

const convertOptions = {
  virtuals: true,
  versionKey: false,
  /**
   * Performs a transformation of the resulting object to remove sensitive information.
   *
   * @param {object} doc - The mongoose document which is being converted.
   * @param {object} ret - The plain object representation which has been converted.
   */
  transform: (doc, ret) => {
    delete ret._id
  }
}

schema.set('timestamps', true)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)

/**
 * Authenticates an account.
 *
 * @param {string} email The email.
 * @param {string} password The password.
 * @returns {Promise} Resolves to a user object.
 */
schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Credentials invalid or not provided.')
  }
  return user
}

// Creates a model using the schema.
export const UserModel = mongoose.model('User', schema)
