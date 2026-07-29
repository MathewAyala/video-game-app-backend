const express = require('express');
const app = express();
const PORT = 8080;
const {db, Game, User, Review} = require('./models') 
const gameRouter = require('./routes/games')
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
// app.use(morgan())
app.use(logger)
app.use('/games', gameRouter)
app.use(errorHandler)

async function logger(req, res, next){
    await console.log('>>>Request Method', req.method, req.originalUrl)
    next()
}

async function errorHandler(err, req, res, next){
    await console.log('>>>', err.message)
    res.status(500).json({error: 'something went wrong'})
}

async function startApp(){
    await db.sync();
    app.listen(PORT, () => console.log(`Running on Port ${PORT}`) )
}
startApp()