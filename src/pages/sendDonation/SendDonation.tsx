import { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import InputField from '../../components/Inputfield';
import Buttons from '../../components/Buttons';
import { useHistory } from 'react-router';
import { ApiGet } from '../../helper/API/ApiData';
import AuthStorage from "../../helper/AuthStorage"
import STORAGEKEY from '../../config/APP/app.config';
import ReactHtmlParser from 'react-html-parser';
interface sendDonationHistory {
    name: string;
    organization: string;
    donationAmount: string;
}

const SendDonation = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id')?.toString();
    const { innerWidth } = window
    const sendDonationHistory: sendDonationHistory = {
        name: "",
        organization: "",
        donationAmount: ""
    };

    const [displayDonationAmount, setDisplayDonationAmount] = useState("");
    const [donationData, setDonationData] = useState(sendDonationHistory);
    const [donation, setDonation] = useState<any>();

    const resetFormError = {
        nameError: "",
        organizationError: "",
        donationAmountError: ""
    };
    const [formError, setFormError] = useState(resetFormError);

    const donationDataStorage = AuthStorage.getStorageJsonData(STORAGEKEY.donationData)
    useEffect(() => {
        window.scrollTo(0, 0);
        // handleDonation(3)
        // setSelectedDonation("3")
    }, [])

    useEffect(() => {
        // AuthStorage.deleteKey(STORAGEKEY.donationData)
        ApiGet(`memorialHall/getDonationMoneyDetailByID/${id}`)
            .then((res: any) => {
                setDonation(res?.data)

            }).catch((error) => {
                console.error("error", error);
            })



        if (donationDataStorage) {
            setDonationData({
                name: donationDataStorage.name,
                organization: donationDataStorage.organization,
                donationAmount: donationDataStorage.donationAmount
            })

            // if (+donationDataStorage.donationAmount.replace(',', '') > 0 && +donationDataStorage.donationAmount.replace(',', '') <= 10000) {
            //     setSelectedDonation("1")
            // }
            // if (+donationDataStorage.donationAmount.replace(',', '') >= 30000 && +donationDataStorage.donationAmount.replace(',', '') < 50000) {
            //     setSelectedDonation("3")
            // }
            // if (+donationDataStorage.donationAmount.replace(',', '') >= 50000 && +donationDataStorage.donationAmount.replace(',', '') < 100000) {
            //     setSelectedDonation("5")
            // }
            // if (+donationDataStorage.donationAmount.replace(',', '') >= 100000) {
            //     setSelectedDonation("10")
            // }

        }
    }, [])

    const handleChange = (e: any) => {
        setDonationData({ ...donationData, [e.target.name]: e.target.value });
    }

    const priceDonate = [
        {
            amount: "10,000",
            display: "1"
        },
        {
            amount: "30,000",
            display: "3"
        },
        {
            amount: "50,000",
            display: "5"
        },
        {
            amount: "100,000",
            display: "10"
        },
    ]

    const validate = (): boolean => {
        let flag = true
        if (donationData.name === "") {
            setFormError({ ...formError, nameError: `${t("signup.Errors.This_is_required_information")}` })
            flag = false
        }
        if (donationData.organization === "") {
            setFormError({ ...formError, organizationError: `${t("signup.Errors.This_is_required_information")}` })
            flag = false
        }
        if (donationData.donationAmount === "") {
            setFormError({ ...formError, donationAmountError: `${t("signup.Errors.This_is_required_information")}` })
            flag = false
        }
        return flag
    }
    const goSendDonationReciept = () => {
        if (!validate()) {
            return
        }

        const sessionDonationData = {
            name: donationData.name,
            organization: donationData.organization,
            donationAmount: donationData.donationAmount,
            recipient_organization: donation?.recipient_organization,
            memorial_id: id,
            bank_name: donation?.bank_name,
            ac_number: donation?.ac_number,
        }

        AuthStorage.setStorageJsonData(STORAGEKEY.donationData, sessionDonationData, false)
        history.push('/donationreciept')
    }

    const handleDonation = (items: any) => {
        let firstAmount
        let finalAmount
        let amVal = parseInt(items.amount.replace(/,/g , ''))
        if(donationData.donationAmount === "") {
            firstAmount = 0
        } else {
            firstAmount =  parseInt(donationData.donationAmount.replace(/,/g , ''))
        }
        finalAmount = amVal + firstAmount
        let storeAmount = finalAmount.toLocaleString()
        setDonationData({
            ...donationData,
            donationAmount: storeAmount
        })
    }

    useEffect(() => {
        setDisplayDonationAmount(donationData.donationAmount)
    }, [donationData.donationAmount])

    const backMemorialViewPage = () => {
        if (innerWidth > 767) {
            history.push('/memorialview?id=' + id)
        } else {
            history.push('/memorialprofile?id=' + id)
        }
    }

    return (
        <>
            <div className="bg-gray">
                <div className="my-page send-donation-form">
                    <div className="my-page-head">
                        <img src="./img/back-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={backMemorialViewPage} alt="" />
                        <h1>{`${t("SendDonation.Send_a_donation")}`}
                            <br />
                            <span>{ReactHtmlParser(donation?.Introduction)}</span>
                        </h1>

                    </div>
                    <div className="send-donation-popups">
                        <div className="send-donationtitle">
                            <p>{ReactHtmlParser(donation?.Introduction)}</p>
                            {/* <p>고인은 생전 미혼모 복지 분야에 대한 관심과 애정으로 평소 정성스러운 마음과 물질을 나누셨습니다. 유족들은 고인의 유지를 잇기 위해 은평구 복지시설을 계속 지원하기로 했습니다.</p> */}
                        </div>
                        <div className="donation-reciept">
                            <p className="reciept-number">{`${t("SendDonation.Donation_Recipient")}`}</p>
                            <p className="reciept-name">{donation?.recipient_organization}</p>
                        </div>
                        <form className="login-form ">
                            <InputField
                                label={`${t("SendDonation.Name")}`}
                                fromrowStyleclass=""
                                name="name"
                                value={donationData.name}
                                placeholder={`${t("SendDonation.Enter_name")}`}
                                type="text"
                                lablestyleClass="login-label"
                                InputstyleClass="login-input"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {formError.nameError && (
                                <div className="position-relative">
                                    <p className="log-error">{formError.nameError}</p>
                                </div>
                            )}
                            <InputField
                                label={`${t("SendDonation.Organization")}`}
                                fromrowStyleclass=""
                                name="organization"
                                value={donationData.organization}
                                placeholder={`${t("SendDonation.Enter_the_recipient’s_organization")}`}
                                type="text"
                                lablestyleClass="login-label"
                                InputstyleClass="login-input"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {formError.organizationError && (
                                <div className="position-relative">
                                    <p className="log-error">{formError.organizationError}</p>
                                </div>
                            )}
                            <div>
                                <label className="login-label">
                                    {`${t("SendDonation.Donation_Amount")}`}
                                </label>
                                <div className="donation-amountradio">
                                    {priceDonate.map((items) =>
                                        <div className="radio-btn ">
                                            <label className="radio-btn-detail ">
                                                <input
                                                    type="radio"
                                                    name="city"
                                                    id="button"
                                                    value=""
                                                    checked={false}
                                                    onClick={(e) => {
                                                            handleDonation(items)
                                                    }}
                                                />
                                                <div className="radio-check font-16-normal">+ {items.display}{`${t("SendDonation.Won")}`}</div>
                                            </label>
                                        </div>
                                    )}
                                </div>


                                <div className="won-input">
                                    <InputField
                                        label=""
                                        fromrowStyleclass=""
                                        name="donationAmount"
                                        value={donationData.donationAmount ? donationData.donationAmount : "0"}
                                        placeholder=""
                                        type="text"
                                        lablestyleClass="login-label"
                                        InputstyleClass="login-input"
                                        onChange={(e: any) => {
                                            handleChange(e);
                                        }}
                                    />

                                    <div className="won-symbol">{`${t("SendDonation.Won")}`}</div>
                                </div>
                                {formError.donationAmountError && (
                                    <div className="position-relative">
                                        <p className="log-error">{formError.donationAmountError}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="login-label">
                                        {`${t("SendDonation.Amount_to_donate")}`}
                                    </label>
                                    <div className="total-doonation">
                                        <p className="amount-of-donation">{displayDonationAmount ? displayDonationAmount : "0"}</p>
                                        <p className="total-wonsymbol">{`${t("SendDonation.Won1")}`}</p>
                                    </div>
                                </div>


                            </div>

                            <Buttons

                                ButtonStyle="my-page-save-btn"
                                onClick={goSendDonationReciept}
                                children={`${t("SendDonation.Send_a_donation")}`}

                            />

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SendDonation
