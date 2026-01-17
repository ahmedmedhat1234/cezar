// ==================== Products Data ====================
const products = {
    1: {
        name: 'ترينج أديداس وتر بروف',
        price: 1750,
        originalPrice: 2000,
        images: ['2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg'],
        description: 'ترينج أديداس وتر بروف عالي الجودة مصنوع من مواد متينة ومقاومة للماء. مناسب لجميع الأنشطة الرياضية.'
    },
    2: {
        name: 'ترينج أديداس ميرور أوريچينال',
        price: 2450,
        images: ['7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg'],
        description: 'ترينج أديداس ميرور أوريچينال الأصلي بتصميم عصري وراقي. مناسب للرياضيين المحترفين.'
    },
    3: {
        name: 'ترينج نايك ميرور أوريچينال',
        price: 2450,
        images: ['11.jpeg', '12.jpeg', '13.jpeg'],
        description: 'ترينج نايك ميرور أوريچينال بجودة عالية جداً. يوفر راحة قصوى وأداء ممتاز.'
    },
    4: {
        name: 'جاكيت سبورت بناتي ميرور أوريچينال – Sports Jacket',
        price: 1200,
        images: ['14.jpeg', '15.jpeg', '16.jpeg', '17.jpeg'],
        description: 'جاكيت سبورت بناتي ميرور أوريچينال بتصميم أنيق وحديث. مثالي للفتيات الرياضيات.'
    }
};

// ==================== Slider Functionality ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-image');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[n].classList.add('active');
    dots[n].classList.add('active');
}

function changeSlide(n) {
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
setInterval(() => {
    changeSlide(1);
}, 5000);

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

// ==================== Order Functionality ====================
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
