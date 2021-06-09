const express = require("express")
const router = express.Router()

// route prefix /api
router.get("/", async (req, res, next) => {
  res.send("o/")
})

module.exports = router