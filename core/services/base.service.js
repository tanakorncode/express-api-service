"use strict"

const db = require("../config/db").mysql
const utils = require("../../utils")
const _ = require("lodash")
const isEmpty = require("is-empty")

class Base {
  constructor() {
    this._tableName = ""
    this._primaryKey = ""
    this.db = db
  }

  get primaryKey() {
    return this._primaryKey
  }

  set primaryKey(pk) {
    this._primaryKey = pk
  }

  get tableName() {
    return this._tableName
  }

  set tableName(name) {
    this._tableName = name
  }

  /**
   * บันทึกรายการ
   * @param {Object|Array} data
   * @return {Promise<any>}
   */
  async create(data) {
    try {
      const inserted = await this.db(this.tableName).insert(data)
      return inserted
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * อัพเดทรายการ
   * @param {Object|Array} data
   * @param {Object} condition
   * @return {Promise<*|void>}
   */
  async update(data, condition = {}) {
    try {
      const defaultCondition = {}
      defaultCondition[this.primaryKey] = _.get(data, this.primaryKey, null)
      const conditions = utils.updateObject(defaultCondition, condition)
      if (isEmpty(conditions[this.primaryKey])) {
        // is false
        return Promise.reject(utils.errorHandler(`'${this.primaryKey} not found.'`, 400))
      }
      const updated = await this.db(this.tableName).where(conditions).update(data)
      return updated[0]
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * ลบรายการ
   * @param {Object} condition
   * @return {Promise<never>}
   */
  delete(condition = {}) {
    return db(this.tableName).where(condition).del()
  }

  /**
   * ลบรายการ
   * @param {String|Number} id
   * @return {Promise<never>}
   */
  deleteById(id) {
    const condition = {}
    condition[this.primaryKey] = id
    return this.db(this.tableName).where(condition).del()
  }

  /**
   *
   * @param {String|Number} id
   * @return {Promise<Object>}
   */
  findOneById(id) {
    return this.db.select("*").from(this.tableName).where(this.primaryKey, id).first()
  }

  /**
   *
   * @param {Object} condition
   * @return {Promise}
   */
  findOne(condition = {}) {
    return db.select("*").from(this.tableName).where(condition).first()
  }

  /**
   * @param {Object} condition
   * @return {Knex.QueryBuilder<unknown, DeferredKeySelection.ReplaceBase<TResult, unknown>>}
   */
  findAll(condition = {}) {
    if (condition) {
      return db.select("*").from(this.tableName).where(condition)
    }
    return db.select("*").from(this.tableName)
  }
}

module.exports = Base
