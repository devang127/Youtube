import { Container, Row, Col } from "react-bootstrap";
import CDNImage from "./CDNImage";
import Heading from "./Heading";

const PageHeader = ({ heading, subHeading, image }) => {
  return (
    <section className="page-header">
      <div className="overlay"></div>
      <CDNImage imgSrc={image} imgAlt={heading} className="header-image" imgClass="h-100 w-100 object-fit-cover" />
      <Container className="position-relative h-100 d-flex flex-column justify-content-end">
        <Row>
          <Col md={9} className="d-flex align-items-center">
            <div className="heading-wrapper" data-aos="fade-up" data-aos-delay="300">
              <p>{subHeading}</p>
              <h1>{heading}</h1>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PageHeader;
