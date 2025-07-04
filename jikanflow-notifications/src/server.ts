const express = require("express");               // 👈 CommonJS require
import { Request, Response } from "express";
// Removed manual destructuring of Request and Response to avoid redeclaration error

const app = express();
const PORT = 4001;

app.use(express.json());

/**
 * @param {Request} req
 * @param {Response} res
 */
interface HelloRequest extends Request {}
interface HelloResponse extends Response {}

app.get("/", (req: HelloRequest, res: HelloResponse) => {
  res.send("Hello from CommonJS + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
