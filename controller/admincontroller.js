const user = require("../model/usermodel");
const Admindb = require("../model/category");
const category = require("../model/category");
const mongoose = require("mongoose");
const adminEmail = process.env.adminEmail;
const adminPassword = process.env.adminPassword;

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

//const userView =(req,res) =>{
//   res.render('admin/userpage')
//}

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
  const image = req.file;
  let imageUrl = image.path;
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

const editCat = (req, res) => {
  console.log("editing");
  const delid = req.params.id;
  console.log(delid);
  const onUser = category.findOne({ _id: delid });
  res.render("admin/editcategory", { onUser });
};

module.exports = {
  adminLogin,
  postAdmin,
  adminHome,
  //userView,
  userPage,
  block,
  unblock,
  catPage,
  addCategory,
  postaddCategory,
  deleteCategory,
  editCat,
};
