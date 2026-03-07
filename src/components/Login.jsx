import { useState, useEffect } from "react";
import { setPin, verifyPin, hasPin } from "../auth";

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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                      <path d="M10 11v6M14 11v6" />
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
      </div>
    </div>
  );
}
