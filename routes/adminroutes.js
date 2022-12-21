
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
router.get('/home',adminHome)

router.get('/userpage',userPage)
router.get('/block/:id',block)
router.get('/unblock/:id',unblock)
router.get('/catpage',catPage)
router.get('/addcat',addCategory)
router.post('/add',postaddCategory)
router.get('/delcategory/:id',deleteCategory)
router.get('/editcategory/:id',editCat)
router.post('/updatecategory/:id',postEdit)
router.get('/productlist',productList)
router.get('/addproduct',addProduct)
router.post('/postaddproduct',postAddproduct)
router.get('/deletproduct/:id',deleteProduct)
router.get('/updatepage/:id',updatePage)
router.post('/updateproduct/:id',updateproduct)

module.exports = router

