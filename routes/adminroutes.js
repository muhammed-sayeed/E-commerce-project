const {varifyAdmin} = require('../Middlewear/varifyAdmin');
const  {
    adminLogin,
    postAdmin,
    adminHome,
   
    userPage,
    block,
    unblock,
    catPage,
    addCategory,
    postaddCategory,
    deleteCategory,
    editCat,
    postEdit,
    productList,
    addProduct,
    postAddproduct,
    // postAddproduct,
    deleteProduct,
    updatePage,
    updateproduct

} = require('../controller/admincontroller')
const router = require('./userroutes')


router.get('/admin',adminLogin)
router.post('/adminhome',postAdmin)
router.get('/home',varifyAdmin,adminHome)

router.get('/userpage',varifyAdmin,userPage)
router.get('/block/:id',varifyAdmin,block)
router.get('/unblock/:id',varifyAdmin,unblock)
router.get('/catpage',varifyAdmin,catPage)
router.get('/addcat',varifyAdmin,addCategory)
router.post('/add',varifyAdmin,postaddCategory)
router.get('/delcategory/:id',varifyAdmin,deleteCategory)
router.get('/editcategory/:id',varifyAdmin,editCat)
router.post('/updatecategory/:id',varifyAdmin,postEdit)
router.get('/productlist',varifyAdmin,productList)
router.get('/addproduct',varifyAdmin,addProduct)
router.post('/postaddproduct',varifyAdmin,postAddproduct)
router.get('/deletproduct/:id',varifyAdmin,deleteProduct)
router.get('/updatepage/:id',varifyAdmin,updatePage)
router.post('/updateproduct/:id',varifyAdmin,updateproduct)

module.exports = router

