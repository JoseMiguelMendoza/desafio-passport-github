let buttonAddToCart = document.getElementsByClassName('buttonAddToCart');
for (let i = 0; i < buttonAddToCart.length; i++) {
    buttonAddToCart[i].addEventListener('click', (e) => {
        e.preventDefault();
        let cartId;
        fetch('/api/carts')
            .then(response => response.json())
            .then(data => {
                if (data.payload && data.payload.length > 0) {
                    cartId = data.payload[0]._id; // Obtener el ID del primer carrito
                    const productId = e.target.getAttribute('data-product-id'); 
                    const body = { product: productId, quantity: 1 }; // Datos del producto a agregar
                    return fetch(`/api/carts/${cartId}/product/${productId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    });
                } else {
                    throw new Error('No se encontró ningún carrito');
                }
            })
            .then(response => {
                if (response.ok) {
                    Toastify({
                        text: "Producto agregado al carrito",
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
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
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
                } else {
                    Toastify({
                        text: "Error al agregar el producto al carrito",
                        duration: 3000,
                        gravity: "top",
                        offset: {
                            x: 0,
                            y: 52
                        },
                        close: false,
                        position: "left",
                        stopOnFocus: false,
                        style: {
                            background: "linear-gradient(to right, #ff0000)",
                            width: "275px",
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
                console.error('Error:', error);
                Toastify({
                    text: "Ocurrió un error al conectar con el servidor",
                    duration: 3000,
                    gravity: "top",
                    offset: {
                        x: 0,
                        y: 52
                    },
                    close: false,
                    position: "left",
                    stopOnFocus: false,
                    style: {
                        background: "linear-gradient(to right, #ff0000)",
                        width: "310px",
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
            });
    });
}