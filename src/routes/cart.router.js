import { Router } from 'express'
import CartManager from '../dao/mongo/cartManager.js'
import cartModel from '../dao/models/cart.model.js'

const CartRouter = Router()
const cartManager = new CartManager()


CartRouter.get('/', async(req, res) => {
    let result = await cartManager.getCarts()
    res.status(201).json({ status: 'success', payload: result })
})

CartRouter.get('/:cid', async(req, res) => {
    let result = await cartManager.getProductsFromCart(req, res)
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found'})
    return res.status(200).json({ status: 'success', payload: result })
})


CartRouter.post('/', async(req, res) => {
    let addingCart = await cartManager.addCarts()
    return res.status(201).json({ status: 'success', payload: addingCart })
})

CartRouter.post('/:cid/product/:pid', async(req, res) => {
    try{
        let cartId = req.params.cid
        let productId = req.params.pid
        let result = await cartManager.addProductInCart(cartId, productId)
        if( typeof result === 'string'){
            return res.status(400).json({ status: 'error', error: result })
        }
        return res.status(201).json({ status: 'success', payload: result })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
})

CartRouter.put('/:cid', async(req, res) => {
    try {
        const cid = req.params.cid;
        const products = req.body.products;
        const updatedCart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', message: 'Carrito actualizado con éxito', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
})

CartRouter.put('/:cid/products/:pid', async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' })
        }

        const product = cart.products.find(product => product.product == pid);
        if (!product) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' })
        }
        product.quantity = quantity;
        await cart.save()
        res.status(200).json({ status: 'success', message: 'Cantidad de ejemplares actualizada' })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

CartRouter.delete('/:cid', async(req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' })
        }
        cart.products = []
        await cart.save()
    
        res.status(200).json({ status: 'success', message: 'Todos los productos del carrito han sido eliminados' })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

CartRouter.delete('/:cid/products/:pid', async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        let result = await cartManager.deleteProductFromCart(cid, pid)
        if(typeof result == 'string') return res.status(400).json({ status: 'error', error: result })

        let productsPopulated = await cartModel.findById(cid).populate('products.product').lean()
        req.io.emit('productoEliminado', productsPopulated)

        return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
})


export default CartRouter