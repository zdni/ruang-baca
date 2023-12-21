import OrderPenalty from '../models/OrderPenalty.js'

import checkValidationObjectId from "../libraries/checkValidationObjectId.js"
import OrderPenaltyService from '../services/OrderPenaltyService.js'

class OrderPenaltyController {
  async index(req, res){
    try {
      const query = await OrderPenaltyService.generateQuerySearch(req)
      if(!query.status) throw { code: data.code, message: "ERROR_QUERY_SEARCH", data: null, status: false }
      
      const penalties = await OrderPenalty.find(query.query)
        .populate('orderId')
      if(!penalties) { throw { code: 404, message: "PENALTY_DATA_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LIST_PENALTY",
        data: penalties
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

  async store(req, res) {
    try {
      const data = await OrderPenaltyService.generateData(req)
      if (!data.status) throw { code: data.code, message: data.message, data: null, status: false }
      
      const document = new OrderPenalty(data.data)
      const penalty = await document.save()
      if(!penalty) { throw { code: 404, message: "FAILED_CREATE_PENALTY", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_PENALTY",
        data: penalty
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

  async show(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }
      
      const checkObjId = await checkValidationObjectId(id, OrderPenalty, "PENALTY")
      if(!checkObjId.status) return checkObjId

      const penalty = await OrderPenalty.findOne({ _id: id })
        .populate('orderId')
      if(!penalty) { throw { code: 404, message: "PENALTY_NOT_FOUND", data: null, status: false } }
      
      return res.status(200).json({
        status: true,
        message: "PENALTY_FOUND",
        data: penalty
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
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }
      
      const checkObjId = await checkValidationObjectId(id, OrderPenalty, "PENALTY")
      if(!checkObjId.status) return checkObjId

      const penalty = await OrderPenalty.findByIdAndUpdate( { _id: id }, req.body, { new: true } )
      if(!penalty) { throw { code: 500, message: "PENALTY_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "PENALTY_UPDATE_SUCCESS",
        data: penalty
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

  async destroy(req, res) {
    try {
      const {id} = req.params
      if(!id) { throw { code: 428, message: "ID_REQUIRED", data: null, status: false } }
      
      const checkObjId = await checkValidationObjectId(id, OrderPenalty, "PENALTY")
      if(!checkObjId.status) return checkObjId

      const penalty = await OrderPenalty.findOneAndDelete({ _id: id })
      if(!penalty) { throw { code: 500, message: "PENALTY_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "PENALTY_DELETE_SUCCESS",
        data: penalty
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
}

export default new OrderPenaltyController