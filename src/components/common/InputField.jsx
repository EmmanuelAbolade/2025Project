import React from "react";


//<div className={className}> debugging to replace div in return
const InputField = ({ label, type, value, onChange }) => {
  return (
    <div className="mb-3">
    
      <label className="form-label fw-bold text-secondary">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="form-control"
        required
      />
    </div>
  );
};

export default InputField;
