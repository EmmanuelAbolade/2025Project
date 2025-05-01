
// src/components/AdminRecommendations.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Card, Container, Form, Spinner } from "react-bootstrap";
import { db, storage } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CloudinaryUpload from "./CloudinaryUpload";

const AdminRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Current Recommendation structure
  const [currentRec, setCurrentRec] = useState({
    id: "",
    name: "",
    url: "",
    image: "",
    location: "",
    map: "",
    services: "",
    contacts: "",
    hours: ""
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recSnapshot = await getDocs(collection(db, "recommendations"));
      const recData = recSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecommendations(recData);
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  // Function to open the modal.
  const handleOpenModal = (rec = null) => {
    if (rec) {
      setEditMode(true);
      setCurrentRec(rec);
    } else {
      setEditMode(false);
      setCurrentRec({
        id: "",
        name: "",
        url: "",
        image: "",
        location: "",
        map: "",
        services: "",
        contacts: "",
        hours: ""
      });
    }
    setShowModal(true);
  };

  // Function to close the modal.
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to simulate saving the recommendation.
  const handleSubmitRecommendation = async () => {
    try {
      if (editMode && currentRec.id) {
        const recRef = doc(db, "recommendations", currentRec.id);
        await updateDoc(recRef, {
          name: currentRec.name,
          url: currentRec.url,
          image: currentRec.image,
          location: currentRec.location,
          map: currentRec.map,
          services: currentRec.services,
          contacts: currentRec.contacts,
          hours: currentRec.hours
        });
        setRecommendations(recommendations.map(rec => rec.id === currentRec.id ? currentRec : rec));
        alert("Recommendation updated successfully.");
      } else {
        const docRef = await addDoc(collection(db, "recommendations"), {
          name: currentRec.name,
          url: currentRec.url,
          image: currentRec.image,
          location: currentRec.location,
          map: currentRec.map,
          services: currentRec.services,
          contacts: currentRec.contacts,
          hours: currentRec.hours
        });
        setRecommendations([...recommendations, { id: docRef.id, ...currentRec }]);
        alert("Recommendation added successfully.");
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving recommendation:", error);
    }
  };

  const handleDeleteRecommendation = async (id) => {
    if (window.confirm("Are you sure you want to delete this recommendation?")) {
      await deleteDoc(doc(db, "recommendations", id));
      setRecommendations(recommendations.filter(rec => rec.id !== id));
      alert("Recommendation deleted successfully.");
    }
  };


  // Handle file input change for image upload.
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const storage = getStorage();
    // Create a unique file path using the current timestamp and file name.
    const storageRef = ref(storage, `recommendationImages/${Date.now()}-${file.name}`);
    try {

      // Create a unique file path using the current timestamp and file name.
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setCurrentRec(prev => ({ ...prev, image: downloadURL }));
      console.log("Image uploaded, URL:", downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setUploadingImage(false);
  };

  if (loading) return <p>Loading recommendations...</p>;

  return (
    <Container fluid className="mt-4">
      <h2 className="text-start fw-bold text-primary">📌 Recommendations Management</h2>
  
      {/* Add Recommendation Button */}
      <Card className="shadow-lg border border-3 border-dark rounded p-4 mb-3">
        <Button variant="primary fw-bold w-100" onClick={() => handleOpenModal()}>
          ➕ Add Recommendation
        </Button>
      </Card>
  
      {/* Recommendation Table */}
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <Table striped bordered hover responsive className="text-center">
          <thead className="bg-primary text-white">
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Image</th>
              <th>Location</th>
              <th>Map</th>
              <th>Services</th>
              <th>Contacts</th>
              <th>Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <tr key={rec.id}>
                <td>{rec.name}</td>
                <td><a href={rec.url} target="_blank" rel="noopener noreferrer">{rec.url}</a></td>
                <td>
                  {rec.image ? (
                    <img src={rec.image} alt={rec.name} className="rounded shadow-sm" style={{ width: "100px" }} />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>
                <td>{rec.location}</td>
                <td>{rec.map}</td>
                <td>{rec.services}</td>
                <td>{rec.contacts}</td>
                <td>{rec.hours}</td>
                <td>
                  <Button variant="info fw-bold shadow-sm me-2" onClick={() => handleOpenModal(rec)}>
                    ✏ Edit
                  </Button>
                  <Button variant="danger fw-bold shadow-sm" onClick={() => handleDeleteRecommendation(rec.id)}>
                    🗑 Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
  
      {/* Modal for adding/updating recommendation */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-primary">
            {editMode ? "✏ Edit Recommendation" : "➕ Add Recommendation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📌 Name</Form.Label>
              <Form.Control
                type="text"
                value={currentRec.name}
                onChange={(e) => setCurrentRec({ ...currentRec, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🔗 URL</Form.Label>
              <Form.Control
                type="text"
                value={currentRec.url}
                onChange={(e) => setCurrentRec({ ...currentRec, url: e.target.value })}
              />
            </Form.Group>
            {/* Cloudinary Upload for Image */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📸 Upload Image</Form.Label>
              <CloudinaryUpload
                onUploadComplete={(url) => setCurrentRec((prev) => ({ ...prev, image: url }))}
              />
              {currentRec.image && (
                <div className="mt-2">
                  <img src={currentRec.image} alt="Preview" className="rounded shadow-sm" style={{ width: "100px" }} />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📍 Location</Form.Label>
              <Form.Control
                type="text"
                value={currentRec.location}
                onChange={(e) => setCurrentRec({ ...currentRec, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🗺 Map</Form.Label>
              <Form.Control
                type="text"
                value={currentRec.map}
                onChange={(e) => setCurrentRec({ ...currentRec, map: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🛠 Services/Products</Form.Label>
              <Form.Control
                type="text"
                value={currentRec.services}
                onChange={(e) => setCurrentRec({ ...currentRec, services: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">📞 Contacts</Form.Label>
              <Form.Control
                type="text"
                value={currentRec.contacts}
                onChange={(e) => setCurrentRec({ ...currentRec, contacts: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🕰 Hours</Form.Label>
              <Form.Control
                type="text"
                value={currentRec.hours}
                onChange={(e) => setCurrentRec({ ...currentRec, hours: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary fw-bold" onClick={handleCloseModal}>
            ❌ Cancel
          </Button>
          <Button variant="primary fw-bold" onClick={handleSubmitRecommendation}>
            {editMode ? "✅ Update" : "➕ Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
  
};

export default AdminRecommendations;