const handleMessages = (req,res,db)=>{
    const {email,firstname,messagebody} = req.body
    if (!email || !firstname || !messagebody){
        return res.status(400).json('incorrect form submission');
    }
    return db('message').select()
        .where({email:email})
    .then(function(rows) {
        if (rows.length === 0) {
            return db('message').insert({
                email:email,
                firstname:firstname,
                messagebody:messagebody,
            }).then(response=>{
                res.status(200).json('added successfully');
            })
        } else {
            res.status(400).json('Your message already sent');
        }
    })
    .catch(err=> res.status(400).json('here'));
}

 module.exports = {
    handleMessages:handleMessages
 }