import { StatusCodes } from 'http-status-codes'
import users from '../models/users.js'
import { getMessageFromValidationError } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import products from '../models/products.js'

export const create = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError()
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號已註冊'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '發生錯誤'
      })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const getProfile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        like: req.user.like.reduce((total, current) => total + current.quantity, 0)
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const getLike = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'like').populate('like.product')
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: result.like
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}

export const editLike = async (req, res) => {
  try {
    // 尋找購物車內有沒有傳入的商品 ID
    const idx = req.user.like.findIndex(like => like.product.toString() === req.body.product)
    if (idx > -1) {
      // 如果購物車內已經有商品
      // 檢查修改後的數量
      const quantity = req.user.like[idx].quantity + parseInt(req.body.quantity)
      if (quantity <= 0) {
        // 小於 0，移除
        req.user.like.splice(idx, 1)
      } else {
        // 大於 0，修改
        req.user.like[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有，檢查商品 ID 是否存在
      const product = await products.findById(req.body.product)
      if (!product || !product.sell) {
        // 沒有，錯誤
        throw new Error('NOT FOUND')
      } else {
        // 有，放入購物車
        req.user.like.push({
          product: product._id,
          quantity: req.body.quantity
        })
      }
    }
    // 保存
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.like.reduce((total, current) => total + current.quantity, 0)
    })
  } catch (error) {
    if (error.message === 'NOT FOUND') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到1'
      })
    } else if (error.name === 'ValidationError') {
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

export const removeFromLikes = async (req, res) => {
  try {
    const idx = req.user.like.findIndex(like => like.product.toString() === req.body.product)
    if (idx > -1) {
      req.user.like.splice(idx, 1)
      await req.user.save()
      res.status(StatusCodes.OK).json({
        success: true,
        message: ''
      })
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到該收藏商品'
      })
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '發生錯誤'
    })
  }
}
