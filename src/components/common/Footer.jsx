import { Link } from "react-router-dom";
import { footerContact, footerItem, socialIcons } from "../data/Data";
import { Card, Container, Row, Col} from "react-bootstrap";
export default function Footer() {
  return (
    <Container fluid className="mt-4">
      <Card className="shadow-lg border border-3 border-dark rounded p-4 bg-dark text-light">
        <Row className="g-3">
          {/* Brand Introduction */}
          <Col md={6} lg={4}>
            <Card className="bg-primary rounded p-4 shadow-sm">
              <Link to="/">
                <h1 className="text-white text-uppercase mb-3">Guest Ease</h1>
              </Link>
              <p className="text-white mb-0 fw-bold">
                Providing convenient, efficient, and personalized services to guests. 
                Thank you for choosing us. We look forward to serving you and making every experience exceptional.
              </p>
            </Card>
          </Col>
  
          {/* Contact Section */}
          <Col md={6} lg={3}>
            <h6 className="section-title text-start text-primary text-uppercase mb-4">📞 Contact</h6>
            {footerContact.map((val, index) => (
              <p key={index} className="fw-bold text-light">
                {val.icon} {val.name}
              </p>
            ))}
            <div className="d-flex pt-2 gap-2">
              {socialIcons.slice(0, 4).map((val, index) => (
                <a key={index} className="btn btn-outline-light btn-social shadow-sm" href="">
                  {val.icon}
                </a>
              ))}
            </div>
          </Col>
  
          {/* Quick Links */}
          <Col lg={5} md={12}>
            <Row className="gy-5 g-4">
              {footerItem.map((section, sectionIndex) => (
                <Col key={sectionIndex} md={6}>
                  <h6 className="section-title text-start text-primary text-uppercase mb-4">
                    {section.header}
                  </h6>
                  {section.UnitItem.map((item, itemIndex) => (
                    <a key={itemIndex} className="btn btn-link text-decoration-none fw-bold text-light shadow-sm" href="">
                      {item.name}
                    </a>
                  ))}
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>
    </Container>
  );
  
}
