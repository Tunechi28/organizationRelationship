const dotenv = require("dotenv");
const express = require('express');
const logger =require('morgan');

//setting up express app

const app = express();

//pass incoming requests data
app.use(express.json());
app.use(express.urlencoded({extended : false}))
dotenv.config();

//setting up a default catchup route that sends back a welcome message in JSON format
// app.get('*', (req,res) => res.status(200).send({
//     message : 'welcome to Organization Relations'
// }))
const organizationRouter = require('./routes/organization')
app.use('/organizations', organizationRouter);

app.get('/',  async function(req, res) {

    res.send('you got here. so get out')
});

let port;


if(process.env.NODE_ENV === 'DEVELOPMENT' || process.env.NODE_ENV === 'PRODUCTION' ){
    port = process.env.PORT || 7000
}

if(process.env.NODE_ENV === 'TEST'){
    port = 0
}


const server =   app.listen(port, ()=>{
    console.log(`Listening on ${port}`);
})


module.exports = server

