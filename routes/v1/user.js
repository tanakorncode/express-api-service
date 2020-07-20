const router = require("express").Router()
const controllers = require("../../controllers/user")
const authenticateJwt = require("../../middlewares/authenticate-jwt")

// authentication
router.use("*", authenticateJwt)

router.route("/").get(controllers.getUsers)

module.exports = router
