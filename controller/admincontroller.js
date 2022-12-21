const user = require("../model/usermodel");
const Admindb = require("../model/category");
const category = require("../model/category");
const mongoose = require("mongoose");
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;
const product = require("../model/product");
const Productdb = require("../model/product");

const adminLogin = (req, res) => {
  res.render("admin/adminlogin");
};

const postAdmin = (req, res) => {
  const admin = req.body.email;
  const password = req.body.password;
  console.log("login started");

  if (admin === adminEmail && password === adminPassword) {
    console.log("checking");
    req.session.admin = true;
    res.redirect("admin/home");
  } else {
    console.log("checking failed");
    res.redirect("/admin");
  }
};

const adminHome = (req, res) => {
  res.render("admin/adminhome");
};

const userPage = async (req, res) => {
  const userlist = await user.find();
  console.log(userlist);
  res.render("admin/userpage", { userlist });
};

const block = async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  await user.findByIdAndUpdate(id, { access: false });
  res.redirect("/admin/userpage");
};

const unblock = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  await user.findByIdAndUpdate(_id, { access: true });
  res.redirect("/admin/userpage");
};

const catPage = async (req, res) => {
  const categorylist = await category.find();
  console.log(categorylist);
  res.render("admin/catPage", { categorylist });
};

const addCategory = (req, res) => {
  res.render("admin/addcat");
};

const postaddCategory = (req, res) => {
  console.log("cat adding");
  const image = req.files.image;
  let imageUrl = image[0].path;
  imageUrl = imageUrl.substring(6);
  console.log(req.body);
  if (!image) {
    res.redirect("/admin/addcat");
  }
  console.log(image.path);
  const category1 = new Admindb({
    name: req.body.name,
    image: imageUrl,
    description: req.body.description,
  });
  category1.save((err, doc) => {
    if (err) console.log(err);
    else {
      console.log(doc);
      res.redirect("/admin/catpage");
    }
  });
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  console.log("deleting");
  console.log(id);
  await category
    .findByIdAndDelete({ _id: id })
    .then((doc) => {
      console.log(doc);
      res.redirect("/admin/catpage");
    })
    .catch((err) => console.log(err));
};

const editCat = async (req, res) => {
  console.log("editing");
  const delid = req.params.id;
  console.log(delid);
  const onUser = await category.findOne({ _id: delid });
  console.log(onUser);
  res.render("admin/editcategory", { onUser });
};

const postEdit = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  console.log(
    "post editing----------------------------------------------------------"
  );
  const id = req.params.id;
  console.log(id);
  const updateName = req.body.categoryname;
  const updatedescription = req.body.description;
  const updateimage = req.file;
  console.log(updateName);

  let cat = { name: updateName, description: updatedescription };
  if (updateimage) {
    let imageUrl = updateimage.path;
    cat.image = imageUrl.substring(6);
  }
  console.log(cat.image);
  await category.updateOne(
    { _id: id },
    {
      $set: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
    }
  );
  res.redirect("/admin/catpage");
};

const productList = async (req, res) => {
  const productlist = await product.find().populate("category");
  console.log(productlist);
  res.render("admin/product", { productlist });
};

const addProduct = async (req, res) => {
  const categories = await category.find();
  res.render("admin/addproduct", { categories });
};

const postAddproduct = (req, res) => {
  console.log("product adding-----------------------------");
  console.log(req.files);
  const image = req.files.image;
  console.log("image-------------------------------------");
  let img = [];
  image.forEach((el, i, arr) => {
    img.push(arr[i].path.substring(6));
  });

  console.log(image.path);
  const product1 = new Productdb({
    name: req.body.name,
    brand: req.body.brand,
    stock: req.body.stock,
    price: req.body.price,
    discount: req.body.discount,
    size: req.body.size,
    category: req.body.category,
    image: img,
    description: req.body.description,
  });
  product1.save((err, doc) => {
    if (err) {
      console.log(err);
      res.redirect("admin/addproduct");
    } else {
      console.log(doc);
      res.redirect("/admin/productlist");
    }
  });
};

const deleteProduct = (req, res) => {
  const id = req.params.id;
  console.log("deleting----------------");
  console.log(id);
  product
    .findByIdAndDelete({ _id: id })
    .then((doc) => {
      console.log(doc);
      res.redirect("/admin/productlist");
    })
    .catch((err) => {
      console.log(err);
    });
};

const updatePage = async (req, res) => {
  const updateid = req.params.id;
  console.log("update page-----------------------------------");
  console.log(updateid);
  const categories = await category.find();
  const onUser = await product.findOne({ _id: updateid });
  console.log(onUser);
  res.render("admin/updateproduct", { categories, onUser });
};

const updateproduct = async (req, res) => {
  console.log("updating----------------------------");
  const id = req.params.id;
  console.log(id);
  const image = req.files.image;
  const pro = {
    name: req.body.name,
    brand: req.body.brand,
    price: req.body.price,
    stock: req.body.stock,
    category: req.body.category,
    description: req.body.description,
    discount: req.body.discount,
    size: req.body.size,
  };
  if (image) {
    img = [];
    image.forEach((el, i, arr) => {
      img.push(arr[i].path.substring(6));
    });
    const productz = await product.updateOne(
      { _id: id },
      {
        $set: {
          name: pro.name,
          brand: pro.brand,
          price: pro.price,
          stock: pro.stock,
          category: pro.category,
          image: img,
          description: pro.description,
          discount: pro.discount,
          size: pro.size,
        },
      }
    );
  } else {
    const productz = await product.updateOne(
      { _id: id },
      {
        $set: {
          name: pro.name,
          brand: pro.brand,
          price: pro.price,
          stock: pro.stock,
          category: pro.category,
          description: pro.description,
          discount: pro.discount,
          size: pro.size,
        },
      }
    );
  }
  res.redirect("/admin/productlist");
};

module.exports = {
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
  updateproduct,
};
