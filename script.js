// Productos disponibles
const products = [
    {
        id: 1,
        name: "Yogurt Natural",
        description: "Yogurt natural sin azúcar, 100% natural",
        price: 8500,
        emoji: "🥛"
    },
    {
        id: 2,
        name: "Yogurt de Fresa",
        description: "Delicioso yogurt con trozos de fresa",
        price: 9500,
        emoji: "🍓"
    },
    {
        id: 3,
        name: "Yogurt de Mora",
        description: "Yogurt cremoso con mora colombiana",
        price: 9500,
        emoji: "🫐"
    },
    {
        id: 4,
        name: "Yogurt Griego",
        description: "Yogurt griego alto en proteína",
        price: 12000,
        emoji: "🏛️"
    },
    {
        id: 5,
        name: "Yogurt de Mango",
        description: "Yogurt tropical con mango fresco",
        price: 10000,
        emoji: "🥭"
    },
    {
        id: 6,
        name: "Yogurt de Arándanos",
        description: "Yogurt con arándanos antioxidantes",
        price: 11000,
        emoji: "🫐"
    }
];

// Carrito de compras
let cart = [];

// Formatear precio en pesos colombianos
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

// Renderizar productos
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Producto agregado al carrito');
}

// Actualizar carrito
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    renderCart();
}

// Renderizar carrito
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        totalPrice.textContent = formatPrice(0);
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = formatPrice(total);
}

// Aumentar cantidad
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Disminuir cantidad
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCart();
    }
}

// Mostrar/ocultar modal del carrito
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`¡Gracias por tu compra!\n\nTotal: ${formatPrice(total)}\n\nTu pedido será procesado pronto.`);
    cart = [];
    updateCart();
    toggleCart();
}

// Notificación simple
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    document.getElementById('cartIcon').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('cartModal').addEventListener('click', (e) => {
        if (e.target.id === 'cartModal') {
            toggleCart();
        }
    });
});

// Animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
