import { useEffect, useState } from 'react'
import { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import Buttons from '../../components/Buttons';
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import InputField from '../../components/Inputfield'
import { ApiGet, ApiPatch } from '../../helper/API/ApiData';
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { getUserData } from '../../redux/actions/userDataAction';
import DeleteAccount from '../../modal/DeleteAccount';
import NumberFormat from "react-number-format";
import SavedPopUp from '../../modal/SavedPopUp';
import { LoginWith } from '../../helper/Constant';

registerLocale("ko", ko);

interface findPassState {
    password: string;
    confirmPassword: string;
}
const MyAccount = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const findPassState: findPassState = {
        password: "",
        confirmPassword: ""
    };
    const Data = {
        avatar: "",
    };

    const inputErr = {
        password: "",
        confirmPass: "",
        passMatch: "",
    };

    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState(Data);
    const [pass, setPass] = useState(findPassState);
    const [error, setError] = useState(inputErr);
    const [imgSrc, setImgSrc] = useState('../img/Avatar.png');
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isSubmitedPass, setIsSubmitedPass] = useState(false);
    const [IsDelete, setIsDelete] = useState(false);
    const [mobileData, setMobileData] = useState("");
    const [emailData, setEmailData] = useState("");
    const [Name, setName] = useState("");
    const [showSavedPopUp, setShowSavedPopUp] = useState(false);
    const [logeddinWith, setLogeddinWith] = useState("");

    const { userData } = useSelector((state: RootStateOrAny) => state.userData)

    useEffect(() => {
        setProfileData(userData)
    }, [userData]);

    useEffect(() => {
        ApiGet("user/getUser").then((res: any) => {

            if (res.data.avatar !== null || res.data.avatar !== "") {
                setImgSrc(res.data.avatar)
            }
            setEmailData(res.data.email);
            setMobileData(res.data.mobile);
            setName(res.data.name);
            setLogeddinWith(res.data.login_with);

        });
    }, [])

    const inputValidation = () => {
        let Err = {
            password: "",
            confirmPass: "",
            passMatch: "",
        };

        if (pass.password !== pass.confirmPassword) {
            Err.passMatch = `${t("signup.Errors.PasswordMatch")}`;
        }

        setError(Err);

        if (
            !Err.password &&
            !Err.confirmPass && !Err.passMatch
        ) {
            return true;
        }
        return false;
    };


    useEffect(() => {
        if (isSubmitedPass) {
            inputValidation();
        }
    }, [pass]);

    const Save = () => {

        setIsSubmitedPass(true)
        if (!inputValidation()) {
            return
        } else {
            let formData = new FormData();
            // formData.append('dob', moment(dobData).format("YYYY.MM.DD").toString());
            formData.append('mobile', mobileData);
            formData.append('password', pass.password);

            if (selectedFile) {
                formData.append('avatar', selectedFile);
            }

            ApiPatch("user/auth/edit", formData)
                .then((res: any) => {
                    dispatch(getUserData())
                    setShowSavedPopUp(true)
                });
        }
    }

    //Delete Account
    const deleteAc = () => {
        setIsDelete(true)
    }

    const closeSavedPopUp = () => {
        setShowSavedPopUp(false)
    }

    const GoToHomepage = () => {
        history.push('/')
    }
    useEffect(() => {
        if (!selectedFile) {
            setImgSrc('./img/Avatar.png');
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);

        setImgSrc(objectUrl);
        profileData.avatar = objectUrl;
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const backHomePage = () => {
        history.push('/')
    }

    return (
        <>
            <div className="bg-gray my-profile-page">
                <div className="my-page">
                    <div className="my-page-head">
                        <img src="./img/back-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={backHomePage} alt="" />
                        <h1>{t("logIn.My_Page")}</h1>
                    </div>

                    <div className="myaccount-popup">
                        <div className="my-page-popup-head ">
                            <div className="my-page-popup-head-user-img">
                                <img src={imgSrc !== "" ? imgSrc : "../img/Avatar.png"} className="user-img" alt="Profile" onError={(e: any) => { e.target.onerror = null; e.target.src = "./img/Avatar.png" }} />
                                <img src="./img/my page Vector.svg" className="my-page-Vector" alt="" />

                                <InputField
                                    label=""
                                    fromrowStyleclass=""
                                    name=""
                                    value=""
                                    placeholder=""
                                    type="file"
                                    InputstyleClass="custom-file-input cursor-pointer"
                                    lablestyleClass=""
                                    onChange={(e: any) => {
                                        if (!e.target.files || e.target.files.length === 0) {
                                            setSelectedFile(undefined);
                                            return;
                                        }
                                        if (e.target.files[0]?.type === "image/jpeg" || e.target.files[0]?.type === "image/png") {
                                            setSelectedFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                            <div className="my-page-popup-head-details">
                                <h2>{Name}</h2>
                                <h3>{emailData}</h3>
                            </div>
                        </div>
                        <form className="login-form my-account-inner-content date-note position-relative">
                            <label className="login-label p-relative">{`${t("Modal.Title.Phone_Number")}`}</label>
                            <NumberFormat
                                format="###-####-####"
                                //  mask="_"
                                name=""
                                value={mobileData}
                                placeholder={`${t("signup.Placeholder.Phone_number")}`}
                                className="login-input"
                                onChange={(e: any) => {
                                    setMobileData(e.target.value);
                                }}

                            />

                            {logeddinWith === LoginWith.Manual &&
                                <>
                                    <InputField
                                        label={`${t("signup.Password")}`}
                                        fromrowStyleclass=""
                                        name=""
                                        value={pass.password}
                                        placeholder={`${t("signup.Placeholder.Password")}`}
                                        type="Password"
                                        lablestyleClass="login-label"
                                        InputstyleClass="login-input"
                                        onChange={(e: any) => {
                                            setPass({ ...pass, password: e.target.value })
                                        }}
                                    />
                                    {error.password && (
                                        <div className="position-relative">
                                            <p className="log-error">{error.password}</p>
                                        </div>
                                    )}
                                    <InputField
                                        label={`${t("signup.Password_Confirmation")}`}
                                        fromrowStyleclass=""
                                        name=""
                                        value={pass.confirmPassword}
                                        placeholder={`${t("signup.Placeholder.Password_Confirmation")}`}
                                        type="Password"
                                        lablestyleClass="login-label"
                                        InputstyleClass="login-input"
                                        onChange={(e: any) => {
                                            setPass({ ...pass, confirmPassword: e.target.value })
                                        }}
                                    />
                                    {error.confirmPass && (
                                        <div className="position-relative">
                                            <p className="log-error">{error.confirmPass}</p>
                                        </div>
                                    )}
                                    {!error.confirmPass && error.passMatch && (
                                        <div className="position-relative">
                                            <p className="log-error">{error.passMatch}</p>
                                        </div>
                                    )}
                                </>
                            }

                            <div className="my-acoount-border"></div>

                            <Buttons
                                ButtonStyle="my-page-save-btn"
                                onClick={() => Save()}
                                children={`${t("signup.Save")}`}
                            />
                            <div className="my-page-login-popup-footer">
                                <Buttons
                                    ButtonStyle="signup-del-account"
                                    onClick={() => { deleteAc(); }}
                                    children={`${t("signup.Delete_Account")}`}
                                />

                            </div>
                        </form>
                        {IsDelete && <DeleteAccount show={IsDelete} onHide={() => setIsDelete(false)} />}
                    </div>
                </div>
            </div>

            {showSavedPopUp && <SavedPopUp show={showSavedPopUp} onHide={closeSavedPopUp} GoToHomepage={GoToHomepage} />}
        </>
    )
}

export default MyAccount
