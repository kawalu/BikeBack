import express from 'express'
import contentType from '../middlewares/contentType.js'
import { create, login, logout, extend, getProfile, getLike, editLike, removeFromLikes } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/', contentType('application/json'), create)
router.post('/login', contentType('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getProfile)
router.get('/like', auth.jwt, getLike)
router.post('/like', contentType('application/json'), auth.jwt, editLike)
router.delete('/like', contentType('application/json'), auth.jwt, removeFromLikes)

export default router
