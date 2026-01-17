// ==================== Products Data ====================
const products = {
    1: {
        name: 'ترينج أديداس وتر بروف',
        price: 1750,
        originalPrice: 2000,
        images: ['2.jpg', '3.jpg', '4.jpg', '5.jpg'],
        description: 'ترينج أديداس وتر بروف عالي الجودة مصنوع من مواد متينة ومقاومة للماء. مناسب لجميع الأنشطة الرياضية.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    2: {
        name: 'ترينج أديداس ميرور أوريچينال',
        price: 2450,
        images: ['7.jpg', '8.jpg', '9.jpg', '10.jpg'],
        description: 'ترينج أديداس ميرور أوريچينال الأصلي بتصميم عصري وراقي. مناسب للرياضيين المحترفين.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    3: {
        name: 'ترينج نايك ميرور أوريچينال',
        price: 2450,
        images: ['11.jpg', '12.jpg', '13.jpg'],
        description: 'ترينج نايك ميرور أوريچينال بجودة عالية جداً. يوفر راحة قصوى وأداء ممتاز.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    4: {
        name: 'جاكيت سبورت بناتي ميرور أوريچينال',
        price: 1200,
        images: ['14.jpg', '15.jpg', '16.jpg', '17.jpg'],
        description: 'جاكيت سبورت بناتي ميرور أوريچينال بتصميم أنيق وحديث. مثالي للفتيات الرياضيات.',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
    }
};

// ==================== Shopping Cart Management ====================
class ShoppingCart {
    constructor() {
        this.items = this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('cezar_cart');
        return stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem('cezar_cart', JSON.stringify(this.items));
        updateCartCount();
    }

    addItem(productId, quantity = 1, size = null) {
        const product = products[productId];
        if (!product) return false;

        const existingItem = this.items.find(
            item => item.id === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity,
                size: size,
                image: product.images[0]
            });
        }

        this.saveToStorage();
        showNotification('تم إضافة المنتج للسلة بنجاح!', 'success');
        return true;
    }

    removeItem(productId, size = null) {
        this.items = this.items.filter(
            item => !(item.id === productId && item.size === size)
        );
        this.saveToStorage();
    }

    updateQuantity(productId, quantity, size = null) {
        const item = this.items.find(
            item => item.id === productId && item.size === size
        );
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId, size);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
    }
}

// Initialize cart
const cart = new ShoppingCart();

// ==================== DOM Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    setupSlider();
});

