// A simplified symmetric cipher tailored for easy explanation.
// It uses a basic XOR operation with the master key, followed by Base64 encoding,
// and finally maps the output directly to Ancient Runes.

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
