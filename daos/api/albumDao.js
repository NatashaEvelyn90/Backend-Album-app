const con = require ('../../config/dbconfig')
const { queryAction} = require('../../helpers/queryAction')
const albumDao = {
    
    table: 'album',

    findAlbumInfo: (res, table)=> {
        
        const sql = `SELECT al.album_id, al.title, al.artist_id, al.band_id, al.label_id, al.yr_released,
            CASE 
                WHEN ar.fName is NULL THEN ''
                ELSE ar.fName
                END fName,
            CASE
                WHEN ar.lName IS NULL THEN ''
                ELSE ar.lName
                END lName,
            CASE
                WHEN b.band IS NULL THEN ''
                ELSE b.band
                END band,
            l.label
            FROM album al
            LEFT OUTER JOIN artist ar USING (artist_id)        
            LEFT OUTER JOIN band b USING (band_id)
            JOIN label l USING (label_id)
            ORDER BY al.album_id;`

            con.query(
                sql,
                (error, rows)=> {
                    queryAction(res, error, rows, table)
                }
            )
    },
    findAlbumsByArtistId: (res, table, id)=> {
    
            const sql = `SELECT title, album_id, yr_released FROM ${table} WHERE artist_id = ${id};`
    
            con.query(
                sql,
                (error, rows)=> {
                    queryAction(res, error, rows, table)
                }
            )
        },

        createAlbum: (req, res, table)=> {

            //! capture fName, lName, band and label
            const fName = req.body.fName
            const lName = req.body.lName
            const band = req.body.band
            const label = req.body.label

            let data = {
                artist_id: null,
                band_id: null,
                label_id: null,
            }

            
            let artist = {}
            
            
            // check in the artist table first if it is in the database
        con.execute(`
                SELECT * FROM artist;`,
                (error, rows)=> {
                if (!error) { // if NO error
                    //* find artist where fName and lName are the same as artist.fName and artist.lName
                    if (fName != null || lName != null) {
                        artist = rows.find(artist => artist.fName == fName && artist.lName == lName)                     
                        //* if artist is undefined add to artist table
                        console.log(artist)
                        if(artist == undefined) {
                            console.log('artist is undenfined')
                            con.execute(
                                `INSERT INTO artist SET fName = "${fName}", lName = "${lName}";`,
                                (error, dbres) => {
                                    if(!error) {
                                        console.log(dbres.insertId)
                                        data.artist_id = dbres.insertId
                                    } else {
                                        console.log(error)
                                    }
                                }
                            )
                        
                            
                        }
                        
                    }
                    
                }
            }
        )
            // data.artist_id = artist.artist_id
            data = {
                artist_id: artist.artist_id,
                band_id: null,
                label_id: null
            }
            res.json(data)
    }
}




module.exports = albumDao