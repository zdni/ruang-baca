import checkValidationObjectId from "../libraries/checkValidationObjectId.js"

import Document from "../models/Document.js"
import ResUser from "../models/ResUser.js"

class OrderService {
  async generateData(req) {
    try {
      let data = {}
      const {
        userId,
        documentId,
        date,
        status,
        qty
      } = req.body

      if(!userId) return { status: false, code: 428, message: "USER_IS_REQUIRED" }
      if(!documentId) return { status: false, code: 428, message: "DOCUMENT_IS_REQUIRED" }
      if(!date.start) return { status: false, code: 428, message: "START_DATE_IS_REQUIRED" }
      if(!date.end) return { status: false, code: 428, message: "END_DATE_IS_REQUIRED" }

      // documentId
      const checkDocId = await checkValidationObjectId(documentId, Document, "DOCUMENT")
      if(!checkDocId.status) return checkDocId
      
      // userId
      const checkUserId = await checkValidationObjectId(userId, ResUser, "USER")
      if(!checkUserId.status) return checkUserId

      data = {
        userId,
        documentId,
        date,
        qty,
      }

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
      const {
        userId,
        documentId,
        currentDate,
        startDate,
        endDate,
        status
      } = req.query

      let query = {}

      // documentId
      if(documentId) {
        const checkDocId = await checkValidationObjectId(documentId, Document, "DOCUMENT")
        if(!checkDocId.status) return checkDocId

        query['documentId'] = documentId
      }
      // userId
      if(userId) { 
        const checkUserId = await checkValidationObjectId(userId, ResUser, "USER")
        if(!checkUserId.status) return checkUserId

        query['userId'] = userId 
      }
      
      if(status && status !== 'all') query['status'] = status
      // query late order return

      // date
      if(currentDate || startDate || endDate) {
        query['date'] = { start: {} }
        if(currentDate) { Object.assign(query['date']['start'], { $eq: ISODate(currentDate) }) }
        if(startDate) { Object.assign(query['date']['start'], { $gte: ISODate(startDate) }) }
        if(endDate) { Object.assign(query['date']['start'], { $lte: ISODate(endDate) }) }
      }
      
      return { status: true, query }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }
}

export default new OrderService