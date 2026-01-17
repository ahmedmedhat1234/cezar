/**
 * منتجات Cezar Sports Wear
 * جميع الأسعار بالجنيه المصري
 */

const PRODUCTS = [
  {
    id: 1,
    name: "ترينج أديداس وتر بروف",
    category: "تريننج",
    price: 1750,
    originalPrice: 2000,
    image: "images/product-1.jpg",
    images: ["images/product-1.jpg", "images/product-1-2.jpg"],
    description: "ترينج أديداس عالي الجودة مقاوم للماء، مصنوع من أفضل الخامات الرياضية. مناسب لجميع أنواع التمارين الرياضية.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "خصم",
    discount: 12
  },
  {
    id: 2,
    name: "ترينج أديداس ميرور أوريجينال",
    category: "تريننج",
    price: 2450,
    image: "images/product-2.jpg",
    images: ["images/product-2.jpg"],
    description: "ترينج أديداس أصلي 100% بتصميم عصري وألوان مميزة. توفر راحة قصوى أثناء التمرين.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    discount: 0
  },
  {
    id: 3,
    name: "ترينج نايك ميرور أوريجينال",
    category: "تريننج",
    price: 2450,
    image: "images/product-3.jpg",
    images: ["images/product-3.jpg"],
    description: "ترينج نايك أصلي بأحدث التقنيات الرياضية. تصميم مريح وعملي للاستخدام اليومي والرياضي.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    discount: 0
  },
  {
    id: 4,
    name: "جاكيت سبورت بناتي ميرور أوريجينال",
    category: "جاكيت",
    price: 1200,
    image: "images/product-4.jpg",
    images: ["images/product-4.jpg"],
    description: "جاكيت رياضي نسائي بتصميم عصري وألوان جذابة. مصنوع من خامات عالية الجودة توفر الراحة والدفء.",
    sizes: ["XS", "S", "M", "L", "XL"],
    discount: 0
  },
  {
    id: 5,
    name: "بنطلون رياضي Adidas",
    category: "بنطلون",
    price: 1800,
    originalPrice: 2200,
    image: "images/product-5.jpg",
    images: ["images/product-5.jpg"],
    description: "بنطلون رياضي أديداس بتقنية Climalite للتهوية الممتازة. مناسب للتمارين المكثفة والاستخدام اليومي.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "خصم",
    discount: 18
  },
  {
    id: 6,
    name: "حذاء رياضي Nike Revolution",
    category: "أحذية",
    price: 1500,
    image: "images/product-6.jpg",
    images: ["images/product-6.jpg"],
    description: "حذاء رياضي نايك خفيف الوزن وسهل الارتداء. توفر دعم ممتاز للقدم أثناء الركض والمشي.",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    discount: 0
  },
  {
    id: 7,
    name: "تي شيرت رياضي Puma",
    category: "تي شيرت",
    price: 650,
    image: "images/product-7.jpg",
    images: ["images/product-7.jpg"],
    description: "تي شيرت رياضي بوما بتقنية الامتصاص السريع للعرق. مريح وخفيف الوزن مثالي للتمارين.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    discount: 0
  },
  {
    id: 8,
    name: "شورت رياضي Adidas",
    category: "شورت",
    price: 950,
    originalPrice: 1200,
    image: "images/product-8.jpg",
    images: ["images/product-8.jpg"],
    description: "شورت رياضي أديداس بتصميم عصري وألوان متنوعة. مصنوع من خامات تجف بسرعة وتوفر راحة قصوى.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "خصم",
    discount: 21
  }
];

// دالة للحصول على منتج بواسطة ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === parseInt(id));
}

// دالة للحصول على المنتجات حسب الفئة
function getProductsByCategory(category) {
  if (category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

// دالة للحصول على جميع الفئات
function getCategories() {
  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  return categories;
}
