const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const movies = require('./controllers/movies');
const messages = require('./controllers/messages');

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    }
});



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=>{res.send('the server is working!')})
app.post('/signin', signin.handleSignIn(db,bcrypt))
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})
app.post ('/movieSearch',(req,res)=> {movies.handleApiCall(req,res)})
app.post ('/addMovie',(req,res)=> {movies.handleAddMovie(req,res,db)})
app.post ('/getList',(req,res)=> {movies.handleGetList(req,res,db)})
app.put ('/watched',(req,res)=> {movies.handleWatchCange(req,res,db)})
app.delete ('/removeMovie',(req,res)=> {movies.handleRemoveMovie(req,res,db)})
app.post ('/sendMessage',(req,res)=> {messages.handleMessages(req,res,db)})

app.listen(process.env.PORT || 3001,()=>{
    console.log(`app is running in port ${process.env.PORT}`);
})

