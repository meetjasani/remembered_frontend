import { useState } from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router";
import Buttons from '../../../components/Buttons'
import InputField from "../../../components/Inputfield";
import NumberInput from "../../../components/NumberInput";
import { ApiPostNoAuth } from "../../../helper/API/ApiData";
import AuthStorage from "../../../helper/AuthStorage";

interface findPasswordState {
  email: string;
  phone: string;
  verification: string;
}
const FindPassword = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const findPasswordState: findPasswordState = {
    email: "",
    phone: "",
    verification: ""
  };

  const findPassword_Err = {
    emailError: "",
    emailFormatErr: "",
    phoneError: "",
    verificationError: "",
  };

  const [findPassword, setFindPassword] = useState(findPasswordState);
  const [findPasswordErrors, setfindPasswordErrors] = useState(findPassword_Err);
  const invalidEmail = "";
  const [isPhoneCode, setIsPhoneCode] = useState(false);
  const [isVerifiCode, setIsVerifiCode] = useState(false);
  const [isOtpVerify, setIsOtpVerify] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [authenticationNumberHasAlreadyBeenSent, setAuthenticationNumberHasAlreadyBeenSent] = useState("");

  const sendOTP = () => {
    let mobile
    mobile = findPassword.phone.replaceAll("-","")
    mobile = mobile.replaceAll(" ","")
    if (mobile.length < 11) {
      setfindPasswordErrors({
        ...findPasswordErrors,  
        phoneError: `${t("re_enter_phone_number")}`
      });
      return
    }

    ApiPostNoAuth("user/otp-send", {
      mobile: findPassword.phone,
    }).then((res: any) => {
      if (res?.message === "Otp sent successfully" || res?.message === "authentication number has already been sent.") {
        // if (findPassword.phone.length < 10) { }
        if (AuthStorage.getLang() === "en") {
          setAuthenticationNumberHasAlreadyBeenSent("authentication number has already been sent.")
        } else if (AuthStorage.getLang() === "ko") {
          setAuthenticationNumberHasAlreadyBeenSent("인증번호 전송 되었습니다.")
        }
      }
    });;
  };

  //Mobile Number Verification
  const mobileVerification = () => {
    ApiPostNoAuth("user/otp-verify", {
      mobile: findPassword.phone,
      code: findPassword.verification,
    }).then((res: any) => {
      setIsVerified(true);
    }).catch((error) => {
      setIsOtpVerify(true);
      setIsVerified(false);
    })
  }
  const findPasswordValidation = () => {
    let findPassword_Err = {
      emailError: "",
      emailFormatErr: "",
      phoneError: "",
      verificationError: "",
    };

    const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

    if (findPassword.email && !validEmail.test(findPassword.email)) {
      findPassword_Err.emailFormatErr = `${t("find_password.Errors.InvalidEmail")}`;
    }
    if (!findPassword.email) {
      findPassword_Err.emailError = `${t("find_password.Errors.This_is_required_information")}`;
    }

    if (findPassword.phone === "") {
      findPassword_Err.phoneError = `${t("find_password.Errors.This_is_required_information")}`;
    }

    if (findPassword.phone.length > 10) {
      findPassword_Err.phoneError = `${t("find_password.Errors.This_is_required_information ")}`;
    }

    if (findPassword.verification === "") {
      findPassword_Err.verificationError = `${t("find_password.Errors.This_verification_code_is_invalid")}`;
    }

    if (findPassword.verification.length > 0 && findPassword.verification.length < 6) {
      findPassword_Err.verificationError = `${t("signup.Errors.Verification_Code")}`;
    }

    setfindPasswordErrors(findPassword_Err);

    if (!findPasswordErrors.emailError && !findPasswordErrors.phoneError && !findPasswordErrors.verificationError && !findPasswordErrors.emailFormatErr) {
      return true;
    }

    return false;
  };
  const FindPassword = () => {

    if (!findPasswordValidation()) {
      return;
    }

    ApiPostNoAuth("user/sendForgotlink", {
      email: findPassword.email,
    }).then((res: any) => {
      if (res.status === 200) {
        history.push("/login");
      }

    }).catch((error) => {

    })
  }

  const backHomePage = () => {
    history.push('/')
  }
  return (
    <>

      <div className="modal-dialog modal-lg signup-popup modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header justify-content-center p-0">
            <img src="./img/memorial-Frame.svg" onClick={backHomePage} className="logo-img" alt="" />
          </div>
          <div className="modal-body p-0">
            <form className="login-form">
              <InputField
                label={`${t("find_password.Email")}`}
                fromrowStyleclass=""
                name="email"
                value={findPassword.email}
                placeholder={`${t("find_password.Placeholder.Email")}`}
                type="text"
                lablestyleClass="login-label"
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  setfindPasswordErrors({
                    ...findPassword_Err,
                    emailError: "",
                    emailFormatErr: ""
                  });
                  setFindPassword({ ...findPassword, email: e.target.value })
                }
                }
              />
              {findPasswordErrors.emailError && (
                <div className="position-relative">
                  <p className="log-error">{findPasswordErrors.emailError}</p>
                </div>
              )}
              {findPasswordErrors.emailFormatErr && (
                <div className="position-relative">
                  <p className="log-error">{findPasswordErrors.emailFormatErr}</p>
                </div>
              )}
              {!findPasswordErrors.emailError &&
                !findPasswordErrors.emailFormatErr &&
                invalidEmail && (
                  <div className="position-relative">
                    <p className="log-error">{invalidEmail}</p>
                  </div>
                )}
              <div className="position-relative">
                <label className="login-label p-relative">{`${t("find_password.Phone_number")}`}  </label>
                <Buttons
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={() => { sendOTP(); }}
                  children={`${t("find_password.Send_Verification_Code")}`}
                  disabled={!isPhoneCode}
                />
              </div>
              <NumberFormat
                format="###-####-####"
                name="phone"
                value={findPassword.phone}
                placeholder={`${t("find_password.Placeholder.Enter_phone_number")}`}
                className="login-input"
                onChange={(e: any) => {
                  setfindPasswordErrors({
                    ...findPassword_Err,
                    phoneError: ""
                  });
                  if (e.target.value) {
                    setIsPhoneCode(true)
                  } else {
                    setIsPhoneCode(false)
                  }
                  setFindPassword({ ...findPassword, phone: e.target.value })
                }
                }
              />
              {/* <NumberInput
                name="phone"
                value={findPassword.phone}
                placeholder={`${t("find_password.Placeholder.Enter_phone_number")}`}
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  setfindPasswordErrors({
                    ...findPassword_Err,
                    phoneError: ""
                  });
                  if (e.target.value) {
                    setIsPhoneCode(true)
                  } else {
                    setIsPhoneCode(false)
                  }
                  setFindPassword({ ...findPassword, phone: e.target.value })
                }
                } maxLength={11}
              /> */}
              {findPasswordErrors.phoneError && (
                <div className="position-relative">
                  <p className="log-error">{findPasswordErrors.phoneError}</p>
                </div>
              )}
              {authenticationNumberHasAlreadyBeenSent && (
                <div className="position-relative">
                  <p className="log-errors">{authenticationNumberHasAlreadyBeenSent}</p>
                </div>
              )}
              <div className="position-relative">
                <label className="login-label p-relative">{`${t("find_password.Verification_Code")}`}</label>
                <Buttons
                  ButtonStyle="Register-Send-Verification-Code"
                  onClick={mobileVerification}
                  children={`${t("find_password.Verify")}`}
                  disabled={!isVerifiCode}
                />
              </div>
              <NumberInput
                name="verification"
                value={findPassword.verification}
                placeholder={`${t("find_password.Placeholder.Enter_Verification_code")}`}
                InputstyleClass="login-input"
                onChange={(e: any) => {
                  setfindPasswordErrors({
                    ...findPassword_Err,
                    verificationError: ""
                  });
                  if (e.target.value) {
                    setIsVerifiCode(true)
                    setIsOtpVerify(false)
                  } else {
                    setIsVerifiCode(false)
                  }
                  setFindPassword({ ...findPassword, verification: e.target.value })
                }
                } maxLength={10}
              />
              {isOtpVerify && (
                <div className="position-relative">
                  <p className="log-error">{t("signup.Errors.Verification_Code")}</p>
                </div>
              )}
              {findPasswordErrors.verificationError && (
                <div className="position-relative">
                  <p className="log-error">{findPasswordErrors.verificationError}</p>
                </div>
              )}
              <Buttons
                ButtonStyle={`login-btn find-email-btn  ${!isVerified && "login-btn-btnDisabled"}`}
                onClick={() => FindPassword()}
                disabled={!isVerified}
              >
                {`${t("find_password.Send_Email_Link")}`}
              </Buttons>
            </form>
          </div>
        </div>
      </div>



    </>
  )
}

export default FindPassword
