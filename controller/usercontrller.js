const { name } = require("ejs");
const mongoose = require("mongoose");
const Userdb = require("../model/usermodel");
const { sendotp, varifyotp } = require("../verification/otp");
const bcrypt = require("bcrypt");
const user = require("../model/usermodel");
const product = require("../model/product");
const category = require("../model/category");
const cart = require("../model/cart");
const address = require("../model/address");

const homeView = async (req, res) => {
  const productz = await product.find();
  console.log("home--------------------------");
  console.log(productz);
  res.render("user/home", { productz });
};

const viewMore = async (req, res) => {
  console.log("single page---------------------");
  const id = req.params.id;
  console.log(id);
  console.log("id-------------------------------");
  const details = await product.findById(id).populate("category");
  console.log(details);
  res.render("user/productdetails", { details });
};

const loginView = (req, res) => {
  res.render("user/login");
};

const postloginView = async (req, res) => {
  console.log("login started");
  console.log(req.body);
  const { email, password } = req.body;
  const loginDetails = await Userdb.findOne({ email: email });
  console.log(loginDetails);
  if (loginDetails && loginDetails.access) {
    console.log("checking");
    data = await bcrypt.compare(password, loginDetails.password);
    console.log(data);
    if (data) {
      console.log("log success");

      req.session.login = loginDetails;
      console.log(req.session.login);
      console.log("this is login daata");
      res.redirect("/");
    } else {
      console.log("pass invalid");
      res.redirect("/login");
    }
  } else {
    console.log("email not find");
    res.redirect("/login");
  }
};

const signView = (req, res) => {
  res.render("user/signup");
};

const postsignupView = async (req, res) => {
  console.log("hii");
  console.log(req.body);
  const number = req.body.phone;
  const user = await Userdb.findOne({ email: req.body.email });
  console.log("here its is");
  console.log(user);
  if (user) {
    console.log("fdgfd");

    res.redirect("user/signup");
  } else {
    req.session.user1 = req.body;
    sendotp(number);
    console.log("otp page");
    res.render("user/otp");
  }
};

const postOtp = async (req, res) => {
  console.log("varification started");
  const otp = req.body.otp;
  const { name, phone, email, password, conform } = req.session.user1;
  console.log(otp);
  varifyotp(phone, otp).then(async (verification_check) => {
    console.log("verifying");
    if (verification_check.status == "approved") {
      const hashpassword = await bcrypt.hash(password, 10);
      const hashedconfirmpassword = await bcrypt.hash(conform, 10);

      const user = new Userdb({
        name: name,
        phone: phone,
        email: email,
        password: hashpassword,
        conform: hashedconfirmpassword,
      });
      await user.save();
      req.session.login = user;

      res.redirect("/");
    }
  });
};

const shopView = (req, res) => {
  res.render("user/shoppage");
};

const getCart = async (req, res) => {
  if (req.session.login) {
    const userId = req.session.login._id;
    console.log(userId);
    const cartitems = await cart
      .findOne({ owner: mongoose.Types.ObjectId(userId) })
      .populate("items.product");
    res.render("user/cart", { cartitems, owner: req.session.login });
  } else {
    res.redirect("/carterror");
  }
};

const addTocart = async (req, res) => {
  const proid = req.params.id;
  const userId = req.session.login._id;
  console.log(userId);
  console.log("this is login iddd");
  console.log(req.session.login);
  console.log(proid);
  console.log(userId);
  const Product = await product.findOne({ _id: proid });
  const user = await cart.findOne({ owner: userId });
  if (Product.stock < 1) {
    console.log("stock unavilable");
  } else {
    console.log("stock available");
    if (!user) {
      console.log("cart is empty");
      const newCart = await cart({
        owner: userId,
        items: [{ product: proid, totalprice: Product.price }],
        cartTotal: Product.price,
      });
      await newCart.save();
      console.log("added successfully");
    } else {
      console.log("productlist-----------------------------");
      const productlist = await cart.findOne({
        owner: userId,
        "items.product": proid,
      });
      console.log(productlist);
      if (productlist !== null) {
        console.log("product exist");
        console.log(productlist);
        await cart.findOneAndUpdate(
          {
            owner: userId,
            "items.product": proid,
          },
          {
            $inc: {
              "items.$.quantity": 1,
              "items.$.totalprice": Product.price,
              cartTotal: Product.price,
            },
          }
        );
      } else {
        console.log("new pro adding----------------------------");
        console.log(userId);
        const nweproAdd = await cart.findOneAndUpdate(
          { owner: userId },
          {
            $push: {
              items: { product: proid, totalprice: Product.price },
            },
            $inc: {
              cartTotal: Product.price,
            },
          }
        );
      }
    }
  }
};

