
const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

const {
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
} = require('./auth-middleware');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  usernameBostami,
  sifreGecerlimi,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const hashedPassword = bcrypt.hashSync(password, 10);

      const user = await Users.ekle({
        username,
        password: hashedPassword,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  usernameVarmi,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const passwordCorrect =
        typeof password === 'string' &&
        bcrypt.compareSync(password, req.user.password);

      if (!passwordCorrect) {
        return res.status(401).json({
          message: 'Geçersiz kriter!',
        });
      }

      req.session.userId = req.user.user_id;

      res.status(200).json({
        message: `Hoşgeldin ${username}!`,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(200).json({
      message: 'Oturum bulunamadı!',
    });
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

   res.clearCookie('cikolatacips');

    res.status(200).json({
      message: 'Çıkış yapildi',
    });
  });
});

module.exports = router;
