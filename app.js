require("dotenv").config();
const express = require('express');
const app = express();
const PORT = 8080;
const {db, Game, User, Review} = require('./models') 
const gameRouter = require('./routes/games')
const reviewRouter = require('./routes/review')
const cors = require('cors')
const morgan = require('morgan')

//new things -------------------------------------------------------------------------
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const { requireAuth } = require('./middleware/auth');
const FRONTEND_URL = 'http://localhost:5173'

// Deployed apps sit behind a proxy (Render, ...). This tells Express
// to trust it, so rate-limiting sees the real visitor IP and secure cookies work.
app.set('trust proxy', 1);

// Stop any one IP from spamming the server.
//
// The limit is deliberately loose in development. React's StrictMode runs every
// effect twice, and a single page refresh already costs you /auth/me plus a
// data fetch — so a tight limit means you hit 429 while debugging and think
// your auth broke. Production is where this actually has a job to do.
const isProd = process.env.NODE_ENV === 'production';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: isProd ? 100 : 1000, // max requests per IP in that window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: '🛑 Too many requests, please try again later.' },
});

app.use(helmet()); // sets safe HTTP headers
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL, // let your React app call this API
    credentials: true, // allow cookies (needed once you add login/auth)
  }),
);

app.use(morgan('dev')); // logs each request to the terminal (handy for debugging)
app.use(express.json({ limit: '10kb' })); // parse JSON bodies into req.body; cap the size
app.use(limiter);
app.use(express.static(path.join(__dirname, 'public'))); // serve the info page in /public

// ---------- health check ----------
// The first thing to hit when something seems broken. If this returns JSON,
// the server is up and the problem is further in (the database, a route, CORS).
app.get('/check', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/protected', requireAuth, (req, res) => {
  res.json({
    message: '🔒 Your token is valid — you reached a protected route!',
    userId: req.user.id,
    username: req.user.username,
    // How did they log in? Handy to see the two doors working.
    via: req.user.auth0Id ? 'auth0' : 'password',
  });
});

const authRouter = require('./routes/authRoutes')
app.use('/auth', authRouter);

// app.use(express.json())
// app.use(cors())
// app.use(morgan())
app.use(logger)
app.use('/games', gameRouter)
app.use('/games', reviewRouter)
app.use(errorHandler)

// Nothing above matched, so the thing doesn't exist. Send a clear JSON 404.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});


async function logger(req, res, next){
    await console.log('>>>Request Method', req.method, req.originalUrl)
    next()
}

async function errorHandler(err, req, res, next){
    console.error(err);
  // jwtCheck throws a 401 when a token is missing or invalid. Respect any
  // status the error already carries; anything else is a real server error.
  const status = err.status || err.statusCode || 500;
  const message =
    status === 401
      ? 'Invalid or missing token'
      : 'Something went wrong on the server';
  res.status(status).json({ error: message });
};

async function startServer(){
   try {
    await db.authenticate();
    console.log('🐘 Database connection established.');
   
    await db.sync({alter: true});
    console.log('🧩 Models synced.');

    app.listen(PORT, () => console.log(`🚀 Server is running on ${PORT}`) )
    // Graceful shutdown: hosts send SIGTERM on redeploy. Stop taking new
    // requests, then close the DB connection so nothing is left hanging.
    const shutdown = () => {
      console.log('\n👋 Shutting down...');
        db.close(async () => {
        await db.close();
        process.exit(0);
      });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('❌ Unable to start server:', err.message);
    process.exit(1); // stop the process so the problem is obvious
  };
}

startServer()

