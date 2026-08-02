import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

/**
 * Derives a consistent 32-byte key from the ENCRYPTION_KEY environment variable.
 */
const getSecretKey = () => {
  const secret = process.env.ENCRYPTION_KEY || "anand_vihar_google_oauth_fallback_secret_key_32_bytes";
  return crypto.createHash("sha256").update(secret).digest();
};

/**
 * Encrypts cleartext using AES-256-CBC.
 * Returns cipher representation prefixed with the initialization vector (IV).
 */
export const encrypt = (text) => {
  if (!text) return "";
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

/**
 * Decrypts AES-256-CBC cipher representations.
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return "";
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !encrypted) return "";
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err.message);
    return "";
  }
};
