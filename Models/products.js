import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    titolo: {
        type: String,
        required: true
    },
    editore: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    sottocategoria: {
        type: String,
        required: false
    },
    quantità: {
        type: Number,
        required: true
    },
    prezzo_acquisto: {
        type: Number,
        required: true
    },
    prezzo_vendita: {
        type: Number,
        required: true
    },
    isbn: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    strict: true
})

const ProductsModel = mongoose.model("ProductsModel", productsSchema, "products")
export default ProductsModel