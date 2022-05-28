import React, { useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ApiGet } from "../helper/API/ApiData";
import AuthStorage from "../helper/AuthStorage";
import Layout from "../layouts/Layout";
import ErrorPage1 from "./errors/ErrorPage1";
import { changeLoginState } from "../redux/actions/loginAction";
import Login from "./login/Login";
import homepage from "./homepage/Homepage";
import LoginLayout from "../layouts/LoginLayout";
import Registration from "./login/child-components/Registration";
import FindPassword from "./login/child-components/FindPassword";
import FindEmail from "./login/child-components/FindEmail";
import MyAccount from "./my-account/MyAccount";
import MemorialHall from "./memorialhall/MemorialHall";
import AboutRemembered from "./about-remembered/AboutRemembered";
import MemorialHallStatus from "./memorialhall/MemorialHallStatus";
import MemorialView from "./memorial-view/MemorialView";
import Faq from "./faq/Faq";
import Funeralnews from "./funeral-news/FuneralNews";
import SendDonation from "./sendDonation/SendDonation";
import SendDonationReciept from "./sendDonation/SendDonationReciept";
import PriceGuides from "./Price/PriceGuides";
import PremiumFree from "./Price/PremiumFree";
import Funeralnewsdetail from "./funeral-news/FuneralDetail";
import MobMemorialView from "./mobile memorial view/MobMemorialView";

const Index = () => {
  const pathname = ["/login", "/Registration", "/memorialview", "/memorialhallstatus", "/memorialprofile"]
  //   const locationPathName = [ 
  //   "/",
  //   "/homepage",
  //   "/myaccount",
  //   "/memorialhall",
  //   "/memorialhallstatus",
  //   "/aboutremembered",
  //   "/memorialview",
  //   "/faq",
  //   "/funeralnews",
  //   "/senddonation",
  //   "/donationreciept",
  //   "/priceguide",
  //   "/Premiumfree",
  //   "/funeralDetails",
  //   "/memorialprofile",
  //   "/login",
  //   "/findemail",
  //   "/findpassword",
  //   "/Registration"
  // ]
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (AuthStorage.isUserAuthenticated()) {
      ApiGet("user/validate")
        .then((res) => {
          dispatch(changeLoginState(true));
        })
        .catch((error) => {
          AuthStorage.deauthenticateUser();
          history.push("/");
        });
    }
    else {
      if (!pathname.includes(location.pathname)) {
        history.push("/");
      }
    }
  },[]);

  return (
    <>

      {/* <div className="loader-custom">sss</div> */}

      <Switch>
        <Route
          exact
          path={[
            "/",
            "/homepage",
            "/myaccount",
            "/memorialhall",
            "/memorialhallstatus",
            "/aboutremembered",
            "/memorialview",
            "/faq",
            "/funeralnews",
            "/senddonation",
            "/donationreciept",
            "/priceguide",
            "/Premiumfree",
            "/funeralDetails",
            "/memorialprofile"
          ]}
        >
          <Layout>
            <Switch>
              <RouteWrapper
                exact={true}
                path="/"
                component={homepage}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/homepage"
                component={homepage}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/myaccount"
                component={MyAccount}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/memorialhall"
                component={MemorialHall}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/memorialhallstatus"
                component={MemorialHallStatus}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/aboutremembered"
                component={AboutRemembered}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/memorialview"
                component={MemorialView}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/faq"
                component={Faq}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/funeralnews"
                component={Funeralnews}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/funeralDetails"
                component={Funeralnewsdetail}
                isPrivateRoute={false}
              />


              <RouteWrapper
                exact={true}
                path="/senddonation"
                component={SendDonation}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/donationreciept"
                component={SendDonationReciept}

                isPrivateRoute={false}
              />


              <RouteWrapper
                exact={true}
                path="/priceguide"
                component={PriceGuides}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/premiumfree"
                component={PremiumFree}

                isPrivateRoute={false}
              />

              <RouteWrapper
                exact={true}
                path="/memorialprofile"
                component={MobMemorialView}
                isPrivateRoute={false}
              />

            </Switch>
          </Layout>
        </Route>
        <Route
          exact
          path={[
            "/login",
            "/findemail",
            "/findpassword",
            "/Registration"
          ]}
        >
          <LoginLayout>
            <Switch>
              <RouteWrapper
                exact={false}
                path="/login"
                component={Login}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/findemail"
                component={FindEmail}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/findpassword"
                component={FindPassword}

                isPrivateRoute={false}
              />
              <RouteWrapper
                exact={true}
                path="/Registration"
                component={Registration}

                isPrivateRoute={false}
              />
            </Switch>
          </LoginLayout>
        </Route>
        <Route path="/error" component={ErrorPage1} />
        <Redirect from="**" to="/error" />
      </Switch>
    </>
  );
};

export default Index;

interface RouteWrapperProps {
  component: any;
  exact: boolean;
  path: string;
  isPrivateRoute: boolean;
}

function RouteWrapper({
  component: Component,
  isPrivateRoute,
  ...rest
}: RouteWrapperProps) {
  const history = useHistory();
  const isAuthenticated: boolean = isPrivateRoute
    ? AuthStorage.isUserAuthenticated()
    : true;
  return (
    <>
      {isAuthenticated ? (
        <Route {...rest} render={(props) => <Component {...props} />} />
      ) : (
        history.push("/")
      )}
    </>
  );
}
