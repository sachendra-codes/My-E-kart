const { Order, ProductCart } = require('../models/order')
module.exports.getOrderById = async (req, res, next, id) => {
  try {
    order = await Order.findById(id).populate('products.product', 'name price')
    req.order = order
    next()
  } catch (err) {
    console.log(err)
    res.status(400).json({
      message: 'order not found',
    })
  }
}
exports.createOrder = async (req, res) => {
  req.body.orde.user = req.profile
  const order = new Order(req.body.order)
  try {
    let order = await order.save()
    res.json(order)
  } catch (err) {
    console.log(err)
    res.status(400).json({
      message: 'Can not create order',
    })
  }
}

module.exports.getAllOrders = async (req, res) => {
  try {
    orders = await Order.find().populate('user', '_id name')
    res.json(orders)
  } catch (err) {
    console.log(err)
    res.status(400).json({
      message: 'Not found any order',
    })
  }
}

module.exports.getOrderStatus = async (req, res) => {
  res.json(Order.schema.path('status').enumValues)
}

module.exports.updateStatus = async (req, res) => {
  try {
    order = await Order.update(
      { _id: req.body.orderId },
      { $set: { status: req.body.status } }
    )
    res.json(order)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Can not update status' })
  }
}
