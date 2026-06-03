export interface PasswordCheckResponse {
  score: number;   // 0–4
  label: string;   // "Slaba" | "Zadovoljavajuća" | "Dobra" | "Jaka"
  suggestions: string[];
}

export interface PasswordGenerateResponse {
  password: string;
}

export interface GenerateOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  specialChars: boolean;
}