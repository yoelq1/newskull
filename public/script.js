const content = document.getElementById("content");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || []; // persistent
let history = [];

// Fetch products dari server
async function loadProducts() {
  const res = await fetch("/api/products");
  products = await res.json();
  renderProducts();
}

// Render semua produk
function renderProducts() {
  content.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.price}</p>
      <button onclick="addToCart(${p.id})">Keranjang</button>
      <button onclick="buyProduct(${p.id})">Buy</button>
    `;
    content.appendChild(card);
  });
}

// Tambah produk ke keranjang
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart)); // simpan ke localStorage
  alert("Ditambahkan ke keranjang!");
}

// Buy product
async function buyProduct(id) {
  const product = products.find(p => p.id === id);
  const phone = prompt("Masukkan nomor WhatsApp:");
  const username = prompt("Masukkan username:");
  if(phone && username){
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, phone, username })
    });
    alert("Order berhasil, admin akan menghubungi Anda!");
  }
}

// Render keranjang
function renderCart() {
  content.innerHTML = "<h2>Keranjang</h2>";
  if(cart.length === 0){
    content.innerHTML += "<p>Keranjang kosong</p>";
    return;
  }
  cart.forEach(p => {
    const div = document.createElement("div");
    div.textContent = `${p.name} - ${p.price}`;
    content.appendChild(div);
  });
}

// Render history
async function renderHistory() {
  const res = await fetch("/api/orders");
  const orders = await res.json();
  history = orders;
  content.innerHTML = "<h2>History</h2>";
  orders.forEach(o => {
    const div = document.createElement("div");
    div.textContent = `${o.product.name} - ${o.status}`;
    content.appendChild(div);
  });
}

// Buttons
document.getElementById("homeBtn").onclick = loadProducts;
document.getElementById("cartBtn").onclick = renderCart;
document.getElementById("historyBtn").onclick = renderHistory;

// ===================== Auto-refresh & real-time =====================
// Produk baru muncul otomatis setiap 2 detik
setInterval(loadProducts, 2000);

// History auto-refresh setiap 2 detik
setInterval(() => {
  if(document.getElementById("historyBtn").classList.contains("active")){
    renderHistory();
  }
}, 2000);

// Initial load
loadProducts();
