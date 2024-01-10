import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import usersModel from "../Models/users.js"

const login = express.Router()

login.post("/login", async (req, res) => {
    const user = await usersModel.findOne({ username: req.body.username })

    if (!user) {
        return res.status(404).send({
            message: "Utente non trovato.",
            statusCode: 404
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send({
            message: "Username o password errati.",
            statusCode: 400
        })
    }

    const token = jwt.sign({
        username: user.username,
        password: user.password,
        id: user._id
    }, process.env.SECRET_JWT_KEY, {
        expiresIn: "24h"
    })

    return res.header("tskAuth", token).status(200).send({ token })
})

export default login