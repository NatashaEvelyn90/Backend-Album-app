//! e = error r = rows t= table obj = response that we are going to be passing in
//? Typing this helper out, now all we have to type in our code is the queryAction(res, error, rows, table) whenever we need to call it in its place.  Take a look at the daoCommon.js document. The greyed out code is what we would have to originally have to keep typing out but instead we replaced it by just adding what I stated at the top. 
const queryAction =(obj, e, r, t)=> {
    
    if(!e) {
        if(r.length === 1) {
            obj.json(...r)
        } else {
            obj.json(r)
        }
    } else {
        console.log(`DAO Error: ${e}`)
        obj.json({
            "message": 'error',
            'table': `${t}`,
            'error': e
        })
    }
}
    

module.exports = {
    queryAction
}