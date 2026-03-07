import Dexie from "dexie";

export const db = new Dexie("FinanceDB");

db.version(2).stores({
  transactions: "++id, type, amount, name, category, isAsset, date",
  categories: "++id, name",
  settings: "key"
});