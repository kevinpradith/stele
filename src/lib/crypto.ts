// ─── Caesar Cipher ───────────────────────────────────────────
export function caesarEncrypt(text: string, shift: number): string {
  if (!Number.isFinite(shift)) shift = 0;
  shift = ((shift % 26) + 26) % 26;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });
}
export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, -shift);
}

// ─── Vigenère Cipher ─────────────────────────────────────────
export function vigenereEncrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toLowerCase().replace(/[^a-z]/g, '');
  if (!k.length) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    const shift = k[ki++ % k.length].charCodeAt(0) - 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });
}
export function vigenereDecrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toLowerCase().replace(/[^a-z]/g, '');
  if (!k.length) return text;
  let ki = 0;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    const shift = k[ki++ % k.length].charCodeAt(0) - 97;
    return String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
  });
}

// ─── ROT13 ───────────────────────────────────────────────────
export function rot13(text: string): string {
  return caesarEncrypt(text, 13);
}

// ─── Atbash ──────────────────────────────────────────────────
export function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base));
  });
}

// ─── XOR Cipher ──────────────────────────────────────────────
// Encrypt → text XOR key → hex pairs
// Decrypt → hex pairs XOR key → text
export function xorEncrypt(text: string, key: string): string {
  if (!key) return text;
  return Array.from(text)
    .map((c, i) =>
      (c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        .toString(16)
        .padStart(2, '0'),
    )
    .join(' ');
}
export function xorDecrypt(hexText: string, key: string): string {
  if (!key) return hexText;
  const bytes = hexText.trim().split(/\s+/).filter(Boolean);
  if (bytes.length === 0) return '';
  const out: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    const h = bytes[i];
    if (!/^[0-9a-fA-F]{2}$/.test(h)) return 'Invalid XOR hex input';
    const byte = parseInt(h, 16);
    out.push(String.fromCharCode(byte ^ key.charCodeAt(i % key.length)));
  }
  return out.join('');
}

// ─── Base64 ──────────────────────────────────────────────────
export function base64Encode(text: string): string {
  try {
    // UTF-8 safe encoding
    return btoa(
      encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1: string) =>
        String.fromCharCode(parseInt(p1, 16)),
      ),
    );
  } catch {
    return 'Invalid input';
  }
}
export function base64Decode(text: string): string {
  try {
    return decodeURIComponent(
      Array.from(atob(text.trim()))
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
  } catch {
    return 'Invalid Base64';
  }
}

// ─── Hex ─────────────────────────────────────────────────────
export function textToHex(text: string): string {
  return Array.from(text)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ');
}
export function hexToText(hex: string): string {
  try {
    const compact = hex.replace(/\s+/g, '');
    if (!compact.length) return '';
    if (compact.length % 2 !== 0) return 'Invalid hex';
    if (!/^[0-9a-fA-F]+$/.test(compact)) return 'Invalid hex';
    const pairs = compact.match(/.{2}/g) ?? [];
    return pairs.map((h) => String.fromCharCode(parseInt(h, 16))).join('');
  } catch {
    return 'Invalid hex';
  }
}

// ─── Binary ──────────────────────────────────────────────────
export function textToBinary(text: string): string {
  return Array.from(text)
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}
export function binaryToText(bin: string): string {
  try {
    const compact = bin.replace(/\s+/g, '');
    if (!compact.length) return '';
    if (!/^[01]+$/.test(compact)) return 'Invalid binary';
    if (compact.length % 8 !== 0) return 'Invalid binary';
    const chunks = compact.match(/.{8}/g) ?? [];
    return chunks.map((b) => String.fromCharCode(parseInt(b, 2))).join('');
  } catch {
    return 'Invalid binary';
  }
}

// ─── Morse Code ──────────────────────────────────────────────
const MORSE: Readonly<Record<string, string>> = {
  A: '.-',   B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.',  H: '....', I: '..',   J: '.---', K: '-.-', L: '.-..',
  M: '--',   N: '-.',   O: '---',  P: '.--.',  Q: '--.-', R: '.-.',
  S: '...',  T: '-',    U: '..-',  V: '...-',  W: '.--',  X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
  '/': '-..-.', '@': '.--.-.', '&': '.-...', ':': '---...',
} as const;

const MORSE_REV: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k]),
);

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((c) => (c === ' ' ? '/' : (MORSE[c] ?? '?')))
    .join(' ');
}
export function morseToText(morse: string): string {
  const trimmed = morse.trim();
  if (!trimmed) return '';
  /* Word breaks: output uses " / "; also accept "/" without extra spaces (pasted text). */
  return trimmed
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((code) => MORSE_REV[code] ?? '?')
        .join(''),
    )
    .join(' ');
}

