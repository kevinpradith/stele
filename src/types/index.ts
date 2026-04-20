// ─── Cipher IDs ──────────────────────────────────────────────
export type CipherId =
  | 'caesar'
  | 'vigenere'
  | 'rot13'
  | 'atbash'
  | 'xor'
  | 'base64'
  | 'hex'
  | 'binary'
  | 'morse'
  | 'url'
  | 'a1z26'
  | 'reverse'
  | 'stelegraphy';

export type Category = 'Classical' | 'Encoding' | 'Custom';

export type Mode = 'encrypt' | 'decrypt';

// ─── Cipher Definition ────────────────────────────────────────
export interface CipherDef {
  readonly id: CipherId;
  readonly label: string;
  readonly category: Category;
  readonly description: string;
  /** ROT-13 and Atbash are self-inverse; no mode toggle shown. */
  readonly symmetric?: boolean;
  readonly needsShift?: boolean;
  readonly needsKey?: boolean;
  readonly keyPlaceholder?: string;
}

// ─── Process Parameters ───────────────────────────────────────
export interface ProcessParams {
  shift: number;
  key: string;
}
