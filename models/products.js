import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少名稱']
  },
  model: {
    type: String,
    required: [true, '缺少型號']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  },
  description: {
    type: String,
    required: [true, '缺少說明']
  },
  category: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['HONDA', 'YAMAHA', 'KAWASAKI'],
      message: '分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    required: [true, '缺少上架狀態']
  },
  engineform: { type: String, required: [true, '引擎'] }, // 引擎
  dimensions: { type: String, required: [true, '缺少車長×車寬×車高'] }, // 車長×車寬×車高
  seatHeight: { type: String, required: [true, '缺少座高'] }, // 座高
  weight: { type: String, required: [true, '缺少車重'] }, // 車重
  displacement: { type: String, required: [true, '缺少'] }, // 總排氣量
  maxHorsepower: { type: String, required: [true, '缺少'] }, // 最高馬力
  maxTorque: { type: String, required: [true, '缺少'] }, // 最大扭力
  frontSuspension: { type: String, required: [true, '缺少'] }, // 前懸吊系統
  rearSuspension: { type: String, required: [true, '缺少'] }, // 後懸吊系統
  frontTire: { type: String, required: [true, '缺少'] }, // 輪胎(前)
  rearTire: { type: String, required: [true, '缺少'] }, // 輪胎(後)
  frontBrakeSystem: { type: String, required: [true, '缺少'] }, // 前煞車系統
  rearBrakeSystem: { type: String, required: [true, '缺少'] } // 後煞車系統
}, { versionKey: false })

export default mongoose.model('products', schema)
