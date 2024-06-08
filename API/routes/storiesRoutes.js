const express = require('express')
const router = express.Router()

const {
    getUserStories,
    getStorie,
    getStorieReactions,
    createStorie,
    reactStorie,
    deleteStorie,
    reportStorie
} = require('../api/controllers/storiesController')

// Middlewares
const checkTokenMW = require('../middlewares/checkTokenMW')
const checkBannedUserMW = require(`../middlewares/checkBannedUserMW`)
const checkPrivateUserMW = require(`../middlewares/checkPrivateUserMW`)
const verifyStoriesOwnershipMW = require('../middlewares/verifyStoriesOwnership')

// Routes
router.get('/:name/all_stories', checkTokenMW, verifyStoriesOwnershipMW, getUserStories) // get user stories
router.get('/:name/storie', checkTokenMW, checkBannedUserMW, checkPrivateUserMW, getStorie) // get today user stories
router.get(`/:name/:storieId/reactions`, checkTokenMW, verifyStoriesOwnershipMW, getStorieReactions) // get stories reactions

router.post('/create', checkTokenMW, createStorie) // createStories
router.post('/:name/:storieId', checkTokenMW, checkBannedUserMW, checkPrivateUserMW, reactStorie) // react to a storie
router.delete('/:storieId', checkTokenMW, deleteStorie) // delete a storie
router.put(`/:name/:storieId/report`, checkTokenMW, checkBannedUserMW, checkPrivateUserMW, reportStorie) // report storie

module.exports = router