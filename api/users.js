import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");

export default function handler(req,res){
  if(req.method==="GET"){
    const users = JSON.parse(fs.readFileSync(usersFile));
    res.status(200).json(users);
  } else if(req.method==="POST"){
    const body = JSON.parse(req.body);
    const users = JSON.parse(fs.readFileSync(usersFile));
    const newUser = { id: Date.now(), ...body };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users,null,2));
    res.status(200).json(newUser);
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
