import DocumentCategory from '../models/DocumentCategory.js'

import checkValidationObjectId from "../libraries/checkValidationObjectId.js"

class DocumentCategoryController {
  async index(req, res) {
    try {
      const categories = await DocumentCategory.find()
      if( !categories ) { throw { code: 404, message: "CATEGORY_DATA_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LIST_CATEGORY",
        data: categories
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

      const data = new DocumentCategory({ name: name })
      const category = await data.save()
      if( !category ) { throw { code: 500, message: "FAILED_CREATE_CATEGORY", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_CATEGORY",
        data: category
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
      
      const checkObjId = await checkValidationObjectId(id, DocumentCategory, "CATEGORY")
      if(!checkObjId.status) return checkObjId

      return res.status(200).json({
        status: true,
        message: "CATEGORY_FOUND",
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
      
      const checkObjId = await checkValidationObjectId(id, DocumentCategory, "CATEGORY")
      if(!checkObjId.status) return checkObjId

      const category = await DocumentCategory.findByIdAndUpdate( { _id: id }, req.body, { new: true } )
      if(!category) { throw { code: 500, message: "CATEGORY_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "CATEGORY_UPDATE_SUCCESS",
        data: category,
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
      
      const checkObjId = await checkValidationObjectId(id, DocumentCategory, "CATEGORY")
      if(!checkObjId.status) return checkObjId

      const category = await DocumentCategory.findOneAndDelete({ _id: id })
      if(!category) { throw { code: 500, message: "CATEGORY_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "CATEGORY_DELETE_SUCCESS",
        data: category,
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

export default new DocumentCategoryController