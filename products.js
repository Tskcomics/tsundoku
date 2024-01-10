import express from "express"
import { validationResult } from "express-validator"
import ProductsModel from "../Models/products.js"
import cacheMiddleware from "../Middlewares/cacheMiddleware.js"

const products = express.Router()

products.get("/products", cacheMiddleware, async (req, res) => {
    const { page = 1, pageSize = 100 } = req.query
    try {
        const products = await ProductsModel.find()
            .populate("titolo", "editore categoria sottocategoria quantità prezzo_acquisto prezzo_vendita ISBN id")
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .sort({ titolo: + 1 })

        const totalProducts = await ProductsModel.countDocuments()

        if (!products) {
            return res.status(404).send({
                message: "Posts not found",
                statusCode: 404
            })
        }
        res.status(200).send({
            message: "Posts found",
            statusCode: 200,
            totalProducts,
            products
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500,
            error
        })
    }
})

products.get("/products/:id", cacheMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const product = await ProductsModel.findById(id)
            .populate("titolo", "editore", "categoria", "sottocategoria", "quantità", "prezzo_acquisto", "prezzo_vendita", "ISBN", "_id")

        res.status(200).send({
            message: `Prodotto con id ${id} trovato.`,
            statusCode: 200
        })

        if (!product) {
            return res.status(404).send({
                message: `Prodotto con id ${id} non trovato.`,
                statusCode: 404
            })
        }
    } catch (error) {
        if (error) {
            return res.status(500).send({
                message: "Errore interno del server.",
                statusCode: 500
            })
        }
    }
})

products.post("/products", cacheMiddleware, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array(),
            statusCode: 400
        })
    }

    const product = new ProductsModel({
        titolo: req.body.titolo,
        editore: req.body.editore,
        categoria: req.body.categoria,
        sottocategoria: req.body.sottocategoria,
        quantità: req.body.quantità,
        prezzo_acquisto: req.body.prezzo_acquisto,
        prezzo_vendita: req.body.prezzo_vendita,
        isbn: req.body.isbn
    })

    try {
        const productExists = await ProductsModel.findOne({ titolo: req.body.titolo })
        if (productExists) {
            return res.status(409).send({
                message: "Prodotto già esistente.",
                statusCode: 409
            })
        }

        const newProduct = await product.save()
        res.status(201).send({
            message: "Prodotto aggiunto correttamente.",
            statusCode: 201
        })

    } catch (error) {
        if (error) {
            res.status(500).send({
                message: "Errore interno del server.",
                statusCode: 500
            })
        }
    }
})

products.patch("/products/:id", cacheMiddleware, async (req, res) => {
    const { id } = req.params
    const productExists = await ProductsModel.findById(id)

    if (!productExists) {
        return res.status(404).send({
            message: "Prodotto non trovato.",
            statusCode: 404
        })
    }

    try {
        const productID = id
        const productUpdated = req.body
        const options = { new: true }
        const result = await ProductsModel.findByIdAndUpdate(productID, productUpdated, options)

        res.status(200).send({
            message: "Prodotto modificato correttamente.",
            statusCode: 200
        })

    } catch (error) {
        if (error) {
            res.status(500).send({
                message: "Errore interno del server.",
                statusCode: 500
            })
        }
    }
})

products.delete("/products/:id", cacheMiddleware, async (req, res) => {
    const { id } = req.params
    const productExists = await ProductsModel.findById(id)

    if (!productExists) {
        return res.status(400).send({
            message: "Prodotto non trovato.",
            statusCode: 404
        })
    }

    const productID = id
    const productDeleted = req.body
    const result = await ProductsModel.findByIdAndDelete(productID, productDeleted)

    res.status(200).send({
        message: "Prodotto eliminato correttamente.",
        statusCode: 200
    })
})

export default products