import React from 'react'; //, { useState }
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap'; //FormControl,
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoginMenu } from './api-authorization/LoginMenu';
import { AppPaths } from './common/Constants';
import BrandImage from '../favicon.ico';

export default function MyNavbar() {
  const background = "secondary";
  const variant = "dark";
  //const [searchText, setSearchText] = useState('');
  return (
    <div style={{marginBottom: "43px"}}>
      <Navbar id="navBar" bg={background} variant={variant} expand="md" fixed="top" style={{padding: 1}}>
        <Link id="navBrand" to={AppPaths.Pages.Home.Index} className="px-2 m-0 navbar-brand text-primary">
            <img src={BrandImage} style={{width: 25, height: 25, marginBottom: 4, marginRight: 4}} alt="Bridge Hospice Logo" />
            Bridge Hospice
        </Link>
        <Navbar.Toggle aria-controls="navCollapse" />
        <Navbar.Collapse id="navCollapse" className="py-0">
          <Nav id="navLinks" className="mr-auto" variant="pills" activeKey="none">
            <Link to={AppPaths.Pages.Services.Index} className="nav-link px-2">Services</Link>
            <Link to={AppPaths.Pages.Volunteer.Index} className="nav-link px-2">Volunteer</Link>
            <Link to={AppPaths.Pages.Contact.Index} className="nav-link px-2">Contact Us</Link>
            {/*<Link to={AppPaths.Pages.Bereavement.Index} className="nav-link px-2">Bereavement</Link>*/}
            <NavDropdown id="navMore" title={<span className="px-2">More</span>}>
              <Link to={AppPaths.Pages.Donations.Index} className="dropdown-item">Donations</Link>
              <Link to={AppPaths.Pages.Veterans.Index} className="dropdown-item">Veterans</Link>
              {/*<Link to={AppPaths.Pages.Employment.Index} className="dropdown-item">Employment</Link>*/}
              {/*<Link to={AppPaths.Pages.About.Index} className="dropdown-item">About Us</Link>*/}
              {/*<Link to={AppPaths.Pages.Contact.Index} className="dropdown-item">Contact Us</Link>*/}
              {/*<Link to={AppPaths.Pages.Testimonials.Index} className="dropdown-item">Testimonials</Link>*/}
              <Dropdown.Divider />
              <Link to={AppPaths.Pages.Help.Index} className="dropdown-item">Help</Link>
              <Link to={AppPaths.Legal.PrivacyPolicy.Index} className="dropdown-item">Privacy Policy</Link>
              <Link to={AppPaths.Legal.TermsOfService.Index} className="dropdown-item">Terms of Service</Link>
            </NavDropdown>
          </Nav>
          
          <span id="navTools" className="mb-1 px-2 my-md-0 px-md-0 d-flex">
            {/*
            <FormControl id="searchBar" name="search" className="my-auto mr-auto" type="text" placeholder="Search" 
              style={{maxHeight: "30px"}} 
              onChange={event => { setSearchText(event.target.value); }}
              onKeyDown={event => event.keyCode === 13 && window.location.replace(`${window.location.origin}/search?${searchText}`)}
            />
            */}
            {/*
            <Link to={AppPaths.Pages.Cart.Index} className={`btn btn-${background} navBtn`}>
              <FontAwesomeIcon icon="shopping-cart" className="text-primary" />
            </Link>
            */}
            <LoginMenu className={`btn btn-${'secondary'}`} title="Account" />

          </span>
          
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
} 