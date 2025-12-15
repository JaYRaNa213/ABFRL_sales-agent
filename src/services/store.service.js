import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storesPath = path.join(__dirname, "../data/stores.json");

const stores = JSON.parse(
    fs.readFileSync(storesPath, "utf-8")
);

export function getStores() {
    return stores;
}

export function getStoreById(storeId) {
    return stores.find(s => s.storeId === storeId);
}
