import { del, get, post, put } from "./api_helper"
import * as url from "./url_helper"

export const checkServer = () => get('', {})
//  .............................. AUTH ....................................
export const authLogin = user => post(url.LOGIN, user)
export const authRefreshToken = user => post(url.REFRESH_TOKEN, user, { params: { ...user } })

//  .............................. USERS ....................................
export const getUserFromToken = token => get(url.USER_FROM_TOKEN, { headers: { authorization: `Bearer ${token}` } })
export const getUsers = config => get(url.USERS, config) // { params: query, headers }
export const getUser = (id, config) => get(`${url.USERS}/${id}`, config) // { params: { id } }
export const createUser = (data, config) => post(url.USERS, data, config)
export const updateUser = (id, data, config) => put(`${url.USERS}/${id}`, data, config)
export const resetPasswordUser = (id, config) => put(`${url.USER_RESET_PASSWORD}/${id}`, {}, config)
export const changePasswordUser = (id, data, config) => put(`${url.USER_CHANGE_PASSWORD}/${id}`, data, config)
export const changeProfilePictureUser = (id, data, config) => put(`${url.USER_CHANGE_PROFILE_PICTURE}/${id}`, data, config)
export const deleteUser = (id, config) => del(`${url.USERS}/${id}`, config)

//  .............................. DOCUMENT ....................................
export const getDocuments = config => get(url.DOCUMENTS, config)
export const getDocument = id => get(`${url.DOCUMENTS}/${id}`)
export const getDocumentGroup = config => get(url.DOCUMENTS_GROUP, config)
export const createDocument = (data, config) => post(url.DOCUMENTS, data, config)
export const updateDocument = (id, data, config) =>  put(`${url.DOCUMENTS}/${id}`, data, config)
export const deleteDocument = (id, config) =>  del(`${url.DOCUMENTS}/${id}`, config)

//  .............................. ORDER ....................................
export const getOrders = config => get(url.ORDERS, config)
export const getOrder = (id, config) => get(`${url.ORDERS}/${id}`, config)
export const createOrder = (data, config) => post(url.ORDERS, data, config)
export const updateOrder = (id, data, config) =>  put(`${url.ORDERS}/${id}`, data, config)
export const deleteOrder = (id, config) => del(`${url.ORDERS}/${id}`, config)

//  .............................. PENALTY ....................................
export const getPenalties = config => get(url.ORDER_PENALTIES, config)
export const getPenalty = config => get(url.ORDER_PENALTIES, config)
export const createPenalty = (data, config) => post(url.ORDER_PENALTIES, data, config)
export const updatePenalty = (id, data, config) =>  put(`${url.ORDER_PENALTIES}/${id}`, data, config)
export const deletePenalty = (id, config) => del(`${url.ORDER_PENALTIES}/${id}`, config)


//  .............................. SETTING ....................................
//  .............................. LOCATION ....................................
export const getLocations = config => get(url.LOCATIONS, config)
export const getLocation = config => get(url.LOCATIONS, config)
export const createLocation = (data, config) => post(url.LOCATIONS, data, config)
export const updateLocation = (id, data, config) => put(`${url.LOCATIONS}/${id}`, data, config)
export const deleteLocation = (id, config) => del(`${url.LOCATIONS}/${id}`, config)

//  .............................. SPECIALIZATION ....................................
export const getSpecializations = config => get(url.SPECIALIZATIONS, config)
export const getSpecialization = config => get(url.SPECIALIZATIONS, config)
export const createSpecialization = (data, config) => post(url.SPECIALIZATIONS, data, config)
export const updateSpecialization = (id, data, config) => put(`${url.SPECIALIZATIONS}/${id}`, data, config)
export const deleteSpecialization = (id, config) => del(`${url.SPECIALIZATIONS}/${id}`, config)

//  .............................. CATEGORY ....................................
export const getDocumentCategories = config => get(url.DOCUMENT_CATEGORIES, config)
export const getDocumentCategory = config => get(url.DOCUMENT_CATEGORIES, config)
export const createDocumentCategory = (data, config) => post(url.DOCUMENT_CATEGORIES, data, config)
export const updateDocumentCategory = (id, data, config) => put(`${url.DOCUMENT_CATEGORIES}/${id}`, data, config)
export const deleteDocumentCategory = (id, config) => del(`${url.DOCUMENT_CATEGORIES}/${id}`, config)

//  .............................. TYPE ....................................
export const getDocumentTypes = config => get(url.DOCUMENT_TYPES, config)
export const getDocumentType = config => get(url.DOCUMENT_TYPES, config)
export const createDocumentType = (data, config) => post(url.DOCUMENT_TYPES, data, config)
export const updateDocumentType = (id, data, config) => put(`${url.DOCUMENT_TYPES}/${id}`, data, config)
export const deleteDocumentType = (id, config) => del(`${url.DOCUMENT_TYPES}/${id}`, config)
