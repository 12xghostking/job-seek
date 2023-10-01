import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jobseek from './image.jpg';

const HeroSection = () => {
  return (
    <section className="hero-section text-center py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h1>Find Your Ideal Job</h1>
            <p>
              Simplify your Job seeking journey by connecting with the right
              employers for your career. Apply to Jobs seamlessly.
            </p>
          </div>
          <div className="col-lg-6">
            <img
              src={jobseek}
              alt="Job seek app"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
