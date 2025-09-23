import express from "express";

import { loginUser, registerUser } from "../controller/user.js";

const userRoute = express.Router();

user.post("/register", registerUser);

user.post("/login", loginUser);

export default userRoute;
