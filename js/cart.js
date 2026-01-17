/**
 * إدارة السلة (Shopping Cart)
 * تُخزن البيانات في Local Storage
 */

const CART_KEY = 'cezar_cart';

class ShoppingCart {
  constructor() {
    this.items = this.loadFromStorage();
  }

  // تحميل السلة من Local Storage
  loadFromStorage() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // حفظ السلة في Local Storage
  saveToStorage() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    this.notifyListeners();
  }

  // إضافة منتج للسلة
  addItem(productId, quantity = 1, size = null) {
    const product = getProductById(productId);
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
        image: product.image
      });
    }

    this.saveToStorage();
    return true;
  }

  // إزالة منتج من السلة
  removeItem(productId, size = null) {
    this.items = this.items.filter(
      item => !(item.id === productId && item.size === size)
    );
    this.saveToStorage();
  }

  // تحديث كمية منتج
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

  // الحصول على عدد المنتجات في السلة
  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // الحصول على إجمالي السعر
  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // الحصول على جميع عناصر السلة
  getItems() {
    return this.items;
  }

  // تفريغ السلة
  clear() {
    this.items = [];
    this.saveToStorage();
  }

  // الحصول على عدد العناصر المختلفة
  getUniqueItemCount() {
    return this.items.length;
  }

  // إنشاء رسالة WhatsApp من محتويات السلة
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

  // إرسال الطلب عبر WhatsApp
  sendToWhatsApp(phoneNumber = '201022319907') {
    const message = this.generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  // مستمعو التغييرات
  listeners = [];

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }
}

// إنشاء نسخة عامة من السلة
const cart = new ShoppingCart();
