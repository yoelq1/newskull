const API_PRODUCTS = "/api/products";
const API_ORDERS   = "/api/orders";

const addProductBtn = document.getElementById("addProductBtn");
const pnameInput = document.getElementById("pname");
const ppriceInput = document.getElementById("pprice");
const ordersList = document.getElementById("ordersList");

async function loadOrders() {
  try {
    const res = await fetch(API_ORDERS);
    const orders = await res.json();
    ordersList.innerHTML = "";
    orders.forEach(o => {
      const div = document.createElement("div");
      div.innerHTML = `
        ${o.product.name} - ${o.username} - ${o.phone} - ${o.status}
        <button onclick="updateOrder(${o.id}, 'done')">Done</button>
        <button onclick="updateOrder(${o.id}, 'cancel')">Batal</button>
      `;
      ordersList.appendChild(div);
    });
  } catch(err){ console.error(err); }
}

async function updateOrder(id, status) {
  try {
    await fetch(`${API_ORDERS}?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    loadOrders();
  } catch(err){ console.error(err); }
}

addProductBtn.onclick = async () => {
  const name = pnameInput.value.trim();
  const price = ppriceInput.value.trim();
  if(name && price){
    await fetch(API_PRODUCTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price })
    });
    pnameInput.value = "";
    ppriceInput.value = "";
    alert("Produk ditambahkan!");
  } else {
    alert("Isi nama dan harga produk!");
  }
}

loadOrders();
setInterval(loadOrders, 2000);
