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
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  const errorDiv = document.getElementById("loginError");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");
  const btnIcon = document.getElementById("btnIcon");

  btnText.textContent = "Memproses...";
  btnLoader.classList.remove("hidden");
  btnIcon.classList.add("hidden");

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

      showMainApp(user);
    } else {
      errorDiv.classList.remove("hidden");
      btnText.textContent = "Masuk";
      btnLoader.classList.add("hidden");
      btnIcon.classList.remove("hidden");

      errorDiv.parentElement.classList.add("animate-bounce-in");
      setTimeout(() => {
        errorDiv.parentElement.classList.remove("animate-bounce-in");
      }, 600);
    }
  }, 1000);
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
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.setAttribute("data-lucide", "eye-off");
  } else {
    passwordInput.type = "password";
    eyeIcon.setAttribute("data-lucide", "eye");
  }
  lucide.createIcons();

  eyeIcon.parentElement.classList.add("animate-bounce-in");
  setTimeout(() => {
    eyeIcon.parentElement.classList.remove("animate-bounce-in");
  }, 600);
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
  document.getElementById("floatingCartButton").classList.remove("hidden");
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
      "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/70b9b3976e974dc8bd58e113a538477b_9366/Y-3_Stripes_Socks_Brown_KT3230_01_00_standard.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/1878821/pexels-photo-1878821.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/bivbbt0saypjw0mimm9x/U+NK+EVERYDAY+LTWT+CREW+3PR.png?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    id: 13,
    name: "Sepatu Vans",
    category: "Sepatu",
    brand: "Vans",
    desc: "Vans Old Skool Classic Black",
    price: 180000,
    stock: 15,
    image:
      "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    id: 14,
    name: "Baju Under Armour",
    category: "Baju",
    brand: "Under Armour",
    desc: "Kaos compression Under Armour",
    price: 65000,
    stock: 25,
    image:
      "https://i.pinimg.com/736x/06/31/47/063147912776b12dddb43251f93d5c46.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    id: 15,
    name: "Celana Dickies",
    category: "Celana",
    brand: "Dickies",
    desc: "Celana kerja Dickies 874 original",
    price: 120000,
    stock: 30,
    image:
      "https://dickies.co.id/odext/web/content/product.template/256761/image_1920/img_product_256761.png?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    id: 16,
    name: "Sepatu New Balance",
    category: "Sepatu",
    brand: "New Balance",
    desc: "Sepatu lifestyle New Balance 574",
    price: 220000,
    stock: 12,
    image:
      "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    id: 17,
    name: "Topi New Era",
    category: "Topi",
    brand: "New Era",
    desc: "Topi MLB New York Yankees",
    price: 45000,
    stock: 20,
    image:
      "https://images.pexels.com/photos/844867/pexels-photo-844867.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  {
    id: 18,
    name: "Kaos Kaki Vans",
    category: "Kaos Kaki",
    brand: "Vans",
    desc: "Kaos kaki Vans Checkboard",
    price: 18000,
    stock: 50,
    image:
      "https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
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
  const sidebar = document.getElementById("cartSidebar");
  const mainContent = document.getElementById("mainContent");
  const floatingCartButton = document.getElementById("floatingCartButton");

  if (cartOpen) {
    sidebar.classList.remove("hidden");
    sidebar.classList.add("flex");
    sidebar.classList.remove("slide-out-left");
    sidebar.classList.add("slide-in-right");
    mainContent.classList.add("lg:mr-[420px]");
    floatingCartButton.classList.add("hidden");
  } else {
    sidebar.classList.remove("slide-in-right");
    sidebar.classList.add("slide-out-left");
    setTimeout(() => {
      sidebar.classList.add("hidden");
      sidebar.classList.remove("flex");
    }, 300);
    mainContent.classList.remove("lg:mr-[420px]");
    floatingCartButton.classList.remove("hidden");
  }
}

function toggleFilterDropdown() {
  const dropdown = document.getElementById("filterDropdown");
  dropdown.classList.toggle("hidden");

  if (!dropdown.classList.contains("hidden")) {
    dropdown.classList.add("animate-scale-in");
  }
}

