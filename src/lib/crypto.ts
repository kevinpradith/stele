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
// A simplified symmetric cipher tailored for easy explanation.
// It uses a basic XOR operation with the master key, followed by Base64 encoding,
// and finally maps the output directly to Ancient Runes.
class Stelegraphy {
  private key: string;

  constructor(key: string) {
    this.key = key || "stele";
  }

  encrypt(plaintext: string): string {
    // 1. Encode text ke bytes yang aman (UTF-8)
    const encodedStr = encodeURIComponent(plaintext);

    // 2. Terapkan XOR (Pencampuran pesan dengan password)
    const xored = Array.from(encodedStr).map((char, i) => {
      const charCode = char.charCodeAt(0);
      const keyChar = this.key.charCodeAt(i % this.key.length);
      return String.fromCharCode(charCode ^ keyChar);
    }).join('');
    
    // 3. Ubah ke Base64 agar formatnya konsisten
    const b64 = btoa(xored);

    // 4. Terjemahkan Base64 menjadi karakter Prasasti (Ancient Runes)
    return b64ToRunes(b64);
  }

  decrypt(runesStr: string): string {
    try {
      // 1. Kembalikan Ancient Runes ke bentuk Base64
      const b64 = runesToB64(runesStr);

      // 2. Decode Base64 menjadi string ter-XOR
      const xored = atob(b64);

      // 3. Bongkar XOR dengan kunci password yang sama
      const decodedStr = Array.from(xored).map((char, i) => {
        const charCode = char.charCodeAt(0);
        const keyChar = this.key.charCodeAt(i % this.key.length);
        return String.fromCharCode(charCode ^ keyChar);
      }).join('');
      
      // 4. Decode aman kembali ke pesanan asli
      return decodeURIComponent(decodedStr);
    } catch {
      throw new Error("Teks sandi Runes rusak atau salah password");
    }
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
