import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router";
import Buttons from '../../../components/Buttons'
import InputField from "../../../components/Inputfield";
import NumberInput from "../../../components/NumberInput";
import { ApiPostNoAuth } from "../../../helper/API/ApiData";
import AuthStorage from "../../../helper/AuthStorage";

interface findEmailState {
  email: string;
  name: string;
  phone: string;
  verification: string;
}
const FindEmail = () => {

  const { t } = useTranslation();
  const history = useHistory();

  const findEmailState: findEmailState = {
    email: "",
    name: "",
    phone: "",
    verification: ""
  };

  const findEmail_Err = {
    nameError: "",
    phoneError: "",
    verificationError: "",
    userError: ""
  };

  const [findEmail, setFindEmail] = useState(findEmailState);
  const [findEmailErrors, setfindEmailErrors] = useState(findEmail_Err);
  const [emailData, setEmailData] = useState("");
  const [isPhoneCode, setIsPhoneCode] = useState(false);
  const [isVerifiCode, setIsVerifiCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isOtpVerify, setIsOtpVerify] = useState(false)
  const [modalGetEmailHide, setModalGetEmailHide] = React.useState(false);
  const [authenticationNumberHasAlreadyBeenSent, setAuthenticationNumberHasAlreadyBeenSent] = useState("");

  const sendOTP = () => {
    let mobile
    mobile = findEmail.phone.replaceAll("-","")
    mobile = mobile.replaceAll(" ","")
    if (mobile.length < 10) {
      setfindEmailErrors({
        ...findEmailErrors,  
        phoneError: `${t("re_enter_phone_number")}`
      });
      return
    }

    ApiPostNoAuth("user/otp-send", {
      mobile: findEmail.phone.replace(" ", ""),
    }).then((res: any) => {
      if (res?.message === "Otp sent successfully" || res?.message === "authentication number has already been sent.") {
        if (AuthStorage.getLang() === "en") {
          setAuthenticationNumberHasAlreadyBeenSent("authentication number has already been sent.")
        } else if (AuthStorage.getLang() === "ko") {
          setAuthenticationNumberHasAlreadyBeenSent("인증번호 전송 되었습니다")
        }
      }
    });;
  };

  //Mobile Number Verification
  const mobileVerification = () => {
    ApiPostNoAuth("user/otp-verify", {
      mobile: findEmail.phone.replace(" ", ""),
      code: findEmail.verification,
    }).then((res) => {
      setIsVerified(true);

    }).catch((error) => {
      setIsOtpVerify(true)
      setIsVerified(false);
    })
  }
  const findPasswordValidation = () => {
    let findPassword_Err = {
      nameError: "",
      phoneError: "",
      verificationError: "",
      userError: ""
    };

    if (!findEmail.email) {
      findPassword_Err.userError = `${t("find_email.Errors.User_email_not_found")}`;
    }

    if (!findEmail.name) {
      findPassword_Err.nameError = `${t("find_email.Errors.This_is_required_information")}`;
    }

    if (findEmail.phone === "") {
      findPassword_Err.phoneError = `${t("find_email.Errors.This_is_required_information")}`;
    }

    if (findEmail.verification === "") {
      findPassword_Err.verificationError = `${t("find_email.Errors.This_is_required_information")}`;
    }

    if (findEmail.verification.length > 0 && findEmail.verification.length < 6) {
      findPassword_Err.verificationError = `${t("signup.Errors.Verification_Code")}`;
    }

    setfindEmailErrors(findPassword_Err);

    if (!findEmailErrors.nameError && !findEmailErrors.phoneError && !findEmailErrors.verificationError) {
      return true;
    }

    return false;
  };
  const FindEmail = () => {

    if (!findPasswordValidation()) {
      return;
    }

    ApiPostNoAuth("user/getEmail", {
      name: findEmail.name,
      mobile: findEmail.phone.replace(" ", ""),
    }).then((res: any) => {
      setModalGetEmailHide(true);
      setEmailData(res.data.email);

    }).catch((error) => {
      setModalGetEmailHide(false);
    })
  }

  const backHomePage = () => {
    history.push('/')
  }
  return (
    <>

      {!modalGetEmailHide &&
        <div className="modal-dialog modal-lg signup-popup modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header justify-content-center p-0">
              <img src="./img/memorial-Frame.svg" onClick={backHomePage} className="logo-img" alt="" />
            </div>
            <div className="modal-body p-0">
              <form className="login-form">
                <InputField
                  label={`${t("find_email.Name")}`}
                  fromrowStyleclass=""
                  name="name"
                  value={findEmail.name}
                  placeholder={`${t("find_email.Placeholder.Name")}`}
                  type="text"
                  lablestyleClass="login-label"
                  InputstyleClass="login-input"
                  onChange={(e: any) => {
                    setfindEmailErrors({
                      ...findEmail_Err,
                      nameError: ""
                    });
                    setFindEmail({ ...findEmail, name: e.target.value })
                  }
                  }
                />
                {findEmailErrors.nameError && (
                  <div className="position-relative">
                    <p className="log-error">{findEmailErrors.nameError}</p>
                  </div>
                )}

                <div className="p-relative">
                  <label className="login-label p-relative">{`${t("find_email.Phone_number")}`}</label>
                  <Buttons
                    ButtonStyle="Register-Send-Verification-Code"
                    onClick={() => { sendOTP(); }}
                    children={`${t("find_email.Send_Verification_Code")}`}
                    disabled={!isPhoneCode}
                  />
                </div>
                <NumberFormat
                  format="###-####-####"
                  name="phone"
                  value={findEmail.phone}
                  placeholder={`${t("find_email.Placeholder.Phone_number")}`}
                  className="login-input"
                  onChange={(e: any) => {
                    setfindEmailErrors({
                      ...findEmail_Err,
                      phoneError: ""
                    });
                    if (e.target.value) {
                      setIsPhoneCode(true)
                    } else {
                      setIsPhoneCode(false)
                    }
                    setFindEmail({ ...findEmail, phone: e.target.value })
                  }}
                />
                {findEmailErrors.phoneError && (
                  <div className="position-relative">
                    <p className="log-error">{findEmailErrors.phoneError}</p>
                  </div>
                )}
                {authenticationNumberHasAlreadyBeenSent && (
                  <div className="position-relative">
                    <p className="log-errors">{authenticationNumberHasAlreadyBeenSent}</p>
                  </div>
                )}
                <div className="p-relative">
                  <label className="login-label p-relative">{`${t("find_email.Verification_Code")}`}</label>
                  <Buttons
                    ButtonStyle="Register-Send-Verification-Code"
                    onClick={mobileVerification}
                    children={`${t("find_email.Verify")}`}
                    disabled={!isVerifiCode}
                  />
                </div>
                <NumberInput
                  name="verification"
                  value={findEmail.verification}
                  placeholder={`${t("find_email.Placeholder.Enter_Verification_code")}`}
                  InputstyleClass="login-input"
                  onChange={(e: any) => {
                    setfindEmailErrors({
                      ...findEmail_Err,
                      verificationError: ""
                    });
                    if (e.target.value) {
                      setIsOtpVerify(false)
                      setIsVerifiCode(true)
                    } else {
                      setIsVerifiCode(false)
                    }
                    setFindEmail({ ...findEmail, verification: e.target.value })
                  }
                  } maxLength={10}
                />
                {isOtpVerify && (
                  <div className="position-relative">
                    <p className="log-error">{t("signup.Errors.Verification_Code")}</p>
                  </div>
                )}
                {(findEmailErrors.verificationError) && (
                  <div className="position-relative">
                    <p className="log-error">{findEmailErrors.verificationError}</p>
                  </div>
                )}
                {findEmailErrors.userError && (
                  <div className="position-relative">
                    <p className="log-error">{findEmailErrors.userError}</p>
                  </div>
                )}
                <Buttons
                  ButtonStyle={`login-btn find-email-btn ${!isVerified && "login-btn-btnDisabled"}`}
                  onClick={() => FindEmail()}
                  disabled={!isVerified}
                >
                  {`${t("find_email.Find_Email")}`}
                </Buttons>
              </form>
            </div>
          </div>
        </div>
      }

  
      {modalGetEmailHide &&
        <div className="modal-dialog modal-lg find-email-popup modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header justify-content-center p-0">
              <img src="./img/memorial-Frame.svg" onClick={backHomePage} className="logo-img" alt="" />
            </div>
            <div className="modal-body p-0 ">
              <form className="login-form">
                <div className="sucess-login text-center">
                  <p className="content-email-address">{`${t("find_password.Email")}`}</p>
                  <p className="email-view"> {emailData}</p>
                </div>
              </form>
            </div>
            <div className="w-100 p-0 m-0">
              <div className="login-popup-footer d-flex m-0">
                <Buttons
                  ButtonStyle={`login-btn find-email-btn-two ${!isVerified && "login-btn-btnDisabled"}`}
                  onClick={() => { history.push("/login") }}
                >
                  {t("logIn.Log_In")}
                </Buttons>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default FindEmail
