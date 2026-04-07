const express = require("express");
const { fetchRecommendations } = require("../controllers/productController");

const router = express.Router();

router.get("/recommendations", fetchRecommendations);

module.exports = router;

