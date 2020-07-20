"use strict"

const UserService = require("../core/services/user.service")
const _ = require("lodash")

/**
 * @method GET /v1/user
 * @param {*} req
 * @param {*} res
 * @return {Array}
 */
exports.getUsers = async (req, res) => {
  try {
    const page = _.get(req.query, "page", 1)
    const perPage = _.get(req.query, "per_page", 20)

    const count = await UserService.count()
    const users = await UserService.findAllUsers({ page: page, limit: perPage })
    res.success({
      users: users,
      _meta: {
        totalCount: count[0].total,
        pageCount: Math.ceil(count[0].total / perPage),
        currentPage: Number(page),
        perPage: Number(perPage),
      },
    })
  } catch (error) {
    res.error(error)
  }
}
