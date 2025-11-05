const connect = require('../../config/dbconfig')
const { queryAction } = require ('../../helpers/queryAction')

const daoCommon = {

    //! Here, we will be creating methods that will be querying the database 
    findAll: (req, res, table) => {
        
        //! .query takes on the arguments (sql query, callback function)
        connect.query(
            `SELECT * FROM ${table};`,
            (error, rows)=> {
                //? This queryAction is what you type instead of the greyed out area. Re-look at the queryAction.js in the helpers folder to see all the information 
                queryAction(res, error, rows, table)
                // if(!error) {
                //     if(rows.length === 1) {
                //         res.json(...rows)
                //     } else {
                //         res.json(rows)
                //     }
                // } else {
                //     console.log(`Dao Error: ${error}`)
                //     res.json({
                //         "message": 'error',
                //         'table': `${table}`,
                //         'error': error
                //     })
                // }
            }
        )
    },


    findById: (res, table, id) => {

        connect.query(
            `SELECT * FROM ${table} WHERE ${table}_id = ${id};`,
            (error, rows) => {
                queryAction(res, error, rows, table)
                // if(!error) {
                //     res.json(...rows)
                // } else {
                //     console.log(`DAO Error: ${error}`)
                //     res.json({
                //         "message": 'error',
                //         'table': `${table}`,
                //         'error': error
                //     })
                // }
            }
        )
    },
    
    sort: (res, table, sorter) => {


        connect.query(
            `SELECT * FROM ${table} ORDER BY ${sorter};`,
            (error, rows) => {
                queryAction(res, error, rows, table)
            }
        )
    },

    create: (req, res, table) => {

        if(Object.keys(req.body).length === 0) {
            //! Object.keys(obj) => array of keys
            res.json({
                "error": true,
                "message": "No fields to create"
            })
        } else {
            const fields = Object.keys(req.body)
            const values = Object.values(req.body)

            connect.execute(
                `INSERT INTO ${table} SET ${fields.join(' = ?, ')} = ? ;`,
                values,
                (error, dbres)=> {
                    if(!error){
                        res.json({
                            Last_id: dbres.insertId
                        })
                    } else {
                        console.log(`${table} Dao error: `, error)
                    }
                }
            )
        }

        // console.log(req)
        // res.send('complete')
    }
}

module.exports = daoCommon