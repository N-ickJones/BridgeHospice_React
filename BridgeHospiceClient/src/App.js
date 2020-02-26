import React, { useEffect } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';

import MyNavbar from './components/Navbar';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';

import Volunteer from './components/pages/Volunteer';
import Services from './components/pages/Services';
import Veterans from './components/pages/Veterans';
import Donations from './components/pages/Donations';
import Dashboard from './components/pages/Dashboard';
import Help from './components/pages/Help';

//import Bereavement from './components/pages/Bereavement';
//import Employment from './components/pages/Employment';
//import About from './components/pages/About';
//import Testimonials from './components/pages/Testimonials';
//import Search from './components/pages/Search';
//import Cart from './components/pages/Cart';

import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';

import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { AppPaths } from './components/common/Constants';

export default function App() {
  library.add(fas);
  //let acceptedTerms = localStorage.getItem("acceptTerms");

  return (
    <BrowserRouter>
      <div className="app bg-light pb-4" style={{"minWidth": "240px"}}>
      <ScrollToTop />
      <MyNavbar />
      {/*acceptedTerms == null && (
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          Please review our&nbsp;
          <Link to={AppPaths.Legal.TermsOfService.Index}>Terms of Service</Link>&nbsp;&&nbsp;
          <Link to={AppPaths.Legal.PrivacyPolicy.Index}>Privacy Policy</Link>.&nbsp;
          Closing this alert and using the website indicates an agreement to these policies.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={handleLegalAlert()}><span aria-hidden="true">&times;</span></button>
        </div>
      )*/}

      <Switch>

        {/* Pipeline for Client Application */}
        <Route exact path="/" component={Home} />
        <Route exact path={AppPaths.Pages.Home.Index} component={Home} />
        <Route exact path={AppPaths.Pages.Services.Index} component={Services} />
        <Route exact path={AppPaths.Pages.Volunteer.Index} component={Volunteer} />
        <Route exact path={AppPaths.Pages.Contact.Index} component={Contact} />
        <Route exact path={AppPaths.Pages.Donations.Index} component={Donations} />
        <Route exact path={AppPaths.Pages.Veterans.Index} component={Veterans} />
        <Route exact path={AppPaths.Pages.Dashboard.Index} component={Dashboard} />
        <Route exact path={AppPaths.Pages.Help.Index} component={Help} />

        {/*<Route exact path={AppPaths.Pages.Bereavement.Index} component={Bereavement} />*/}
        {/*<Route exact path={AppPaths.Pages.Employment.Index} component={Employment} />*/}
        {/*<Route exact path={AppPaths.Pages.About.Index} component={About} />*/}
        {/*<Route exact path={AppPaths.Pages.Testimonials.Index} component={Testimonials} />*/}
        {/*<Route exact path={AppPaths.Pages.Search.Index} component={Search} />*/}
        {/*<Route exact path={AppPaths.Pages.Cart.Index} component={Cart} />*/}

        {/* Legal */}
        <Route exact path={AppPaths.Legal.PrivacyPolicy.Index} component={PrivacyPolicy} />
        <Route exact path={AppPaths.Legal.TermsOfService.Index} component={TermsOfService} />

        {/* Pipeline for IdentityServer4 */}
        <Route path={AppPaths.Identity.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />

      </Switch>
      </div>
    </BrowserRouter>
  );

  function ScrollToTop() {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  }
  
}

//function handleLegalAlert() {
  //  localStorage.setItem("acceptTerms", "The user has dismissed the Terms of Service and Privacy Notice alert indicating that is aware and accepted that Terms of Service and usage of personal information to improve our service.");
  //}
//import Account from './components/account/Index';
//<Route path={AppPaths.Pages.Account.Index} component={Account} />