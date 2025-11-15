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
    
    //! need an objec that will hold data to be added to album table 
    let albumInfo = {
        title: req.body.title,
        artist_id: null,
        band_id: null,
        label_id: null,
        yr_released: req. body.yr_released
    }
    
    //! check in the artist table first if it is in the database. If it is, return the artist_id. If not, add the artist and return the artist id
    const artistId = con.execute(`
        SELECT * FROM artist;`,
        (error, rows)=> {
            let artist
            let id
                if (!error) { // if NO error
                    //* find artist where fName and lName are the same as artist.fName and artist.lName
                    if (fName != null || lName != null) {
                        artist = rows.find(artist => artist.fName == fName && artist.lName == lName)                     
    
                        if(artist == undefined) { //* if artist is undefined/no match; add to artist table
                            con.execute(
                                `INSERT INTO artist SET fName = "${fName}", lName = "${lName}";`,
                                (error, dbres) => {
                                    if(!error) {
                                        id = dbres.insertId
                                        return id
                                    }else{
                                        console.log(error)
                                    }                                        
                                } 
                            )
                            console.log(artistId)        
                            albumInfo.artist_id = artistId
    
                            res.json(albuminfo)    
                        }
                    }                                              
                }                       
            }          
        )
    }
}



module.exports = albumDao

// * Crazpicc notes. This is what we had previously

// const fName = req.body.fName
//         const lName = req.body.lName
//         const band = req.body.band
//         const label = req.body.label

//         let data = {
//             artist_id: null,
//             band_id: null,
//             label_id: null
//         }
//         let artist = {}

        // check in artist table
//         con.execute(
//             `SELECT * FROM artist;`,
//             (error, rows)=> {

//                 data.artist_id =()=> {
//                     if (!error) {
                    //  find artist where fName and lName are the same as artist.fName and artist.lName
//                         if (fName != null || lName != null) {
//                             artist = rows.find(artist => artist.fName == fName && artist.lName == lName)
                        // if artist is undefined add to artist table
//                             console.log(`artist: ${artist}`)
//                             if (artist == undefined) {
//                             con.execute(
//                                 `INSERT INTO artist SET fName = "${fName}", lName = "${lName}";`,
//                                 (error, dbres)=> {
//                                     if (!error) {
//                                         artist.artist_id = dbres.insertId
//                                         console.log(`artist has been added. artist_id is ${artist.artist_id}`)
//                                     } else {
//                                         console.log(error)
//                                     }
//                                 }
//                             )
//                             }   
//                         }
//                     }
//                     return artist.artist_id
//                 }
                
                // return data.artist_id
//             }
//         )
//         console.log(`the artist_id is ${data.artist_id}`)
        // data.artist_id = artist.artist_id
        // data = {
        //     artist_id: artist.artist_id,
        //     band_id: null,
        //     label_id: null
        // }
//         res.json(data)