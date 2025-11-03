const express = require('express')
const router = express.Router()

const {albumDao: dao}= require('../../daos/dao')

router.get('/', (req, res)=> {
    dao.findAll(req, res, dao.table)
})

module.exports = router