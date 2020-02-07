import React from 'react';
import { Link } from 'react-router-dom';
import { AppPaths } from '../common/Constants';

import Banner1 from '../../static/Home01.jpg';
import Banner2 from '../../static/Home02.jpg';
import Banner3 from '../../static/Home03.jpg';
import Banner4 from '../../static/Home04.jpg';
import Banner5 from '../../static/Home05.jpg';
import Logo from '../../static/BridgeHospiceLogo.png';
import Valor from '../../static/Valor.png';
import DavesWish from '../../static/DavesWish.png';

export default function Home() {
  const randomStart = getRandomInt(5);
  return (
    <div className="container shadow p-0">
      <div id="carouselExampleSlidesOnly" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className={getClass(1)} data-interval="20000">
              <img src={Banner1} className="d-block w-100" alt="Customer Satisfaction Cascade 1" />
          </div>
          <div className={getClass(2)} data-interval="20000">
            <img src={Banner2} className="d-block w-100" alt="Customer Satisfaction Cascade 2" />
          </div>
          <div className={getClass(3)} data-interval="20000">
              <img src={Banner3} className="d-block w-100" alt="Customer Satisfaction Cascade 3" />
          </div>
          <div className={getClass(4)} data-interval="20000">
            <img src={Banner4} className="d-block w-100" alt="Customer Satisfaction Cascade 4" />
          </div>
          <div className={getClass(5)} data-interval="20000">
            <img src={Banner5} className="d-block w-100" alt="Customer Satisfaction Cascade 5" />
          </div>
        </div>
      
        <div className="text-center hero-container">
          <Link to={AppPaths.Pages.Contact.Index} className="hover-dim" title="Click here for contact information">
            <p className="text-light hero-font mb-1"><span className="bg bg-secondary-opaque px-2 rounded">EXTENDING LOVE, COMFORT, AND CARE</span></p>
            <img src={Logo} className="img-fluid hero-image" alt="Bridge Hospice" />
          </Link>
        </div>

        <div className="bg-orange nav-box mt-3 py-4 px-3 d-flex align-items-center">
          <div className="text-center text-light">
            <p style={{fontSize: "24px"}}>In 2019 the Founder and Administrator of BRIDGE Hospice, Tammie Ware, discovered herself wanting 
              more out of the hospice experience for the patient and family. She put together a team of individuals
              who specialize in different areas, but all carried the same desire to make the hospice experience about 
              the patient and family. BRIDGE Hospice is committed to extending love, comfort, and care to our patients
              and their loved ones, because every patient's need is unique, our caring staff offers specialized care 
              individually for each patient and family.
            </p>
            <h2>To BRIDGE Hospice, you are family.</h2>
          </div>
        </div>

        <div className="bg-purple nav-box d-flex p-3 text-light">
          <div className="row m-auto w-100 py-3">
              <div className="col-12 col-md-6 text-center my-auto pb-2" style={{lineHeight: 1.0}}>
                <div style={{fontSize: "70px", fontWeight: "500"}}>5</div>
                <div style={{fontSize: "35px", fontWeight: "500"}}>REASONS</div>
                <div style={{fontSize: "35px", fontWeight: "500"}}>FOR CHOOSING</div>
                <div style={{fontSize: "35px", fontWeight: "500"}}>HOSPICE</div>
              </div>
              <div className="col-12 col-md-6">
                <ol className="pt-1" style={{lineHeight: 1.8, fontSize: "20px"}}>
                  <li>Medicare pays for all hospice services.</li>
                  <li>Hospice can improve your quality of life.</li>
                  <li>Hospice puts your wishes front and center.</li>
                  <li>Hospice helps you communicate with doctors</li>
                  <li>Hospice gives your family much-needed support.</li>
                </ol>
              </div>
          </div>
        </div>

        <div className="bg-cyan nav-box py-3 px-3 text-light"  style={{fontSize: "24px"}}>
          <h2 className="text-center py-2">Our Services</h2>
          <div className="row">
            <div className="col-12 col-md">
              <ul>
                <li>Pre-Admission Consultation</li>
                <li>Hospice Aides for Personal Care</li>
                <li>Trained Volunteers</li>
                <li>Medical Equipment and Supplies</li>
                <li>Continuous Care Requiring Intense Intervention*</li>
              </ul>
            </div>
            <div className="col-12 col-md">
              <ul>
                <li>Hospice Nursing Care</li>
                <li>Social Work and Pastoral Care</li>
                <li>Pain and Symptom Management</li>
                <li>Available 24 Hours, 7 Days a Week</li>
                <li>Respite or Inpatient Care if needed*</li>
              </ul>
            </div>
            <div className="col-12 col-md">
              <ul>
                <li>Hospice Physician/Medical Director</li>
                <li>Therapists and Counseling</li>
                <li>Pharmacy Consultation/Services</li>
                <li>Bereavement Program offered for 13 months after death</li>
              </ul>
            </div>
          </div>
          <div className="d-flex">
            <div className="ml-auto mr-3" style={{fontWeight: "700"}}>
              * Eligibility Required
            </div>
          </div>
        </div>

        <div className="bg-valorblue nav-box py-5 px-3">
          <Link to={AppPaths.Pages.Veterans.Index} title="Click here for information on our veteran services">
            <div className="row hover-dim">
              <img src={Valor} alt="Valor" className="mx-auto ml-lg-auto mr-lg-0 h-100" />
              <div className="valor-text text-light text-center text-lg-left mx-auto ml-lg-0" style={{lineHeight: 1.1}}>
                <div>VALOR</div>
                <div>THE VETERANS DIVISION OF BRIDGE HOSPICE</div>
                <div>HONORING THOSE WHO SERVED</div>
              </div>
            </div>
          </Link>
        </div>

        <div id="daves-wishes" className="bg-yellow nav-box py-3 px-3 text-center d-flex">
          <Link to={AppPaths.Pages.Donations.Index} className="m-auto hover-dim" title="Click here to make a donation">
            <img src={DavesWish} alt="Dave's Wish" className="img-fluid" />
          </Link>
        </div>

      </div>
    </div>
  );

  function getClass(position) {
    if (position === randomStart) {
      return "carousel-item active";
    }
    else {
      return "carousel-item";
    }
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }
}

