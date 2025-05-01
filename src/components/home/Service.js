import React from "react";
import { Link } from "react-router-dom";
import CommonHeading from "../common/CommonHeading";
import { services } from "../data/Data";
import { Col, Row, Card, Badge, Alert, Container } from "react-bootstrap";

export default function Services() {
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <CommonHeading heading="🌟 Our Services" title="Services" subtitle="Check the range of our available services" />
  
        <Row className="g-4 mt-3">
          {services.map((item, index) => (
            <Col key={index} lg={4} md={6} className="fadeInUp" data-wow-delay="0.1s">
              <Link to={item.link} className="service-item rounded shadow-sm p-3 text-decoration-none bg-white border border-2 border-secondary">
                <div className="service-icon bg-transparent border rounded p-2 d-flex align-items-center justify-content-center">
                  {item.icon}
                </div>
                <h5 className="fw-bold text-dark mt-3">{item.name}</h5>
                <p className="text-muted fw-bold">{item.description}</p>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>
    </Container>
  );
  
}
