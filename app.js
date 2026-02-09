lucide.createIcons();

const users = [
  {
    username: "admin",
    password: "admin123",
    role: "Admin",
    name: "Administrator",
  },
  {
    username: "kasir",
    password: "kasir123",
    role: "Kasir",
    name: "Kasir 01",
  },
  {
    username: "Karteho",
    password: "kasirlah",
    role: "Supervisor",
    name: "Karteho",
  },
  {
    username: "manager",
    password: "manager123",
    role: "Manager",
    name: "Store Manager",
  },
];

let currentUser = null;
let viewMode = "grid";
let cartOpen = false;

window.onload = function () {
  const savedUser = localStorage.getItem("posUser");
  const savedRole = localStorage.getItem("posRole");
  const rememberMe = localStorage.getItem("posRemember") === "true";

  if (savedUser && rememberMe) {
    const user = users.find((u) => u.username === savedUser);
    if (user) {
      currentUser = user;
      showMainApp(user);
    }
  }
};

function handleLogin(e) {
  if (e) e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  const errorDiv = document.getElementById("loginError");
  const loginBtn = document.getElementById("loginBtn");
  const btnText = loginBtn.querySelector("span");
  const btnLoader = document.getElementById("btnLoader");
  const btnIcon = document.getElementById("btnIcon");

  // 1. UI State: Loading
  // Menonaktifkan tombol agar tidak klik ganda & mengubah visual
  loginBtn.disabled = true;
  loginBtn.classList.add("opacity-80", "cursor-not-allowed");
  btnText.textContent = "Memproses...";
  btnLoader.classList.remove("hidden");
  btnIcon.classList.add("hidden");
  errorDiv.classList.add("hidden"); // Sembunyikan error sebelumnya jika ada

  setTimeout(() => {
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      currentUser = user;
      if (rememberMe) {
        localStorage.setItem("posUser", user.username);
        localStorage.setItem("posRole", user.role);
        localStorage.setItem("posRemember", "true");
      } else {
        localStorage.removeItem("posUser");
        localStorage.removeItem("posRole");
        localStorage.removeItem("posRemember");
      }

      // Beri sedikit delay agar user sempat melihat pesan "Berhasil!"
      setTimeout(() => showMainApp(user), 800);
    } else {
      // 3. UI State: Error
      loginBtn.disabled = false;
      loginBtn.classList.remove("opacity-80", "cursor-not-allowed");
      btnText.textContent = "Masuk";
      btnLoader.classList.add("hidden");
      btnIcon.classList.remove("hidden");

      // Menampilkan error dengan animasi halus
      errorDiv.classList.remove("hidden");
      errorDiv.classList.add("animate-shake"); // Pastikan class shake ada di CSS Anda

      // Hapus animasi shake setelah selesai agar bisa diulang jika error lagi
      setTimeout(() => {
        errorDiv.classList.remove("animate-shake");
      }, 500);
    }
  }, 1200); // Sedikit lebih lama agar transisi loading terasa "mahal"
}

function showMainApp(user) {
  const loginPage = document.getElementById("loginPage");
  const mainApp = document.getElementById("mainApp");

  document.getElementById("displayUsername").textContent = user.name;
  document.getElementById("displayRole").textContent = user.role;
  document.getElementById("userInitials").textContent = user.name
    .substring(0, 2)
    .toUpperCase();

  const hour = new Date().getHours();
  const shift =
    hour >= 6 && hour < 14
      ? "Pagi"
      : hour >= 14 && hour < 22
        ? "Sore"
        : "Malam";
  document.getElementById("shiftBadge").textContent = shift;

  loginPage.classList.add("slide-out");
  setTimeout(() => {
    loginPage.classList.add("hidden");
    mainApp.classList.remove("hidden");
    mainApp.classList.add("slide-in");

    initPOS();
  }, 400);
}

function logout() {
  if (confirm("Yakin ingin keluar dari sistem?")) {
    localStorage.removeItem("posUser");
    localStorage.removeItem("posRole");
    localStorage.removeItem("posRemember");
    location.reload();
  }
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.setAttribute("data-lucide", "eye");
  } else {
    passwordInput.type = "password";
    eyeIcon.setAttribute("data-lucide", "eye-closed");
  }
  lucide.createIcons();
}

