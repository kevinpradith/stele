// ─── Cipher IDs ──────────────────────────────────────────────
export type CipherId = 'stelegraphy';

export type Category = 'Stelegraphy';

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
