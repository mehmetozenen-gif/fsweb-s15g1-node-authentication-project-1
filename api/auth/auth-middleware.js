
const Users = require('../users/users-model');

// 1. Korumalı rotaları kontrol eder
function sinirli(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  return res.status(401).json({
    message: 'Geçemezsiniz!',
  });
}

// 2. Kullanıcı adı zaten kullanılıyor mu?
async function usernameBostami(req, res, next) {
  try {
    const { username } = req.body || {};

    const users = await Users.goreBul({ username });

    if (users.length > 0) {
      return res.status(422).json({
        message: 'Username kullaniliyor',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

// 3. Kullanıcı adı veritabanında var mı?
async function usernameVarmi(req, res, next) {
  try {
    const { username } = req.body || {};

    const users = await Users.goreBul({ username });

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Geçersiz kriter',
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    next(error);
  }
}

// 4. Şifre en az 3 karakter mi?
function sifreGecerlimi(req, res, next) {
  const { password } = req.body || {};

 if (
  typeof password !== 'string' ||
  password.length <= 3
) {
    return res.status(422).json({
      message: 'Şifre 3 karakterden fazla olmalı',
    });
  }

  next();
}

module.exports = {
  sinirli,
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
};
