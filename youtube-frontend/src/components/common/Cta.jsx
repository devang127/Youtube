import React, { useRef, useState } from "react";
import Heading from "../common/Heading";
import PrimaryButton from "../common/PrimaryButton";
import { Container, Row, Col } from "react-bootstrap";


const CTA = ({
    tag = "EVERY PROJECT STARTS WITH A CONVERSATION",
    title = "Partner with A1 UK for Certified, Proven Perimeter Protection",
    description = "Discover bespoke perimeter security solutions engineered for performance, compliance, and complete peace of mind.",
    linkName = "Get in Touch",
    img = "/media/images/common/cta.jpg",
    className = "",
}) => {

    return (
      <section className={`cta ${className}`}>
        <div className="cta-wrapper" data-aos="fade-up" data-aos-delay="300">
          <Container className="p-lg-0 h-100">
            <div className="cta-wrap">
              <figure className="overlay">
                <img src="/media/images/common/cta-bg.png" alt="overlay" className="w-100 h-100 object-fit-cover" />
              </figure>

              <figure>
                <img src={img} alt="CTA Background" className="w-100 h-100 object-fit-cover" />
              </figure>

              <Row className="align-items-center h-100">
                <Col lg={8} className="mx-auto">
                  <div className="gap-wrapper">
                    <Heading textWhite="true" tag={tag} title={title} />
                    {/* <p className="text-white mt-3 mb-1">{description}</p> */}
                    <div className="d-flex justify-content-center mt-4 mt-lg-0 pt-lg-4 pt-2">
                      <PrimaryButton text={linkName} to="/contact#enquiry" />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </section>
    );
};

export default CTA;
