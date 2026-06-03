import { useState } from "react";
import { usePasswordApi } from "../hooks/usePasswordApi";
import type { GenerateOptions } from "../types";

export default function PasswordGenerator() {
  const [options, setOptions] = useState<GenerateOptions>({
    length: 12,
    uppercase: true,
    lowercase: true,
    digits: true,
    specialChars: true,
  });
  const [copied, setCopied] = useState(false);
  const { generatedPassword, loading, error, generate } = usePasswordApi();

  const handleGenerate = () => {
    generate(options);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleOption = (key: keyof Omit<GenerateOptions, "length">) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="card">
      <h2>⚙️ Generator lozinke</h2>

      <div className="slider-row">
        <label>Dužina: <strong>{options.length}</strong></label>
        <input
          type="range"
          min={8}
          max={128}
          value={options.length}
          onChange={(e) => setOptions((prev) => ({ ...prev, length: Number(e.target.value) }))}
          className="slider"
        />
      </div>

      <div className="toggles">
        {(
          [
            { key: "uppercase", label: "Velika slova (A-Z)" },
            { key: "lowercase", label: "Mala slova (a-z)" },
            { key: "digits", label: "Cifre (0-9)" },
            { key: "specialChars", label: "Specijalni znakovi (!@#...)" },
          ] as { key: keyof Omit<GenerateOptions, "length">; label: string }[]
        ).map(({ key, label }) => (
          <label key={key} className="toggle-label">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggleOption(key)}
            />
            {label}
          </label>
        ))}
      </div>

      <button onClick={handleGenerate} className="btn-primary" disabled={loading}>
        {loading ? "Generiše..." : "Generiši"}
      </button>

      {error && <p className="error">{error}</p>}

      {generatedPassword && (
        <div className="generated-box">
          <code className="generated-password">{generatedPassword}</code>
          <button onClick={handleCopy} className="btn-secondary">
            {copied ? "✅ Kopirano!" : "Kopiraj"}
          </button>
        </div>
      )}
    </div>
  );
}
