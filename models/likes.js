import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  product: {
    type: mongoose.ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量']
  }
}, { versionKey: false })

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  date: {
    type: Date,
    default: Date.now
  },
  like: {
    type: [likeSchema],
    default: [],
    validate: {
      validator (value) {
        return Array.isArray(value) && value.length > 0
      },
      message: '不能為空'
    }
  }
})

export default mongoose.model('likes', schema)
