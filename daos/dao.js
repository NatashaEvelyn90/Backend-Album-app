const daoCommon = require('./common/daoCommon')

const albumDao = {
    ...daoCommon,
    ...require('./api/albumDao')
    
}

const artistDao = {
    ...daoCommon,
    ...require('./api/artistDao')
    
}

module.exports = {
    albumDao,
    artistDao
}