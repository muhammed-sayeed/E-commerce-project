const express = require('express')
const logger = require('morgan')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const http = require('http')
const session = require('express-session')
const multer = require('multer')
const nocache = require('nocache')


const filestorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/imagess')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g,'-')+ file.originalname)
    }
});


const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/png' || file.mimetype ==='image.jpg' || file.mimetype ==='image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
   
}


app.set('views',path.join(__dirname,"views"))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))
// app.use(express.static(path.resolve('./public')))



// app.use(express.static(__dirname+'/public/admin'))





app.use(session({
    secret:"sessionkey",
    resave : false,
    saveUninitialized:true,
    cookie:{maxAge:6000000}
}))

app.use(nocache())


app.use(logger('dev'))



const userRouter = require('./routes/userroutes')
const adminRouter = require('./routes/adminroutes')

app.use(express.urlencoded({ extended: false }));
app.use(multer({storage : filestorage,fileFilter:fileFilter}).fields([{name:"image",maxCount:2}]))



app.use('/',userRouter)
app.use('/admin',adminRouter)

// app.listen(3000)

module.exports = app
