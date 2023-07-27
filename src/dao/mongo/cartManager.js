import productModel from "../models/product.model.js"
import cartModel from '../models/cart.model.js'

export default class CartManager{
    constructor(){
    }

    getCarts = async() => {
        return await cartModel.find().lean().exec()
    }

    addCarts = async(cart) => {
        return await cartModel.create(cart)
    }


    getCartsById = async(id) => {
        return await cartModel.findById(id).lean().exec()
    }

    addProductInCart = async(cartId, productId) => {
        let cartByIdInDB = await cartModel.findById(cartId)
        if(!cartByIdInDB) return 'Cart Not Found'
        let productByIdInDB = await productModel.findById(productId)
        if(!productByIdInDB) return 'Product Not Found'

        const productIndex = cartByIdInDB.products.findIndex(
            (item) => item.product.toString() === productId
        );
        if (productIndex !== -1) {
            // El producto ya está en el carrito, incrementar la cantidad
            cartByIdInDB.products[productIndex].quantity += 1;
        } else {
            // El producto no está en el carrito, agregarlo
            cartByIdInDB.products.push({
            product: productId,
            quantity: 1,
            });
        }
        await cartByIdInDB.save()
        return cartByIdInDB
    }

    getProductsFromCart = async(req, res) => {
        try{
            const id = req.params.cid
            const result = await cartModel.findById(id).populate('products.product').lean().exec()
            if(result === null){
                return null
            }
            return result
        }catch(err){
            res.status(500).json({ status: 'error', error: err.message })
        }
    }

    deleteProductFromCart = async(cid, pid) => {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return 'Carrito no encontrado'
        }
        const productIndex = cart.products.findIndex(product => product.product == pid);
        if (productIndex === -1) {
            return 'Producto no encontrado en el carrito.'
        }
        cart.products.splice(productIndex, 1)
        await cart.save()
        return cart
    }
}