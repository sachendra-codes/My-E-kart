const express = require('express')
const router = express.Router()
const {
  isAdmin,
  isSignedin,
  isAuthenticated,
} = require('../controllers/auth.js')

const {
  getUserById,
  pushOrderInPurchaseList,
} = require('../controllers/user.js')

const { updateStock } = require('../controllers/product.js')

const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require('../controllers/order')

router.param('userId', getUserById)
router.param('orderId', getOrderById)

//Create
router.post(
  '/order/create/:userId',
  isSignedin,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
)

router.get(
  '/order/all/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  getAllOrders
)

//Status of order
router.get(
  '/order/status/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  getOrderStatus
)
router.put(
  '/order/:orderId/status/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateStatus
)
module.exports = router
