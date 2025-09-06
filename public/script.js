const content = document.getElementById("content");

let products = [];
let cart = [];
let history = [];

// Fetch products
async function loadProducts() {
  const res = await fetch("/api/products");
  products = await res.json();
  renderProducts();
}

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

// Cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  alert("Ditambahkan ke keranjang!");
}

// Buy
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

// Buttons
document.getElementById("homeBtn").onclick = loadProducts;

document.getElementById("cartBtn").onclick = () => {
  content.innerHTML = "<h2>Keranjang</h2>";
  cart.forEach(p => {
    const div = document.createElement("div");
    div.textContent = `${p.name} - ${p.price}`;
    content.appendChild(div);
  });
};

document.getElementById("historyBtn").onclick = async () => {
  const res = await fetch("/api/orders");
  const orders = await res.json();
  content.innerHTML = "<h2>History</h2>";
  orders.forEach(o => {
    const div = document.createElement("div");
    div.textContent = `${o.product.name} - ${o.status}`;
    content.appendChild(div);
  });
};

// Initial load
loadProducts();
