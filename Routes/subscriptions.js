import express from "express"
import subscriptionsModel from "../Models/subscriptions.js"

const subscriptions = express.Router()

subscriptions.delete("/subscriptions", async(req, res) => {
  try {
    const deleteAll = await subscriptionsModel.deleteMany()

    res.status(200).send({
      statusCode: 200
    })

  } catch (error) {
    if(error) {
      return res.status(500).send({
        message: "Errore interno del server.",
        statusCode: 500
      })
    }
  }
})

export default subscriptions

