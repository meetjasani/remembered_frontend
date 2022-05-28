import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import Buttons from '../../components/Buttons';
import Senddonationmoney from '../../modal/SendDonationMoney';
import AuthStorage from "../../helper/AuthStorage"
import { useHistory } from 'react-router';
import STORAGEKEY from '../../config/APP/app.config';
import { ApiPost } from '../../helper/API/ApiData';

const SendDonationReciept = () => {

    const { t } = useTranslation();
    const history = useHistory()
    const { innerWidth } = window
    const [donationData, setDonationData] = useState<any>();
    const [showDonationMsg, setShowDonationMsg] = useState(false);

    const confirmDonation = () => {
        setShowDonationMsg(true)
    }

    const postDonation = () => {
        const body = {
            recipient_name: donationData?.recipient_organization,
            name: donationData?.name,
            organization: donationData?.organization,
            donation_amount: donationData?.donationAmount.replace(',', ''),
            memorial_id: donationData?.memorial_id
        }
        ApiPost(`memorialHall/createMemorialHallDonation`, body)
            .then((res: any) => {
                setShowDonationMsg(false)
                AuthStorage.deleteKey(STORAGEKEY.donationData)
                if (innerWidth > 767) {
                    history.push('/memorialview?id=' + donationData.memorial_id)
                } else {
                    history.push('/memorialprofile?id=' + donationData.memorial_id)
                }
            })
            .catch((error) => {
            });
    }

    const cancleDonation = () => {
        history.push(`/senddonation?id=${donationData.memorial_id}`)
    }

    const closeDonationMsg = () => {
        setShowDonationMsg(false)
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        const donationData = AuthStorage.getStorageJsonData(STORAGEKEY.donationData)
        setDonationData(donationData)
    }, [])

    const backMemorialViewPage = () => {
        if (innerWidth > 767) {
            history.push('/memorialview?id=' + donationData.memorial_id)
        } else {
            history.push('/memorialprofile?id=' + donationData.memorial_id)
        }
    }

    return (
        <>
            <div className="bg-gray">
                <div className="my-page send-donation-form">
                    <div className="my-page-head">
                        <img src="./img/back-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={backMemorialViewPage} alt="" />
                        <h1>{`${t("SendDonation.Account_Information_for_donation")}`}</h1>
                    </div>
                    <div className="send-donation-popups send-donation-reciept">
                        <div className="send-donationtitle">
                            <p>{`${t("SendDonation.Guide_message_for_account_information")}`}</p>
                            <p>{`${t("SendDonation.Guide_message_for_account_information1")}`}</p>
                        </div>
                        <div className="donation-reciept">
                            <p className="reciept-number">{`${t("SendDonation.Account_Information")}`}</p>
                            <p className="reciept-name">{donationData?.bank_name} {donationData?.ac_number}   {`${t("SendDonation.Account_Holder")}`} {donationData?.recipient_organization} </p>
                        </div>
                        <form className="login-form ">

                            <div>
                                <label className="login-label">
                                    {`${t("SendDonation.Donation_recipient")}`}
                                </label>
                                <p className="login-results">{donationData?.recipient_organization}</p>
                            </div>

                            <div>
                                <label className="login-label">
                                    {`${t("SendDonation.Name")}`}
                                </label>
                                <p className="login-results">{donationData?.name}</p>
                            </div>

                            <div>
                                <label className="login-label">
                                    {`${t("SendDonation.Organization")}`}
                                </label>
                                <p className="login-results">{donationData?.organization}</p>
                            </div>

                            <div>
                                <label className="login-label">
                                    {`${t("SendDonation.Donation_Amount")}`}
                                </label>
                                <div className="total-doonation">
                                    <p className="amount-of-donation">{donationData?.donationAmount}</p>
                                    <p className="total-wonsymbol">{`${t("SendDonation.Won")}`}</p>
                                </div>
                            </div>

                            <div className="donationBtn-group">
                                <Buttons
                                    ButtonStyle="cancle-daonationBtn"
                                    onClick={cancleDonation}
                                    children={`${t("SendDonation.Cancel")}`}
                                />

                                <Buttons
                                    ButtonStyle="confirm-daonationBtn"
                                    onClick={confirmDonation}
                                    children={`${t("SendDonation.OK")}`}
                                />
                            </div>

                        </form>
                    </div>
                </div >
            </div >

            <Senddonationmoney show={showDonationMsg} onHide={closeDonationMsg} onConfirm={postDonation} />
        </>
    )
}

export default SendDonationReciept
