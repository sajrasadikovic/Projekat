import PasswordChecker from "./components/PasswordChecker.tsx";
import PasswordGenerator from "./components/PasswordGenerator.tsx";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 Password Manager</h1>
        <p>Provjeri jačinu ili generiši sigurnu lozinku</p>
      </header>
      <main className="app-main">
        <PasswordChecker />
        <PasswordGenerator />
      </main>
    </div>
  );
}
