import mongoose from "mongoose";

const customersSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cognome: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  nr_casella: {
    type: String,
    required: true
  },
  nr_tessera: {
    type: String,
    required: false
  },
  pti_tessera: {
    type: String,
    required: false
  },
  abbonamenti: []
}, {
  timestamps: true,
  strict: true
})

const customersModel = mongoose.model("CustomersModel", customersSchema, "customers")
export default customersModel