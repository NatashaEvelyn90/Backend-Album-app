const connect = require('../../config/dbconfig')

const daoCommon = {

    //! Here, we will be creating methods that will be querying the database 
    findAll: (req, res, table) => {
        
        //! .query takes on the arguments (sql query, callback function)
        connect.query(
            `SELECT * FROM ${table};`,
            (error, rows)=> {
                if(!error) {
                    if(rows.length === 1) {
                        res.json(...rows)
                    } else {
                        res.json(rows)
                    }
                } else {
                    console.log(`Dao Error: ${error}`)
                    res.json({
                        "message": 'error',
                        'table': `${table}`,
                        'error': error
                    })
                }
            }
        )
    }
}

module.exports = daoCommon