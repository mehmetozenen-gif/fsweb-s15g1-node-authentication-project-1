
const express = require('express');
const router = express.Router();

const Users = require('./users-model');
const { sinirli } = require('../auth/auth-middleware');

// GET /api/users
// Yalnızca giriş yapmış kullanıcılar erişebilir
router.get('/', sinirli, async (req, res, next) => {
  try {
    const users = await Users.bul();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
