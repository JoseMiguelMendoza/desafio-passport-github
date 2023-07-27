import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    code: {type: Number, unique: true, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    status: { type: Boolean, default: true },
    thumbnail: { type: [String], default: [] }
})

productSchema.plugin(mongoosePaginate)
mongoose.set('strictQuery', false)
const productModel = mongoose.model('products', productSchema)

export default productModel