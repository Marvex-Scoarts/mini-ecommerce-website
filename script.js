// 1. MULTI-DEPARTMENT PRODUCT CATALOG (16 ITEMS)
const products = [
  // --- STREETWEAR ---
  { id: 1, name: "CloudStep Retro Sneakers", price: 45000, category: "Streetwear", emoji: "👟" },
  { id: 2, name: "Oversized Graphic Hoodie", price: 28000, category: "Streetwear", emoji: "🧥" },
  { id: 3, name: "Y2K Chrome Sunglasses", price: 12500, category: "Streetwear", emoji: "🕶️" },
  { id: 4, name: "Cargo Parachute Pants", price: 32000, category: "Streetwear", emoji: "👖" },

  // --- TECH GADGETS ---
  { id: 5, name: "Studio ANC Wireless Pods", price: 38000, category: "Tech", emoji: "🎧" },
  { id: 6, name: "RGB Mechanical Mini Keyboard", price: 42000, category: "Tech", emoji: "⌨️" },
  { id: 7, name: "MagSafe Fast Power Bank", price: 24000, category: "Tech", emoji: "🔋" },
  { id: 8, name: "Smart Fitness Pulse Watch", price: 35000, category: "Tech", emoji: "⌚" },

  // --- BEAUTY & SKINCARE ---
  { id: 9, name: "Hyaluronic Dew Glow Serum", price: 14500, category: "Beauty", emoji: "🧴" },
  { id: 10, name: "Velvet Berry Lip Gloss Set", price: 9500, category: "Beauty", emoji: "💄" },
  { id: 11, name: "Vanilla Oud Body Mist", price: 16000, category: "Beauty", emoji: "🌸" },
  { id: 12, name: "Rose Quartz Facial Roller", price: 8500, category: "Beauty", emoji: "✨" },

  // --- SNACKS & DRINKS ---
  { id: 13, name: "Spicy Suya Chicken Shawarma", price: 4500, category: "Snacks", emoji: "🌯" },
  { id: 14, name: "Brown Sugar Boba Milk Tea", price: 3800, category: "Snacks", emoji: "🧋" },
  { id: 15, name: "Loaded Pepperoni Pizza Box", price: 9500, category: "Snacks", emoji: "🍕" },
  { id: 16, name: "Salted Caramel Gelato Tub", price: 5200, category: "Snacks", emoji: "🍨" }
];

// 2. GRAB HTML ELEMENTS
const productGrid = document.getElementById("product-grid");
const filterTabs = document.getElementById("filter-tabs");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartDeliveryEl = document.getElementById("cart-delivery");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartPanel = document.getElementById("cart-panel");

// 3. LOAD SAVED CART FROM BROWSER STORAGE
let cart = JSON.parse(localStorage.getItem("bestie_boutique_cart")) || [];
let activeCategory = "All";

// Helper to format Naira cleanly
function formatNaira(amount) {
  return "₦" + amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// 4. RENDER PRODUCTS ON SCREEN
function renderProducts() {
  productGrid.innerHTML = "";

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div>
        <div class="product-emoji">${product.emoji}</div>
        <div class="product-badge">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formatNaira(product.price)}</p>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
        + Add to Cart
      </button>
    `;

    productGrid.appendChild(card);
  });
}

// 5. CATEGORY FILTER CLICK HANDLER
filterTabs.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;

  // Update active pill styling
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");

  activeCategory = e.target.dataset.category;
  renderProducts();
});

// 6. ADD PRODUCT TO CART (OR INCREASE QUANTITY)
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveAndUpdateCart();
}

// 7. UPDATE QUANTITY (+1 OR -1)
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveAndUpdateCart();
  }
}

// 8. REMOVE PRODUCT COMPLETELY
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveAndUpdateCart();
}

// 9. SAVE CART & REFRESH UI
function saveAndUpdateCart() {
  localStorage.setItem("bestie_boutique_cart", JSON.stringify(cart));
  renderCart();
}

// 10. RENDER CART ITEMS & CALCULATE TOTALS
function renderCart() {
  cartItemsEl.innerHTML = "";

  // Update navbar cart badge count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.innerText = totalItems;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart-msg">Your cart is empty. Add something cool!</p>`;
    cartSubtotalEl.innerText = formatNaira(0);
    cartDeliveryEl.innerText = formatNaira(0);
    cartTotalEl.innerText = formatNaira(0);
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartRow = document.createElement("div");
    cartRow.classList.add("cart-item");

    cartRow.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.emoji} ${item.name}</h4>
        <p>${formatNaira(itemTotal)}</p>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Remove">✕</button>
      </div>
    `;

    cartItemsEl.appendChild(cartRow);
  });

  // Smart delivery fee: Free delivery on orders ₦50,000 and above!
  const deliveryFee = subtotal >= 50000 ? 0 : 2500;
  const grandTotal = subtotal + deliveryFee;

  cartSubtotalEl.innerText = formatNaira(subtotal);
  cartDeliveryEl.innerText = deliveryFee === 0 ? "FREE 🎉" : formatNaira(deliveryFee);
  cartTotalEl.innerText = formatNaira(grandTotal);
}

// 11. CHECKOUT ACTION
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some drops before checking out.");
    return;
  }

  const totalText = cartTotalEl.innerText;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  alert(`🎉 Order Confirmed at Remmaxel Boutique!\n\nItems Ordered: ${itemCount}\nTotal Paid: ${totalText}\n\nThank you for shopping with us! 💖`);

  // Clear cart after checkout
  cart = [];
  saveAndUpdateCart();
});

// 12. SMOOTH SCROLL TO CART ON MOBILE
cartToggleBtn.addEventListener("click", () => {
  cartPanel.scrollIntoView({ behavior: "smooth" });
});

closeCartBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// INITIALIZE STOREFRONT
renderProducts();
renderCart();