import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const ordersFile = path.join(dataDir, "orders.json");

export default function handler(req, res) {
  const orders = JSON.parse(fs.readFileSync(ordersFile));

  if(req.method === "GET") {
    res.status(200).json(orders);
  } else if(req.method === "POST") {
    const body = JSON.parse(req.body);
    const newOrder = { id: Date.now(), status: "pending", ...body };
    orders.push(newOrder);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.status(200).json(newOrder);
  } else if(req.method === "PATCH") {
    const body = JSON.parse(req.body);
    const order = orders.find(o => o.id == req.query.id);
    if(order){
      Object.assign(order, body);
      fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