function toggleRemember(checkbox) {
  const iconUnchecked = document.getElementById("icon-unchecked");
  const iconChecked = document.getElementById("icon-checked");
  const labelText = checkbox.closest("label").querySelector("span");

  if (checkbox.checked) {
    iconUnchecked.classList.add("hidden");
    iconChecked.classList.remove("hidden");
    labelText.classList.replace("text-gray-400", "text-[#BA984E]"); // Opsional: teks jadi emas saat terpilih
  } else {
    iconUnchecked.classList.remove("hidden");
    iconChecked.classList.add("hidden");
    labelText.classList.replace("text-[#BA984E]", "text-gray-400");
  }
  lucide.createIcons();
}

function showForgotPassword() {
  alert("Silahkan hubungi administrator untuk reset password.");
}

function openQRScanner() {
  alert(
    "Fitur QR Scanner sedang dalam pengembangan.\nGunakan input manual untuk sementara.",
  );
}

let cart = [];
let isMember = false;
let currentFilters = {
  category: "",
  brand: "",
};

function initPOS() {
  updateClock();
  setInterval(updateClock, 1000);
  renderProducts();
  renderCart();

  cartOpen = false;
  document.getElementById("cartSidebar").classList.add("hidden");
  document.getElementById("cartSidebar").classList.remove("flex");
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const clockEl = document.getElementById("clock");
  if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
}

const products = [
  {
    id: 1,
    name: "Baju Nike",
    category: "Baju",
    brand: "Nike",
    desc: "Baju olahraga Nike Dri-FIT",
    price: 50000,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Celana Levi's",
    category: "Celana",
    brand: "Levi's",
    desc: "Celana jeans Levi's 501 original",
    price: 100000,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Kaos Kaki Adidas",
    category: "Kaos Kaki",
    brand: "Adidas",
    desc: "Kaos kaki olahraga Adidas",
    price: 15000,
    stock: 100,
    image:
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Sepatu Nike",
    category: "Sepatu",
    brand: "Nike",
    desc: "Sepatu running Nike Air Max",
    price: 200000,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Topi Adidas",
    category: "Topi",
    brand: "Adidas",
    desc: "Topi baseball Adidas classic",
    price: 25000,
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Baju Uniqlo",
    category: "Baju",
    brand: "Uniqlo",
    desc: "Kaos polos katun Uniqlo",
    price: 50000,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Celana Zara",
    category: "Celana",
    brand: "Zara",
    desc: "Celana chino Zara slim fit",
    price: 100000,
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    name: "Sepatu Converse",
    category: "Sepatu",
    brand: "Converse",
    desc: "Sepatu casual Converse Chuck Taylor",
    price: 200000,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=300&fit=crop",
  },
  {
    id: 9,
    name: "Kaos Kaki Nike",
    category: "Kaos Kaki",
    brand: "Nike",
    desc: "Kaos kaki pendek Nike",
    price: 15000,
    stock: 80,
    image:
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=300&fit=crop",
  },
  {
    id: 10,
    name: "Topi Nike",
    category: "Topi",
    brand: "Nike",
    desc: "Topi sport Nike AeroBill",
    price: 25000,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    name: "Baju H&M",
    category: "Baju",
    brand: "H&M",
    desc: "T-shirt basic H&M",
    price: 50000,
    stock: 55,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
  },
  {
    id: 12,
    name: "Sepatu Puma",
    category: "Sepatu",
    brand: "Puma",
    desc: "Sepatu running Puma RS-X",
    price: 200000,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop",
  },
];

