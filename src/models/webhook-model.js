import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
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

// Creates a model using the schema.
export const WebhookModel = mongoose.model('Webhook', schema)