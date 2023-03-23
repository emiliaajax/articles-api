import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  authorID: {
    type: String
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200000
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

const convertOptions = {
  timestamps: true,
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

export const PostModel = mongoose.model('PostModel', schema)
