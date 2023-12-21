import express from 'express'

import AuthController from '../controllers/AuthController.js'
import DocumentCategoryController from '../controllers/DocumentCategoryController.js'
import DocumentController from '../controllers/DocumentController.js'
import DocumentTypeController from '../controllers/DocumentTypeController.js'
import OrderController from '../controllers/OrderController.js'
import OrderPenaltyController from '../controllers/OrderPenaltyController.js'
import ResSpecializationController from '../controllers/ResSpecializationController.js'
import StockLocationController from '../controllers/StockLocationController.js'
import ResUserController from '../controllers/ResUserController.js'

import auth from '../middleware/auth.js'
import upload from '../libraries/helpers/fileHelper.js'

const router = express.Router()

// auth
router.post('/auth/login', AuthController.login)
router.post('/auth/refresh-token', AuthController.refreshToken)

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

// locations
router.get('/locations', StockLocationController.index)
router.get('/locations/:id', StockLocationController.show)
router.post('/locations', auth(), StockLocationController.store)
router.put('/locations/:id', auth(), StockLocationController.update)
router.delete('/locations/:id', auth(), StockLocationController.destroy)

// specializations
router.get('/specializations', ResSpecializationController.index)
router.get('/specializations/:id', ResSpecializationController.show)
router.post('/specializations', auth(), ResSpecializationController.store)
router.put('/specializations/:id', auth(), ResSpecializationController.update)
router.delete('/specializations/:id', auth(), ResSpecializationController.destroy)

// documents
router.get('/documents', DocumentController.index)
router.get('/documents/group', DocumentController.group)
router.get('/documents/:id', DocumentController.show)
router.post('/documents', auth(), upload.single('cover'), DocumentController.store)
router.put('/documents/:id', auth(), upload.single('cover'), DocumentController.update)
router.delete('/documents/:id', auth(), DocumentController.destroy)

// document category
router.get('/document/categories', DocumentCategoryController.index)
router.get('/document/categories/:id', DocumentCategoryController.show)
router.post('/document/categories', auth(), DocumentCategoryController.store)
router.put('/document/categories/:id', auth(), DocumentCategoryController.update)
router.delete('/document/categories/:id', auth(), DocumentCategoryController.destroy)

// document type
router.get('/document/types', DocumentTypeController.index)
router.get('/document/types/:id', DocumentTypeController.show)
router.post('/document/types', auth(), DocumentTypeController.store)
router.put('/document/types/:id', auth(), DocumentTypeController.update)
router.delete('/document/types/:id', auth(), DocumentTypeController.destroy)

// orders
router.get('/orders', auth(), OrderController.index)
router.get('/orders/:id', auth(), OrderController.show)
router.post('/orders', auth(), OrderController.store)
router.put('/orders/:id', auth(), OrderController.update)
router.delete('/orders/:id', auth(), OrderController.destroy)

// penalties
router.get('/order/penalties', auth(), OrderPenaltyController.index)
router.get('/order/penalties/:id', auth(), OrderPenaltyController.show)
router.post('/order/penalties', auth(), OrderPenaltyController.store)
router.put('/order/penalties/:id', auth(), OrderPenaltyController.update)
router.delete('/order/penalties/:id', auth(), OrderPenaltyController.destroy)

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