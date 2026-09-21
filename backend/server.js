import http from "node:http";
import { json } from "co-body";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dataFile = fileURLToPath(new URL("./data.json", import.meta.url));

function getUsers() {
  return JSON.parse(readFileSync(dataFile, "utf-8"));
}

function saveUsers(users) {
  writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

const server = http.createServer(async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json"); 

if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }


  
  if (req.method === "GET" && req.url === "/users") {
    return res.end(JSON.stringify(getUsers()));
  }




  if (req.method === "POST" && req.url === "/register") { 
    const newUser = await json(req);

    if (!newUser.name || !newUser.email || !newUser.password || !newUser.age) {
      res.writeHead(400);
      return res.end(JSON.stringify({ ok: false, message: "All fields are required" }));
    }

    const users = getUsers();

    if (users.some((user) => user.name === newUser.name)) {
      res.writeHead(409);
      return res.end(JSON.stringify({ ok: false, message: "User already exists" }));
    }

    users.push(newUser);
    saveUsers(users);
    res.writeHead(201);
    return res.end(JSON.stringify({ ok: true }));
  }



  if (req.method === "POST" && req.url === "/login") {
    const loginUser = await json(req);
    const users = getUsers();
    const user = users.find(
      (item) => item.name === loginUser.name && item.password === loginUser.password
    );



    if (user) {
      return res.end(JSON.stringify({ message: true }));
    }



    res.writeHead(401);
    return res.end(JSON.stringify({ message: false }));
  }

  
  res.writeHead(404);
  res.end(JSON.stringify({ message: "Not Found" }));
});

server.on("error", (error) => {
  console.error("Server error:", error.message);
});

server.listen(3000, () => console.log("Listening on 3000"));
