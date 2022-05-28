import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import Buttons from "../../components/Buttons";
import STORAGEKEY from "../../config/APP/app.config";
import { ApiPost } from "../../helper/API/ApiData";
import AuthStorage from "../../helper/AuthStorage";
import { changeLoginState } from "../../redux/actions/loginAction";
import KakaoLogin from "react-kakao-login";
import NaverLogin from "react-login-by-naver";
import { ApiPostNoAuth } from "../../helper/API/ApiData";
import { getCookie, setCookie } from "../../helper/utils";

interface loginFormState {
  email: string;
  password: string;
}

const Login = () => {
  //i18n
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch()
  const queryParams = new URLSearchParams(window.location.search);

  const loginFormState: loginFormState = {
    email: "",
    password: "",
  };

  const login_Err = {
    emailError: "",
    emailFormatErr: "",
    passError: "",
  };

  const [statelogin, setStatelogin] = useState(loginFormState);
  const [loginErrors, setLoginErrors] = useState(login_Err);
  const [stayLogedIn, setStayLogedIn] = useState(false);
  const [incorrectPass, setIncorrectPass] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [memorialHallId, setMemorialHallId] = useState<string | undefined>("");

  // sns kakao
  const kakaoRef = useRef<HTMLDivElement | any>(null);
  const NaverLoginRef = useRef<HTMLDivElement>(null);

  const onClicKakao = () => {
    kakaoRef.current?.onButtonClick();
    kakaoRef.current?.onButtonClick();
  };

  useEffect(() => {
    const getEmail = getCookie("email");
    if (getEmail !== null && getEmail !== "") {
      setStatelogin({ ...statelogin, email: getEmail });
    }
    const id = queryParams.get('id')?.toString();
    if (id) {
      setMemorialHallId(id)
    }
  }, [])

  const onSuccessKakaoLogin = (data: any) => {
    ApiPostNoAuth("user/auth/signup", {
      email: data.profile.kakao_account.email,
      password: '00000000000',
      name: data.profile.kakao_account.profile.nickname,
      mobile: data?.phoneNumber || '00000000000',
      is_verified: true,
      login_with: 'Kakaotalk'
    })
      .then((res) => {
        setStatelogin({ ...statelogin, email: data.profile.kakao_account.email });
        setStatelogin({ ...statelogin, password: '00000000000' });
        reqKaakoSnsLogin(data);
      })
      .catch((error) => {
        setStatelogin({ ...statelogin, email: data.profile.kakao_account.email });
        setStatelogin({ ...statelogin, password: '00000000000' });

        reqKaakoSnsLogin(data);
      });
  };

  const onFailKakaoLogin = (data: any) => {
  };

  const reqKaakoSnsLogin = (data: any) => {
    ApiPost("user/auth/login", {
      email: data.profile.kakao_account.email,
      password: '00000000000',
      login_with: 'Kakaotalk',
    })
      .then((res: any) => {
        setStatelogin(loginFormState);

        localStorage.setItem('loginUser', res.data.email);
        localStorage.setItem('loginWith', res.data.login_with);
        localStorage.setItem('loginMobile', res.data.mobile);

        AuthStorage.setStorageData(
          STORAGEKEY.token,
          res.data.token,
          stayLogedIn
        );
        delete res.data.token;
        AuthStorage.setStorageJsonData(
          STORAGEKEY.userData,
          res.data,
          stayLogedIn
        );
        dispatch(changeLoginState(true))

        if (memorialHallId) {
          const mHId = memorialHallId
          setMemorialHallId(undefined)
          history.push(`/memorialview?id=${mHId}&isFromLogin=true`);
        } else {
          setMemorialHallId(undefined);
          history.push("/");
        }
      })
      .catch((error) => {
      });
  }

  const onClickNaverLogin = () => {
    NaverLoginRef.current?.click();
  };

  const onSuccessNaverLogin = (data: any) => {
    ApiPostNoAuth("user/auth/signup", {
      email: data.email,
      password: '00000000000',
      name: data.name,
      mobile: data?.phoneNumber || '00000000000',
      is_verified: true,
      login_with: 'Naver'
    })
      .then((res) => {
        setStatelogin({ ...statelogin, email: data.email });
        setStatelogin({ ...statelogin, password: '00000000000' });
        reqNaverSnsLogin(data);
      })
      .catch((error) => {
        setStatelogin({ ...statelogin, email: data.email });
        setStatelogin({ ...statelogin, password: '00000000000' });

        reqNaverSnsLogin(data);
      });
  };

  const reqNaverSnsLogin = (data: any) => {
    ApiPost("user/auth/login", {
      email: data.email,
      password: '00000000000',
      login_with: 'Naver',
    })
      .then((res: any) => {
        setStatelogin(loginFormState);

        localStorage.setItem('loginUser', res.data.email);
        localStorage.setItem('loginWith', res.data.login_with);
        localStorage.setItem('loginMobile', res.data.mobile);

        AuthStorage.setStorageData(
          STORAGEKEY.token,
          res.data.token,
          stayLogedIn
        );
        delete res.data.token;
        AuthStorage.setStorageJsonData(
          STORAGEKEY.userData,
          res.data,
          stayLogedIn
        );
        dispatch(changeLoginState(true))

        if (memorialHallId) {
          const mHId = memorialHallId
          setMemorialHallId(undefined)
          history.push(`/memorialview?id=${mHId}&isFromLogin=true`);
        } else {
          setMemorialHallId(undefined);
          history.push("/");
        }
      })
      .catch((error) => {
      });
  }


  const loginValidation = () => {
    let login_Err = {
      emailError: "",
      emailFormatErr: "",
      passError: "",
    };

    const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

    if (statelogin.email && !validEmail.test(statelogin.email)) {
      login_Err.emailFormatErr = `${t("logIn.Errors.InvalidEmail")}`;
    }

    if (!statelogin.email) {
      login_Err.emailError = `${t("logIn.Errors.This_is_required_information")}`;
    }

    if (statelogin.password === "") {
      login_Err.passError = `${t("logIn.Errors.Please_enter_password_one_more_time")}`;
    }

    setLoginErrors(login_Err);
    setIncorrectPass("");

    if (!loginErrors.emailError && !loginErrors.passError && !loginErrors.emailFormatErr) {
      return true;
    }
    return false;
  };

  const Login = (loginWith: string) => {

    if (!loginValidation()) {
      setBtnDisabled(true);
      return;
    }
    const getEmail = getCookie("email");
    if (getEmail !== null && getEmail !== "") {
      if (stayLogedIn === true) {
        setCookie("email", statelogin.email, 1440);
      } else {
        setCookie("email", "", 1440);
      }
    } else {
      if (stayLogedIn === true) {
        setCookie("email", statelogin.email, 1440);
      } else {
        setCookie("email", "", 1440);
      }
    }

    ApiPost("user/auth/login", {
      email: statelogin.email,
      password: statelogin.password,
      login_with: loginWith,
    })
      .then((res: any) => {
        setStatelogin(loginFormState);


        localStorage.setItem('loginUser', res.data.email);
        localStorage.setItem('loginWith', res.data.login_with);
        localStorage.setItem('loginMobile', res.data.mobile);

        AuthStorage.setStorageData(
          STORAGEKEY.token,
          res.data.token,
          stayLogedIn
        );
        delete res.data.token;
        AuthStorage.setStorageJsonData(
          STORAGEKEY.userData,
          res.data,
          stayLogedIn
        );
        dispatch(changeLoginState(true))

        if (memorialHallId) {
          const mHId = memorialHallId
          setMemorialHallId(undefined)
          history.push(`/memorialview?id=${mHId}&isFromLogin=true`);
        } else {
          setMemorialHallId(undefined)
          history.push("/");
        }
      })
      .catch((error) => {
        if (error === "Wrong Email") {
          setIncorrectPass("");
          setInvalidEmail(`${t("logIn.Errors.This_is_required_information")}`);
        }

        if (error === "Wrong Password") {
          setInvalidEmail("");
          setIncorrectPass(`${t("logIn.Errors.Please_enter_password_one_more_time")}`);
        }
      });
  };
  //---------------

  const showPopups = (popupName: string) => {
    if (popupName === "FindEmail") {
      history.push("/findemail");
    }
    if (popupName === "FindPassword") {
      history.push("/findpassword");
    }
    if (popupName === "Registration") {
      history.push("/Registration");
    }
  }

  useEffect(() => {
    if (statelogin.email !== "" && statelogin.password !== "") {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [statelogin]);

  const backHomePage = () => {
    history.push('/')
  }
  return (
    <>

      <div className="modal-dialog modal-lg log-popup modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header justify-content-center p-0">
            <img src="./img/memorial-Frame.svg" onClick={backHomePage} className="logo-img" alt="" />
          </div>
          <div className="modal-body p-0">
            <form className="login-form">
              <label className="login-label">{`${t("logIn.Email")}`}</label>
              <input
                type="email"
                className="login-input"
                name="email"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    emailError: "",
                    emailFormatErr: ""
                  });
                  setStatelogin({ ...statelogin, email: e.target.value })
                }
                }
                value={statelogin.email}
                placeholder={`${t("logIn.Placeholder.Email")}`}
              />
              <div className="position-relative">
                {loginErrors.emailError && (
                  <p className="log-error">
                    {loginErrors.emailError}
                  </p>
                )}
                {loginErrors.emailFormatErr && (
                  <p className="log-error">
                    {loginErrors.emailFormatErr}
                  </p>
                )}
                {!loginErrors.emailError &&
                  !loginErrors.emailFormatErr &&
                  invalidEmail && (
                    <p className="log-error">{invalidEmail}</p>
                  )}
              </div>
              <label className="login-label">{`${t("logIn.Password")}`}</label>
              <input
                type="password"
                className="login-input"
                name="password"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    passError: ""
                  });
                  setStatelogin({ ...statelogin, password: e.target.value })
                }
                }
                placeholder={`${t("logIn.Placeholder.Password")}`}
              />
              <div className="position-relative">
                {loginErrors.passError && (
                  <p className="log-error">
                    {loginErrors.passError}
                  </p>
                )}
                {!loginErrors.passError && incorrectPass && (
                  <p className="log-error">{incorrectPass}</p>
                )}
              </div>
              <label
                className={
                  stayLogedIn
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setStayLogedIn(e.target.checked);
                  }}
                  className="checkbox-input"
                />
                {`${t("logIn.Stay_logged_in")}`}
              </label>
              <Buttons
                ButtonStyle={`login-btn ${btnDisabled && "login-btn-btnDisabled"}`}
                onClick={() => Login("Manual")}
                disabled={btnDisabled}
              >
                {t("logIn.Log_In")}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={onClicKakao}>
                <img src="./img/kakaotalk 1.svg" className="kakaotalk-img" alt="" />
                {`${t("logIn.Log_in_with_Kakaotalk")}`}
              </Buttons>
              <KakaoLogin
                token={"c38ef9667188c5012eda6562f4403007"}
                onSuccess={onSuccessKakaoLogin}
                onFail={onFailKakaoLogin}
                onLogout={console.info}
                ref={kakaoRef}
                style={{ display: "none" }}
              />
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={onClickNaverLogin}>
                <img src="./img/Naver-img.svg" className="kakaotalk-img" alt="" />
                {`${t("logIn.Log_in_with_Naver")}`}
              </Buttons>
              <NaverLogin
                clientId="wB_SSJRLJANaC0F4okrV"
                callbackUrl={STORAGEKEY.app_host + "/login"}
                render={(props: any) => (
                  <div
                    ref={NaverLoginRef}
                    onClick={props.onClick}
                    style={{ display: "none" }}
                  >
                    Naver Login
                  </div>
                )}
                onSuccess={onSuccessNaverLogin}
                onFailure={() => { }}
              />
            </form>
          </div>
          <div className="modal-footer w-100 p-0 m-0">
            <div className="login-popup-footer d-flex">

              <Buttons
                ButtonStyle="login-btn-Find-Email p-0"
                onClick={() => showPopups("FindEmail")}
                children={`${t("logIn.Find_Email")}`}
              />
              <Buttons
                ButtonStyle="login-btn-Find-Email p-0 find-password-btn"
                onClick={() => showPopups("FindPassword")}
                children={`${t("logIn.Find_Password")}`}
              />

              <Buttons
                ButtonStyle="login-btn-Not-a-member p-0"
                onClick={() => showPopups("Registration")}
                children={`${t("logIn.Not_a_member")}`}
              />

            </div>
          </div>
        </div>

        <div className="loader-mob-page d-md-none d-block"><img src="./img/whitelogo.svg" alt="" /></div>

      </div>

      {/* <div className="trans-bg-modal">
        <Modal
          show={modalShow}
          dialogClassName="log-popup"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header className="justify-content-center p-0">
            <Modal.Title><img src="./img/memorial-Frame.svg" className="logo-img" /></Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-0">
            <form className="login-form">
              <label className="login-label">{`${t("logIn.Email")}`}</label>
              <input
                type="email"
                className="login-input"
                name="email"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    emailError: "",
                    emailFormatErr: ""
                  });
                  setStatelogin({ ...statelogin, email: e.target.value })
                }
                }
                value={statelogin.email}
                placeholder={`${t("logIn.Placeholder.Email")}`}
              />
              <div className="position-relative">
                {loginErrors.emailError && (
                  <p className="log-error">
                    {loginErrors.emailError}
                  </p>
                )}
                {loginErrors.emailFormatErr && (
                  <p className="log-error">
                    {loginErrors.emailFormatErr}
                  </p>
                )}
                {!loginErrors.emailError &&
                  !loginErrors.emailFormatErr &&
                  invalidEmail && (
                    <p className="log-error">{invalidEmail}</p>
                  )}
              </div>
              <label className="login-label">{`${t("logIn.Password")}`}</label>
              <input
                type="password"
                className="login-input"
                name="password"
                onChange={(e) => {
                  setLoginErrors({
                    ...loginErrors,
                    passError: ""
                  });
                  setStatelogin({ ...statelogin, password: e.target.value })
                }
                }
                placeholder={`${t("logIn.Placeholder.Email")}`}
              />
              <div className="position-relative">
                {loginErrors.passError && (
                  <p className="log-error">
                    {loginErrors.passError}
                  </p>
                )}
                {!loginErrors.passError && incorrectPass && (
                  <p className="log-error">{incorrectPass}</p>
                )}
              </div>
              <label
                className={
                  stayLogedIn
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setStayLogedIn(e.target.checked);
                  }}
                  className="checkbox-input"
                />
                {`${t("logIn.Stay_logged_in")}`}
              </label>
              <Buttons
                ButtonStyle={`login-btn ${btnDisabled && "login-btn-btnDisabled"}`}
                onClick={() => Login("Manual")}
                disabled={btnDisabled}
              >
                {t("logIn.Log_In")}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/kakaotalk 1.svg" className="kakaotalk-img" />
                {`${t("logIn.Log_in_with_Kakaotalk")}`}
              </Buttons>
              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                <img src="./img/Naver-img.svg" className="kakaotalk-img" />
                {`${t("logIn.Log_in_with_Naver")}`}
              </Buttons>
            </form>
          </Modal.Body>

          <Modal.Footer className="w-100 p-0 m-0">
            <div className="login-popup-footer d-sm-flex flex-wrap">
              <div className="right-btn">
                <Buttons
                  ButtonStyle="login-btn-Find-Email p-0"
                  onClick={() => showPopups("FindEmail")}
                  children={`${t("logIn.Find_Email")}`}
                />
                <Buttons
                  ButtonStyle="login-btn-Find-Email p-0"
                  onClick={() => showPopups("FindPassword")}
                  children={`${t("logIn.Find_Password")}`}
                />
              </div>
              <div className="ml-auto">
                <Buttons
                  ButtonStyle="login-btn-Not-a-member p-0"
                  onClick={() => showPopups("Registration")}
                  children={`${t("logIn.Not_a_member")}`}
                />
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </div> */}
    </>
  );
};

export default Login;
