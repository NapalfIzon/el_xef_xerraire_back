import express from "express";
import {
  addUser,
  getUserById,
  userLogin,
  modifyUser,
} from "../controller/usersController";

const router = express.Router();

router.post("/:id", getUserById);

router.post("/new", addUser);

router.post("/login", userLogin);

router.patch("/:id", modifyUser);

export default router;
