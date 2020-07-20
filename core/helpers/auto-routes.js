"use strict"

const path = require("path")
const fs = require("fs")
const router = require("express").Router()

let autoRoutes = function (app, routesDir, routesPassed = "/", skips = []) {
  if (!fs.existsSync(routesDir)) {
    // console.error(routesDir + ' not exists')
    return
  }

  if (!fs.statSync(routesDir).isDirectory()) {
    // console.error(routesDir + ' is not a Directory')
    return
  }

  let items = fs.readdirSync(routesDir)
  items.forEach(function (data) {
    let itemPath = path.join(routesDir, data)
    if (fs.statSync(itemPath).isDirectory()) {
      if (/^.*\/$/.test(routesPassed)) {
        autoRoutes(app, itemPath, routesPassed + data)
      } else {
        autoRoutes(app, itemPath, routesPassed + "/" + data)
      }
    } else {
      let fileRouteName = data.substr(0, data.length - 3)
      if (!skips.includes(fileRouteName)) {
        if (/^.*\/$/.test(routesPassed)) {
          useRouteFile(app, itemPath, routesPassed + fileRouteName)
        } else {
          useRouteFile(app, itemPath, routesPassed + "/" + fileRouteName)
        }
      }
    }
  })
}

function useRouteFile(app, file, url) {
  if (!/^.*index$/.test(url)) {
    const route = require(file)
    app.use(router.use(url, route))
  }
}

module.exports = autoRoutes
