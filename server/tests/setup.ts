import { mkdirSync } from "node:fs";

mkdirSync("logs", { recursive: true });
process.env.NODE_ENV = "test";
