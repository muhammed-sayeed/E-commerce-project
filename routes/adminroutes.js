
const  {
    adminLogin,
    postAdmin,
    adminHome,
    // userView,
    userPage,
    block,
    unblock,
    catPage,
    addCategory,
    postaddCategory,
    deleteCategory,
    editCat

} = require('../controller/admincontroller')
const router = require('./userroutes')


router.get('/admin',adminLogin)
router.post('/adminhome',postAdmin)
router.get('/home',adminHome)
// router.get('/user', userView)
router.get('/userpage',userPage)
router.get('/block/:id',block)
router.get('/unblock/:id',unblock)
router.get('/catpage',catPage)
router.get('/addcat',addCategory)
router.post('/add',postaddCategory)
router.get('/delcategory/:id',deleteCategory)
router.get('/editcategory/:id',editCat)

module.exports = router

