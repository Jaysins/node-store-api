require("dotenv").config()
require("express-async-errors")

const express = require("express")
const connectDB = require("./db/connect")
const productsRouter = require("./routes/products")
const app = express()

const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

app.use(express.json())

app.get("/", (req, res) => {
    res.send("<a href='/api/v1/products'> products route </a>")
})

app.use(`/api/${process.env.API_VERSION}/products`, productsRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const start = async (port, callback) => {
    try {
        await connectDB(process.env.MONGO_DB_URI)
        // noinspection JSCheckFunctionSignatures,JSVoidFunctionReturnValueUsed
        app.listen(port, console.log(`server listening on port ${port}`))

    } catch (error) {
        console.log(error)
    }
}

start(port = process.env.Port || 3000).then(r  => {console.log(r)})