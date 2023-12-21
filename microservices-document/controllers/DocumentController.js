import Document from '../models/Document.js'
import mongoose from "mongoose"

import checkValidationObjectId from "../libraries/checkValidationObjectId.js"
import DocumentService from '../services/DocumentService.js'
import citation from "../libraries/helpers/citation.js"

import { publish } from '../redis.js'

class DocumentController {
  async index(req, res) {
    try {
      publish("rbturesuserchannel", JSON.stringify({
        'tes': "tes"
      }))
      
      const query = await DocumentService.generateQuerySearch(req)
      if(!query.status) throw { code: data.code, message: "ERROR_QUERY_SEARCH", data: null, status: false }
      
      let result = Document.aggregate(query.aggregate)
      
      const documents = await result
      const total = await Document.aggregate([query.aggregate[0],{'$count':'total'}])

      if(!documents) { throw { code: 404, message: "DOCUMENT_DATA_NOT_FOUND", data: null, status: false } }
      
      return res.status(200).json({
        status: true,
        message: "LIST_DOCUMENT",
        data: documents,
        total: total[0].total
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
      const data = await DocumentService.generateData(req)
      if (!data.status) throw { code: data.code, message: data.message, data: null, status: false }

      const newDocument = new Document(data.data)
      const document = await newDocument.save()

      if(!document) { throw { code: 500, message: "FAILED_CREATE_DOCUMENT", data: null, status: false } }
      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_DOCUMENT",
        data: document
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
      
      const checkObjId = await checkValidationObjectId(id, Document, "DOCUMENT")
      if(!checkObjId.status) return checkObjId
      
      // counter views
      const document = await Document.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $addFields: {coverUrl: { $concat: [req.protocol, "://", req.get('host'), "/uploads/documents/", "$cover"] }} },
      ])
      
      if(!document || !(document.length > 0)) { throw { code: 404, message: "DOCUMENT_NOT_FOUND", data: null, status: false } }
      
      // get citations
      const citations = citation(document[0])
      
      return res.status(200).json({
        status: true,
        message: "DOCUMENT_FOUND",
        data: document[0],
        citations,
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
      
      const checkObjId = await checkValidationObjectId(id, Document, "DOCUMENT")
      if(!checkObjId.status) return checkObjId
      
      const form = req.body
      if (req.file) form.cover = req.file.filename

      const document = await Document.findByIdAndUpdate( { _id: id }, form, { new: true } )
      if(!document) { throw { code: 500, message: "DOCUMENT_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "DOCUMENT_UPDATE_SUCCESS",
        data: document,
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

  async updateMany(req, res) {
    try {
      const form = req.body
      const updateDoc = form.updateDoc  // { $set: { 'category.name': 'Internet' } }
      const filter = form.filter  // {'category': {'id': "1", "name": "Internet G"}}
      
      const result = await Document.updateMany( filter, updateDoc )
      if(!result) { throw { code: 500, message: "DOCUMENT_UPDATE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "DOCUMENT_UPDATE_SUCCESS",
        data: result.modifiedCount,
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
      
      const checkObjId = await checkValidationObjectId(id, Document, "DOCUMENT")
      if(!checkObjId.status) return checkObjId
      
      const document = await Document.findOneAndDelete({ _id: id })
      if(!document) { throw { code: 500, message: "DOCUMENT_DELETE_FAILED", data: null, status: false } }

      return res.status(200).json({
        status: true,
        message: "DOCUMENT_DELETE_SUCCESS",
        data: document
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

  async group(req, res) {
    try {
      const query = await DocumentService.generateQueryGroup(req)
      if(!query.status) throw { code: query.code, message: "ERROR_QUERY_GROUP", data: null, status: false }
      const result = await Document.aggregate(query.query)
      
      return res.status(200).json({
        status: true,
        message: "DOCUMENT_GROUP_SUCCESS",
        data: result
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

export default new DocumentController