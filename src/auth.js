import CryptoJS from "crypto-js";
import { db } from "./db";

export async function setPin(pin) {
  const hash = CryptoJS.SHA256(pin).toString();
  await db.settings.put({ key: "pin", value: hash });
}

export async function verifyPin(pin) {
  const saved = await db.settings.get("pin");
  if (!saved) return false;
  const hash = CryptoJS.SHA256(pin).toString();
  return saved.value === hash;
}

export async function hasPin() {
  const saved = await db.settings.get("pin");
  return !!saved;
}