/* 
<div className={styleClass.mainWindow}>

        {/* Help Banner //*}
        <div className="row bg-primary py-2 rounded">
          <Link to={AppPaths.Pages.Contact.Index} className="col text-center" title="Click here to get started">
            <h4 className="m-0 text-dark">DO YOU KNOW SOMEONE WE CAN HELP? <span className="text-light">Press here</span></h4>
          </Link>
        </div>

        {/* Cards Container //*}
        <div className="row">
          <Link to={AppPaths.Pages.Services.Index} className="col page-card" style={{"backgroundImage": `url(${ImgService})`}} title="Our Services"></Link>
          <Link to={AppPaths.Pages.About.Index} className="col page-card" style={{"backgroundImage": `url(${ImgAbout})`}} title="About Us"></Link>
          <Link to={AppPaths.Pages.Volunteer.Index} className="col page-card" style={{"backgroundImage": `url(${ImgVolunteer})`}} title="Volunteers"></Link>
          <Link to={AppPaths.Pages.Donations.Index} className="col page-card" style={{"backgroundImage": `url()`}} title="Coming soon: Donations"></Link>
          <Link to={AppPaths.Pages.Employment.Index} className="col page-card" style={{"backgroundImage": `url()`}} title="Coming soon: Employment"></Link>
          <Link to={AppPaths.Pages.Contact.Index} className="col page-card" style={{"backgroundImage": `url()`}} title="Coming soon: Contact Us"></Link>
          <Link to={AppPaths.Pages.Testimonials.Index} className="col page-card" style={{"backgroundImage": `url()`}} title="Coming soon: Testimonials"></Link>
          <Link to={AppPaths.Pages.Help.Index} className="col page-card" style={{"backgroundImage": `url()`}} title="Coming soon: Help"></Link>
        </div>

    </div>

*/