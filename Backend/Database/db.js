const mongoose = require('mongoose')


const mongoUrl='mongodb+srv://sunilbhatt:1234@cluster0.zcans64.mongodb.net/notesapp'

const db= mongoose.connect(mongoUrl,{
useNewUrlParser:true,
useUnifiedTopology :true,
}).then(()=>{
  console.log("Database Connected successfully...")
}).catch((err)=>{
  console.error("Connection failed with database",err)
})

module.exports =db;