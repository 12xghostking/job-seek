import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeaturesSection = () => {
  return (
    <section className="features-section text-center py-5">
      <div className="container">
        <h2>Key Features</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Comprehensive Job Listings</h5>
                <p className="card-text">
                  Access a wide range of job opportunities from various industries and sectors.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Effortless Job Search</h5>
                <p className="card-text">
                  Easily search and filter job listings based on your preferences and skills.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">One-Click Application</h5>
                <p className="card-text">
                  Apply to jobs with just a single click, saving you time and effort.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Personalized Job Recommendations</h5>
                <p className="card-text">
                  Receive job recommendations tailored to your skills and career goals.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Real-time Application Updates</h5>
                <p className="card-text">
                  Stay updated with real-time notifications on your application status.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Employer Communication</h5>
                <p className="card-text">
                  Communicate directly with employers for interview requests and inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
