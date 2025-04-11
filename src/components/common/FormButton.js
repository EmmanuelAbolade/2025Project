import React from "react";

export default function FormButton({ text, onClick }) {
  return (
    <button className="btn btn-primary w-100 mt-3" onClick={onClick}>
      {text}
    </button>
  );
}