const removefromcart = async (req, res) => {
  console.log(
    "..........................................................................................."
  );
  let userdata = req.session.login;
  console.log(userdata);
  const proid = req.query.productid;
  let products = await product.findOne({ _id: proid });
  let carts = await cart.findOne({ owner: userdata._id });

  console.log(".........................");

  console.log(carts);

  console.log(".........................");

  let index = await carts.items.findIndex((el) => {
    return el.product == proid;
  });
  console.log("index finded");
  console.log(index);
  let price = carts.items[index].totalprice;
  console.log(price);

  let deletingproduct = await cart.findOneAndUpdate(
    { owner: userdata._id },
    {
      $pull: {
        items: { product: proid },
      },
      $inc: { cartTotal: -price },
    }
  );
  deletingproduct.save();
  res.json("succeed");
};

const quantityChange = async (req, res) => {
  console.log("starting----------------------------------------");

  console.log(req.query);
  const products = await product.findOne({ _id: req.query.productid });
  productprice = products.price;
  const cartcount = req.query.cartcount;
  console.log("changing started----------------------------------");
  console.log(cartcount);
  if (cartcount == 1) {
    var product_price = products.price;
  } else {
    var product_price = -products.price;
    console.log("entered-------------------------------------------");
  }
  console.log("hi--------------------------------------------");
  console.log(product_price);
  let updatedcart = await cart.findOneAndUpdate(
    {
      _id: req.query.cartid,
      "items.product": req.query.productid,
    },
    {
      $inc: {
        "items.$.quantity": cartcount,
        "items.$.totalprice": product_price,
        cartTotal: product_price,
      },
    }
  );
  let total = updatedcart.cartTotal;
  let index = updatedcart.items.findIndex(
    (objitems) => objitems.product == req.query.productid
  );
  let qty = updatedcart.items[index].quantity;
  console.log(qty + "jjjjjjjj");
  console.log(total);
  console.log("hoi------------------------------------------");

  res.json({ total, qty });
};
const cartError = (req, res) => {
  res.render("user/carterror");
};

const profilePage = (req, res) => {
  if (req.session.login) {
    console.log("profile---------------------------------------");
    const userdetails = req.session.login;
    console.log(userdetails);
    res.render("user/profile", { userdetails });
  } else {
    res.redirect("/login");
  }
};

const addAddres = async (req, res) => {
  console.log(req.body);
  const userId = req.session.login._id;
  const addreexist = await address.findOne({ user: userId });
  console.log("addres------------------------------------------");
  if (addreexist) {
    await addres.findOneAndUpdate(
      { userId },
      { $push: { address: [req.body] } }
    );
    console.log("searching-------------------------------------");
    res.redirect("/profile");
  } else {
    console.log("else working--------------------------------------");
    const useraddres = await address({
      user: userId,
      address: [req.body],
    });
    console.log(useraddres);
    useraddres.save().then(() => {
      res.redirect("/profile");
    });
  }
};

const logout = (req, res) => {
  req.session.login = null;
  res.render("user/login");
};

module.exports = {
  homeView,
  loginView,
  signView,

  postsignupView,
  postOtp,
  postloginView,
  logout,
  viewMore,
  getCart,
  cartError,
  addTocart,
  removefromcart,
  quantityChange,
  shopView,
  profilePage,
  addAddres,
};
