const socket = io()

const btnDeleteProdFromCart = document.getElementsByClassName('btnDeleteProdFromCart');

const productsBox = document.querySelector('.productsBox');
productsBox.addEventListener('click', eliminarProductoDelCarrito);

function eliminarProductoDelCarrito(e) {
    if (e.target.classList.contains('btnDeleteProdFromCart')) {
        let cartId = e.target.dataset.cartId;
        let productId = e.target.dataset.productId;
        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                Toastify({
                    text: "Producto eliminado del carrito",
                    duration: 1000,
                    gravity: "top",
                    offset: {
                        x: 0,
                        y: 52
                    },
                    close: false,
                    position: "left",
                    stopOnFocus: false,
                    style: {
                        background: "linear-gradient(to right, #020024, #790935, #ff003d)",
                        width: "220px",
                        height: "35px",
                        position: "absolute",
                        color: "white",
                        text: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "'Kalam'",
                        fontWeight: "bold"
                    }
                }).showToast();
                socket.emit('eliminarProductoDelCarrito', {cartId, productId});
            } else {
                Toastify({
                    text: "No se pudo eliminar el producto del carrito",
                    duration: 2000,
                    gravity: "top",
                    offset: {
                        x: 0,
                        y: 52
                    },
                    close: false,
                    position: "left",
                    stopOnFocus: false,
                    style: {
                        background: "linear-gradient(to right, #020024, #790935, #ff003d)",
                        width: "220px",
                        height: "35px",
                        position: "absolute",
                        color: "white",
                        text: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "'Kalam'",
                        fontWeight: "bold"
                    }
                }).showToast();
            }
        })
        .catch(error => {
            console.error('Error al eliminar el producto del carrito:', error);
        });
    }
}

socket.on('productoEliminado', async(updatedCart) => {
    try {
        let productsBox = document.querySelector('.productsBox');
        productsBox.innerHTML = '';
    
        updatedCart.products.forEach((product) => {
            let productoEnCarrito =
            `
            <div class="containerProduct">
                <div class="fontSizePropertiesProduct"><b>Title:</b> ${product.product.title}</div>
                <div class="fontSizePropertiesProduct"><b>Category:</b> ${product.product.category}</div>
                <div class="fontSizePropertiesProduct"><b>Quantity:</b> ${product.quantity}</div>
                <div class="fontSizePropertiesProduct"><b>Price:</b> $${product.product.price}</div>
                <div><button class="btnDeleteProdFromCart" data-cart-id="${updatedCart._id}" data-product-id="${product.product._id}">Eliminar producto</button></div>
            </div>
            `
            productsBox.innerHTML += productoEnCarrito
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
});