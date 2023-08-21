import products from '../models/products.js'
import { StatusCodes } from 'http-status-codes'
import { getMessageFromValidationError } from '../utils/error.js'

export const create = async (req, res) => {
  try {
    const result = await products.create({
      name: req.body.name,
      model: req.body.model,
      image: req.file.path,
      description: req.body.description,
      category: req.body.category,
      sell: req.body.sell,
      engineform: req.body.engineform,
      dimensions: req.body.dimensions, // 車長×車寬×車高
      seatHeight: req.body.seatHeight, // 座高
      weight: req.body.weight, // 車重
      displacement: req.body.displacement, // 總排氣量
      maxHorsepower: req.body.maxHorsepower, // 最高馬力
      maxTorque: req.body.maxTorque, // 最大扭力
      frontSuspension: req.body.frontSuspension, // 前懸吊系統
      rearSuspension: req.body.rearSuspension, // 後懸吊系統
      frontTire: req.body.frontTire, // 輪胎(前)
      rearTire: req.body.rearTire, // 輪胎(後)
      frontBrakeSystem: req.body.frontBrakeSystem, // 前煞車系統
      rearBrakeSystem: req.body.rearBrakeSystem // 後煞車系統
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.log(error)
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}

export const getAll = async (req, res) => {
  try {
    // .skip() 跳過幾筆資料
    // .limit() 回傳幾筆
    let result = products
      .find({
        $or: [
          { name: new RegExp(req.query.search, 'i') },
          { description: new RegExp(req.query.search, 'i') },
          { category: new RegExp(req.query.search, 'i') }
        ]
      })
      .sort({ [req.query.sortBy]: req.query.sortOrder === 'asc' ? 1 : -1 })
    if (req.query.itemsPerPage > -1) {
      result = result
        .skip((req.query.page - 1) * req.query.itemsPerPage)
        .limit(req.query.itemsPerPage)
    }
    result = await result
    const count = await products.estimatedDocumentCount()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        data: result,
        count
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const get = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const getId = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    if (!result) {
      throw new Error('NOT FOUND')
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}

export const edit = async (req, res) => {
  try {
    const result = await products.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      model: req.body.model,
      image: req.file?.path,
      description: req.body.description,
      category: req.body.category,
      sell: req.body.sell,
      engineform: req.body.engineform,
      dimensions: req.body.dimensions, // 車長×車寬×車高
      seatHeight: req.body.seatHeight, // 座高
      weight: req.body.weight, // 車重
      displacement: req.body.displacement, // 總排氣量
      maxHorsepower: req.body.maxHorsepower, // 最高馬力
      maxTorque: req.body.maxTorque, // 最大扭力
      frontSuspension: req.body.frontSuspension, // 前懸吊系統
      rearSuspension: req.body.rearSuspension, // 後懸吊系統
      frontTire: req.body.frontTire, // 輪胎(前)
      rearTire: req.body.rearTire, // 輪胎(後)
      frontBrakeSystem: req.body.frontBrakeSystem, // 前煞車系統
      rearBrakeSystem: req.body.rearBrakeSystem // 後煞車系統
    }, { new: true, runValidators: true })
    if (!result) {
      throw new Error('NOT FOUND')
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else if (error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}

export const remove = async (req, res) => {
  try {
    const result = await products.findByIdAndDelete(req.params.id)
    if (!result) {
      throw new Error('NOT FOUND')
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '產品已刪除',
      result
    })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '格式錯誤'
      })
    } else if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到產品'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}
