const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer"); // Add this line
app.use(express.json({ limit: '50mb' })); // Increase the limit for express.json()
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.use(express.urlencoded({ extended: false }));

const mongoUrl ="mongodb+srv://newtest:newtest@cluster0.verwgdi.mongodb.net/"

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./imageDetails");

const User = mongoose.model("UserInfo");
const Images = mongoose.model("ImageDetails");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set the limit to 50MB (adjust as needed)
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      email,
      password: encryptedPassword,
    });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    console.log("email Found");

    // Check if user.password exists before comparing
    if (user.password) {
      const passCompare = await bcrypt.compare(password, user.password);

      if (passCompare) {
        return res.json({ password: "User Logined Successfully" });
        // console.log("password Found");node index.js

      } else {
        console.log("password not found");

      }
    } else {
      console.log("User has no password");
    }
  } else {
    console.log("email not found");

  }
});

app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 ,  name:req.body.name , select:req.body.select ,password:req.body.password, fileid:req.body.fileid , date:req.body.date , code:req.body.qrCodeImage  , location:req.body.location , QrGet:req.body.QrGet, Qrcode:req.body.uniqueId});
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then(data => {
      res.send({ status: "ok", data: data })
    })

  } catch (error) {

  }
})




app.listen(5000, () => {
  console.log("Server Started");
});

