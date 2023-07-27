let socket = io()
let containerProducts = document.getElementById('realTimeProductsBox')
let buttonForm = document.getElementById('createProduct')

buttonForm.addEventListener('click', (e) => {
    e.preventDefault()
    const body = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: Number(document.getElementById('price').value),
        code: Number(document.getElementById('code').value),
        stock: Number(document.getElementById('stock').value),
        category: document.getElementById('category').value
    }
    fetch('/api/products',{
        method: 'post',
        body: JSON.stringify(body),
        headers:{
            'Content-Type': 'application/json'
        },
    })
        .then(result => result.json())
        .then(result => {
            if(result.status === 'error') throw new Error(result.error)
            else {
                socket.emit('productList', result.payload)
            }
            Swal.fire(
                '¡Creado!',
                'Producto creado exitosamente.',
                'success'
            )
            document.getElementById('title').value = ''
            document.getElementById('description').value = ''
            document.getElementById('price').value = ''
            document.getElementById('code').value = ''
            document.getElementById('stock').value = ''
            document.getElementById('category').value = ''
        })
        .catch(err => alert(`Ocurrio un error : (\n${err}`))
})

deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'delete'
    })
    .then(result => result.json())
    .then(result => {
        if(result.status === 'error') throw new Error(result.error)
        Swal.fire(
            '¡Eliminado!',
            'Producto eliminado con exito.',
            'success'
        )
    })
    .catch(err => alert(`Ocurrio un error: (\n${err})`))
}

socket.on('updatedProducts', data => {
    containerProducts.innerHTML = '';
    let dataArray = Array.from(data)
    dataArray.forEach(product => {
        let productHtml = `
        <div class="containerProductWithId" id="${product._id}">
        <button class="deleteButtonProduct" onclick="deleteProduct('${product._id}')">Eliminar</button>
        <div class="containerProductInfo">
        <h1>${product.title}</h1>
        <p class="estiloTexto"><b>Descripción:</b> ${product.description}</p>
        <p class="estiloTexto"><b>Código:</b> ${product.code}</p>
        <p class="estiloTexto"><b>Stock:</b> ${product.stock}</p>
        <p class="estiloTexto"><b>Precio:</b> ${product.price}</p>
        <p class="estiloTexto"><b>Categoria:</b> ${product.category}</p>
        <p class="estiloTexto"><b>ID:</b> ${product._id}</p>
        </div>
        </div>
        `
        containerProducts.innerHTML += productHtml
    });
});