const formatRupiah = (num) => {
  if (isNaN(num)) return "Rp 0";
  return (
    "Rp " +
    Math.round(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
};

function toggleCart() {
  cartOpen = !cartOpen;
  const togglebtn = document.getElementById("toggleCartButton");
  const sidebar = document.getElementById("cartSidebar");
  const mainContent = document.getElementById("mainContent");

  if (cartOpen) {
    togglebtn.classList.add("hidden");
    sidebar.classList.remove("hidden");
    sidebar.classList.add("flex");
    mainContent.classList.add("lg:mr-[420px]");
  } else {
    togglebtn.classList.remove("hidden");
    sidebar.classList.add("hidden");
    sidebar.classList.remove("flex");
    mainContent.classList.remove("lg:mr-[420px]");
  }
}

function toggleFilterDropdown() {
  const dropdown = document.getElementById("filterDropdown");
  dropdown.classList.toggle("hidden");
}

function setViewMode(mode) {
  viewMode = mode;
  document.getElementById("gridBtn").className =
    mode === "grid"
      ? "p-1.5 bg-white rounded shadow-sm text-gray-800 transition-all"
      : "p-1.5 text-gray-500 hover:text-gray-800 transition-all";
  document.getElementById("listBtn").className =
    mode === "list"
      ? "p-1.5 bg-white rounded shadow-sm text-gray-800 transition-all"
      : "p-1.5 text-gray-500 hover:text-gray-800 transition-all";
  renderProducts();
}

function applyFilters() {
  currentFilters.category = document.getElementById("categoryFilter").value;
  currentFilters.brand = document.getElementById("brandFilter").value;
  renderProducts();
}

function updateQtyManual(index, newValue) {
  const qty = parseInt(newValue);
  const maxStock = cart[index].stock || 999;

  if (isNaN(qty) || qty < 1) {
    if (confirm("Hapus item ini dari keranjang?")) {
      cart.splice(index, 1);
    }
  } else if (qty > maxStock) {
    alert(`Stok tersedia hanya ${maxStock} pcs`);
    cart[index].qty = maxStock;
  } else {
    cart[index].qty = qty;
  }
  renderCart();
}

function toggleMember() {
  isMember = !isMember;

  const toggleSidebar = document.getElementById("memberToggleSidebar");
  const knobSidebar = document.getElementById("memberToggleKnobSidebar");
  const statusTextSidebar = document.getElementById("memberStatusTextSidebar");
  const benefitSidebar = document.getElementById("memberBenefitSidebar");

  if (isMember) {
    toggleSidebar?.classList.remove("bg-gray-300");
    toggleSidebar?.classList.add("bg-orange-500");
    knobSidebar?.classList.remove("translate-x-1");
    knobSidebar?.classList.add("translate-x-6");
    if (statusTextSidebar)
      statusTextSidebar.textContent = "Member (Diskon 10%)";
    if (benefitSidebar) benefitSidebar.style.display = "block";
  } else {
    toggleSidebar?.classList.remove("bg-orange-500");
    toggleSidebar?.classList.add("bg-gray-300");
    knobSidebar?.classList.remove("translate-x-6");
    knobSidebar?.classList.add("translate-x-1");
    if (statusTextSidebar) statusTextSidebar.textContent = "Non Member";
    if (benefitSidebar) benefitSidebar.style.display = "none";
  }

  updateTotals();
}

function calculateDiscounts() {
  let subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  let qtyDiscount = 0;
  let details = {
    baju: { qty: 0, total: 0, discount: 0 },
    celana: { qty: 0, total: 0, discount: 0 },
    kaosKaki: { qty: 0, total: 0, discount: 0 },
    sepatu: { qty: 0, total: 0, discount: 0 },
  };

  cart.forEach((item) => {
    const category = item.category
      ? item.category.toLowerCase()
      : item.name.toLowerCase();
    const itemTotal = item.price * item.qty;

    if (category === "baju") {
      details.baju.qty += item.qty;
      details.baju.total += itemTotal;
    } else if (category === "celana") {
      details.celana.qty += item.qty;
      details.celana.total += itemTotal;
    } else if (category === "kaos kaki") {
      details.kaosKaki.qty += item.qty;
      details.kaosKaki.total += itemTotal;
    } else if (category === "sepatu") {
      details.sepatu.qty += item.qty;
      details.sepatu.total += itemTotal;
    }
  });

  if (details.baju.qty >= 5) {
    details.baju.discount = details.baju.total * 0.15;
    qtyDiscount += details.baju.discount;
  }
  if (details.celana.qty >= 4) {
    details.celana.discount = details.celana.total * 0.1;
    qtyDiscount += details.celana.discount;
  }
  if (details.kaosKaki.qty >= 7) {
    details.kaosKaki.discount = details.kaosKaki.total * 0.25;
    qtyDiscount += details.kaosKaki.discount;
  }
  if (details.sepatu.qty >= 3) {
    details.sepatu.discount = details.sepatu.total * 0.2;
    qtyDiscount += details.sepatu.discount;
  }

  let afterQtyDiscount = subtotal - qtyDiscount;

  let memberDiscount = isMember ? afterQtyDiscount * 0.1 : 0;

  let afterMemberDiscount = afterQtyDiscount - memberDiscount;

  let shoppingDiscount = 0;
  if (afterMemberDiscount >= 1000000) {
    shoppingDiscount = afterMemberDiscount * 0.25;
  } else if (afterMemberDiscount >= 500000) {
    shoppingDiscount = afterMemberDiscount * 0.2;
  }

  let total = afterMemberDiscount - shoppingDiscount;

  return {
    subtotal,
    qtyDiscount,
    afterQtyDiscount,
    memberDiscount,
    shoppingDiscount,
    total,
    details,
  };
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  let filtered = products;

  if (currentFilters.category) {
    filtered = filtered.filter((p) => p.category === currentFilters.category);
  }
  if (currentFilters.brand) {
    filtered = filtered.filter((p) => p.brand === currentFilters.brand);
  }

  if (filtered.length === 0) {
    grid.innerHTML =
      '<div class="col-span-full text-center py-20 text-gray-400"><i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 opacity-20"></i><p>Produk tidak ditemukan</p></div>';
    lucide.createIcons();
    document.getElementById("productCount").textContent = 0;
    return;
  }

  document.getElementById("productCount").textContent = filtered.length;

  if (viewMode === "grid") {
    grid.className =
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
    grid.innerHTML = filtered
      .map(
        (product) => `
            <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onclick="addToCart(${product.id})">
              <div class="relative overflow-hidden h-40 bg-gray-700">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  ${product.brand}
                </div>
                <button class="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                  <i data-lucide="plus" class="w-5 h-5"></i>
                </button>
              </div>
              <div class="p-4">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="text-white font-semibold text-lg mb-1">${product.name}</h3>
                </div>
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
  } else {
    grid.className = "space-y-3";
    grid.innerHTML = filtered
      .map(
        (product) => `
            <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex" onclick="addToCart(${product.id})">
              <div class="relative overflow-hidden w-32 h-32 bg-gray-700 flex-shrink-0">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  ${product.brand}
                </div>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-white font-semibold text-lg mb-1">${product.name}</h3>
                  </div>
                  <p class="text-gray-400 text-xs mb-2 line-clamp-2">${product.desc}</p>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-white font-bold text-lg">${formatRupiah(product.price)}</span>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs font-semibold">
                      <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                      <span>Stok: ${product.stock}</span>
                    </div>
                    <button class="bg-orange-500 text-white p-2 rounded-full shadow-lg">
                      <i data-lucide="plus" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `,
      )
      .join("");
  }
  lucide.createIcons();
}

function renderCart() {
  const cartContainer = document.getElementById("cartItems");
  if (!cartContainer) return;

  if (cart.length === 0) {
    const emptyHTML = `
            <div class="flex flex-col items-center justify-center h-full text-gray-400">
              <i data-lucide="shopping-bag" class="w-16 h-16 mb-2 opacity-20"></i>
              <p class="text-sm">Keranjang kosong</p>
              <p class="text-xs mt-1">Klik produk untuk menambahkan</p>
            </div>
          `;
    cartContainer.innerHTML = emptyHTML;
    lucide.createIcons();
    updateTotals();
    return;
  }

  const cartHTML = cart
    .map(
      (item, index) => `
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3 animate-fade-in group hover:shadow-md transition-shadow relative">
            <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0 mt-1">
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 class="font-semibold text-gray-800 text-sm leading-tight break-words">${item.name}</h4>
                  <p class="text-xs text-gray-400">${item.brand}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors flex-shrink-0 -mr-1 -mt-1" title="Hapus item">
                  <i data-lucide="x" class="w-4 h-4"></i>
                </button>
              </div>
              <p class="text-xs text-gray-500 mb-3">${formatRupiah(item.price)} / pcs</p>
              <div class="flex items-center justify-between">
                <span class="font-bold text-orange-600 text-sm">${formatRupiah(item.price * item.qty)}</span>
                <div class="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  <button onclick="updateQty(${index}, -1)" class="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all">
                    <i data-lucide="minus" class="w-3 h-3"></i>
                  </button>
                  <input 
                    type="number" 
                    value="${item.qty}" 
                    min="1"
                    max="${item.stock || 999}"
                    onchange="updateQtyManual(${index}, this.value)"
                    onkeyup="if(event.key==='Enter') this.blur()"
                    class="w-10 h-7 text-center text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-0 tabular-nums text-gray-800"
                    style="-moz-appearance: textfield; appearance: textfield;"
                  />
                  <button onclick="updateQty(${index}, 1)" class="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all">
                    <i data-lucide="plus" class="w-3 h-3"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `,
    )
    .join("");

  cartContainer.innerHTML = cartHTML;
  lucide.createIcons();
  updateTotals();
}

function updateQty(index, change) {
  const item = cart[index];
  const maxStock = item.stock || 999;

  if (change > 0 && item.qty >= maxStock) {
    alert(`Stok ${item.name} hanya tersedia ${maxStock} pcs!`);
    return;
  }
  item.qty += change;
  if (item.qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm("Yakin ingin menghapus semua item?")) {
    cart = [];
    document.getElementById("paymentInput").value = "";
    renderCart();
  }
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    if (existingItem.qty >= product.stock) {
      alert(`Stok ${product.name} hanya tersedia ${product.stock} pcs!`);
      return;
    }
    existingItem.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      stock: product.stock,
      qty: 1,
      image: product.image,
    });
  }

  renderCart();
  updateCartBadges();
}

function updateCartBadges() {
  const count = cart.length;
  document.getElementById("cartBadge").textContent = count;
  document.getElementById("cartBadgeFloating").textContent = count;

  const badge = document.getElementById("cartBadge");
  badge.classList.add("animate-bounce");
  setTimeout(() => badge.classList.remove("animate-bounce"), 1000);
}

function updateTotals() {
  const calc = calculateDiscounts();

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  const elements = {
    subtotal: document.getElementById("subtotalSidebar"),
    total: document.getElementById("totalAmountSidebar"),
    count: document.getElementById("cartItemCountSidebar"),
    qtyDiscount: document.getElementById("qtyDiscountSidebar"),
    memberDiscount: document.getElementById("memberDiscountSidebar"),
    shoppingDiscount: document.getElementById("shoppingDiscountSidebar"),
  };

  if (elements.subtotal)
    elements.subtotal.textContent = formatRupiah(calc.subtotal);
  if (elements.total) elements.total.textContent = formatRupiah(calc.total);
  if (elements.count) elements.count.textContent = totalQty;
  if (elements.qtyDiscount)
    elements.qtyDiscount.textContent = formatRupiah(calc.qtyDiscount);
  if (elements.memberDiscount)
    elements.memberDiscount.textContent = formatRupiah(calc.memberDiscount);
  if (elements.shoppingDiscount)
    elements.shoppingDiscount.textContent = formatRupiah(calc.shoppingDiscount);

  document.getElementById("qtyDiscountRowSidebar").style.display =
    calc.qtyDiscount > 0 ? "flex" : "none";
  document.getElementById("memberDiscountRowSidebar").style.display =
    calc.memberDiscount > 0 ? "flex" : "none";
  document.getElementById("shoppingDiscountRowSidebar").style.display =
    calc.shoppingDiscount > 0 ? "flex" : "none";

  updateCartBadges();
  calculateChange();
}

function calculateChange() {
  const paymentInput = document.getElementById("paymentInput");
  if (!paymentInput) return;

  const payment = parseFloat(paymentInput.value) || 0;
  const calc = calculateDiscounts();
  const change = payment - calc.total;

  const changeRow = document.getElementById("changeRow");
  const changeAmount = document.getElementById("changeAmount");

  if (payment > 0) {
    changeRow.style.display = "flex";
    changeAmount.textContent = formatRupiah(change);
    changeAmount.className =
      change >= 0
        ? "font-bold text-green-400 tabular-nums"
        : "font-bold text-red-400 tabular-nums";
  } else {
    changeRow.style.display = "none";
  }

  return change;
}

function processPayment() {
  const calc = calculateDiscounts();
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  const payment =
    parseFloat(document.getElementById("paymentInput").value) || 0;

  if (payment < calc.total) {
    alert("Jumlah bayar kurang dari total belanja!");
    return;
  }

  const change = payment - calc.total;
  let message = `Transaksi Berhasil!\n\n`;
  message += `Total Belanja: ${formatRupiah(calc.total)}\n`;
  message += `Bayar: ${formatRupiah(payment)}\n`;
  message += `Kembalian: ${formatRupiah(change)}\n\n`;
  message += `Kasir: ${currentUser ? currentUser.name : "Unknown"} (${currentUser ? currentUser.role : ""})\n`;
  message += `Status: ${isMember ? "Member" : "Non Member"}\n`;
  if (calc.qtyDiscount > 0)
    message += `Diskon Quantity: ${formatRupiah(calc.qtyDiscount)}\n`;
  if (calc.memberDiscount > 0)
    message += `Diskon Member: ${formatRupiah(calc.memberDiscount)}\n`;
  if (calc.shoppingDiscount > 0)
    message += `Diskon Belanja: ${formatRupiah(calc.shoppingDiscount)}\n`;

  alert(message);

  cart = [];
  document.getElementById("paymentInput").value = "";
  renderCart();
}

document.addEventListener("click", function (e) {
  const filterDropdown = document.getElementById("filterDropdown");
  const filterBtn = e.target.closest("button");

  if (
    filterDropdown &&
    !filterDropdown.classList.contains("hidden") &&
    (!filterBtn ||
      !filterBtn.onclick ||
      !filterBtn.onclick.toString().includes("toggleFilterDropdown"))
  ) {
    if (!filterDropdown.contains(e.target)) {
      filterDropdown.classList.add("hidden");
    }
  }
});

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const search = e.target.value.toLowerCase();
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search),
    );

    if (currentFilters.category) {
      filtered = filtered.filter((p) => p.category === currentFilters.category);
    }
    if (currentFilters.brand) {
      filtered = filtered.filter((p) => p.brand === currentFilters.brand);
    }

    document.getElementById("productCount").textContent = filtered.length;

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div class="col-span-full text-center py-20 text-gray-400"><i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 opacity-20"></i><p>Produk tidak ditemukan</p></div>';
      lucide.createIcons();
      return;
    }

    if (viewMode === "grid") {
      grid.className =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
      grid.innerHTML = filtered
        .map(
          (product) => `
              <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onclick="addToCart(${product.id})">
                <div class="relative overflow-hidden h-40 bg-gray-700">
                  <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">${product.brand}</div>
                  <button class="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                    <i data-lucide="plus" class="w-5 h-5"></i>
                  </button>
                </div>
                <div class="p-4">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-white font-semibold text-lg">${product.name}</h3>
                  </div>
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
    } else {
      grid.className = "space-y-3";
      grid.innerHTML = filtered
        .map(
          (product) => `
              <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex" onclick="addToCart(${product.id})">
                <div class="relative overflow-hidden w-32 h-32 bg-gray-700 flex-shrink-0">
                  <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                  <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">${product.brand}</div>
                </div>
                <div class="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="text-white font-semibold text-lg">${product.name}</h3>
                    </div>
                    <p class="text-gray-400 text-xs mb-2">${product.desc}</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-white font-bold text-lg">${formatRupiah(product.price)}</span>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs">
                        <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                        <span>Stok: ${product.stock}</span>
                      </div>
                      <button class="bg-orange-500 text-white p-2 rounded-full">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `,
        )
        .join("");
    }
    lucide.createIcons();
  });
}
