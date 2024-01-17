import mongoose from "mongoose";

const SubscriptionsSchema = new mongoose.Schema({
  serie: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: false
  }
}, {
  timestamps: false,
  strict: false
})

const subscriptionsModel = mongoose.model("subscriptionsModel", SubscriptionsSchema, "subscriptions")
export default subscriptionsModel