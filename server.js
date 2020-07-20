/**
 * environment variables
 */
const isDevmode = process.env.NODE_ENV === "development"
require("dotenv").config({ path: isDevmode ? ".env" : ".env.production" })

/**
 * Create Express server.
 */
const http = require("http")
const app = require("./app")

const port = process.env.PORT || 3000
const hostname = process.env.HOST || "localhost"

const server = http.createServer(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
