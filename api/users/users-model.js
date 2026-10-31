
const db = require('../../data/db-config');

// Tüm kullanıcıları getir (şifre olmadan)
function bul() {
  return db('users')
    .select('user_id', 'username');
}

// Verilen filtreye göre kullanıcıları getir
function goreBul(filtre) {
  return db('users')
    .where(filtre);
}

// ID'ye göre kullanıcı getir (şifre olmadan)
function idyeGoreBul(user_id) {
  return db('users')
    .select('user_id', 'username')
    .where({ user_id })
    .first();
}

// Yeni kullanıcı ekle, şifreyi yanıtta gösterme
async function ekle(user) {
  const [user_id] = await db('users').insert(user);

  return idyeGoreBul(user_id);
}

module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
