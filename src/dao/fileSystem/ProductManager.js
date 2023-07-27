import fs from 'fs'

export default class ProductManager{
    #format
    constructor(path){
        this.path = path
        this.#format = 'utf-8'
    }
    
    #generateId = (product) => {
        return (product.length === 0) ? 1 : product[product.length-1].id + 1
    }

    exist = async(id) => {
        let products = await this.readProducts()
        return products.find(prod => prod.id == id)
    }
    
    readProducts = async() => {
        let lecture = await fs.promises.readFile(this.path, this.#format)
        return JSON.parse(lecture)
    }

    getProducts = async() => {
        return await this.readProducts()
    }

    writeProducts = async(product) => {
        await fs.promises.writeFile(this.path, JSON.stringify(product, null, '\t'))
    }

    addProducts = async(product) => {
        let productsOld = await this.readProducts()
        product.id = this.#generateId(productsOld)
        let allProducts = [...productsOld, product]
        return await this.writeProducts(allProducts)
    }

    getProductById = async(id) => {
        let productById = await this.exist(id)
        if(productById) return productById
    }

    updateProducts = async(id, product) => {
        let productById = await this.exist(id)
        if(!productById) return false
        await this.deleteProducts(id)
        let productsOld = await this.readProducts()
        let productsUpdated = [{...product, id: Number(id)}, ...productsOld]
        await this.writeProducts(productsUpdated)
        return true
    }

    deleteProducts = async(id) => {
        let products = await this.readProducts()
        let productWithIdNoIncluded = products.filter(prod => prod.id != id)
        await this.writeProducts(productWithIdNoIncluded)
        return `Producto con id: ${id} eliminado`
    }
}