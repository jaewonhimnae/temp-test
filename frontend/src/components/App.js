import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";

//About Auth
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import ResetPasswordPage from "./views/ResetPasswordPage/ResetPasswordPage";
import ResetPasswordCompletePage from "./views/ResetPasswordCompletePage/ResetPasswordCompletePage";

import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";

//About User
import UserProfilePage from './views/UserProfilePage/UserProfilePage';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Auth(LandingPage, null)} />
        <Route exact path="/login" component={Auth(LoginPage, false)} />
        <Route exact path="/register" component={Auth(RegisterPage, false)} />
        <Route exact path="/reset_password" component={Auth(ResetPasswordPage, false)} />
        <Route exact path="/reset_password_complete/:token" component={Auth(ResetPasswordCompletePage, false)} />

        <Route exact path="/userProfile/:userId" component={Auth(UserProfilePage, true)} />

        <Route component={Auth(NotFoundPage, null)} />
      </Switch>
      <Footer />
    </Suspense>
  );
}

export default App;
