"use strict"

const BaseService = require("./base.service")
const db = require("../config/db").mysql
const isEmpty = require("is-empty")

class UserService extends BaseService {
  constructor() {
    super()
    this.tableName = "user"
    this.primaryKey = "id"
  }

  /**
   *
   * @param {Object} params
   */
  findByUsernameOrEmail(params) {
    return this.db
      .select("user.*", "profile.*")
      .from(this.tableName)
      .innerJoin("profile", "profile.user_id", "user.id")
      .where("username", params.username)
      .orWhere("email", params.username)
      .first()
  }

  /**
   * ข้อมูลผู้ใช้งาน
   */
  static findAllUsers(query = {}) {
    return db
      .select("user.*", "profile.*")
      .from("user")
      .innerJoin("profile", "profile.user_id", "user.id")
      .limit(Number(query.limit))
      .offset((Number(query.page) - 1) * Number(query.limit))
  }

  static count() {
    return db("user").count("id as total")
  }
}

module.exports = UserService
