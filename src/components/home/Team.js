import React from "react";
import { socialIcons, team } from "../data/Data";
import { Link } from "react-router-dom";
import CommonHeading from "../common/CommonHeading";
import { Col, Row, Card, Form, Button, Container } from "react-bootstrap";

export default function Teams() {
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <CommonHeading heading="🌟 Our Team" subtitle="Meet Our Experts" title="Staff Members" />
  
        <Row className="g-4 mt-3">
          {team.map((item, index) => (
            <Col key={index} lg={3} md={6} className="fadeInUp" data-wow-delay="0.1s">
              <Card className="shadow-lg rounded border border-2 border-secondary overflow-hidden">
                <div className="position-relative">
                  <Card.Img variant="top" src={item.image} alt={`${item.name} profile`} className="rounded-top" />
                  <div className="position-absolute start-50 top-100 translate-middle d-flex align-items-center">
                    {socialIcons.slice(0, 3).map((val, index) => (
                      <a
                        key={index}
                        className="btn btn-sm btn-primary fw-bold mx-1 shadow-sm"
                        href=""
                        aria-label={`Follow ${item.name} on Facebook`}
                      >
                        {val.icon}
                      </a>
                    ))}
                  </div>
                </div>
                <Card.Body className="text-center p-4 mt-3">
                  <h5 className="fw-bold text-dark">{item.name}</h5>
                  <small className="text-secondary">{item.designation || "Designation not available"}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Container>
  );
  
}
