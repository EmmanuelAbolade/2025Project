// CloudinaryUpload.jsx
import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";

const CloudinaryUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (!file) return;

    setUploading(true);

    // Create a FormData object for the upload
    const formData = new FormData();
    formData.append("file", file);
    
    // Append your unsigned upload preset name
    formData.append("upload_preset", "unsigned_preset"); // Replacing with your preset name

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dpnpqw37p/image/upload", // Replacing with your cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Uploaded image URL:", data.secure_url);
      // Pass the uploaded image URL back to the parent component
      onUploadComplete(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    
    setUploading(false);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label>Image</Form.Label>
      <Form.Control type="file" onChange={handleImageUpload} />
      {uploading && <Spinner animation="border" size="sm" className="mt-2" />}
    </Form.Group>
  );
};

export default CloudinaryUpload;
