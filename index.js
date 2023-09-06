import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { userController, postController } from "./controllers/index.js";
import validationErrors from "./utils/validationErrors.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwwww@cluster0.ciokvrh.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log(`DB ERR ${err}`);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  validationErrors,
  userController.login
);
app.post(
  "/auth/register",
  registerValidation,
  validationErrors,
  userController.register
);
app.get("/auth/me", checkAuth, userController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", postController.getAll);
app.get("/posts/:id", postController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  validationErrors,
  postController.create
);
app.delete("/posts/:id", checkAuth, postController.remove);
app.patch("/posts/:id", checkAuth, validationErrors, postController.update);

app.listen(5555, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("SERVER OK");
});
