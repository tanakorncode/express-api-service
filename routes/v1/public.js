const router = require("express").Router()
const controllers = require("../../controllers/public")

router.route("/hello").get(controllers.hello)

module.exports = router
