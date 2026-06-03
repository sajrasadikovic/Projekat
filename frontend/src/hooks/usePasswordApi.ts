import { useState, useCallback } from "react";
import { checkPassword, generatePassword } from "../services/api";
import type { PasswordCheckResponse, GenerateOptions } from "../types";

export function usePasswordApi() {
  const [checkResult, setCheckResult] = useState<PasswordCheckResponse | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (password: string) => {
    if (!password) {
      setCheckResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await checkPassword(password);
      setCheckResult(result);
    } catch (err) {
      setError("Nije moguće spojiti se na backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = useCallback(async (options: GenerateOptions) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generatePassword(options);
      setGeneratedPassword(result.password);
    } catch (err) {
      setError("Nije moguće generisati lozinku.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkResult, generatedPassword, loading, error, check, generate };
}