// ─── URL Encoding ────────────────────────────────────────────
export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}
export function urlDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    return 'Invalid URL Encoding';
  }
}

// ─── A1Z26 Cipher ────────────────────────────────────────────
export function a1z26Encrypt(text: string): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z ]/g, '')
    .split(/\s+/)
    .map(word => Array.from(word).map(c => c.charCodeAt(0) - 64).join('-'))
    .join(' ');
}
export function a1z26Decrypt(text: string): string {
  try {
    const compact = text.trim();
    if (!compact) return '';
    return compact
      .split(/\s+/)
      .map(word => 
        word.split('-')
          .filter(n => n.trim() !== '')
          .map(n => {
            const num = parseInt(n, 10);
            if (num < 1 || num > 26 || isNaN(num)) throw new Error();
            return String.fromCharCode(num + 64);
          })
          .join('')
      )
      .join(' ');
  } catch {
    return 'Invalid A1Z26 Input';
  }
}

// ─── Reverse ─────────────────────────────────────────────────
export function reverseText(text: string): string {
  return Array.from(text).reverse().join('');
}

// ─── Stelegraphy (Custom Symmetric Cipher) ───────────────────
// A synchronous block cipher tailored for browser use and demonstration.
// Uses custom PKCS7, KDF (LCG), S-Box array mutation, and dynamic rotations.

const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const RUNE_CHARS = "ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛌᛍᛎᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟ";

function b64ToRunes(b64: string): string {
  return b64.replace(/./g, char => {
    if (char === '=') return '᛫';
    const idx = B64_CHARS.indexOf(char);
    return idx >= 0 ? RUNE_CHARS[idx] : char;
  });
}

function runesToB64(runes: string): string {
  return Array.from(runes.trim()).map(char => {
    if (char === '᛫') return '=';
    const idx = RUNE_CHARS.indexOf(char);
    return idx >= 0 ? B64_CHARS[idx] : char;
  }).join('');
}
class Stelegraphy {
  private masterKey: Uint8Array;
  private sbox: number[];
  private invSbox: number[];
  private readonly BLOCK_SIZE = 8;

  constructor(key: string) {
    if (!key) key = "stele";
    // 1. KDF: Derive 32 bytes deterministically from string key
    this.masterKey = new Uint8Array(32);
    let hash = 0x811c9dc5;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    let seed = hash;
    for (let i = 0; i < 32; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      this.masterKey[i] = seed & 0xff;
    }

    // 2. Dynamic S-Box Generation (RC4 KSA-style)
    this.sbox = Array.from({ length: 256 }, (_, i) => i);
    let j = 0;
    for (let i = 0; i < 256; i++) {
      j = (j + this.sbox[i] + this.masterKey[i % 32]) % 256;
      [this.sbox[i], this.sbox[j]] = [this.sbox[j], this.sbox[i]];
    }

    // 3. Inverse S-Box
    this.invSbox = new Array(256).fill(0);
    for (let i = 0; i < 256; i++) {
      this.invSbox[this.sbox[i]] = i;
    }
  }

  private pad(data: Uint8Array): Uint8Array {
    const padLen = this.BLOCK_SIZE - (data.length % this.BLOCK_SIZE);
    const padded = new Uint8Array(data.length + padLen);
    padded.set(data);
    padded.fill(padLen, data.length);
    return padded;
  }

  private unpad(data: Uint8Array): Uint8Array {
    if (data.length === 0) return data;
    const padLen = data[data.length - 1];
    return data.slice(0, data.length - padLen);
  }

