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
        name: 'جاكيت سبورت بناتي ميرور أوريچينال – Sports Jacket',
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
        this.listeners = [];
    }

    loadFromStorage() {
        const stored = localStorage.getItem('cezar_cart');
        return stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem('cezar_cart', JSON.stringify(this.items));
        this.notifyListeners();
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

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItems() {
        return this.items;
    }

    clear() {
        this.items = [];
        this.saveToStorage();
    }

    generateWhatsAppMessage() {
        if (this.items.length === 0) {
            return 'السلة فارغة';
        }

        let message = '*طلب من Cezar Sports Wear*\n\n';
        message += '*تفاصيل الطلب:*\n';
        message += '─────────────────\n';

        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            if (item.size) {
                message += `   المقاس: ${item.size}\n`;
            }
            message += `   السعر: ${item.price.toLocaleString('ar-EG')} ج.م\n`;
            message += `   الكمية: ${item.quantity}\n`;
            message += `   الإجمالي: ${(item.price * item.quantity).toLocaleString('ar-EG')} ج.م\n`;
            message += '\n';
        });

        message += '─────────────────\n';
        message += `*الإجمالي الكلي: ${this.getTotalPrice().toLocaleString('ar-EG')} ج.م*\n\n`;
        message += 'شكراً لاختيارك Cezar Sports Wear 🙏';

        return message;
    }

    sendToWhatsApp(phoneNumber = '201022319907') {
        const message = this.generateWhatsAppMessage();
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
}

const cart = new ShoppingCart();

// ==================== Update Cart UI ====================
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const count = cart.getItemCount();
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Subscribe to cart changes
cart.subscribe(updateCartUI);

// ==================== Slider Functionality ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-image');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[n].classList.add('active');
    if (dots[n]) dots[n].classList.add('active');
}

function changeSlide(n) {
    if (slides.length === 0) return;
    
    currentSlide += n;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
}

function goToSlide(n) {
    currentSlide = n;
    showSlide(currentSlide);
}

// Auto-slide every 5 seconds
if (slides.length > 0) {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// ==================== Product Image Carousel ====================
const productImageCarousels = {};

function initProductCarousels() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const productId = index + 1;
        const product = products[productId];
        
        if (product && product.images.length > 1) {
            const imageElement = card.querySelector('.product-image img');
            let currentImageIdx = 0;
            
            productImageCarousels[productId] = setInterval(() => {
                currentImageIdx = (currentImageIdx + 1) % product.images.length;
                imageElement.style.opacity = '0.7';
                
                setTimeout(() => {
                    imageElement.src = `images/${product.images[currentImageIdx]}`;
                    imageElement.style.opacity = '1';
                }, 150);
            }, 3000);
        }
    });
}

// Initialize carousels when page loads
document.addEventListener('DOMContentLoaded', () => {
    initProductCarousels();
    updateCartUI();
});

// ==================== Product Modal ====================
let currentProductId = null;
let currentImageIndex = 0;

function openProduct(productId) {
    currentProductId = productId;
    currentImageIndex = 0;
    const product = products[productId];
    const modal = document.getElementById('productModal');
    
    // Set product details
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalPrice').textContent = product.price + ' ج';
    document.getElementById('modalDescription').textContent = product.description;
    
    // Set main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = `images/${product.images[0]}`;
    
    // Create thumbnails
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    product.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = `images/${image}`;
        img.alt = `Product image ${index + 1}`;
        if (index === 0) img.classList.add('active');
        img.onclick = () => changeMainImage(index);
        thumbnailsContainer.appendChild(img);
    });

    // Create size selector
    const sizeContainer = document.getElementById('modalSizes');
    if (sizeContainer && product.sizes) {
        sizeContainer.innerHTML = '<label>اختر المقاس:</label><div class="size-options">';
        product.sizes.forEach(size => {
            sizeContainer.innerHTML += `<button class="size-option" data-size="${size}">${size}</button>`;
        });
        sizeContainer.innerHTML += '</div>';
        
        // Add size selection handlers
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }
    
    modal.classList.add('active');
}

function closeProduct() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
}

function changeMainImage(index) {
    const product = products[currentProductId];
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
    
    mainImage.src = `images/${product.images[index]}`;
    
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    
    currentImageIndex = index;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProduct();
    }
};

// ==================== Add to Cart from Modal ====================
function addToCartFromModal() {
    const product = products[currentProductId];
    const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
    const selectedSize = document.querySelector('.size-option.selected');
    const size = selectedSize ? selectedSize.dataset.size : null;

    cart.addItem(currentProductId, quantity, size);
    
    // Show success message
    showNotification('تم إضافة المنتج للسلة بنجاح!', 'success');
    closeProduct();
}

