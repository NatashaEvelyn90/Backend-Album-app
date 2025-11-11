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
//! request.body =>{} 
        if(Object.keys(req.body).length === 0) { //Object must be capitalized
            //! Object.keys(obj) => array of keys
            res.json({
                "error": true,
                "message": "No fields to create"
            })
        } else {
            const fields = Object.keys(req.body)
            const values = Object.values(req.body)
            //* exectute can take 3 arguments, query can only take 2 arguments


            connect.execute(
                `INSERT INTO ${table} SET ${fields.join(' = ?, ')} = ? ;`,
                values,
                (error, dbres)=> {
                    if(!error){
                        // res.json({
                        //     Last_id: dbres.insertId
                        // })
                        console.log(dbres)
                        res.render('pages/success', {
                            title: 'Success',
                            name: 'Success'
                        })
                    } else {
                        console.log(`${table} Dao error: `, error)
                    }
                }
            )
        }

        // console.log(req)
        // res.send('complete')
    },

    update: (req, res, table) => {
        // first, we would need to check to see if the id is equal to a number. id == number
        if(isNaN(req.params.id)) {
            res.json({
                "error": true,
                "message": "Id must be a number"
            })
        } else if (Object.keys(req.body).length == 0) {
            res.json({
                "error": true,
                "message": "No fields to update"
            })
        } else {
            const fields = Object.keys(req.body)
            const values = Object.values(req.body)

            connect.execute(
                `UPDATE ${table}
                    SET ${fields.join(' = ?, ')} = ? 
                    WHERE ${table}_id = ?`,
                [...values, req.params.id],
                (error, dbres)=> {
                    if(!error) {
                        // res.send(`Changed${dbres.changedRows} row(s)`)
                        res.json({
                            "status": 'updated',
                            "changedRows": dbres.changedRows
                        })
                    } else {
                        res.json({
                            "error": true,
                            "message": error
                        })
                    }
                }    
            )
        }
    },
    
    //! Deleting records 
    delete: (res, table, id)=> {
        console.log(`${table}_id: ${id}`)

        connect.execute(`
            DELETE from ${table} 
            WHERE ${table}_id = ${id};
            SET @num := 0;
            UPDATE ${table} 
            SET ${table}_id = @num := (@num +1);
            ALTER TABLE ${table} AUTO_INCREMENT = 1;`,

            (error, dbres)=> {
                if(!error) {
                    res.send('Record Deleted')
                } else {
                    res.json({
                        "error":true,
                        "message": error
                    })
                }
            }
        )
        // prompt('ARE YOU SURE YOU WANT TO DELETE???')
        //do stuff

    }
}

module.exports = daoCommon