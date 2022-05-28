import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router";
import Buttons from "../../../components/Buttons";
import InputField from "../../../components/Inputfield";
import NumberInput from "../../../components/NumberInput";
import { ApiPostNoAuth } from "../../../helper/API/ApiData";
import AuthStorage from "../../../helper/AuthStorage";
import { LoginWith } from "../../../helper/Constant";
import KakaoLogin from "react-kakao-login";
import NaverLogin from "react-login-by-naver";
import { ApiPost } from "../../../helper/API/ApiData";
import STORAGEKEY from "../../../config/APP/app.config";
import { useDispatch } from "react-redux";
import { changeLoginState } from "../../../redux/actions/loginAction";

interface loginFormState {
  email: string;
  password: string;
}

const termko = () => {
  return (
    <p className="mb-0">리멤버드 <u><b>이용약관</b></u>과 <u><b>개인정보 수집 및 이용</b></u>에 모두 동의합니다.</p>
  )
}

const termen = () => {
  return (
    <p className="mb-0">I agree to the <u><b>Terms of Use</b></u> and <u><b>Privacy Policy.</b></u></p>
  )
}

const Registration = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const queryParams = new URLSearchParams(window.location.search);
  const resetForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    verificationCode: "",
    agreeTerms: false,
  };

  const resetFormError = {
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPassError: "",
    phoneNumberError: "",
    verificationError: "",
    agreeTerms: "",
  };

  const loginFormState: loginFormState = {
    email: "",
    password: "",
  };

  const [userData, setUserData] = useState(resetForm);
  const [formError, setFormError] = useState(resetFormError);
  const [chackBoxValue, setChackBoxValue] = useState(false);
  const [incorrectOTP, setIncorrectOTP] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isMobileEntered, setIsMobileEntered] = useState(false);
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const [isRegisterd, setIsRegisterd] = useState(false);
  const [memorialHallId, setMemorialHallId] = useState<string | undefined>("");
  const [isEmailDisable, setIsEmailDisable] = useState(false);
  const [statelogin, setStatelogin] = useState(loginFormState);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isotpBtnDisabled, setOtpIsBtnDisabled] = useState(false);
  const [authenticationNumberHasAlreadyBeenSent, setAuthenticationNumberHasAlreadyBeenSent] = useState("");
  const [userAlredySignUpErrMsg, setUserAlredySignUpErrMsg] = useState("");
  const [reEnterMobile, setReEnterMobile] = useState("");
  // const [isOtpSuccess, setIsOtpSuccess] = useState(false);

  // sns kakao
  const kakaoRef = useRef<HTMLDivElement | any>(null);
  const NaverLoginRef = useRef<HTMLDivElement>(null);

  const onClicKakao = () => {
    kakaoRef.current?.onButtonClick();
    kakaoRef.current?.onButtonClick();
  };

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
        reqKaakoSnsLogin(data);
      })
      .catch((error) => {
        reqKaakoSnsLogin(data);
      });
  };

  const onFailKakaoLogin = (data: any) => {
    // console.log("fila kakao login", data);
  };

  const reqKaakoSnsLogin = (data: any) => {
    ApiPost("user/auth/login", {
      email: data.profile.kakao_account.email,
      password: '00000000000',
      login_with: 'Kakaotalk',
    })
      .then((res: any) => {
        setStatelogin(loginFormState);
        AuthStorage.deleteKey(STORAGEKEY.email);

        localStorage.setItem('loginUser', res.data.email);
        localStorage.setItem('loginWith', res.data.login_with);
        localStorage.setItem('loginMobile', res.data.mobile);

        AuthStorage.setStorageData(
          STORAGEKEY.token,
          res.data.token,
          false
        );
        delete res.data.token;
        AuthStorage.setStorageJsonData(
          STORAGEKEY.userData,
          res.data,
          false
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
        AuthStorage.deleteKey(STORAGEKEY.email);

        localStorage.setItem('loginUser', res.data.email);
        localStorage.setItem('loginWith', res.data.login_with);
        localStorage.setItem('loginMobile', res.data.mobile);

        AuthStorage.setStorageData(
          STORAGEKEY.token,
          res.data.token,
          false
        );
        delete res.data.token;
        AuthStorage.setStorageJsonData(
          STORAGEKEY.userData,
          res.data,
          false
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


  //Send OTP
  const sendOTP = () => {
    let mobile
    mobile = userData.phoneNumber.replaceAll("-", "")
    mobile = mobile.replaceAll(" ", "")
    if (mobile.length < 10) {
      setReEnterMobile(`${t("re_enter_phone_number")}`)
      return
    }


    ApiPostNoAuth("user/otp-send", {
      mobile: userData.phoneNumber,
    }).then((res: any) => {
      if (res?.message === "Otp sent successfully" || res?.message === "authentication number has already been sent.") {
        if (AuthStorage.getLang() === "en") {
          setAuthenticationNumberHasAlreadyBeenSent("authentication number has already been sent.")
          // if (res?.message === "Otp sent successfully") {
          //   setIsOtpSuccess(true)
          // }
        } else if (AuthStorage.getLang() === "ko") {
          setAuthenticationNumberHasAlreadyBeenSent("인증번호 전송 되었습니다.")
          // if (res?.message === "Otp sent successfully") {
          //   setIsOtpSuccess(true)
          // }
          // setIsOtpSuccess(true)
        }
      }
    });
  };
  //----------

  //Mobile Number Verification
  const mobileVerification = () => {
    ApiPostNoAuth("user/otp-verify", {
      mobile: userData.phoneNumber,
      code: userData.verificationCode,
    })
      .then((res) => {
        setIncorrectOTP("");
        setIsVerified(true);
      })
      .catch((error) => {
        if (error === "Incorrect OTP") {
          error = AuthStorage.getLang() === "ko" ? "인증번호가 유효하지 않습니다." : "Incorrect OTP"
        } else if (error === "Incorrect Mobile Number") {
          error = AuthStorage.getLang() === "ko" ? "인증번호가 유효하지 않습니다." : "Incorrect Mobile Number"
        }
        setIncorrectOTP(error);
      });
  };

  const validateForm = () => {
    let errors = {
      nameError: "",
      emailError: "",
      passwordError: "",
      confirmPassError: "",
      phoneNumberError: "",
      verificationError: "",
      agreeTerms: "",
    };
    if (!userData.name) {
      errors.nameError = `${t("signup.Errors.This_is_required_information")}`;
    }
    const validEmail: any = new RegExp(
      "^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
    );

    if (!validEmail.test(userData.email)) {
      errors.emailError = `${t("signup.Errors.Email")}`;
    }
    if (!userData.password) {
      errors.passwordError = `${t("signup.Errors.This_is_required_information")}`;
    }

    if (userData.password.length > 0 && userData.password.length < 6) {
      errors.passwordError = `${t("signup.Errors.Password_at_least_eight_character")}`;
    }
    if (!userData.confirmPassword) {
      errors.confirmPassError = `${t("signup.Errors.ConfirmPassword")}`;
    }

    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassError = `${t("signup.Errors.PasswordMatch")}`;
    }

    if (!userData.phoneNumber) {
      errors.phoneNumberError = `${t("signup.Errors.This_is_required_information")}`;
    }

    if (!userData.verificationCode) {
      errors.verificationError = `${t("signup.Errors.Verification_Code")}`;
    }
    if (!userData.agreeTerms) {
      errors.agreeTerms = `${t("signup.Errors.agreeTerms")}`;
    }
    setFormError(errors);

    if (
      !errors.emailError &&
      !errors.passwordError &&
      !errors.confirmPassError &&
      !errors.nameError &&
      !errors.phoneNumberError &&
      !errors.verificationError &&
      !errors.agreeTerms
    ) {
      return true;
    }
    return false;
  };

  const handleChange = (e: any) => {
    if (e.target.name === "agreeTerms") {
      setUserData({ ...userData, [e.target.name]: e.target.checked });
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };
  useEffect(() => {
    if (isVerified) {
      validateForm();
    }
  }, [isVerified]);

  useEffect(() => {
    if (isRegisterd) {
      validateForm();
    }
  }, [userData, isRegisterd]);

  const SignUp = async () => {
    // setIsOtpSuccess(false)
    setIsRegisterd(true);

    if (!validateForm()) {
      return;
    }

    ApiPostNoAuth("user/auth/signup", {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      mobile: userData.phoneNumber,
      is_verified: isVerified,
      login_with: LoginWith.Manual
    })
      .then((res) => {
        setUserData(resetForm);
        setFormError(resetFormError);
        setIsVerified(false);
        setIsRegisterd(false);
        if (memorialHallId) {
          const mHId = memorialHallId
          setMemorialHallId(undefined)
          history.push(`/login?id=${mHId}`);
        } else {
          history.push(`/login`);
        }
      })
      .catch((error) => {
        if (error === "User already exists") {
          setUserAlredySignUpErrMsg(`${t("user_has_already_signed_up")}`)
        }
        setIsVerified(false);
      });
  };

  useEffect(() => {
    const id = queryParams.get('id')?.toString();
    const eid: string | undefined = queryParams.get('eid')?.toString();
    if (id) {
      setMemorialHallId(id)
    }
    if (eid) {
      setUserData({ ...userData, email: eid });
      setIsEmailDisable(true)
    }
  }, [])

  const backHomePage = () => {
    history.push('/')
  }

  useEffect(() => {
    if (isVerified && chackBoxValue) {
      setIsBtnDisabled(true)
    }
  }, [isVerified, chackBoxValue])

  // const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;

  useEffect(() => {
    // debugger;
    // const re = /^[0-9\b]+$/;
    // const isnum = /^\d+$/.test(userData.phoneNumber);
    if (userData.phoneNumber.length > 11) {
      setOtpIsBtnDisabled(true)
    }
  }, [userData])
  return (
    <>

      <div className="modal-dialog modal-lg signup-popup signup-popup-padding modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header justify-content-center p-0">
            <img src="./img/memorial-Frame.svg" onClick={backHomePage} className="logo-img" alt="" />
          </div>
          <div className="modal-body p-0">
            <form className="login-form">
              <InputField
                label={`${t("signup.Email")}`}
                fromrowStyleclass=""
                name="email"
                value={userData.email}
                placeholder={`${t("signup.Placeholder.Email")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                disabled={isEmailDisable}
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />

              {isRegisterd && formError.emailError && (
                <div className="position-relative">
                  <p className="log-error">{formError.emailError}</p>
                </div>
              )}
              <InputField
                label={`${t("signup.Password")}`}
                fromrowStyleclass=""
                name="password"
                value={userData.password}
                placeholder={`${t("signup.Placeholder.Password")}`}
                type="password"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.passwordError && (
                <div className="position-relative">
                  <p className="log-error">{formError.passwordError}</p>
                </div>
              )}{" "}
              <InputField
                label={`${t("signup.Password_Confirmation")}`}
                fromrowStyleclass=""
                name="confirmPassword"
                value={userData.confirmPassword}
                placeholder={`${t("signup.Placeholder.Password_Confirmation")}`}
                type="password"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.confirmPassError && (
                <div className="position-relative">
                  <p className="log-error">{formError.confirmPassError}</p>
                </div>
              )}{" "}
              <InputField
                label={`${t("signup.Name")}`}
                fromrowStyleclass=""
                name="name"
                value={userData.name}
                placeholder={`${t("signup.Placeholder.Name")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  handleChange(e);
                }}
              />
              {isRegisterd && formError.nameError && (
                <div className="position-relative">
                  <p className="log-error">{formError.nameError}</p>
                </div>
              )}{" "}
              <div className="p-relative">
                <label className="login-label ">
                  {`${t("signup.Phone_number")}`}

                </label>
                <Buttons
                  disabled={!isMobileEntered}
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={() => { sendOTP(); }}
                  children={`${t("signup.Send_Verification_Code")}`}
                // disabled={!isotpBtnDisabled}

                />
              </div>
              <NumberFormat
                format="###-####-####"
                name="phoneNumber"
                className="login-input"
                value={userData.phoneNumber}
                placeholder={`${t("signup.Placeholder.Phone_number")}`}
                // pattern="[+-]?\d+(?:[.,]\d+)?"
                onChange={(e: any) => {
                  // const re = /^[0-9\b]+$/;
                  handleChange(e);
                  if (e.target.value) {
                    setIsMobileEntered(true)
                    // setOtpIsBtnDisabled(true)
                  } else {
                    setIsMobileEntered(false)
                    // setOtpIsBtnDisabled(false)
                  }
                }}
              />
              {/* {isOtpSuccess && <p className="otp-success-msg">{t("signup.Errors.verification_has_been_successfully_done")}</p>} */}
              {/* <NumberInput
                name="phoneNumber"
                InputstyleClass="login-input"
                value={userData.phoneNumber}
                placeholder={`${t("signup.Placeholder.Phone_number")}`}
                onChange={(e: any) => {
                  handleChange(e);
                  if (e.target.value) {
                    setIsMobileEntered(true)
                  } else {
                    setIsMobileEntered(false)
                  }
                }}
                maxLength={11}
              /> */}
              {reEnterMobile && (
                <div className="position-relative">
                  <p className="log-error">{reEnterMobile}</p>
                </div>
              )}
              {isRegisterd && formError.phoneNumberError && (
                <div className="position-relative">
                  <p className="log-error">{formError.phoneNumberError}</p>
                </div>
              )}
              {authenticationNumberHasAlreadyBeenSent && (
                <div className="position-relative">
                  <p className="log-errors">{authenticationNumberHasAlreadyBeenSent}</p>
                </div>
              )}{" "}


              <div className="p-relative">
                <label className="login-label p-relative">
                  {`${t("signup.Verification_Code")}`}
                </label>
                <Buttons
                  disabled={!isCodeEntered}
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={mobileVerification}
                  children={`${t("signup.Verify")}`}
                />
              </div>
              <NumberInput
                name="verificationCode"
                value={userData.verificationCode}
                placeholder={`${t("signup.Placeholder.Verification_Code")}`}
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  if (e.target.value) {
                    setIsCodeEntered(true)
                    // setIsOtpVerified(false)
                  } else {
                    setIsCodeEntered(false)
                  }
                  setUserData({
                    ...userData,
                    verificationCode: e.target.value,
                  });
                }}
                maxLength={6}
              />
              {isRegisterd && formError.verificationError && (
                <div className="position-relative">
                  <p className="log-error">{formError.verificationError}</p>
                </div>
              )}{" "}
              {incorrectOTP && (
                <div className="position-relative">
                  <p className="log-error">{incorrectOTP}</p>
                </div>
              )}


              <label
                className={
                  chackBoxValue
                    ? "login-label-checkbox-checked"
                    : "login-label-checkbox"
                }
              >
                <input
                  type="checkbox"
                  name="agreeTerms"
                  onChange={(e) => {
                    handleChange(e);
                    setChackBoxValue(e.target.checked);
                  }}
                  // disabled={!isOtpVerified}
                  className="checkbox-input"
                />
                {" "}
                {AuthStorage.getLang() === "en" ? termen() : termko()}
              </label>
              {isRegisterd && formError.agreeTerms && (
                <div className="position-relative">
                  <p className="log-error">{formError.agreeTerms}</p>
                </div>
              )}

              {userAlredySignUpErrMsg &&
                <div className="">
                  <p className="log-error-1">{userAlredySignUpErrMsg}</p>
                </div>
              }

              <Buttons
                ButtonStyle={`login-btn ${!isBtnDisabled && "login-btn-btnDisabled"}`}
                onClick={() => {
                  SignUp();
                }}
                children={`${t("signup.Register")}`}
                disabled={!isBtnDisabled}
              />

              <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={onClicKakao}>
                <img src="./img/kakaotalk 1.svg" className="kakaotalk-img" alt="" />
                {`${t("signup.Register_with_Kakaotalk")}`}
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
                {`${t("signup.Register_with_Naver")}`}
              </Buttons>
              <NaverLogin
                clientId="wB_SSJRLJANaC0F4okrV"
                callbackUrl={STORAGEKEY.app_host + "/Registration"}
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
        </div>
      </div>

    </>
  );
};

export default Registration;
