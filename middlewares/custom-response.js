"use strict"

/**
 * custom response
 * Example.
 * app.get("/", (req, res) => res.success({ message: "It works!" }))
 * app.get("/", (req, res) => res.error({ error: "data not found." }))
 * app.get("/401", (req, res) => req.throw(401))
 * app.get("/400", (req, res) => req.throw(400, 'name required'))
 * app.get("/400", (req, res) => req.throw(400, 'name required', { user: user }))
 * app.get("/401", (req, res) => req.assert(req.user, 401, 'User not found. Please login!'))
 */

const createError = require("http-errors")
const httpAssert = require("http-assert")
const devMode = process.env.NODE_ENV === "development"
// error
const throwError = (...args) => {
  throw createError(...args)
}

module.exports = () => {
  return function (req, res, next) {
    req.assert = httpAssert
    req.throw = throwError

    res.success = (data = "", statusCode = 200) => {
      res.status(statusCode || 200).send({
        statusCode: statusCode,
        success: true,
        message: "ok",
        data: data,
      })
    }

    res.error = (err) => {
      if (devMode) {
        console.log(err.stack)
      }
      let statusCode = err.status || 500
      res.status(statusCode)
      res.send({
        statusCode: statusCode,
        success: false,
        name: String(err.name).replace("Error", ""),
        message: err.message,
      })
    }

    next()
  }
}