function setViewMode(mode) {
  viewMode = mode;
  document.getElementById("gridBtn").className =
    mode === "grid"
      ? "p-1.5 bg-white rounded shadow-sm text-gray-800 transition-all-smooth animate-scale-in"
      : "p-1.5 text-gray-500 hover:text-gray-800 transition-all-smooth";
  document.getElementById("listBtn").className =
    mode === "list"
      ? "p-1.5 bg-white rounded shadow-sm text-gray-800 transition-all-smooth animate-scale-in"
      : "p-1.5 text-gray-500 hover:text-gray-800 transition-all-smooth";
  renderProducts();
}

function applyFilters() {
  currentFilters.category = document.getElementById("categoryFilter").value;
  currentFilters.brand = document.getElementById("brandFilter").value;
  renderProducts();

  const productGrid = document.getElementById("productGrid");
  productGrid.classList.add("animate-fade-in");
  setTimeout(() => {
    productGrid.classList.remove("animate-fade-in");
  }, 500);
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
    if (benefitSidebar) {
      benefitSidebar.style.display = "block";
      benefitSidebar.classList.add("animate-fade-in");
    }
  } else {
    toggleSidebar?.classList.remove("bg-orange-500");
    toggleSidebar?.classList.add("bg-gray-300");
    knobSidebar?.classList.remove("translate-x-6");
    knobSidebar?.classList.add("translate-x-1");
    if (statusTextSidebar) statusTextSidebar.textContent = "Non Member";
    if (benefitSidebar) {
      benefitSidebar.style.display = "none";
      benefitSidebar.classList.remove("animate-fade-in");
    }
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
      '<div class="col-span-full text-center py-20 text-gray-400 animate-fade-in"><i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 opacity-20 animate-float"></i><p>Produk tidak ditemukan</p></div>';
    lucide.createIcons();
    document.getElementById("productCount").textContent = 0;
    return;
  }

  document.getElementById("productCount").textContent = filtered.length;

  if (viewMode === "grid") {
    grid.className =
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in";
    grid.innerHTML = filtered
      .map(
        (product, index) => `
            <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all-smooth hover-lift cursor-pointer animate-fade-in-up" style="animation-delay: ${index * 50}ms" onclick="addToCart(${product.id})">
              <div class="relative overflow-hidden h-40 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform-smooth duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity-smooth duration-500"></div>
                <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full transition-transform-smooth group-hover:scale-105">
                  ${product.brand}
                </div>
                <button class="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all-smooth duration-300 shadow-lg hover-glow">
                  <i data-lucide="plus" class="w-5 h-5"></i>
                </button>
              </div>
              <div class="p-4">
                <div class="flex justify-between items-start mb-1">
                  <h3 class="text-white font-semibold text-lg mb-1 group-hover:text-orange-300 transition-colors">${product.name}</h3>
                </div>
                <p class="text-gray-400 text-xs mb-3 line-clamp-2">${product.desc}</p>
                <div class="flex items-center justify-between">
                  <span class="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">${formatRupiah(product.price)}</span>
                  <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs font-semibold group-hover:bg-orange-500/30 transition-all-smooth">
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
    grid.className = "space-y-3 animate-fade-in";
    grid.innerHTML = filtered
      .map(
        (product, index) => `
            <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all-smooth cursor-pointer flex animate-fade-in-up" style="animation-delay: ${index * 50}ms" onclick="addToCart(${product.id})">
              <div class="relative overflow-hidden w-32 h-32 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer flex-shrink-0">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform-smooth duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity-smooth duration-500"></div>
                <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full transition-transform-smooth group-hover:scale-105">
                  ${product.brand}
                </div>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-white font-semibold text-lg mb-1 group-hover:text-orange-300 transition-colors">${product.name}</h3>
                  </div>
                  <p class="text-gray-400 text-xs mb-2 line-clamp-2">${product.desc}</p>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">${formatRupiah(product.price)}</span>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs font-semibold group-hover:bg-orange-500/30 transition-all-smooth">
                      <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                      <span>Stok: ${product.stock}</span>
                    </div>
                    <button class="bg-orange-500 text-white p-2 rounded-full shadow-lg hover-glow transition-all-smooth">
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
            <div class="flex flex-col items-center justify-center h-full text-gray-400 animate-fade-in">
              <i data-lucide="shopping-bag" class="w-16 h-16 mb-2 opacity-20 animate-float"></i>
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
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3 animate-fade-in-up hover:shadow-md transition-all-smooth group hover-lift" style="animation-delay: ${index * 50}ms">
            <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0 mt-1 transition-transform-smooth group-hover:scale-105">
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h4 class="font-semibold text-gray-800 text-sm leading-tight break-words group-hover:text-orange-600 transition-colors">${item.name}</h4>
                  <p class="text-xs text-gray-400">${item.brand}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all-smooth flex-shrink-0 -mr-1 -mt-1 animate-fade-in animation-delay-${index * 50}" title="Hapus item">
                  <i data-lucide="x" class="w-4 h-4"></i>
                </button>
              </div>
              <p class="text-xs text-gray-500 mb-3">${formatRupiah(item.price)} / pcs</p>
              <div class="flex items-center justify-between">
                <span class="font-bold text-orange-600 text-sm transition-all-smooth">${formatRupiah(item.price * item.qty)}</span>
                <div class="flex items-center gap-2 bg-gray-100 rounded-full p-1 group-hover:bg-gray-200 transition-all-smooth">
                  <button onclick="updateQty(${index}, -1)" class="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all-smooth">
                    <i data-lucide="minus" class="w-3 h-3"></i>
                  </button>
                  <input 
                    type="number" 
                    value="${item.qty}" 
                    min="1"
                    max="${item.stock || 999}"
                    onchange="updateQtyManual(${index}, this.value)"
                    onkeyup="if(event.key==='Enter') this.blur()"
                    class="w-10 h-7 text-center text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-0 tabular-nums text-gray-800 transition-all-smooth"
                    style="-moz-appearance: textfield; appearance: textfield;"
                  />
                  <button onclick="updateQty(${index}, 1)" class="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-orange-500 hover:scale-110 transition-all-smooth">
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

  const qtyInput = document.querySelector(
    `#cartItems > div:nth-child(${index + 1}) input[type="number"]`,
  );
  if (qtyInput) {
    qtyInput.classList.add("animate-scale-in");
    setTimeout(() => {
      qtyInput.classList.remove("animate-scale-in");
    }, 300);
  }
}

function removeFromCart(index) {
  const itemDiv = document.querySelector(
    `#cartItems > div:nth-child(${index + 1})`,
  );
  if (itemDiv) {
    itemDiv.classList.add("slide-out-left");
    setTimeout(() => {
      cart.splice(index, 1);
      renderCart();
    }, 300);
  } else {
    cart.splice(index, 1);
    renderCart();
  }
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

  const productCard = event.target.closest(".group");
  if (productCard) {
    productCard.classList.add("animate-bounce-in");
    setTimeout(() => {
      productCard.classList.remove("animate-bounce-in");
    }, 600);
  }
}

function updateCartBadges() {
  const count = cart.length;
  document.getElementById("cartBadge").textContent = count;
  document.getElementById("cartBadgeFloating").textContent = count;

  const badge = document.getElementById("cartBadge");
  const floatingBadge = document.getElementById("cartBadgeFloating");

  badge.classList.add("animate-bounce-in");
  floatingBadge.classList.add("animate-bounce-in");

  setTimeout(() => {
    badge.classList.remove("animate-bounce-in");
    floatingBadge.classList.remove("animate-bounce-in");
  }, 600);
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

  if (elements.subtotal) {
    elements.subtotal.textContent = formatRupiah(calc.subtotal);
    elements.subtotal.parentElement.classList.add("animate-scale-in");
    setTimeout(
      () =>
        elements.subtotal.parentElement.classList.remove("animate-scale-in"),
      300,
    );
  }
  if (elements.total) {
    elements.total.textContent = formatRupiah(calc.total);
    elements.total.classList.add("animate-bounce-in");
    setTimeout(() => elements.total.classList.remove("animate-bounce-in"), 600);
  }
  if (elements.count) elements.count.textContent = totalQty;
  if (elements.qtyDiscount)
    elements.qtyDiscount.textContent = formatRupiah(calc.qtyDiscount);
  if (elements.memberDiscount)
    elements.memberDiscount.textContent = formatRupiah(calc.memberDiscount);
  if (elements.shoppingDiscount)
    elements.shoppingDiscount.textContent = formatRupiah(calc.shoppingDiscount);

  const qtyRow = document.getElementById("qtyDiscountRowSidebar");
  const memberRow = document.getElementById("memberDiscountRowSidebar");
  const shoppingRow = document.getElementById("shoppingDiscountRowSidebar");

  if (calc.qtyDiscount > 0 && qtyRow.style.display === "none") {
    qtyRow.style.display = "flex";
    qtyRow.classList.add("animate-fade-in-up");
  } else if (calc.qtyDiscount === 0) {
    qtyRow.style.display = "none";
  }

  if (calc.memberDiscount > 0 && memberRow.style.display === "none") {
    memberRow.style.display = "flex";
    memberRow.classList.add("animate-fade-in-up");
  } else if (calc.memberDiscount === 0) {
    memberRow.style.display = "none";
  }

  if (calc.shoppingDiscount > 0 && shoppingRow.style.display === "none") {
    shoppingRow.style.display = "flex";
    shoppingRow.classList.add("animate-fade-in-up");
  } else if (calc.shoppingDiscount === 0) {
    shoppingRow.style.display = "none";
  }

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
    changeRow.classList.add("animate-fade-in-up");
    changeAmount.textContent = formatRupiah(change);
    changeAmount.className =
      change >= 0
        ? "font-bold text-green-400 tabular-nums animate-scale-in"
        : "font-bold text-red-400 tabular-nums animate-scale-in";
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

  const paymentBtn = document.querySelector(
    'button[onclick="processPayment()"]',
  );
  paymentBtn.classList.add("animate-bounce-in");

  setTimeout(() => {
    cart = [];
    document.getElementById("paymentInput").value = "";
    renderCart();
    paymentBtn.classList.remove("animate-bounce-in");
  }, 600);
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
      filterDropdown.classList.add("slide-out-left");
      setTimeout(() => {
        filterDropdown.classList.add("hidden");
        filterDropdown.classList.remove("slide-out-left");
      }, 300);
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
        '<div class="col-span-full text-center py-20 text-gray-400 animate-fade-in"><i data-lucide="search-x" class="w-16 h-16 mx-auto mb-4 opacity-20 animate-float"></i><p>Produk tidak ditemukan</p></div>';
      lucide.createIcons();
      return;
    }

    if (viewMode === "grid") {
      grid.className =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in";
      grid.innerHTML = filtered
        .map(
          (product, index) => `
              <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all-smooth hover-lift cursor-pointer animate-fade-in-up" style="animation-delay: ${index * 50}ms" onclick="addToCart(${product.id})">
                <div class="relative overflow-hidden h-40 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer">
                  <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform-smooth duration-500 group-hover:scale-110">
                  <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full transition-transform-smooth group-hover:scale-105">${product.brand}</div>
                  <button class="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all-smooth duration-300 shadow-lg hover-glow">
                    <i data-lucide="plus" class="w-5 h-5"></i>
                  </button>
                </div>
                <div class="p-4">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors">${product.name}</h3>
                  </div>
                  <p class="text-gray-400 text-xs mb-3 line-clamp-2">${product.desc}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">${formatRupiah(product.price)}</span>
                    <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs font-semibold group-hover:bg-orange-500/30 transition-all-smooth">
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
      grid.className = "space-y-3 animate-fade-in";
      grid.innerHTML = filtered
        .map(
          (product, index) => `
              <div class="group bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all-smooth cursor-pointer flex animate-fade-in-up" style="animation-delay: ${index * 50}ms" onclick="addToCart(${product.id})">
                <div class="relative overflow-hidden w-32 h-32 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer flex-shrink-0">
                  <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform-smooth duration-500 group-hover:scale-110">
                  <div class="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full transition-transform-smooth group-hover:scale-105">${product.brand}</div>
                </div>
                <div class="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="text-white font-semibold text-lg group-hover:text-orange-300 transition-colors">${product.name}</h3>
                    </div>
                    <p class="text-gray-400 text-xs mb-2">${product.desc}</p>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">${formatRupiah(product.price)}</span>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-lg text-xs group-hover:bg-orange-500/30 transition-all-smooth">
                        <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                        <span>Stok: ${product.stock}</span>
                      </div>
                      <button class="bg-orange-500 text-white p-2 rounded-full hover-glow transition-all-smooth">
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
