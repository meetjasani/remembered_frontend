import React, { useEffect, useState } from 'react'
import Buttons from '../../components/Buttons';
import InputField from '../../components/Inputfield';
import { ApiPost } from '../../helper/API/ApiData';
import { useHistory } from 'react-router';
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";

interface Props {
    checkedCheckBox: boolean;
    handleCheckbox: (checkedCheckBox: any) => void,
}


const InquiryForm: React.FC<Props> = ({ checkedCheckBox, handleCheckbox }) => {
    const { t } = useTranslation();
    const queryParams = new URLSearchParams(window.location.search);
    const servicePlanType = queryParams.get('servicePlanType')?.toString();
    const history = useHistory();

    const inquiryForm = {
        name: "",
        phone_number: "",
        email: "",
        address: "",
        inquiry: "",
        type: servicePlanType
    };

    const inquiryFormError = {
        nameError: "",
        phone_numberError: "",
        emailError: "",
        addressError: "",
        inquiryError: "",
        isAgreeError: ""
    };

    const [inquiryDataForm, setInquiryDataForm] = useState(inquiryForm);
    const [inquiryDataFormError, setInquiryDataFormError] = useState(inquiryFormError);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleChange = (e: any) => {
        setInquiryDataForm({ ...inquiryDataForm, [e.target.name]: e.target.value });
    }

    const validate = () => {
        let flag = false

        const errors = {
            nameError: "",
            phone_numberError: "",
            emailError: "",
            addressError: "",
            inquiryError: "",
            isAgreeError: ""
        }

        const validEmail: any = new RegExp(
            "^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
        );

        if (inquiryDataForm.name === "" || inquiryDataForm.name === null) {
            errors.nameError = `${t("This_is_required_information")}`
            flag = true
        }

        if (inquiryDataForm.email === "" || inquiryDataForm.email === null) {
            errors.emailError = `${t("This_is_required_information")}`
            flag = true
        } else {
            if (!validEmail.test(inquiryDataForm.email)) {
                errors.emailError = `${t("signup.Errors.Email")}`
                flag = true
            }
        }

        if (inquiryDataForm.phone_number === "" || inquiryDataForm.phone_number === null) {
            errors.phone_numberError = `${t("This_is_required_information")}`
            flag = true
        }

        if (inquiryDataForm.inquiry === "" || inquiryDataForm.inquiry === null) {
            errors.inquiryError = `${t("This_is_required_information")}`
            flag = true
        }

        if (inquiryDataForm.address === "" || inquiryDataForm.address === null) {
            errors.addressError = `${t("This_is_required_information")}`
            flag = true
        }

        if (checkedCheckBox === false) {
            handleCheckbox(true)
            flag = true
        }


        setInquiryDataFormError(errors)

        return flag
    }


    //[+] Post Request
    const postInquiryForm = () => {

        if (validate()) {
            return
        }

        ApiPost("general/createFreeConsultationApplication", inquiryDataForm)
            .then((response: any) => {
                servicePlanType ? history.push("/") : history.push("/Priceguide");
            })
            .catch((err: any) => console.error(err));
    }

    useEffect(() => {
        const handleDisabled = checkedCheckBox === false || inquiryDataForm.name === "" || inquiryDataForm.phone_number === "" || inquiryDataForm.email === "" || inquiryDataForm.address === "" || inquiryDataForm.inquiry === "";

        if (handleDisabled) {
            setButtonDisabled(true)
        } else {
            setButtonDisabled(false)
        }
    }, [checkedCheckBox, inquiryDataForm]);

    return (
        <div>
            <div className="xs-small-conatainer">
                <div className="inquiry-box memorialhall-form">
                    <div className="inquiry-form-title">
                        <h2>{`${t("PremiumFree.InquiryForm.Inquirer")}`}</h2>
                    </div>
                    <form className="inquri-full-form">
                        <div>
                            <InputField
                                label={`${t("signup.Name")}`}
                                fromrowStyleclass=""
                                name="name"
                                value={inquiryDataForm.name}
                                placeholder={`${t("signup.Placeholder.Name")}`}
                                type="text"
                                lablestyleClass="login-label"
                                InputstyleClass="login-input form-input"
                                requiredClass="important-notes"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {inquiryDataFormError.nameError &&
                                <div className="position-relative">
                                    <p className="log-error">{inquiryDataFormError.nameError}</p>
                                </div>
                            }
                        </div>

                        <div className="mo-number">
                            <label className="login-label">
                                {`${t("PremiumFree.InquiryForm.Phone_Number")}`}<span className="important-notes"></span>
                            </label>

                            <NumberFormat
                                className="login-input form-input"
                                format="###-####-####"
                                // mask="_"
                                name="phone_number"
                                value={inquiryDataForm.phone_number}
                                placeholder={`${t("PremiumFree.InquiryForm.Placeholder.Phone_number")}`}
                                onChange={(e: any) => {
                                    // setInquryDataForm({ ...inquryDataForm, phone_number: e.target.value });
                                    handleChange(e);
                                }}
                            />

                            {inquiryDataFormError.phone_numberError &&
                                <div className="position-relative">
                                    <p className="log-error">{inquiryDataFormError.phone_numberError}</p>
                                </div>
                            }
                        </div>

                        <div>
                            <InputField
                                label={`${t("PremiumFree.InquiryForm.Email_address")}`}
                                fromrowStyleclass=""
                                name="email"
                                value={inquiryDataForm.email}
                                placeholder={`${t("PremiumFree.InquiryForm.Placeholder.Email_address")}`}
                                type="email"
                                lablestyleClass="login-label"
                                InputstyleClass="login-input form-input"
                                requiredClass="important-notes"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {inquiryDataFormError.emailError && (
                                <div className="position-relative">
                                    <p className="log-error">{inquiryDataFormError.emailError}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <InputField
                                label={`${t("PremiumFree.InquiryForm.Address")}`}
                                fromrowStyleclass=""
                                name="address"
                                value={inquiryDataForm.address}
                                placeholder={`${t("PremiumFree.InquiryForm.Placeholder.Address")}`}
                                type="text"
                                lablestyleClass="login-label address-label"
                                InputstyleClass="login-input form-input "
                                requiredClass="important-notes"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {inquiryDataFormError.addressError && (
                                <div className="position-relative">
                                    <p className="log-error">{inquiryDataFormError.addressError}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <InputField
                                label={`${t("PremiumFree.InquiryForm.Inquiry")}`}
                                fromrowStyleclass=""
                                name="inquiry"
                                value={inquiryDataForm.inquiry}
                                placeholder={`${t("PremiumFree.InquiryForm.Placeholder.Inquiry")}`}
                                type="textarea"
                                lablestyleClass="login-label"
                                InputstyleClass="login-input"
                                requiredClass="important-notes"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {inquiryDataFormError.inquiryError && (
                                <div className="position-relative">
                                    <p className="log-error">{inquiryDataFormError.inquiryError}</p>
                                </div>
                            )}
                        </div>

                        <Buttons
                            onClick={postInquiryForm}
                            ButtonStyle="inquiry-form-submit"
                            children={`${t("PremiumFree.InquiryForm.Save_Btn")}`}
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default InquiryForm
