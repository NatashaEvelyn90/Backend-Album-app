const express = require('express')
const router = express.Router()
const PORT = process.env.PORT || 3000

//! We are going to be creating the root route of the API
//? root route http://localhost:3000/api
router.get('/api', (req, res) => {
    // res.send('album api')
    res.json({
        'All Albums': `http://localhost:${PORT}/api/album`
    })
}) 

router.use('/api/album', require('./api/albumRoutes'))

//! This is our ERROR handling section 
router.use((req, res, next) => {
    res.status(404)
    .send('<h1>404 Error, this page does not exist </h1>')
})

module.exports = router