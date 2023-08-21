import mongoose from 'mongoose'

const motorcycleSchema = new mongoose.Schema({
  dimensions: { type: String, required: [true, '缺少'] }, // 車長×車寬×車高
  seatHeight: { type: String, required: [true, '缺少'] }, // 座高
  weight: { type: String, required: [true, '缺少'] }, // 車重
  displacement: { type: String, required: [true, '缺少'] }, // 總排氣量
  maxHorsepower: { type: String, required: [true, '缺少'] }, // 最高馬力
  maxTorque: { type: String, required: [true, '缺少'] }, // 最大扭力
  frontSuspension: { type: String, required: [true, '缺少'] }, // 前懸吊系統
  rearSuspension: { type: String, required: [true, '缺少'] }, // 後懸吊系統
  frontTire: { type: String, required: [true, '缺少'] }, // 輪胎(前)
  rearTire: { type: String, required: [true, '缺少'] }, // 輪胎(後)
  frontBrakeSystem: { type: String, required: [true, '缺少'] }, // 前煞車系統
  rearBrakeSystem: { type: String, required: [true, '缺少'] } // 後煞車系統
})

const Motorcycle = mongoose.model('Motorcycle', motorcycleSchema)

export default Motorcycle
