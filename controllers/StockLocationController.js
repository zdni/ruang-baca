import StockLocation from '../models/StockLocation.js'

import checkValidationObjectId from "../libraries/checkValidationObjectId.js"

class StockLocationController {
  async index(req, res) {
    try {
      const locations = await StockLocation.find()
      if( !locations ) { throw { code: 404, message: "LOCATION_DATA_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LIST_LOCATION",
        data: locations
      })
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
        data: null
      })
    }
  }

  async store(req, res) {
    try {
      const { name } = req.body
      if(!name) { throw { code: 428, message: "NAME_IS_REQUIRED", data: null, status: false } }
      
      const data = new StockLocation({ name: name })
      const location = await data.save()
      if( !location ) { throw { code: 500, message: "FAILED_CREATE_LOCATION", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_LOCATION",
        data: location
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
      
      const checkObjId = await checkValidationObjectId(id, StockLocation, "LOCATION", true)
      if(!checkObjId.status) return checkObjId

      return res.status(200).json({
        status: true,
        message: "LOCATION_FOUND",
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

      const checkObjId = await checkValidationObjectId(id, StockLocation, "LOCATION")
      if(!checkObjId.status) return checkObjId

      const location = await StockLocation.findByIdAndUpdate( { _id: id }, req.body, { new: true } )
      if(!location) { throw { code: 500, message: "LOCATION_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LOCATION_UPDATE_SUCCESS",
        data: location,
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
      
      const checkObjId = await checkValidationObjectId(id, StockLocation, "LOCATION")
      if(!checkObjId.status) return checkObjId

      const location = await StockLocation.findOneAndDelete({ _id: id })
      if(!location) { throw { code: 500, message: "LOCATION_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LOCATION_DELETE_SUCCESS",
        data: location,
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

export default new StockLocationController