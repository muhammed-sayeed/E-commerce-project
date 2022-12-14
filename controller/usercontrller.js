const { name } = require('ejs');
const mongoose = require('mongoose')
const Userdb = require('../model/usermodel');
const {sendotp,varifyotp} = require('../verification/otp')
const bcrypt = require('bcrypt');
const user = require('../model/usermodel');









const homeView = (req, res) => {
  res.render("user/home");
};

const loginView = (req, res) => {
  res.render("user/login");
};


const postloginView = async(req,res)=>{
console.log('login started')
console.log(req.body)
const{email,password}=req.body
const loginDetails =await Userdb.findOne({email:email})
console.log(loginDetails)
if(loginDetails && loginDetails.access){
console.log('checking')
data = await bcrypt.compare(password,loginDetails.password)
   console.log(data)
     if(data){
      console.log('log success');
      req.session.login = true;
        res.render('user/home')
       
      }else{
        console.log('pass invalid');
        res.redirect('/login')
      }
   }else{
    console.log('email not find')
    res.redirect('/login')
  }}


const signView = (req, res) => {
  res.render("user/signup");
};


const postsignupView = async (req, res) => {
 
    res.redirect('user/signup')
 
console.log("hii");
console.log(req.body);
const number = req.body.phone
const user = await Userdb.findOne({email:req.body.email})
  console.log("here its is")
           console.log(user);
    if(user){
      console.log("fdgfd")
     
        res.redirect('user/signup')
    }
    else{
      req.session.user1 = req.body
       sendotp(number)
        console.log('otp page');
        res.render("user/otp");
      
    }
   }
  



const postOtp =async(req,res) =>{
console.log('varification started')
const otp = req.body.otp
const{name,phone,email,password,conform} = req.session.user1
    console.log(otp)
     varifyotp(phone,otp).then(async(verification_check)=>{
      console.log("verifying")
      if(verification_check.status=='approved'){
        const hashpassword = await bcrypt.hash(password,10)
        const hashedconfirmpassword = await bcrypt.hash(conform,10)

        const user = new Userdb({
           name :name,
           phone: phone,
           email: email,
           password:hashpassword,
           conform:hashedconfirmpassword
        })
       await user.save();
      
       req.session.login = true;
       

       res.redirect('/')
      }
    })
   }



   const logout = (req,res)=>{
    req.session.login =null;
    res.render('user/login')
   }
  
  //  const otpView = (req,res)=>{

  //   res.render('user/otp')
  //  }




module.exports = {
  homeView,
  loginView,
  signView,
//  otpView,
  postsignupView,
  postOtp,
  postloginView,
  logout,
 
};
