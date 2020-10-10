export {}
const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.send({ success: true }).status(200)
})

module.exports = router
