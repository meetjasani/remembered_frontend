import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import NumberFormat from 'react-number-format';
import { RootStateOrAny, useSelector } from 'react-redux';
import { ApiPostNoAuth } from '../helper/API/ApiData';

interface Props {
    show: boolean,
    onHide: () => void,
    handlePost: (phoneNumber: any) => void,
    userData: any
}

const SelfAuthentication: React.FC<Props> = ({ onHide, show, handlePost, userData }) => {
    const { t } = useTranslation();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    //Count Down Timer
    const [start, setStart] = useState(false);
    const [incorrectOTP, setIncorrectOTP] = useState(false);
    const [showCountDown, setShowCountDown] = useState(false)
    const [[m, s], setTime] = useState([parseInt("3"), parseInt("0")]);
    const [over, setOver] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [vcode, setVcode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [authenticationNumberHasAlreadyBeenSent, setAuthenticationNumberHasAlreadyBeenSent] = useState("");


    const tick = () => {
        if (over) return;
        if (m === 0 && s === 0) {
            setOver(true);
        } else if (s === 0) {
            setTime([m - 1, 59]);
        } else {
            setTime([m, s - 1]);
        }
    };

    const reset = () => {
        setTime([parseInt("3"), parseInt("0")]);
        setOver(false);
    };

    //Send OTP
    const sendOTP = () => {
        if (!phoneNumber) {
            return
        }
        if (is_loggedin) {
            if (userData?.mobile !== phoneNumber) {
                return
            }
        }
        setShowCountDown(true);
        setStart(true);
        reset();
        setIncorrectOTP(false);
        ApiPostNoAuth("user/otp-send", {
            mobile: phoneNumber,
        }).then((res: any) => {
            if (res?.message === "Otp sent successfully" || res?.message === "authentication number has already been sent.") {
                setAuthenticationNumberHasAlreadyBeenSent(`${t("verification_code_has_been_sent")}`)
            }
        });
    };

    //Mobile Number Verification
    const mobileVerification = () => {
        ApiPostNoAuth("user/otp-verify", {
            mobile: phoneNumber,
            code: vcode,
        })
            .then((res: any) => {
                if (res?.message === "Incorrect OTP") {
                    setIsVerified(false);
                }
                if (res?.data?.is_verified) {
                    setIsVerified(true);
                    setIncorrectOTP(false);
                } else {
                    setIncorrectOTP(true);
                    setIsVerified(false);
                }
            })
            .catch((error) => {
                setIncorrectOTP(true);
                setIsVerified(false);
            });
    };

    useEffect(() => {
        if (start) {
            const timerID = setInterval(() => tick(), 1000);
            return () => clearInterval(timerID);
        }
    });

    useEffect(() => {
        setShowCountDown(false);
        setStart(false);
        setPhoneNumber("")
        setVcode("")
        setIncorrectOTP(false);
        setOver(false);
    }, [show])


    return (
        <Modal
            show={show}
            onHide={() => {
                onHide()
                setStart(false)
            }}
            backdrop="static"
            dialogClassName="SelfAuthentication-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Self_Authentication")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4 className="">{`${t("Modal.Self_Authentication")}`}</h4>

                <div className="register-seltAuth">
                    <label className="SelfAuthentication-pop-up-lable">{`${t("Modal.Title.Phone_Number")}`}</label>
                    <NumberFormat
                        format="###-####-####"
                        name="phoneNumber"
                        value={phoneNumber}
                        className="SelfAuthentication-pop-up-input number-formator-self"
                        type="text"
                        placeholder={t("memorial_hall_register.Placeholder.Auth_phone_Number")}
                        onChange={(e: any) => {
                            setPhoneNumber(e.target.value);
                        }}
                        autoComplete="off"
                    />
                    <Button
                        onClick={() => { sendOTP() }}
                        className="sendVerfyCode"
                    >
                        {`${t("signup.Send_Verification_Code")}`}
                    </Button>

                </div>
                {authenticationNumberHasAlreadyBeenSent &&
                    <p className='ml-2 mt-verify'>{authenticationNumberHasAlreadyBeenSent}</p>
                }

                <div className="register-seltAuth">
                    <label className="SelfAuthentication-pop-up-lable-2">{`${t("signup.Verification_Code")}`}</label>
                    <Form.Control
                        name="code"
                        value={vcode}
                        className="SelfAuthentication-pop-up-input"
                        type="text"
                        placeholder={t("signup.Placeholder.Verification_Code")}
                        onChange={(e: any) => { setVcode(e.target.value) }}
                        autoComplete="off"
                    />
                    {showCountDown && !vcode && <p className="sendVerfyCode mb-0">{`${m.toString().padStart(1, "0")}:${s.toString().padStart(2, "0")}`}</p>}
                    {vcode && !over && (
                        <Button
                            onClick={() => { mobileVerification() }}
                            className="sendVerfyCode"
                        >
                            {t('signup.Verify')}
                        </Button>
                    )}
                </div>
                {incorrectOTP &&
                    <p className="error-color ml-2 register-seltAuth-error">{t('Modal.Verification_code_does_not_match')}</p>
                }
                {over &&
                    <p className="error-color ml-2 register-seltAuth-error">{t('Modal.Verification_code_is_no_longer_valid_Please_resend')}</p>
                }

                <Modal.Footer className="edit-pop-up-edit p-0">
                    <Button
                        onClick={() => {
                            handlePost(phoneNumber)
                            setIsVerified(false)
                        }}
                        disabled={!isVerified}
                        className={!isVerified ? "modal-title-small-f-btn-disabled" : "modal-title-small-f-btn"}
                    >
                        {`${t("find_email.Verify")}`}
                    </Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default SelfAuthentication
