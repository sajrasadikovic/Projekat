import type{ PasswordCheckResponse, PasswordGenerateResponse, GenerateOptions } from "../types";

const BASE_URL = "http://localhost:8080/api/password";

export async function checkPassword(password: string): Promise<PasswordCheckResponse> {
  const response = await fetch(`${BASE_URL}/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error("Greška pri provjeri lozinke.");
  }

  return response.json();
}

export async function generatePassword(options: GenerateOptions): Promise<PasswordGenerateResponse> {
  const { length, uppercase, lowercase, digits, specialChars } = options;

  const params = new URLSearchParams({
    length: String(length),
    uppercase: String(uppercase),
    lowercase: String(lowercase),
    digits: String(digits),
    specialChars: String(specialChars),
  });

  const response = await fetch(`${BASE_URL}/generate?${params.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Greška pri generisanju lozinke.");
  }

  return response.json();
}