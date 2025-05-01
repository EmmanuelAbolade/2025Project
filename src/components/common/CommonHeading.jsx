import { Card, Container } from "react-bootstrap";

export default function CommonHeading({ heading, title, subtitle }) {
  return (
    <Container fluid className="mt-4 text-center">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-light">
        <h6 className="section-title text-primary text-uppercase fw-bold">{heading}</h6>
        <h1 className="fw-bold text-dark">
          {subtitle} <span className="text-primary text-uppercase">{title}</span>
        </h1>
      </Card>
    </Container>
  );
  
}
