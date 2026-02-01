// Initialize Icons
lucide.createIcons();

// Data Produk
const products = [
  {
    id: 1,
    name: "Laptop Gaming",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Laptop Gaming Pro",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Laptop Gaming Elite",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Laptop Gaming Ultra",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Laptop Gaming Max",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Laptop Gaming Plus",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Laptop Gaming S",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Laptop Gaming X",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
  },
  {
    id: 9,
    name: "Laptop Gaming Z",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
  },
  {
    id: 10,
    name: "Laptop Gaming Air",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    name: "Laptop Gaming Lite",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
  },
  {
    id: 12,
    name: "Laptop Gaming Mini",
    desc: "Laptop gaming dengan prosesor bertenaga dan grafis...",
    price: 40000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
  },
];

// State Keranjang
let cart = [
  {
    id: 1,
    name: "Product Name",
    price: 40000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Product Name",
    price: 40000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Product Name",
    price: 40000,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop",
  },
];

// Format Rupiah
const formatRupiah = (num) => {
  return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Render Produk
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products
    .map(
      (product) => `
                <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onclick="addToCart(${product.id})">
                    <div class="relative overflow-hidden h-40 bg-gray-700">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        <button class="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                            <i data-lucide="plus" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <div class="p-4">
                        <h3 class="text-white font-semibold text-lg mb-1">${product.name}</h3>
                        <p class="text-gray-400 text-xs mb-3 line-clamp-2">${product.desc}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-white font-bold text-lg">${formatRupiah(product.price)}</span>
                            <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs font-semibold">
                                <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                                <span>${product.stock}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
    )
    .join("");
  lucide.createIcons();
}

// Render Keranjang
function renderCart() {
  const cartContainer = document.getElementById("cartItems");
  const mobileCartContainer = document.getElementById("mobileCartItems");

  const cartHTML = cart
    .map(
      (item, index) => `
                <div class="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 animate-fade-in group hover:shadow-md transition-shadow">
                    <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-gray-800 text-sm truncate">${item.name}</h4>
                        <p class="text-xs text-gray-500 mb-2">${item.name}</p>
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-gray-900 text-sm">${formatRupiah(item.price * item.qty)}</span>
                            <div class="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                                <button onclick="updateQty(${index}, -1)" class="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all">
                                    <i data-lucide="minus" class="w-3 h-3"></i>
                                </button>
                                <span class="text-sm font-semibold w-4 text-center tabular-nums">${item.qty}</span>
                                <button onclick="updateQty(${index}, 1)" class="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all">
                                    <i data-lucide="plus" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            `,
    )
    .join("");

  cartContainer.innerHTML =
    cartHTML ||
    '<div class="flex flex-col items-center justify-center h-full text-gray-400"><i data-lucide="shopping-bag" class="w-16 h-16 mb-2 opacity-20"></i><p class="text-sm">Keranjang kosong</p></div>';
  mobileCartContainer.innerHTML =
    cartHTML ||
    '<div class="flex flex-col items-center justify-center h-full text-gray-400"><i data-lucide="shopping-bag" class="w-16 h-16 mb-2 opacity-20"></i><p class="text-sm">Keranjang kosong</p></div>';

  lucide.createIcons();
  updateTotals();
}

// Update Quantity
function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

// Remove from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Clear Cart
function clearCart() {
  if (confirm("Yakin ingin menghapus semua item?")) {
    cart = [];
    renderCart();
  }
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.image,
    });
  }

  renderCart();

  // Animasi badge
  const badge = document.getElementById("cartBadge");
  badge.classList.add("animate-bounce");
  setTimeout(() => badge.classList.remove("animate-bounce"), 1000);
}

// Update Totals
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("subtotal").textContent = formatRupiah(subtotal);
  document.getElementById("totalAmount").textContent = formatRupiah(subtotal);
  document.getElementById("mobileTotalAmount").textContent =
    formatRupiah(subtotal);
  document.getElementById("cartItemCount").textContent = cart.length;
  document.getElementById("cartBadge").textContent = cart.length;
  document.getElementById("mobileCartBadge").textContent = cart.length;
}

// Toggle Mobile Cart
function toggleMobileCart() {
  const mobileCart = document.getElementById("mobileCart");
  mobileCart.classList.toggle("hidden");
}

// Search Filter
document.getElementById("searchInput").addEventListener("input", (e) => {
  const search = e.target.value.toLowerCase();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search),
  );
  const grid = document.getElementById("productGrid");

  if (filtered.length === 0) {
    grid.innerHTML =
      '<div class="col-span-full text-center py-20 text-gray-400"><i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 opacity-20"></i><p>Produk tidak ditemukan</p></div>';
    lucide.createIcons();
  } else {
    grid.innerHTML = filtered
      .map(
        (product) => `
                    <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onclick="addToCart(${product.id})">
                        <div class="relative overflow-hidden h-40 bg-gray-700">
                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                            <button class="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                                <i data-lucide="plus" class="w-5 h-5"></i>
                            </button>
                        </div>
                        <div class="p-4">
                            <h3 class="text-white font-semibold text-lg mb-1">${product.name}</h3>
                            <p class="text-gray-400 text-xs mb-3 line-clamp-2">${product.desc}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-white font-bold text-lg">${formatRupiah(product.price)}</span>
                                <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs font-semibold">
                                    <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                                    <span>${product.stock}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
      )
      .join("");
    lucide.createIcons();
  }
  document.getElementById("productCount").textContent = filtered.length;
});

// Initial Render
renderProducts();
renderCart();
