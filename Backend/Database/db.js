const mongoose = require('mongoose')


const mongoUrl=''//Enter your Database Link here

const db= mongoose.connect(mongoUrl,{
useNewUrlParser:true,
useUnifiedTopology :true,
}).then(()=>{
  console.log("Database Connected successfully...")
}).catch((err)=>{
  console.error("Connection failed with database",err)
})

module.exports =db;
