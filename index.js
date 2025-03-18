const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userModel = require("./usermodel");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const port = 3010;

app.use(express.static("static"));
app.use(express.json());


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://kolathurlayasrees70:laya1234@cluster0.5z4jk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected.");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.post("/create", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      success: true,
      message: "User successfully created.",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create user.",
    });
  }
});

app.listen(port, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${port}`);
});