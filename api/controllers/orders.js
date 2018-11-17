const Order = require('../moduls/order');
const Product = require('../moduls/product');
const mongoose = require('mongoose');

exports.order_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name') // to show the specified product fields
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.add_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(500).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .populate('product')
    .then(order => {
      if (!order) {
        res.status(500).json({
          message: 'Order not found!'
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders'
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.delete_order = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.deleteOne({ _id: orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          data: { productId: 'ID', quantity: 'Number' }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
