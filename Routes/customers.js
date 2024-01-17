import express from "express";
import { validationResult } from "express-validator";
import customersModel from "../Models/customers.js"
import subscriptionsModel from "../Models/subscriptions.js";
import cacheMiddleware from "../Middlewares/cacheMiddleware.js";

const customers = express.Router()

customers.get("/customers", cacheMiddleware, async (req, res) => {
  const { page = 1, pageSize = 1000000000 } = req.query
  try {
    const customers = await customersModel.find()
      .populate("nome", "cognome, tel, email,")
      .limit(pageSize)
      .sort({ nome: + 1 })
      .skip((page - 1) * pageSize)
    const totalCustomers = await customersModel.countDocuments()

    if (!customers) {
      return res.status(404).send({
        message: "Clienti non trovati.",
        statusCode: 404
      })
    }

    res.status(200).send({
      message: "Clienti trovati.",
      statusCode: 200,
      totalCustomers,
      customers
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

customers.get("/customers/:id", cacheMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const customer = await customersModel.findById(id)
      .populate("nome", "cognome", "tel", "email", "nr_casella", "nr_tessera", "pti_tessera", "abbonamenti", "_id")

    res.status(200).send({
      message: `Cliente con id ${id} trovato.`
    })

    if (!customer) {
      return res.status(404).send({
        message: `Cliente con id ${id} non trovato.`,
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

customers.post("/customers", cacheMiddleware, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array(),
      statusCode: 404
    })
  }

  const customer = new customersModel({
    nome: req.body.nome,
    cognome: req.body.cognome,
    tel: req.body.tel,
    email: req.body.email,
    nr_casella: req.body.nr_casella,
    nr_tessera: req.body.nr_tessera,
    pti_tessera: req.body.pti_tessera
  })

  try {
    const customerExists = await customersModel.findOne({ nr_casella: req.body.nr_casella })
    if (customerExists) {
      return res.status(409).send({
        message: "Casella già assegnata ad un altro cliente.",
        statusCode: 409
      })
    }

    const newCustomer = await customer.save()
    res.status(201).send({
      message: "Nuovo cliente salvato correttamente.",
      statusCode: 201
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

customers.post("/customers/:id", async (req, res) => {
  const errors = validationResult(req)
  const { id } = req.params
  const customer = await customersModel.findById(id)

  if (!errors.isEmpty()) {
    res.status(400).send({
      message: "Bad request",
      errors: errors.array(),
      statusCode: 400
    })
  }

  const subscription = new subscriptionsModel({
    serie: req.body.serie,
    note: req.body.note
  })

  try {
    customer.abbonamenti.push(subscription)
    const newSubscription = await subscription.save()
    await customersModel.updateOne({ _id: customer._id }, { $push: { abbonamenti: newSubscription } })
    res.status(201).send({
      message: "Nuovo abbonamento aggiunto.",
      statusCode: 201,
      newSubscription
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

customers.patch("/customers/:id", cacheMiddleware, async (req, res) => {
  const { id } = req.params
  const customerExists = await customersModel.findById(id)

  if (!customerExists) {
    return res.status(404).send({
      message: `Nessun cliente con id ${id} trovato.`,
      statusCode: 404
    })
  }

  try {
    const customerID = id
    const customerUpdated = req.body
    const options = { new: true }
    const result = await customersModel.findByIdAndUpdate(customerID, customerUpdated, options)

    res.status(200).send({
      message: "Informazioni del cliente modificate correttamente.",
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

customers.delete("/customers/:id", cacheMiddleware, async (req, res) => {
  const { id } = req.params
  const customerExists = await customersModel.findById(id)

  if (!customerExists) {
    return res.status(404).send({
      message: `Cliente con id ${id} non trovato.`,
      statusCode: 404
    })
  }

  try {
    const customerID = id
    const customerDeleted = req.body
    const result = await customersModel.findByIdAndDelete(customerID, customerDeleted)

    res.status(200).send({
      message: "Cliente eliminato correttamente",
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

export default customers