import express from 'express'

import AuthController from '../controllers/AuthController.js'
import ResUserController from '../controllers/ResUserController.js'

import auth from '../middleware/auth.js'
import upload from '../libraries/helpers/fileHelper.js'

const router = express.Router()

// auth
router.post('/auth/login', AuthController.login)
router.post('/auth/refresh-token', AuthController.refreshToken)
router.post('/auth/validate-token', auth(), AuthController.validateToken)

// users
router.get('/user', auth(), ResUserController.userFromToken)
router.get('/users', auth(), ResUserController.index)
router.get('/users/:id', auth(), ResUserController.show)
router.post('/users', auth(), ResUserController.store)
router.put('/users/:id', auth(), ResUserController.update)
router.put('/users/reset-password/:id', auth(), ResUserController.resetPassword)
router.put('/users/change-password/:id', auth(), ResUserController.changePassword)
router.put('/users/change-profile-picture/:id', auth(), upload.single('image'), ResUserController.changeProfilePicture) 
router.delete('/users/:id', auth(), ResUserController.destroy)

// server
router.get('/', function (req, res) {
    try {
      return res.status(200).json({
        status: true,
        message: 'CONNECTED'
      })
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'NOT CONNECTED'
      })
    }
  })
  
  export default router