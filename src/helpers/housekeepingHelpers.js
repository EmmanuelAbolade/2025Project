//src\helpers\housekeepingHelpers.js


// Helper function to reset form data
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Helper function to validate form inputs
export const validateFormData = (formData) => {
    // Ensure at least one input is provided (checkbox or text field)
    return Object.values(formData).some((value) => value !== false && value !== "");
  };
  
  // Refactored function to extract only the guest-filled data
export const extractFilledData = (formData) => {
  return Object.entries(formData)
    .filter(([key, value]) => {
      if (typeof value === "boolean") return value; // Include only true checkboxes
      if (typeof value === "string") return value.trim() !== ""; // Include only non-empty text fields
      return false;
    })
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});
};

  
  // Helper function to save data to Firestore
  export const saveToFirestore = async (db, collectionName, data) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        status: "Pending" // Set default status
      });
      return true; // Return success
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      return false; // Return failure
    }
  };
  
  
// Reset form data to initial state 
export const resetFormData = () => ({
    linen: false,
    trash: false,
    mop: false,
    sanitize: false,
    toiletries: false,
    towels: false,
    coffee: false,
    furniture: false,
    mirrors: false,
    pestControl: false,
    lightBulb: false,
    unclogDrain: false,
    replaceItem: false,
    securityKeyCard: false,
    inRoomSafe: false,
    lostItem: "",
    extraItem: "",
    suspiciousActivity: "",
    foundItem: "",
    otherRequest: ""
  });
  