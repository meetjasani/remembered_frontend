import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import InquiryForm from './InquiryForm';
import { useTranslation } from 'react-i18next';


function PremiumFree() {
    const history = useHistory();
    const { t } = useTranslation();
    const [agreeBtn, setAgreeBtn] = useState(false);
    const [agreeErr, setAgreeErr] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    
    const backPriceguidePage = () => {
        history.push('/Priceguide')
    }

    const handleCheckbox = (e: boolean) => {
        if(e) {
            setAgreeErr(true)
        } else {
            setAgreeErr(false)
        }
    }

    return (
        <div className="bg-gray">
            <div className="xs-small-conatainer premium-and-free-page">
                <div className="my-page-head" >
                    <img src="./img/back-arrow.svg" className="d-md-none d-block page-back-arrow" alt="" onClick={backPriceguidePage} />
                    <h1>{`${t("PremiumFree.Premium_Service_Free_Consultation")}`}</h1>
                </div>
                <div className="premium-card-content" >
                    <div className="price-card">
                        <div>
                            <h3 className="price-contact-info text-center">{`${t("PremiumFree.Contact_Information")}`}</h3>
                            <h1 className="price-contact-number text-center">080-1588-0000</h1>
                            <div className="price-timetable">
                                <div className="d-flex ">
                                    <p className="time-table-days">{`${t("PremiumFree.Contact_Information_title1")}`}</p>
                                    <p className="timetable-hour">{`${t("PremiumFree.Contact_Information_title2")}`}</p>
                                </div>
                                <div className="d-flex price-timetable-row">
                                    <p className="time-table-days">{`${t("PremiumFree.Contact_Information_title3")}`}</p>
                                    <p className="timetable-hour">{`${t("PremiumFree.Contact_Information_title4")}`}</p>
                                </div>
                            </div>

                            <p className="contact-terms text-center">{`${t("PremiumFree.Contact_Information_content")}`}</p>
                        </div>
                    </div>

                </div>
                <div className="privact-policy-section">
                    <div >
                        <div className="premium-card-content">
                            <div className="title-privacy-policy">
                                <h3>{`${t("PremiumFree.Privacy_Policy")}`}</h3>
                                <h5>{`${t("PremiumFree.Required_Items")}`}</h5>
                            </div>
                        </div>
                        <div className="terms-table">
                            <div className="premium-card-content">
                                <div className="termstable-row">
                                    <div className="single-terms-row">
                                        <p>{`${t("PremiumFree.Collected_Items")}`}</p>
                                    </div>
                                    <div className="single-terms-row">
                                        <p>{`${t("PremiumFree.Purpose")}`}</p>
                                    </div>
                                    <div className="single-terms-row">
                                        <p>{`${t("PremiumFree.Retention_Period")}`}</p>
                                    </div>
                                </div>

                                <div className="terms-table-content">
                                    <div className="single-terms-row">
                                        <h6>{`${t("PremiumFree.PrivacyPolicy_row1_cell1")}`}</h6>
                                    </div>
                                    <div className="single-terms-row">
                                        <h6>{`${t("PremiumFree.PrivacyPolicy_row1_cell2_title1")}`}</h6>
                                        <h6>{`${t("PremiumFree.PrivacyPolicy_row1_cell2_title2")}`}</h6>
                                        <h6>{`${t("PremiumFree.PrivacyPolicy_row1_cell2_title3")}`}</h6>
                                    </div>
                                    <div className="single-terms-row">
                                        <h6>{`${t("PremiumFree.PrivacyPolicy_row1_cell3")}`}</h6>
                                    </div>
                                </div>

                                <div className="terms-confirmation">

                                    <div>
                                        <p>{`${t("PremiumFree.PrivacyPolicy_content")}`}</p>
                                    </div>
                                    <div className="ml-md-auto">
                                        <label
                                            className={
                                                agreeBtn
                                                    ? "agree-login-label-checkbox-checked"
                                                    : "agree-login-label-checkbox"
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    setAgreeBtn(e.target.checked);
                                                }}
                                                className="agree-checkbox-input"
                                            />
                                            {`${t("PremiumFree.PrivacyPolicy_checkbox_label")}`}
                                        </label>
                                        {agreeErr &&
                                            <div className="position-relative">
                                                <p className="log-error">{t("This_is_required_information")}</p>
                                            </div>
                                        }
                                    </div>

                                </div>
                            </div>
                            <InquiryForm checkedCheckBox={agreeBtn} handleCheckbox={(e: boolean) => handleCheckbox(e)} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PremiumFree
