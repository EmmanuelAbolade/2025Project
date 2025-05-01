import { db } from "../firebase/firebaseConfig";
import { getDocs, collection, query, where, addDoc } from "firebase/firestore";

export const populateStaffProfiles = async () => {
  try {
    // Fetch all users from the `users` collection
    const usersSnapshot = await getDocs(collection(db, "users"));

    // Fetch existing staff members in `StaffProfiles`
    const staffProfilesSnapshot = await getDocs(collection(db, "StaffProfiles"));
    const existingStaffIds = staffProfilesSnapshot.docs.map((doc) => doc.data().id); // Collect all existing IDs

    // Filter users with role "staff" and add them only if they don't exist in `StaffProfiles`
    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      if (userData.role === "staff" && !existingStaffIds.includes(userDoc.id)) {
        await addDoc(collection(db, "StaffProfiles"), {
          id: userDoc.id, // Use the user's Firestore document ID
          name: userData.name, // Use the name from `users`
          role: userData.bio || "Housekeeping", // Optional: Use job role (if stored as `bio`, otherwise default to "Housekeeping")
        });
        console.log(`Added staff: ${userData.name}`);
      }
    });

    console.log("StaffProfiles populated successfully without duplicates!");
  } catch (error) {
    console.error("Error populating StaffProfiles:", error);
  }
};
