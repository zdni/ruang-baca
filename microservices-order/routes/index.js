import express from 'express'

import OrderController from '../controllers/OrderController.js'

import auth from '../middleware/auth.js'

const router = express.Router()

// orders
router.get('/orders', auth(), OrderController.index)
router.get('/orders/:id', auth(), OrderController.show)
router.post('/orders', auth(), OrderController.store)
router.put('/orders/:id', auth(), OrderController.update)
router.delete('/orders/:id', auth(), OrderController.destroy)

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