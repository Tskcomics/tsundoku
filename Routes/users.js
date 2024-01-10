import express from "express"
import usersModel from "../Models/users.js"
import bcrypt from "bcrypt"
import cacheMiddleware from "../Middlewares/cacheMiddleware.js"
import validateUser from "../Middlewares/validateUser.js"

const users = express.Router()

users.get("/users", cacheMiddleware, async (req, res) => {
    const { page = 1, pageSize = 5 } = req.query

    try {
        const users = await usersModel.find()
            .populate("username", "_id")
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .sort({ createdAt: -1 })

        const totalUsers = await usersModel.countDocuments()

        res.status(200).send({
            message: "Utenti caricati correttamente.",
            statusCode: 200,
            count: totalUsers,
            currentPage: + page,
            totalPages: Math.ceil(totalUsers / pageSize),
            users
        })

    } catch (error) {
        if (error) {
            return res.status(500).send({
                message: "Errore interno del server",
                statusCode: 500
            })
        }
    }
})

users.get("/users/:id", cacheMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const user = await usersModel.findById(id)

        res.status(200).send({
            message: "Utente trovato.",
            statusCode: 200,
            user
        })

        if (!user) {
            return res.status(404).send({
                message: "Utente non trovato.",
                statusCode: 404
            })
        }

    } catch (error) {
        if (error) {
            return res.status(500).send({
                message: "Errore interno del server",
                statusCode: 500,
                error
            })
        }
    }
})

users.post("/users/new", validateUser, async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new usersModel({
        username: req.body.username,
        password: hashedPassword
    })

    try {
        const userExists = await usersModel.findOne({ username: req.body.username })

        if (userExists) {
            return res.status(409).send({
                message: "Utente già esistente.",
                statusCode: 409
            })
        }

        const newUser = await user.save()

        res.status(201).send({
            message: "Nuovo utente creato correttamente.",
            statusCode: 201,
            payload: newUser
        })

    } catch (error) {
        if (error) {
            return res.status(500).send({
                message: "Errore interno del server.",
                statusCode: 500
            })
        }
    }
})

users.patch("/users/:id", async (req, res) => {

    const { id } = req.params
    const userExists = await usersModel.findById(id)

    if (!userExists) {
        return res.status(404).send({
            message: "Utente non trovato",
            statusCode: 404
        })
    }

    try {
        const userID = id
        const userUpdated = req.body
        const options = { new: true }
        const result = await usersModel.findByIdAndUpdate(userID, userUpdated, options)

        res.status(200).send({
            message: "Utente modificato correttamente.",
            statusCode: 200
        })

    } catch (error) {
        if (error) {
            return res.status(500).send({
                message: "Errore interno del server.",
                statusCode: 500
            })
        }
    }
})

users.delete("/users/:id", async (req, res) => {
    const { id } = req.params
    try {
        const userExists = await usersModel.findByIdAndDelete(id)

        if (!userExists) {
            return res.status(404).send({
                message: "Utente non trovato.",
                statusCode: 404
            })
        }

        res.status(200).send({
            message: "Utente eliminato",
            statusCode: 200
        })

    } catch (error) {
        if (error) {
            return res.status(500).send({
                message: "Errore interno del server.",
                statusCode: 500
            })
        }
    }
})

export default users