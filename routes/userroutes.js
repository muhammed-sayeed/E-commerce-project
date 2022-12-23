const express = require('express')



const {
    homeView,
    loginView ,
    signView,
   
    postsignupView,
    postOtp,
    postloginView,
    viewMore,
    getCart,
    cartError,
    logout,
    addTocart,
    removefromcart,
    quantityChange,
    shopView 
   
} = require('../controller/usercontrller')


const router = express.Router()


router.get('/',homeView)
router.get('/login',loginView )
router.get('/signup',signView)

router.post('/signuppost',postsignupView)
router.post('/otp',postOtp)
router.post('/home',postloginView)

router.get('/logout',logout)
router.get('/productdetails/:id',viewMore)
router.get('/gotocart',getCart)
router.get('/carterror',cartError)
router.get('/addtocart/:id',addTocart)
router.delete('/removefromcart/',removefromcart)
router.patch('/qtychange/',quantityChange),
router.get('/shopview',shopView )



module.exports = router
   