const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../moduls/user');

exports.users_get_all = (req, res, next) => {
  User.find()
    .select('_id email')
    .exec()
    .then(users => {
      return res.status(200).json({ users: users });
    })
    .catch(err => {
      return res.status(500).json({ error: err });
    });
};

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length) {
        return res.status(422).json({
          message: 'User with the specified email already exist!'
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'User created',
              result: result
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      });
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "mail not found, user doesn't exist"
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: err
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        return res.status(401).json({
          message: err
        });
      });
    })
    .catch(err => {
      console.log('err :', err);
      res.status(500).json({
        error: err
      });
    });
};

exports.delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      console.log(result);
      if (result)
        return res.status(200).json({
          message: 'User is deleted'
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err
      });
    });
};
