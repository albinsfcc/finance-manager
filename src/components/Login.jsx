import { useState, useEffect } from "react";
import { setPin, verifyPin, hasPin, resetPin } from "../auth";

const PAD_LAYOUT = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, "delete"],
];

export default function Login({ onLogin }) {
  const [pin, setPinInput] = useState("");
  const [createMode, setCreateMode] = useState(false);
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    hasPin().then((exists) => {
      if (!exists) setCreateMode(true);
    });
  }, []);

  useEffect(() => {
    if (pin.length !== 4 || verifying) return;

    const submit = async () => {
      setVerifying(true);
      setError(false);

      if (createMode) {
        await setPin(pin);
        onLogin();
      } else {
        const valid = await verifyPin(pin);
        if (valid) {
          onLogin();
        } else {
          setError(true);
          setPinInput("");
          setTimeout(() => setError(false), 400);
        }
      }
      setVerifying(false);
    };

    submit();
  }, [pin, createMode, onLogin]);

  const handleDigit = (digit) => {
    if (typeof digit === "number" && pin.length < 4) {
      setPinInput((p) => p + digit);
    } else if (digit === "delete") {
      setPinInput((p) => p.slice(0, -1));
    }
  };

  const handleResetPin = async () => {
    await resetPin();
    setPinInput("");
    setCreateMode(true);
    setError(false);
  };

  return (
    <div className="center-screen">
      <div className={`login-card pin-pad-card ${error ? "pin-error" : ""}`}>
        <h2>{createMode ? "Create PIN" : "Enter PIN"}</h2>
        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`pin-dot ${pin.length > i ? "filled" : ""}`}
            />
          ))}
        </div>
        <div className="pin-keypad">
          {PAD_LAYOUT.map((row, rowIdx) => (
            <div key={rowIdx} className="pin-row">
              {row.map((key, colIdx) =>
                key === null ? (
                  <span key={colIdx} className="pin-key pin-key-empty" aria-hidden />
                ) : (
                <button
                  key={colIdx}
                  type="button"
                  className="pin-key"
                  onClick={() => handleDigit(key)}
                  disabled={typeof key === "number" && pin.length >= 4}
                  aria-label={key === "delete" ? "Delete" : key.toString()}
                >
                  {key === "delete" ? (
                    <svg className="pin-delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
        {error && <p className="pin-error-msg">Wrong PIN</p>}
        {!createMode && (
          <button type="button" className="pin-reset-btn" onClick={handleResetPin}>
            Reset PIN
          </button>
        )}
      </div>
    </div>
  );
}
