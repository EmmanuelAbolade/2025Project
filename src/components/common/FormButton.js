import React from "react";

export default function FormButton({ text, onClick }) {
  return (
    <button className="btn btn-primary w-100 mt-3" style={{ fontSize: "1.25rem" }} onClick={onClick}>
      {text}
    </button>
  );
}
