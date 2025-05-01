//src\components\homePage\FeedbackCarousel.js
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../../css/style.css"; // ✅ Import Styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ✅ Import FontAwesome
import { faStar } from "@fortawesome/free-solid-svg-icons"; // ✅ Import Star Icon
import { Table, Button, Card, Badge, Alert, Container } from "react-bootstrap";

const FeedbackCarousel = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchApprovedFeedback() {
      try {
        const querySnapshot = await getDocs(collection(db, "approvedFeedbacks"));
        setFeedbacks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    }
    fetchApprovedFeedback();
  }, []);

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      navigation
      className="shadow-lg border border-3 border-dark rounded"
    >
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <SwiperSlide key={feedback.id} className="feedback-slide bg-light p-4 rounded shadow-sm">
            <h3 className="fw-bold text-dark">{feedback.category}</h3>
            <div className="d-flex justify-content-center mt-2">
              {[...Array(feedback.rating)].map((_, index) => (
                <FontAwesomeIcon key={index} icon={faStar} className="star-icon text-warning mx-1" />
              ))}
            </div>
            <p className="text-muted fw-bold mt-3">{feedback.comment}</p>
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide className="bg-light p-4 text-center rounded shadow-sm">
          <p className="text-muted fw-bold">⚠ No feedback available yet.</p>
        </SwiperSlide>
      )}
    </Swiper>
  );
  
};

export default FeedbackCarousel;