const product = require("../models/product")
const getAllProductsStatic = async (req, res) => {
    {
        const products = await product.find({})
        res.status(200).json({products, nbHits: products.length})
    }
}

const getAllProducts = async (req, res) => {
    {
        const {
            featured, name, company, fields, numericFilters, sort = "createdAt",
            limit = 7, page = 1
        } = req.query

        const queryObject = {}
        if (featured) {
            queryObject.featured = featured === 'true'
        }
        if (company) {
            queryObject.company = company
        }
        if (name) {
            queryObject.name = {$regex: name, $options: "i"}
        }
        if (numericFilters) {
            const operatorMap = {
                ">": "$gt", ">=": "$gte", "=": "$eq", "<": "$lt", "<=": "$lte"
            }
            const regex = /\b(<|>|>=|=|<=)\b/g
            let filters = numericFilters.replace(regex, (match) => `-${operatorMap[match]}-`)
            const options = ["price", "rating"]
            // noinspection JSVoidFunctionReturnValueUsed
            filters = filters.split(",").forEach((item) => {
                const [field, operator, value] = item.split("-")
                if (options.includes(field)) {
                    queryObject[field] = {[operator]: Number(value)}
                }
            })
        }

        let result = product.find(queryObject)

        const sortList = sort.split(",").join(" ")

        result = result.sort(sortList)

        if (fields) {
            const fieldList = fields.split(",").join(" ")
            result = result.select(fieldList)
        }
        const skip = (Number(page) - 1) * Number(limit)

        result = result.skip(skip).limit(limit)

        const products = await result

        res.status(200).json({products, nbHits: products.length, currentPage: page, "limit": limit})
    }
}

module.exports = {getAllProducts, getAllProductsStatic}