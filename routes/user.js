const User = require('../models/user')
const express = require('express')
const router = express.Router()
const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require('../controllers/user')
const { isSignedin, isAuthenticated, isAdmin } = require('../controllers/auth')

router.param('userId', getUserById) //whenever there is a route with /:id this will add user with that id to req.prfile

router.get('/user/:userId', isSignedin, isAuthenticated, getUser)

router.put('/user/:userId', isSignedin, isAuthenticated, updateUser)

router.get(
  '/orders/user/:userId',
  isSignedin,
  isAuthenticated,
  userPurchaseList
)

module.exports = router
