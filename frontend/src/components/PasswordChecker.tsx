import { useState } from "react";
import { usePasswordApi } from "../hooks/usePasswordApi";

const scoreColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];
const scoreWidths = ["20%", "40%", "60%", "80%", "100%"];

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const { checkResult, loading, error, check } = usePasswordApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    check(val);
  };

  return (
    <div className="card">
      <h2>🔍 Provjera lozinke</h2>

      <input
        type="text"
        placeholder="Unesite lozinku..."
        value={password}
        onChange={handleChange}
        className="input"
        minLength={1}
        maxLength={128}
      />

      {loading && <p className="hint">Provjeravam...</p>}
      {error && <p className="error">{error}</p>}

      {checkResult && !loading && (
        <div className="result">
          <div className="strength-bar-bg">
            <div
              className="strength-bar"
              style={{
                width: scoreWidths[checkResult.score],
                backgroundColor: scoreColors[checkResult.score],
              }}
            />
          </div>
          <p className="label" style={{ color: scoreColors[checkResult.score] }}>
            Jačina: <strong>{checkResult.label}</strong>
          </p>

          {checkResult.suggestions.length > 0 && (
            <ul className="suggestions">
              {checkResult.suggestions.map((s, i) => (
                <li key={i}>💡 {s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
