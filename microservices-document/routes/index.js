import express from 'express'

import DocumentController from '../controllers/DocumentController.js'

import auth from '../middleware/auth.js'
import upload from '../libraries/helpers/fileHelper.js'

const router = express.Router()

// documents
router.get('/documents', DocumentController.index)
router.get('/documents/group', DocumentController.group)
router.get('/documents/:id', DocumentController.show)
router.post('/documents', auth(), upload.single('cover'), DocumentController.store)
router.put('/documents/:id', auth(), upload.single('cover'), DocumentController.update)
router.put('/documents', auth(), DocumentController.updateMany)
router.delete('/documents/:id', auth(), DocumentController.destroy)

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