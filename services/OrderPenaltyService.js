import checkValidationObjectId from "../libraries/checkValidationObjectId.js"

import Order from '../models/Order.js'

class OrderPenaltyService {
  async generateData(req) {
    try {
      const {
        orderId,
        description,
        date,
        status,
      } = req.body

      if(!description) return { status: false, code: 428, message: "DESCRIPTION_IS_REQUIRED" }
      if(!orderId) return { status: false, code: 428, message: "ORDER_IS_REQUIRED" }

      // orderId
      const checkOrderId = await checkValidationObjectId(orderId, Order, "ORDER")
      if(!checkOrderId.status) return checkOrderId
      
      let data = {
        orderId,
        description
      }
      if(date) data['date'] = date
      if(status) data['status'] = status

      return { status: true, data }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }

  async generateQuerySearch(req) {
    try {
      let query = {}
      let {
        orderId,
        status,
      } = req.query

      if(orderId) {
        const checkOrderId = await checkValidationObjectId(orderId, Order, "ORDER")
        if(!checkOrderId.status) return checkOrderId

        query['orderId'] = orderId
      }
      if(status && status !== 'all') query['status'] = status

      return { status: true, query }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }
}

export default new OrderPenaltyService