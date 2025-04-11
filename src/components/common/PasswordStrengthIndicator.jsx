import React, { useState } from "react";

const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState("");

  const evaluateStrength = (password) => {
    let strength = "Weak";
    if (password.length >= 8) {
      strength = "Medium";
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      strength = "Strong";
    }
    setStrength(strength);
  };

  React.useEffect(() => {
    evaluateStrength(password);
  }, [password]);

  return (
    <div>
      <p>Password Strength: <span className={`strength-${strength.toLowerCase()}`}>{strength}</span></p>
      <style jsx>{`
        .strength-weak {
          color: red;
        }
        .strength-medium {
          color: orange;
        }
        .strength-strong {
          color: green;
        }
      `}</style>
    </div>
  );
};

export default PasswordStrengthIndicator;