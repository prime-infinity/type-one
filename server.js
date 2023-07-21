import express from "express";
const app = express();
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + "/public"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.listen(2000, () => console.log("Visit http://127.0.0.1:2000"));
