const express = require('express')
const router = express.Router()
const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  removeCategory,
} = require('../controllers/category.js')
const { getUserById } = require('../controllers/user.js')
const {
  isSignedin,
  isAdmin,
  isAuthenticated,
} = require('../controllers/auth.js')
router.param('userId', getUserById)
router.param('categoryId', getCategoryById)

router.post(
  '/category/create/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  createCategory
)

//Read routes
router.get('/category/:categoryId', getCategory)
router.get('/categories', getAllCategory)

//Update routes
router.put(
  '/category/:categoryId/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateCategory
)

//Delete
router.delete(
  '/category/:categoryId/:userId',
  isSignedin,
  isAuthenticated,
  isAdmin,
  removeCategory
)

module.exports = router
