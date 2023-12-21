import DocumentType from '../models/DocumentType.js'

import checkValidationObjectId from "../libraries/checkValidationObjectId.js"

class DocumentTypeController {
  async index(req, res) {
    try {
      const types = await DocumentType.find()
      if( !types ) { throw { code: 404, message: "TYPE_DATA_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LIST_TYPE",
        data: types
      })
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      })
    }
  }

  async store(req, res) {
    try {
      const { name } = req.body
      if(!name) { throw { code: 428, message: "NAME_IS_REQUIRED", data: null, status: false } }

      const data = new DocumentType({ name: name })
      const type = await data.save()
      if( !type ) { throw { code: 500, message: "FAILED_CREATE_TYPE", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_TYPE",
        data: type
      })
    } catch (err) {
      return res.status( err.code || 500 ).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async show(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }
      
      const checkObjId = await checkValidationObjectId(id, DocumentType, "TYPE", true)
      if(!checkObjId.status) return checkObjId

      return res.status(200).json({
        status: true,
        message: "TYPE_FOUND",
        data: { ...checkObjId.data }
      })
    } catch (err) {
      if(!err.code) { err.code = 500 }
      return res.status(err.code).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async update(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 420, message: "ID_REQUIRED", data: null, status: false } }
      
      const checkObjId = await checkValidationObjectId(id, DocumentType, "TYPE")
      if(!checkObjId.status) return checkObjId

      const type = await DocumentType.findByIdAndUpdate( { _id: id }, req.body, { new: true } )
      if(!type) { throw { code: 500, message: "TYPE_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "TYPE_UPDATE_SUCCESS",
        data: type,
      })
    } catch (err) {
      return res.status(err.code || 500 ).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async destroy(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 420, message: "ID_REQUIRED", data: null, status: false } }
      
      const checkObjId = await checkValidationObjectId(id, DocumentType, "TYPE")
      if(!checkObjId.status) return checkObjId

      const type = await DocumentType.findOneAndDelete({ _id: id })
      if(!type) { throw { code: 500, message: "TYPE_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "TYPE_DELETE_SUCCESS",
        data: type,
      })
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }
}

export default new DocumentTypeController