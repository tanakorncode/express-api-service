"use strict"

/**
 * @method GET /v1/public/hello
 * @param {*} req
 * @param {*} res
 * @return {Object}
 */
exports.hello = async (req, res) => {
  try {
    const message = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Hello!")
      }, 250)
    })
    res.success({ message: message })
  } catch (error) {
    res.error(error)
  }
}
