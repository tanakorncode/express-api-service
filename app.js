"use strict"

const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const helmet = require("helmet")
const express = require("express")
const path = require("path")
const app = express()
const customReaponse = require("./middlewares/custom-response")
const autoRoutes = require("./core/helpers/auto-routes")
const rfs = require("rotating-file-stream")

/**
 * CORS
 */
app.use(cors())

/**
 * parse application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * parse application/json
 */
app.use(bodyParser.json())

app.use(helmet())

// create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
})

/**
 * App logger
 */
app.use(morgan("combined", { stream: accessLogStream }))

/**
 * CORS Middleware
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET") //to give access to all the methods provided
    return res.status(200).json({})
  }
  next()
})

/**
 * custom response
 */
app.use(customReaponse())

/**
 * API keys and Passport configuration.
 */
require("./core/config/passport")

/**
 * App Routes
 */
app.get("/", (req, res) => res.success({ message: "It works!" }))
autoRoutes(app, path.join(__dirname, "routes")) // auto load routes

/**
 * error handler
 */
app.use((req, res, next) => {
  const error = new Error("Not found")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  let statusCode = error.status || 500
  res.status(statusCode)
  res.json({
    statusCode: statusCode,
    name: String(error.name).replace("Error", ""),
    message: error.message,
  })
})

module.exports = app
