import mongoose from "mongoose"

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
        qty,
        volume,
        identifier,
        classification,
        language,
        content,
        physicalDescription,
        doi,
        
        category,
        type,
        specialization,
        location,
      } = req.body
      
      if(!code) return { status: false, code: 428, message: "CODE_IS_REQUIRED" }
      if(!title) return { status: false, code: 428, message: "TITLE_IS_REQUIRED" }
      if(!author) return { status: false, code: 428, message: "AUTHOR_IS_REQUIRED" }
      if(!location) return { status: false, code: 428, message: "LOCATION_IS_REQUIRED" }


      let data = {
        code,
        title, 
        author,
        location
      }

      // specialization
      if(specialization) {
        data['specialization'] = specialization
      }

      // category
      if(category) {
        data['category'] = category
      }

      // type
      if(type) {
        data['type'] = type
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
        query['type.id'] = typeId
      }
      if(categoryId) {
        query['category.id'] = categoryId
      }
      if(specializationId) {
        query['specialization.id'] = specializationId
      }
      if(locationId) {
        query['location.id'] = locationId
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
      
      // query group
      if(group === 'category') {
        query.push(
          {
            $group: { _id: "$category", "documents": { $push: "$title" } }
          },
          {
            $project: { "total":{ $size:"$documents" } }
          }
        )
      }
      if(group === 'type') {
        query.push(
          {
            $group: { _id: "$type", "documents": { $push: "$title" } }
          },
          {
            $project: { "total":{ $size:"$documents" } }
          }
        )
      }
      if(group === 'specialization') {
        query.push(
          {
            $group: { _id: "$specialization", "documents": { $push: "$title" } }
          },
          {
            $project: { "total":{ $size:"$documents" } }
          }
        )
      }
      if(group === 'location') {
        query.push(
          {
            $group: { _id: "$location", "documents": { $push: "$title" } }
          },
          {
            $project: { "total":{ $size:"$documents" } }
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