const express = require('express')



const {
    homeView,
    loginView ,
    signView,
    // otpView,
    postsignupView,
    postOtp,
    postloginView,
    // otpView,
    logout,
   
} = require('../controller/usercontrller')


const router = express.Router()


router.get('/',homeView)
router.get('/login',loginView )
router.get('/signup',signView)
// router.post('/otp',otpView)
router.post('/signuppost',postsignupView)
router.post('/otp',postOtp)
router.post('/home',postloginView)
// router.get('/otp',otpView)
router.get('/logout',logout)



module.exports = router
   