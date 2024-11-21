import * as CryptoJS from 'crypto-js';
import { SHARED_ENCRYPTION_DECRPTION_PASSWORD } from '../constants';

const ITERATIONS = 1000; // Number of iterations for PBKDF2
const KEY_LENGTH = 256 / 32; // AES-256 requires a 256-bit key (32 bytes)
const SALT_SIZE = 16; // Salt size in bytes

// Function to generate a random salt
const generateSalt = () => CryptoJS.lib.WordArray.random(SALT_SIZE).toString(CryptoJS.enc.Hex);

const deriveKey = (password: string, salt: string) =>
  CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: KEY_LENGTH,
    iterations: ITERATIONS,
  });

// Function to encrypt a string
const encryptText = (text: string, password: string = SHARED_ENCRYPTION_DECRPTION_PASSWORD) => {
  const salt = generateSalt(); // Generate a new salt for each encryption
  const key = deriveKey(password, salt);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });

  const encryptedData = {
    salt: salt,
    iv: iv.toString(CryptoJS.enc.Hex),
    ciphertext: encrypted.toString(),
  };

  return JSON.stringify(encryptedData);
};

// Function to decrypt a string
const decryptText = (encryptedData: string, password: string = SHARED_ENCRYPTION_DECRPTION_PASSWORD) => {
  const { salt, iv, ciphertext } = JSON.parse(encryptedData);
  const key = deriveKey(password, salt);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export {encryptText, decryptText}
