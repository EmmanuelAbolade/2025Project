//src\components\home\About.js
// src/components/home/About.js
import React from "react";
import Heading from "../common/Heading";
import { about } from "../data/Data";
import { Link } from "react-router-dom";
import { Col, Row, Card, Form, Button, Container } from "react-bootstrap";

export default function About() {
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h6 className="section-title text-start text-primary text-uppercase">📌 About Our App</h6>
        <h1 className="text-center fw-bold mb-4">
          Your <span className="text-primary text-uppercase">Guest Ease</span>
        </h1>
  
        <p className="text-muted fw-bold text-center" style={{ fontSize: "1.25rem" }}>
          We make life easy for guests and hotel staff by ensuring seamless communication, helping tasks get done quickly, and providing an exceptional hotel experience.
        </p>
  
        {/* About Feature Cards */}
        <Row className="g-3 pb-4 text-center">
          {about.map((item, index) => (
            <Col key={index} sm={4} className="fadeIn" data-wow-delay="0.1s">
              <Card className="border border-2 rounded shadow-sm p-3">
                <Card.Body>
                  {item.icon}
                  <h2 className="fw-bold mt-2">{item.count}</h2>
                  <p className="fw-bold text-muted">{item.text}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
  
        {/* Action Links */}
        <div className="text-center mt-3">
          <Link to="/contact" className="btn btn-primary fw-bold shadow-sm py-3 px-5 me-2">
            📞 Contact Us
          </Link>
          <Link to="/Services" className="btn btn-secondary fw-bold shadow-sm py-3 px-5 me-2">
            🔎 Explore Services
          </Link>
          <Link to="/booking" className="btn btn-success fw-bold shadow-sm py-3 px-5">
            🏨 Extend Stay
          </Link>
        </div>
  
        {/* Image Gallery */}
        <Row className="g-3 mt-4">
          <Col xs={6} className="text-end">
            <img className="img-fluid rounded w-75 shadow-sm zoomIn" data-wow-delay="0.1s"
              src={`${process.env.PUBLIC_URL}/assets/img/H-1.jpg`}
              alt="Guest Ease Service Highlight"
            />
          </Col>
          <Col xs={6} className="text-start">
            <img className="img-fluid rounded w-100 shadow-sm zoomIn" data-wow-delay="0.3s"
              src={`${process.env.PUBLIC_URL}/assets/img/H-2.jpg`}
              alt="Guest Ease Service Highlight"
            />
          </Col>
          <Col xs={6} className="text-end">
            <img className="img-fluid rounded w-50 shadow-sm zoomIn" data-wow-delay="0.5s"
              src={`${process.env.PUBLIC_URL}/assets/img/H-3.jpg`}
              alt="Guest Ease Service Highlight"
            />
          </Col>
          <Col xs={6} className="text-start">
            <img className="img-fluid rounded w-75 shadow-sm zoomIn" data-wow-delay="0.7s"
              src={`${process.env.PUBLIC_URL}/assets/img/H-4.jpg`}
              alt="Guest Ease Service Highlight"
            />
          </Col>
        </Row>
      </Card>
    </Container>
  );
  
}


/*
import React from "react";
import Heading from "../common/Heading";
import { about } from "../data/Data";
import { Link } from "react-router-dom";


export default function About() {
  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h6 className="section-title text-start text-primary text-uppercase">
                About Our App
              </h6>
              <h1 className="mb-4">
                 Your {" "} 
                <span className="text-primary text-uppercase">Guest Ease</span>
              </h1>
              <p className="mb-4">
                We make life easy for guests and staff of hotels to make communication seemingly effortless and get things done much quickly while guests have the best experience staying at the hotel.
              </p>
              <div className="row g-3 pb-4">
                {about.map((item, key) => (
                  <div className="col-sm-4 wow fadeIn" data-wow-delay="0.1s">
                    <div className="border rounded p-1">
                      <div className="border rounded text-center p-4">
                        {item.icon}
                        <h2 className="mb-1" data-toggle="counter-up">
                          {item.count}
                        </h2>
                        <p className="mb-0">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn btn-primary py-3 px-5 mt-2 me-2">
              Contact Us
              </Link>
              <Link to="/Services" className="btn btn-primary py-3 px-5 mt-2 me-2">
              Explore Services
              </Link>
              <Link to="/booking" className="btn btn-primary py-3 px-5 mt-2 me-2">
              Book Another stay
              </Link>


            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6 text-end">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.1s"
                    src={`${process.env.PUBLIC_URL}/assets/img/H-1.jpg`}
                    style={{ marginTop: "25%" }}
                    alt="Guest Ease Service Highlight"
                  />
                </div>
                <div className="col-6 text-start">
                  <img
                    className="img-fluid rounded w-100 wow zoomIn"
                    data-wow-delay="0.3s"
                    src={`${process.env.PUBLIC_URL}/assets/img/H-2.jpg`}
                  />
                </div>
                <div className="col-6 text-end">
                  <img
                    className="img-fluid rounded w-50 wow zoomIn"
                    data-wow-delay="0.5s"
                    src={`${process.env.PUBLIC_URL}/assets/img/H-3.jpg`}
                  />
                </div>
                <div className="col-6 text-start">
                  <img
                    className="img-fluid rounded w-75 wow zoomIn"
                    data-wow-delay="0.7s"
                    src={`${process.env.PUBLIC_URL}/assets/img/H-4.jpg`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
*/