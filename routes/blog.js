// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const Blog = require("../models/blog");
// const { storage } = require("../config/cloudinary"); // Adjust the path according to your project structure
// const Comment = require("../models/comments");
// const User=require('../models/user')
// const checkAuthenticationCookie = require("../middleware/authetication");

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads"); // Ensure this directory exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.floor(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// let upload = multer({
//   storage,
//   limits: { fileSize: 1000000 * 100 }, // 100 MB
// }).single("blogImage");

// router.get("/add", checkAuthenticationCookie("token"), (req, res) => {
//   res.render("addblog.ejs", {
//     user: req.user, // yeh authentication ke liye use ho rha hai na ki databse ase aarha hai
//   });
// });

// router.post(
//   "/add",
//   upload,
//   checkAuthenticationCookie("token"),
//   async (req, res) => {
//     const { title, content } = req.body;
//     const newBlog = new Blog({
//       title,
//       content,
//       createdBy: req.user._id,
//       blogImage: req.file.path,
//     });

//     await newBlog.save();
//     res.redirect("/");
//   }
// );

// router.get("/:id", checkAuthenticationCookie("token"), async (req, res) => {
//   const { id } = req.params;
//   const blog = await Blog.findById(id).populate("createdBy");
  

//   const comments = await Comment.find({ blogId: req.params.id }).populate(
//     "createdBy"
//   ).sort({createdAt:-1})

//   res.render("view.ejs", {
//     blog,
//     user: req.user,
//     comments,
    
//     // req.user authentication ke liye hai
//   });
// });

// router.get("/:id/edit",
//   checkAuthenticationCookie("token"),
//   async (req, res) => {
//     let {id} = req.params;
    
  
//   let blogdata = await Blog.findById(id);
//   console.log(blogdata)
//     res.render("edit.ejs",{blogdata});
    
//   }
// );


// router.patch("/:id/update", upload, checkAuthenticationCookie("token"), async (req, res) => {
//   const { id } = req.params;
//   const { title, content } = req.body;

//   const updateData = { title, content };

//   if (req.file) {
//     updateData.blogImage = req.file.path;
//   }

//   await Blog.findByIdAndUpdate(id, updateData);
//   res.redirect(`/${id}`);
// });

// router.delete(
//   "/:id/delete",
//   checkAuthenticationCookie("token"),
//   async (req, res) => {
//     const { id } = req.params;
//     console.log(req.user)
//     await Blog.findByIdAndDelete(id);
//     res.redirect("/");

//   }
// );

// router.post("/comment/:blogId", async (req, res) => {
//   const { content } = req.body;
//   const { blogId } = req.params;
//   const createdBy = req.user._id;

//   const newcomment = new Comment({
//     content,
//     blogId,
//     createdBy,
//   });
//   await newcomment.save();
//   res.redirect(`/${req.params.blogId}`);
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig"); // Adjust the path according to your project structure
const Blog = require("../models/blog");
const Comment = require("../models/comments");
const User = require('../models/user');
const checkAuthenticationCookie = require("../middleware/authetication");

const upload = multer({ storage });

router.get("/add", checkAuthenticationCookie("token"), (req, res) => {
  res.render("addblog.ejs", {
    user: req.user,
  });
});

router.post("/add", upload.single("blogImage"), checkAuthenticationCookie("token"), async (req, res) => {
  const { title, content } = req.body;
  const newBlog = new Blog({
    title,
    content,
    createdBy: req.user._id,
    blogImage: req.file.path, // Cloudinary file path
  });

  await newBlog.save();
  res.redirect("/");
});

router.get("/:id", checkAuthenticationCookie("token"), async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate("createdBy");

  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");

  res.render("view.ejs", {
    blog,
    user: req.user,
    comments,
  });
});

router.get("/:id/edit", checkAuthenticationCookie("token"), async (req, res) => {
  let { id } = req.params;
  let blogdata = await Blog.findById(id);
  console.log(blogdata);
  res.render("edit.ejs", { blogdata });
});

router.patch("/:id/update", upload.single("blogImage"), checkAuthenticationCookie("token"), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const updateData = { title, content };
 
  // multer m files ke liye req.body ki jagh req.file aata hai
  if (req.file) {
    updateData.blogImage = req.file.path; // Cloudinary file path
  }

  await Blog.findByIdAndUpdate(id, updateData);
  res.redirect(`/${id}`);
});

router.delete("/:id/delete", checkAuthenticationCookie("token"), async (req, res) => {
  const { id } = req.params;
  console.log(req.user);
  await Blog.findByIdAndDelete(id);
  res.redirect("/");
});

router.post("/comment/:blogId", async (req, res) => {
  const { content } = req.body;
  const { blogId } = req.params;
  const createdBy = req.user._id;

  const newcomment = new Comment({
    content,
    blogId,
    createdBy,
  });
  await newcomment.save();
  res.redirect(`/${req.params.blogId}`);
});

module.exports = router;
