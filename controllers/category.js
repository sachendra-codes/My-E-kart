const Category = require('../models/category')

exports.getCategoryById = async (req, res, next, id) => {
  try {
    category = await Category.findById(id)
    req.category = category
    next()
  } catch (err) {
    return res.status(400).json({
      message: 'Category not found in DB',
    })
  }
}

exports.createCategory = async (req, res) => {
  category = new Category(req.body)
  try {
    category = await category.save()
    res.json({ category })
  } catch (err) {
    return res.status(400).json({
      message: 'Not able to save the category in DB',
    })
  }
}

exports.getCategory = (req, res) => {
  return res.json(req.category)
}

exports.getAllCategory = async (req, res) => {
  try {
    categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(400).json({
      message: 'No category found',
    })
  }
}

exports.updateCategory = async (req, res) => {
  const category = req.category
  category.name = req.body.name
  try {
    updatedCategory = await category.save()
    res.json(updatedCategory)
  } catch (err) {
    res.status(400).json({
      message: 'Failed to update the category',
    })
  }
}

exports.removeCategory = async (req, res) => {
  category = req.category
  try {
    removedCategory = await category.remove()
    res.json({
      message: `${removedCategory.name} is successfully deleted`,
    })
  } catch (err) {
    res.status(400).json({
      message: 'Failed to delete',
    })
  }
}