// ==================== Product Rendering ====================
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    
    for (const [id, product] of Object.entries(products)) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProduct(id);

        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

        card.innerHTML = `
            <div class="product-image">
                <img src="images/${product.images[0]}" alt="${product.name}">
                ${hasDiscount ? `<div class="product-badge">خصم ${discountPercent}%</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="price-current">${product.price} ج</span>
                    ${hasDiscount ? `<span class="price-original">${product.originalPrice} ج</span>` : ''}
                </div>
                <button class="btn-order" onclick="event.stopPropagation(); quickAddToCart(${id})">
                    <i class="fas fa-shopping-cart"></i> أضف للسلة
                </button>
            </div>
        `;

        grid.appendChild(card);
    }
}

// ==================== Product Modal Functions ====================
let currentProductId = null;
let selectedSize = null;

function openProduct(productId) {
    currentProductId = productId;
    selectedSize = null;
    const product = products[productId];
    const modal = document.getElementById('productModal');

    // Set product details
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalPrice').textContent = `${product.price} ج`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalQuantity').value = 1;

    // Set main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = `images/${product.images[0]}`;

    // Set thumbnails
    const thumbnails = document.getElementById('thumbnails');
    thumbnails.innerHTML = '';
    product.images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = `images/${img}`;
        thumb.className = index === 0 ? 'active' : '';
        thumb.onclick = (e) => {
            e.stopPropagation();
            mainImage.src = `images/${img}`;
            document.querySelectorAll('#thumbnails img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbnails.appendChild(thumb);
    });

    // Set sizes
    const sizesDiv = document.getElementById('modalSizes');
    sizesDiv.innerHTML = '<label>المقاس:</label><div class="size-options">';
    product.sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'size-option';
        btn.textContent = size;
        btn.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = size;
        };
        sizesDiv.querySelector('.size-options').appendChild(btn);
    });
    sizesDiv.innerHTML += '</div>';

    modal.classList.add('active');
}

function closeProduct() {
    document.getElementById('productModal').classList.remove('active');
}

function addToCartFromModal() {
    if (!currentProductId) return;
    
    const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
    cart.addItem(currentProductId, quantity, selectedSize);
    closeProduct();
}

function quickAddToCart(productId) {
    cart.addItem(productId, 1, null);
}

// ==================== Shopping Cart Functions ====================
function openCart() {
    const modal = document.getElementById('cartModal');
    renderCartItems();
    modal.classList.add('show');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
}

function renderCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.items.length === 0) {
        cartItemsDiv.innerHTML = '<div class="cart-empty"><p>السلة فارغة</p></div>';
        return;
    }

    cartItemsDiv.innerHTML = '';
    
    cart.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        
        itemDiv.innerHTML = `
            <div class="cart-item-image">
                <img src="images/${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.size ? `<div class="cart-item-size">المقاس: ${item.size}</div>` : ''}
                <div class="cart-item-price">${item.price} ج</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQty(${item.id}, ${item.quantity - 1}, '${item.size}')">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="updateQty(${item.id}, ${item.quantity + 1}, '${item.size}')">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">حذف</button>
                </div>
            </div>
        `;
        
        cartItemsDiv.appendChild(itemDiv);
    });

    // Update total
    const total = cart.getTotal();
    document.getElementById('cartTotal').textContent = `${total} ج`;
}

function updateQty(productId, quantity, size) {
    cart.updateQuantity(productId, quantity, size === 'null' ? null : size);
    renderCartItems();
}

function removeFromCart(productId, size) {
    cart.removeItem(productId, size === 'null' ? null : size);
    renderCartItems();
}

function updateCartCount() {
    const count = cart.getItemCount();
    const countElement = document.getElementById('cartCount');
    if (count > 0) {
        countElement.textContent = count;
        countElement.style.display = 'flex';
    } else {
        countElement.style.display = 'none';
    }
}

function checkoutCart() {
    if (cart.items.length === 0) {
        showNotification('السلة فارغة!', 'error');
        return;
    }

    // Build message
    let message = 'السلام عليكم ورحمة الله وبركاته\n\n';
    message += 'أود طلب المنتجات التالية:\n\n';

    cart.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}`;
        if (item.size) message += ` - المقاس: ${item.size}`;
        message += `\n   الكمية: ${item.quantity} × ${item.price} ج = ${item.quantity * item.price} ج\n\n`;
    });

    const total = cart.getTotal();
    message += `الإجمالي: ${total} ج`;

    // Encode and send to WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201022319907?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after checkout
    setTimeout(() => {
        cart.clear();
        renderCartItems();
        closeCart();
        showNotification('تم إرسال الطلب! شكراً لك', 'success');
    }, 500);
}

// ==================== Slider Functions ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-image');

function setupSlider() {
    // Auto-rotate slides every 5 seconds
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const images = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (currentSlide + direction + images.length) % images.length;
    
    images[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const images = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = index;
    images[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// ==================== Mobile Menu ====================
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('show');
    }
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const menu = document.querySelector('.nav-links');
            if (menu) menu.classList.remove('show');
        });
    });
});

// ==================== Notifications ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} show`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== Close modals when clicking outside ====================
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    
    if (event.target === productModal) {
        closeProduct();
    }
    
    if (event.target === cartModal) {
        closeCart();
    }
}
