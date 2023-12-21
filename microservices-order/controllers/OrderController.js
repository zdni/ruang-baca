import Order from '../models/Order.js'

import checkValidationObjectId from "../libraries/checkValidationObjectId.js"
import OrderService from '../services/OrderService.js'

import { publish } from '../redis.js'

class OrderController {
  async index(req, res){
    try {
      const processQuery = await OrderService.generateQuerySearch(req)
      if(!processQuery.status) throw { code: data.code, message: "ERROR_QUERY_SEARCH", data: null, status: false }
      
      const orders = await Order.find(processQuery.query)
      if(!orders) { throw { code: 404, message: "ORDER_DATA_NOT_FOUND", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "LIST_ORDER",
        data: orders
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
      const data = await OrderService.generateData(req)
      if (!data.status) throw { code: data.code, message: data.message, data: null, status: false }
      
      const document = new Order(data.data)
      const order = await document.save()
      if(!order) { throw { code: 404, message: "FAILED_CREATE_ORDER", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_ORDER",
        data: order
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
      
      const checkObjId = await checkValidationObjectId(id, Order, "ORDER")
      if(!checkObjId.status) return checkObjId

      const order = await Order.findOne({ _id: id })
      if(!order) { throw { code: 404, message: "ORDER_NOT_FOUND", data: null, status: false } }
      
      return res.status(200).json({
        status: true,
        message: "ORDER_FOUND",
        data: order
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
      
      const checkObjId = await checkValidationObjectId(id, Order, "ORDER", true)
      if(!checkObjId.status) return checkObjId

      const order = await Order.findByIdAndUpdate( { _id: id }, req.body, { new: true } )
      if(!order) { throw { code: 500, message: "ORDER_UPDATE_FAILED", data: null, status: false } }

      // function update current qty document if status has done
      if("status" in req.body) {
        let qty
        let queue = false
        if(["late", "done"].includes(req.body.status)) {
          qty = checkObjId.data.qty
          queue = true
        }
        if(checkObjId.data.status === 'draft' && req.body.status === 'process') {
          qty = checkObjId.data.qty*-1
          queue = true
        }
        if(checkObjId.data.status === 'process' && req.body.status === 'cancel') {
          qty = checkObjId.data.qty
          queue = true
        }
        
        if(queue) {
          publish("rbtuorderchannel", JSON.stringify({
            id: checkObjId.data.document.id,
            updateDoc: { $inc: {'currentQty': qty} },
            token: req.headers.authorization
          }))
        }
      }
      // end function

      return res.status(200).json({
        status: true,
        message: "ORDER_UPDATE_SUCCESS",
        data: order
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
      
      const checkObjId = await checkValidationObjectId(id, Order, "ORDER")
      if(!checkObjId.status) return checkObjId

      const order = await Order.findOneAndDelete({ _id: id })
      if(!order) { throw { code: 500, message: "ORDER_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "ORDER_DELETE_SUCCESS",
        data: order
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

export default new OrderController