  encrypt(plaintext: string): string {
    const data = this.pad(new TextEncoder().encode(plaintext));
    
    // 4. Random IV per encryption
    const iv = new Uint8Array(this.BLOCK_SIZE);
    crypto.getRandomValues(iv); // secure sync random
    
    const ciphertext = new Uint8Array(iv.length + data.length);
    ciphertext.set(iv, 0);
    
    let prevBlock = new Uint8Array(iv);
    
    for (let b = 0; b < data.length; b += this.BLOCK_SIZE) {
      const block = data.slice(b, b + this.BLOCK_SIZE);
      
      // 5. CBC XOR
      for (let i = 0; i < this.BLOCK_SIZE; i++) block[i] ^= prevBlock[i];
      
      // 6. SPN (3 Rounds)
      for (let round = 0; round < 3; round++) {
        // A. SubBytes
        for (let i = 0; i < this.BLOCK_SIZE; i++) block[i] = this.sbox[block[i]];
        
        // B. Dynamic Permutation (Rotate Left)
        const sum = block.reduce((a, b) => a + b, 0);
        const shift = sum % this.BLOCK_SIZE;
        const rotated = new Uint8Array(this.BLOCK_SIZE);
        rotated.set(block.slice(shift), 0);
        rotated.set(block.slice(0, shift), this.BLOCK_SIZE - shift);
        for(let i=0; i<this.BLOCK_SIZE; i++) block[i] = rotated[i];
        
        // C. Key Mixing Mask
        for (let i = 0; i < this.BLOCK_SIZE; i++) {
          const keyByte = this.masterKey[(b + round + i) % 32];
          block[i] ^= keyByte;
        }
      }
      
      ciphertext.set(block, iv.length + b);
      prevBlock = new Uint8Array(block);
    }
    
    const b64 = btoa(String.fromCharCode(...ciphertext));
    return b64ToRunes(b64);
  }

  decrypt(runesStr: string): string {
    const b64 = runesToB64(runesStr);
    const binStr = atob(b64);
    const data = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) data[i] = binStr.charCodeAt(i);
    
    if (data.length < this.BLOCK_SIZE || data.length % this.BLOCK_SIZE !== 0) {
      throw new Error("Teks sandi bukan berasal dari Stelegraphy");
    }
    
    const iv = data.slice(0, this.BLOCK_SIZE);
    const ciphertext = data.slice(this.BLOCK_SIZE);
    const plaintext = new Uint8Array(ciphertext.length);
    
    let prevBlock = new Uint8Array(iv);
    
    for (let b = 0; b < ciphertext.length; b += this.BLOCK_SIZE) {
      const cBlock = ciphertext.slice(b, b + this.BLOCK_SIZE);
      const block = new Uint8Array(cBlock);
      
      // Reverse 3 Rounds
      for (let round = 2; round >= 0; round--) {
        // C. Inv Key Mixing Mask
        for (let i = 0; i < this.BLOCK_SIZE; i++) {
          const keyByte = this.masterKey[(b + round + i) % 32];
          block[i] ^= keyByte;
        }
        
        // B. Inv Dynamic Permutation (Rotate Right)
        const sum = block.reduce((a, b) => a + b, 0);
        const shift = sum % this.BLOCK_SIZE;
        const rotated = new Uint8Array(this.BLOCK_SIZE);
        if (shift > 0) {
          rotated.set(block.slice(-shift), 0);
          rotated.set(block.slice(0, -shift), shift);
          for(let i=0; i<this.BLOCK_SIZE; i++) block[i] = rotated[i];
        } else {
          for(let i=0; i<this.BLOCK_SIZE; i++) block[i] = block[i]; // No-op
        }
        
        // A. Inv SubBytes
        for (let i = 0; i < this.BLOCK_SIZE; i++) {
          block[i] = this.invSbox[block[i]];
        }
      }
      
      // Inv CBC
      for (let i = 0; i < this.BLOCK_SIZE; i++) {
        block[i] ^= prevBlock[i];
      }
      
      plaintext.set(block, b);
      prevBlock = cBlock;
    }
    
    return new TextDecoder().decode(this.unpad(plaintext));
  }
}

export function stelegraphyEncrypt(text: string, key: string): string {
  if (!text) return '';
  try {
    return new Stelegraphy(key).encrypt(text);
  } catch (err) {
    return `Encryption Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

export function stelegraphyDecrypt(text: string, key: string): string {
  if (!text) return '';
  try {
    return new Stelegraphy(key).decrypt(text);
  } catch (err) {
    return `Decryption Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}
