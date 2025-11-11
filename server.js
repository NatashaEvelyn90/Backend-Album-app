//! We are going to be building our Server
//? Whenever you are building a server, you need to start these lines 
const express = require('express')
const server = express()
const router = require('./routes/router')
const PORT = process.env.PORT || 3000

//! Handling the security aspect
//? Any packets will be installed like so 
const helmet = require('helmet') 
const cors = require('cors')

//! We are going to be configuring helmet
server.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    directives: {
        "img-src": ["'self'", "https: data"],
        "scriptSrc": ["'self'", "cdn.jsdelivr.net"]
    }
}))

// server.use(helmet())
server.use(cors())
//? url address and parse it and format it into Json. without these, the objects wouldn't work?
server.use(express.json())
server.use(express.urlencoded({extended: true}))

//! Setting EJS as my view engine 
server.set('view engine', 'ejs')

//! localhost:3000 
server.use('/', router)

server.listen(PORT, ()=> console.log(`Party like a rockstar!`))