// ==================== Shopping Cart Modal ====================
function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('show');
        renderCartItems();
    }
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('show');
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const items = cart.getItems();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty"><p>السلة فارغة</p></div>';
    } else {
        cartItemsContainer.innerHTML = items.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="images/${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${item.size ? `<div class="cart-item-size">المقاس: ${item.size}</div>` : ''}
                    <div class="cart-item-price">${item.price.toLocaleString('ar-EG')} ج.م</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1}, '${item.size || ''}')">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1}, '${item.size || ''}')">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size || ''}')">حذف</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update summary
    const totalPrice = cart.getTotalPrice();
    document.getElementById('cartTotal').textContent = totalPrice.toLocaleString('ar-EG');
}

function updateCartQuantity(productId, quantity, size) {
    const sizeValue = size === '' ? null : size;
    cart.updateQuantity(productId, quantity, sizeValue);
    renderCartItems();
}

function removeFromCart(productId, size) {
    const sizeValue = size === '' ? null : size;
    cart.removeItem(productId, sizeValue);
    renderCartItems();
}

function checkoutCart() {
    if (cart.getItems().length === 0) {
        showNotification('السلة فارغة!', 'error');
        return;
    }
    
    cart.sendToWhatsApp('201022319907');
    cart.clear();
    renderCartItems();
    closeCart();
    showNotification('تم إرسال الطلب عبر الواتساب!', 'success');
}

// ==================== Notification System ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==================== Order Functionality (Legacy) ====================
function orderNow(productName, price) {
    showOrderForm(productName, price);
}

function orderFromModal() {
    const product = products[currentProductId];
    showOrderForm(product.name, product.price);
}

function showOrderForm(productName, price) {
    // Create order form modal if it doesn't exist
    let orderModal = document.getElementById('orderModal');
    if (!orderModal) {
        const orderHTML = `
            <div id="orderModal" class="order-modal">
                <div class="order-form-container">
                    <span class="close" onclick="closeOrderForm()">&times;</span>
                    <h2>نموذج الطلب</h2>
                    <form id="orderForm" onsubmit="submitOrder(event)">
                        <div class="form-group">
                            <label>اسم المنتج:</label>
                            <input type="text" id="productNameInput" readonly>
                        </div>
                        <div class="form-group">
                            <label>السعر:</label>
                            <input type="text" id="priceInput" readonly>
                        </div>
                        <div class="form-group">
                            <label>الكمية:</label>
                            <input type="number" id="quantityInput" min="1" value="1" required>
                        </div>
                        <div class="form-group">
                            <label>مكان السكن:</label>
                            <input type="text" id="addressInput" placeholder="أدخل مكان السكن" required>
                        </div>
                        <div class="form-group">
                            <label>رقم الهاتف:</label>
                            <input type="tel" id="phoneInput" placeholder="أدخل رقم الهاتف" required>
                        </div>
                        <div class="form-group">
                            <label>رقم الهاتف البديل:</label>
                            <input type="tel" id="alternatePhoneInput" placeholder="أدخل رقم الهاتف البديل (اختياري)">
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="btn-submit">اطلب عبر الواتساب</button>
                            <button type="button" class="btn-cancel" onclick="closeOrderForm()">إلغاء</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', orderHTML);
        orderModal = document.getElementById('orderModal');
    }
    
    // Fill in the form
    document.getElementById('productNameInput').value = productName;
    document.getElementById('priceInput').value = price + ' ج';
    document.getElementById('quantityInput').value = 1;
    
    // Show the modal
    orderModal.classList.add('active');
}

function closeOrderForm() {
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.classList.remove('active');
    }
}

function submitOrder(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productNameInput').value;
    const price = document.getElementById('priceInput').value;
    const quantity = document.getElementById('quantityInput').value;
    const address = document.getElementById('addressInput').value;
    const phone = document.getElementById('phoneInput').value;
    const alternatePhone = document.getElementById('alternatePhoneInput').value;
    
    // Calculate total price
    const priceNumber = parseInt(price);
    const totalPrice = priceNumber * quantity;
    
    // Create WhatsApp message
    const message = `مرحباً، أود طلب المنتج التالي:\n\n` +
                   `📦 المنتج: ${productName}\n` +
                   `💰 السعر: ${price}\n` +
                   `📊 الكمية: ${quantity}\n` +
                   `💵 الإجمالي: ${totalPrice} ج\n\n` +
                   `📍 مكان السكن: ${address}\n` +
                   `📱 رقم الهاتف: ${phone}\n` +
                   `📞 رقم الهاتف البديل: ${alternatePhone || 'لا يوجد'}\n\n` +
                   `شكراً لتعاملكم معنا!`;
    
    // WhatsApp API link
    const whatsappNumber = '201022319907'; // Without the +
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Close the form
    closeOrderForm();
}

// Close order modal when clicking outside
window.addEventListener('click', function(event) {
    const orderModal = document.getElementById('orderModal');
    if (orderModal && event.target === orderModal) {
        closeOrderForm();
    }
});

// ==================== Navigation Active Link ====================
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ==================== Smooth Scroll for Navigation ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ==================== Mobile Menu Toggle ====================
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('show');
    }
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.classList.remove('show');
        }
    });
});
