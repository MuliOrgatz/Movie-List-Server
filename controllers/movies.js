const MovieDB = require('moviedb')('9c210d9dfe311c989623093774e2c786');


const handleApiCall = (req,res)=>{
    MovieDB.searchMovie({ query: req.body.input }, (err, data)=> {
        res.json(data);
    })
}


const handleAddMovie = (req,res,db)=>{
    const {userid, movieid, posterurl,title,datarelease} = req.body;
    return db('movielist').select()
        .where({userid:userid , movieid:movieid})
    .then(function(rows) {
        if (rows.length === 0) {
            return db('movielist').insert({
                userid:userid,
                movieid:movieid,
                watched:false,
                joined:new Date().toJSON().slice(0,10).replace(/-/g,'/'),
                posterurl:posterurl,
                title:title,
                datarelease:datarelease,
            }).then(movie=>{
                res.status(200).json('added successfully');
            })
        } else {
            res.status(400).json('The movie is in your list');
        }
    })
    .catch(err=> res.status(400).json(err));
}

const handleGetList = (req,res,db)=>{
    const {userid,status} = req.body;
    if (!userid){
        return res.status(400).json('incorrect form submission');
    }
    if(status === 'All'){
        db.select('*').from('movielist')
        .where('userid','=', userid)
        .then(list => {
            res.json(list)
        })   
        .catch(err=> res.status(400).json('someting not good'))
    }else if (status === 'Watched'){
        db.select('*').from('movielist')
        .where({userid:userid, watched:true})
        .then(list => {
            res.json(list)
        })   
        .catch(err=> res.status(400).json('someting not good'))
    }else if (status === 'Want to watch'){
        db.select('*').from('movielist')
        .where({userid:userid, watched:false})
        .then(list => {
            res.json(list)
        })   
        .catch(err=> res.status(400).json('someting not good'))
    } 
}

const handleWatchCange = (req,res,db) =>{
    const {userid, movieid,watched} = req.body;
    db('movielist').select('*')
        .where({userid:userid , movieid:movieid}).update({watched:watched})
        .then(response => {
            res.json(response)
        }) 
    .catch(err=> res.status(400).json(err));
}

const handleRemoveMovie = (req,res,db) =>{
    const {userid, movieid} = req.body;
    db('movielist').where({userid:userid , movieid:movieid}).del()
    .then(response => {
    res.json(response)
    }) 
}



module.exports = {
    handleAddMovie: handleAddMovie,
    handleApiCall : handleApiCall,
    handleGetList:handleGetList,
    handleWatchCange:handleWatchCange,
    handleRemoveMovie:handleRemoveMovie,
}
