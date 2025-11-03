const express = require('express')
const router = express.Router()

const {albumDao: dao}= require('../../daos/dao')

//? http://localhost:3000/api/album 
router.get('/', (req, res)=> {
    dao.findAll(req, res, dao.table)
})

//? http://localhost:300/api/album/sort/ 
//* after the slash, you can put what you want, so example, you can put band_id or label_id or yr_released and it will put that information in order. 

router.get('/sort/:sorter', (req, res) => {
    dao.sort(res, dao.table, req.params.sorter)
})

//! This is the id link 
//? http://localhost:300/api/:id
router.get('/:id', (req, res) => {
    dao.findById(res, dao.table, req.params.id)
})

module.exports = router