
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const server = express();

server.use(helmet());
server.use(express.json());

server.use(cors({
  origin: true,
  credentials: true,
}));

// Session ve cookie yapılandırması
server.use(session({
  name: 'cikolatacips',
  secret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

// API rotaları
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

// Hata yakalama
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
