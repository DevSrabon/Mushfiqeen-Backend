const express = require("express");

const verifyToken = require("../middleware/verifyToken");
const {
  createBayan,
  getBayan,
  deleteBayan,
  updateBayan,
  getBayanById,
} = require("../controllers/bayan.controller");
const router = express.Router();
router.get("/get/:lang", getBayan);
router.get("/getById/:id", getBayanById);
router.use(verifyToken);
router.post("/create", createBayan);
router.delete("/delete/:id", deleteBayan);
router.put("/update/:id", updateBayan);
module.exports = router;
