require("dotenv").config()

const connectDB = require("./db/connect")

const product = require("./models/product")

const jsonProduct = require("./products.json")

const start = async () => {
    try {
        await connectDB(process.env.MONGO_DB_URI)
        await product.deleteMany()
        console.log("done deleting")
        await product.create(jsonProduct)
        console.log("creating...")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
