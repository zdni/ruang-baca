import mongoose from "mongoose"

import checkValidationObjectId from '../libraries/checkValidationObjectId.js'

import StockLocation from '../models/StockLocation.js'
import ResSpecialization from '../models/ResSpecialization.js'
import DocumentCategory from '../models/DocumentCategory.js'
import DocumentType from '../models/DocumentType.js'

class DocumentService {
  async generateData(req) {
    try {
      const {
        code,
        title,
        author,
        studentIdNumber,
        year,
        lectures,
        publisher,
        place_of_publication,
        categoryId,
        qty,
        typeId,
        specializationId,
        locationId,
        volume,
        identifier,
        classification,
        language,
        content,
        physicalDescription,
        doi,
      } = req.body
      
      if(!code) return { status: false, code: 428, message: "CODE_IS_REQUIRED" }
      if(!title) return { status: false, code: 428, message: "TITLE_IS_REQUIRED" }
      if(!author) return { status: false, code: 428, message: "AUTHOR_IS_REQUIRED" }
      if(!locationId) return { status: false, code: 428, message: "LOCATION_IS_REQUIRED" }

      // locationId
      let checkObjId = await checkValidationObjectId(locationId, StockLocation, "STOCK_LOCATION")
      if(!checkObjId.status) return checkObjId

      let data = {
        code,
        title, 
        author,
        locationId
      }

      // specializationId
      if(specializationId) {
        let checkObjId = await checkValidationObjectId(specializationId, ResSpecialization, "SPECIALIZATION")
        if(!checkObjId.status) return checkObjId

        data['specializationId'] = specializationId
      }

      // categoryId
      if(categoryId) {
        let checkObjId = await checkValidationObjectId(categoryId, DocumentCategory, "DOCUMENT_CATEGORY")
        if(!checkObjId.status) return checkObjId
      
        data['categoryId'] = categoryId
      }

      // typeId
      if(typeId) {
        let checkObjId = await checkValidationObjectId(typeId, DocumentType, "DOCUMENT_TYPE")
        if(!checkObjId.status) return checkObjId
      
        data['typeId'] = typeId
      }

      if(req.file) data['cover'] = req.file.filename

      if(studentIdNumber) data['studentIdNumber'] = studentIdNumber
      if(year) data['year'] = year
      if(lectures) data['lectures'] = lectures
      if(publisher) data['publisher'] = publisher
      if(place_of_publication) data['place_of_publication'] = place_of_publication
      if(qty) data['qty'] = data['currentQty'] = qty
      if(volume) data['volume'] = volume
      if(identifier) data['identifier'] = identifier
      if(classification) data['classification'] = classification
      if(language) data['language'] = language
      if(content) data['content'] = content
      if(physicalDescription) data['physicalDescription'] = physicalDescription
      if(doi) data['doi'] = doi
      
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
      const { 
        typeId, 
        categoryId, 
        specializationId,
        locationId,
        search,
        currentYear,
        startYear,
        endYear,
        lang,

        sort,
        page,
        limit,
      } = req.query

      // query where
      if(typeId) {
        let checkObjId = await checkValidationObjectId(typeId, DocumentType, "DOCUMENT_TYPE")
        if(checkObjId.status) query['typeId'] = new mongoose.Types.ObjectId(typeId)
      }
      if(categoryId) {
        let checkObjId = await checkValidationObjectId(categoryId, DocumentCategory, "DOCUMENT_CATEGORY")
        if(checkObjId.status) query['categoryId'] = new mongoose.Types.ObjectId(categoryId)
      }
      if(specializationId) {
        let checkObjId = await checkValidationObjectId(specializationId, ResSpecialization, "SPECIALIZATION")
        if(checkObjId.status) query['specializationId'] = new mongoose.Types.ObjectId(specializationId)
      }
      if(locationId) {
        let checkObjId = await checkValidationObjectId(locationId, StockLocation, "STOCK_LOCATION")
        if(checkObjId.status) query['locationId'] = new mongoose.Types.ObjectId(locationId)
      }

      // code, author, studentIdNumber, lectures, publisher, title = $or
      if(search) {
        query['$or'] = [
          { 'code': { $regex: search.toLowerCase(), $options: "si" } },
          { 'author': { $regex: search.toLowerCase(), $options: "si" } },
          { 'studentIdNumber': { $regex: search.toLowerCase(), $options: "si" } },
          { 'lectures': { $regex: search.toLowerCase(), $options: "si" } },
          { 'publisher': { $regex: search.toLowerCase(), $options: "si" } },
          { 'title': { $regex: search.toLowerCase(), $options: "si" } }
        ]
      }
      if(lang) query['lang'] = lang
      
      // year
      if(currentYear || startYear || endYear) {
        query['year'] = {}
        if(currentYear != 0) { Object.assign(query['year'], { $eq: parseInt(currentYear) }) }
        if(startYear != 0) { Object.assign(query['year'], { $gte: parseInt(startYear) }) }
        if(endYear != 0) { Object.assign(query['year'], { $lte: parseInt(endYear) }) }
      }
      
      const aggregate = [ { $match: query } ]
      
      if(sort) {
        if(sort.includes('-')) {
          aggregate.push({ $sort: { [sort.substring(1)]: -1 } })
        } else {
          aggregate.push({ $sort: { [sort]: 1 } })
        }
      }

      aggregate.push({
        $lookup: {
          from: "documentcategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId"
        }
      })
      aggregate.push({ $unwind: {"path": '$categoryId', "preserveNullAndEmptyArrays": true} })
      aggregate.push({
        $lookup: {
          from: "documenttypes",
          localField: "typeId",
          foreignField: "_id",
          as: "typeId"
        }
      })
      aggregate.push({ $unwind: {"path": '$typeId', "preserveNullAndEmptyArrays": true} })
      aggregate.push({
        $lookup: {
          from: "resspecializations",
          localField: "specializationId",
          foreignField: "_id",
          as: "specializationId"
        }
      })
      aggregate.push({ $unwind: {"path": '$specializationId', "preserveNullAndEmptyArrays": true} })
      aggregate.push({
        $lookup: {
          from: "stocklocations",
          localField: "locationId",
          foreignField: "_id",
          as: "locationId"
        }
      })
      aggregate.push({ $unwind: {"path": '$locationId', "preserveNullAndEmptyArrays": true} })

      // 
      aggregate.push({ $addFields: {coverUrl: { $concat: [req.protocol, "://", req.get('host'), "/uploads/documents/", "$cover"] }} })
      
      if(limit) {
        const skip = ((Number(page) !== 0 && !isNaN(Number(page))) && (Number(limit) !== 0 && !isNaN(Number(limit)))) ? (Number(page) - 1) * Number(limit) : 0
        aggregate.push({ $skip: skip })
        aggregate.push({ $limit: Number(limit) })
      }

      return { status: true, aggregate }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }

  async generateQueryGroup(req) {
    try {
      const { group } = req.query
      
      const query = []
      // query where
      
      // query group
      if(group === 'category') {
        query.push(
          {
            $lookup: {
              from: "documentcategories",
              localField: "categoryId",
              foreignField: "_id",
              as: "result"
            }
          },
          {
            $group: { _id: "$result", total: { $sum: 1 } }
          }
        )
      }
      if(group === 'type') {
        query.push(
          {
            $lookup: {
              from: "documenttypes",
              localField: "typeId",
              foreignField: "_id",
              as: "result"
            }
          },
          {
            $group: { _id: "$result", total: { $sum: 1 } }
          }
        )
      }
      if(group === 'specialization') {
        query.push(
          {
            $lookup: {
              from: "resspecializations",
              localField: "specializationId",
              foreignField: "_id",
              as: "result"
            }
          },
          {
            $group: { _id: "$result", total: { $sum: 1 } }
          }
        )
      }
      if(group === 'location') {
        query.push(
          {
            $lookup: {
              from: "stocklocations",
              localField: "locationId",
              foreignField: "_id",
              as: "result"
            }
          },
          {
            $group: { _id: "$result", total: { $sum: 1 } }
          }
        )
      }

      if(query.length == 0) return {status: false, code: 400}
        
      return { status: true, query }
    } catch (err) {
      if(!err.status) err.status = false
      if(!err.code) err.code = 500
      return err
    }
  }
}

export default new DocumentService