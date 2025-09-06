import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const productsFile = path.join(dataDir, "products.json");

export default function handler(req, res) {
  if(req.method === "GET") {
    const products = JSON.parse(fs.readFileSync(productsFile));
    res.status(200).json(products);
  } else if(req.method === "POST") {
    const body = JSON.parse(req.body);
    const products = JSON.parse(fs.readFileSync(productsFile));
    const newProduct = { id: Date.now(), ...body };
    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    res.status(200).json(newProduct);
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
