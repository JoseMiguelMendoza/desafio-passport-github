import { Router } from 'express'
import ProductManager from '../dao/mongo/productManager.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async(req, res) => {
    let result = await productManager.getProductsWithFilters(req)
    res.status(result.statusCode).json(result.response)
})

router.get('/:id', async(req, res) => {
    try{
        let id = req.params.id
        let productById = await productManager.getProductById(id)
        if(productById === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        return res.status(201).json({ status: 'success', payload: productById })
    } catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
})


router.post('/', async(req, res) => {
    try{
        let newProduct = req.body
        let productGenerated = await productManager.addProducts(newProduct)
        const products = await productManager.getProducts()
        req.io.emit('updatedProducts', products)
        res.status(201).json({ status: 'success', payload: productGenerated })
    } catch(err){
        res.status(500).json({ status: 'error', error: err.message})
    }
})


router.put('/:id', async(req, res) => {
    try{
        let id = req.params.id
        let productToUpdate = req.body
        let productUpdated = await productManager.updateProducts(id, productToUpdate)
        if (productUpdated === null){
            return res.status(404).json({ status: 'error', error: 'Not Found' })
        }
        const products = await productManager.getProducts()
        req.io.emit('updatedProducts', products)
        return res.status(201).json({ status: 'success', payload: productUpdated })
    } catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
})


router.delete('/:id', async(req, res) => {
    try{
        let id = req.params.id
        let deletingProduct = await productManager.deleteProducts(id)
        if(deletingProduct === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        const products = await productManager.getProducts()
        req.io.emit('updatedProducts', products)
        return res.status(201).json({ status: 'success', payload: deletingProduct })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router