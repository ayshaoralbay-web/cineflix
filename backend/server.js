import http from "node:http";
import { json } from "co-body";
import pg from "pg";

const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "0000",
  database: "myapp",
});

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  try {
   
    if (req.method === "GET" && req.url === "/users") {
      const result = await pool.query("SELECT id, name, email, age FROM users ORDER BY id");
      return res.end(JSON.stringify(result.rows));
    }

    
    if (req.method === "POST" && req.url === "/register") {
      const body = await json(req);

      if (!body.name || !body.email || !body.password) {
        res.writeHead(400);
        return res.end(JSON.stringify({ message: "Name, email and password are required" }));
      }

      await pool.query(
        "INSERT INTO users (name, email, age, password) VALUES ($1, $2, $3, $4)", 
        [body.name, body.email, body.age || null, body.password]
      );

      res.writeHead(201);
      return res.end(JSON.stringify({ message: "User created" }));
    }

    
    if (req.method === "POST" && req.url === "/login") {
      const body = await json(req);

      const result = await pool.query(
        "SELECT id FROM users WHERE name = $1 AND password = $2",
        [body.name, body.password]
      );

      if (result.rows.length > 0) {
        return res.end(JSON.stringify({ message: true }));
      }

      res.writeHead(401);
      return res.end(JSON.stringify({ message: false }));
    }

    
    if (req.method === "PUT" && req.url.startsWith("/users/")) {
      const id = req.url.split("/")[2];
      const body = await json(req);

      await pool.query("UPDATE users SET name = $1 WHERE id = $2", [body.name, id]); 
      return res.end(JSON.stringify({ message: "User updated" }));
    }

   
    if (req.method === "DELETE" && req.url.startsWith("/users/")) {
      const id = req.url.split("/")[2];

      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return res.end(JSON.stringify({ message: "User deleted" }));
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ message: "Not Found" }));
  } catch (error) {
    console.log(error);

    
    if (error.code === "23505") {
      res.writeHead(409);
      return res.end(JSON.stringify({ message: "This email is already registered" }));
    }

    res.writeHead(500);
    return res.end(JSON.stringify({ message: "Server error" }));
  }
});

server.listen(5001, () => {
  console.log("Listening on 5001");
});