import { Product, ProductWithoutId } from "../types";
import crypto from "node:crypto";
import readFile from "./readFile";
import writeFile from "./writeFile";

const filename = "./db.json";
let data: Product[] = [];

const fileDb = {
  async init() {
    data = await readFile(filename);
  },

  async getItems() {
    return data;
  },

  async addItem(item: ProductWithoutId) {
    const id = crypto.randomUUID();
    const product = { id, ...item };
    data.push(product);
    await this.save();
    return product;
  },

  async getItemById(id: string) {
    const product = data.find((item) => item.id === id);
    return product || null;
  },
  async updateItem(id: string, updatedData: Partial<ProductWithoutId>) {
    const productIndex = data.findIndex((item) => item.id === id);
    if (productIndex === -1) {
      return null;
    }
    const existingProduct = data[productIndex];
    const updatedProduct = {
      ...existingProduct,
      ...updatedData,
    };
    data[productIndex] = updatedProduct;
    await this.save();

    return updatedProduct;
  },

  async save() {
    await writeFile(filename, data);
  },
};

export default fileDb;
