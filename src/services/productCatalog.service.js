import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, "../data/products.json");

const products = JSON.parse(
  fs.readFileSync(productsPath, "utf-8")
);

export function getAllProducts() {
    return products;
}

export function getProductBySku(sku) {
    return products.find(p => p.sku === sku);
}

export function getProductsByCategory(category) {
  // Case insensitive match
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase() || p.subCategory.toLowerCase() === category.toLowerCase());
}

export function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.subCategory.toLowerCase().includes(lowerQuery) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(lowerQuery)))
    );
}
