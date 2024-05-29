const mongoose = require('mongoose')

const { serverError } = require('../../constants')
const banOrUnbanUser = require('../services/admin/user/banOrUnbanUser')
const deleteBannedUser = require('../services/admin/user/deleteBannedUser')
const deleteUserReport = require('../services/admin/user/deleteUserReport')
const getReportedUsers = require('../services/admin/user/getReportedUsers')
const getBannedUsers = require(`../services/admin/user/getBannedUsers`)
const banOrUnbanPost = require(`../services/admin/post/banOrUnbanPost`)
const deleteBannedPosts = require(`../services/admin/post/deleteBannedPost`)
const getReportedPosts = require(`../services/admin/post/getReportedPosts`)
const getBannedPosts = require(`../services/admin/post/getBannedPosts`)

// ========== USERS ==========
const banOrUnbanUserController = async(req, res)=>{
    try {
        const { code, message, user } = banOrUnbanUser({
            ...req.params,
            message: req.body.message || '',
            loggedUserId: req.id
        })

        return res.status(code).json({ message, user })
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

const deleteBannedUserController = async(req, res)=>{
    try{
        const { code, message, ban_info, user } = await deleteBannedUser({
            ...req.params,
            loggedUserId: req.id
        })
        
        return res.status(code).json({ message, ban_info, user })
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

const deleteUserReportController = async(req, res)=>{
    try{
        const { code, message, user } = await deleteUserReport({...req.params})

        return res.status(code).json({ message, user })
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

const getReportedUsersController = async(req, res)=>{
    const page = Number(req.query.page) || 1
    const maxPageSize = req.query.maxPageSize ? ( Number(req.query.maxPageSize) <= 100 ? Number(req.query.maxPageSize) : 100) : 1

    try{
        const { code, response } = await getReportedUsers({
            page,
            maxPageSize
        })

        return res.status(code).json(response)
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

const getBannedUsersController = async(req, res)=>{
    const page = Number(req.query.page) || 1
    const maxPageSize = req.query.pageSize ? ( Number(req.query.pageSize) <= 100 ? Number(req.query.pageSize) : 100) : 1

    try{

        const { code, response } = await getBannedUsers({
            page,
            maxPageSize,
            loggedUserId: new mongoose.Types.ObjectId(req.id)
        })

        return res.status(code).json(response)
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

// =========== POSTS ==========
const banOrUnbanPostController = async(req, res)=>{
    try {
        const { code, message, post } = await banOrUnbanPost({
            ...req.params,
            message: req.body.message || '',
            loggedUserId: req.id
        })

        return res.status(code).json({
            message,
            post
        })
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

const deleteBannedPostController = async(req, res)=>{
    try{
        const { code, message, post } = deleteBannedPosts({
            ...req.params,
            message: req.body.message || '',
            loggedUserId: req.id
        })

        return res.status(code).json({ message, post })
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

const getReportedPostsController = async(req, res)=>{
    const page = Number(req.query.page) || 1
    const maxPageSize = req.query.maxPageSize ? ( Number(req.query.maxPageSize) <= 100 ? Number(req.query.maxPageSize) : 100) : 1

    try{
        const { response, code } = await getReportedPosts({
            page,
            maxPageSize
        })

        return res.status(code).json(response)
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

const getBannedPostsController = async(req, res)=>{
    const page = Number(req.query.page) || 1
    const maxPageSize = req.query.maxPageSize ? ( Number(req.query.maxPageSize) <= 100 ? Number(req.query.maxPageSize) : 100) : 1

    try{
        const { response, code } = await getBannedPosts({
            loggedUserId: new mongoose.Types.ObjectId(req.id),
            page,
            maxPageSize
        })

        return res.status(code).json(response)
    } catch (error) {
        return res.status(500).json({ message: serverError(error.toString()) })
    }
}

module.exports = {
    getReportedUsers: getReportedUsersController,
    getBannedUsers: getBannedUsersController,
    banOrUnbanUser: banOrUnbanUserController,
    deleteBannedUser: deleteBannedUserController,
    deleteUserReport: deleteUserReportController,
    getReportedPosts: getReportedPostsController,
    getBannedPosts: getBannedPostsController,
    banOrUnbanPost: banOrUnbanPostController,
    deleteBannedPost: deleteBannedPostController,
}