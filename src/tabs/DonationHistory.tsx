import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Pagination from "react-js-pagination";
import { RootStateOrAny, useSelector } from 'react-redux';
import STORAGEKEY from '../config/APP/app.config';
import { ApiDelete, ApiGetNoAuth, ApiPostNoAuth } from '../helper/API/ApiData';
import AuthStorage from '../helper/AuthStorage';
import DeletePopUp from '../modal/DeletePopUp';

interface Props {
    isPrivate: boolean;
    userData: any;
    hallData: any;
    getmemorialViewID: () => void;
}

interface Table {
    donation_amount: string,
    donation_created_date: string,
    id: string,
    name: string,
    organization: string
}
interface TableList {
    AllCount: number,
    count: number;
    donationHistoryData: Table[];
}

const DonationHistory: React.FC<Props> = ({ isPrivate, userData, hallData, getmemorialViewID }) => {
    const { t } = useTranslation();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const [showDeleteDonationPopup, setShowDeleteDonationPopup] = useState(false);
    const [donetionHistoryTablePageNo, setdonetionHistoryTablePageNo] = useState<number>(1)
    const [donationHistoryTableData, setDonationHistoryTableData] = useState<TableList>({
        AllCount: 10,
        count: 10,
        donationHistoryData: []
    })
    const [deleteID, setDeleteID] = useState("")
    const getUniqeNo = AuthStorage.getStorageData(STORAGEKEY.uniqeId)

    const deleteTempPost = () => {
        const body = {
            random_number: getUniqeNo
        }
        ApiPostNoAuth(`memorialHall/deleteNonMemberMemorialPost`, body)
            .then((response: any) => {

            })
            .catch(
                (error: any) => {

                });
    }


    const deleteDonation = (deleteID: string) => {
        setDeleteID(deleteID)
        setShowDeleteDonationPopup(true);
    }

    const hideDeleteDonationPopup = () => {
        setShowDeleteDonationPopup(false);
    }

    const handleDelete = () => {
        ApiDelete(`memorialHall/deleteMemorialHallDonationById/${deleteID}`, {})
            .then((response: any) => {
                setDeleteID("")
                getDonationHistoryData()
                hideDeleteDonationPopup()
                getmemorialViewID()
            })
            .catch((error: any) => { });
    }

    const getDonationHistoryData = () => {
        ApiGetNoAuth(`memorialHall/getAllMemorialHallDonationByID/${hallData?.id}?per_page=10&page_number=${donetionHistoryTablePageNo}`)
            .then((res: any) => {
                setDonationHistoryTableData(res?.data)
            })
            .catch((error) => {
            });
    }

    useEffect(() => {
        if (is_loggedin) {
            getDonationHistoryData()
        }
    }, [donetionHistoryTablePageNo, is_loggedin])

    useEffect(() => {
        if (getUniqeNo) {
            AuthStorage.deleteKey(STORAGEKEY.uniqeId)
            deleteTempPost()
        }
    }, [])

    return (
        <>
            {!isPrivate &&
                <div className="donetion-history-content">
                    <div className="donetion-history-head">
                        <h1 className="donetion-history-title">{hallData.donation_serives[0].Introduction}</h1>
                        {/* <h1 className="donetion-history-title">`${t("DonationHistory.title")}`}</h1>
                        <h1 className="donetion-history-title"> {`${t("DonationHistory.donation_title")}`}</h1> */}
                    </div>
                    {donationHistoryTableData?.donationHistoryData.length === 0 &&
                        <div className="donetion-history-header-top-border"></div>
                    }

                    <div className="donate-history-tables">
                        {donationHistoryTableData?.donationHistoryData.length > 0 &&
                            <table>
                                <tbody>
                                    {donationHistoryTableData?.donationHistoryData.map((tddata: any, i: number) =>
                                        <tr key={i}>
                                            <td>{(donetionHistoryTablePageNo - 1) * 10 + (i + 1)}</td>
                                            <td>{tddata.name}</td>
                                            <td>{tddata.organization}</td>
                                            <td>{tddata.donation_amount}{`${t("MemorialView.Won")}`}</td>
                                            <td>{tddata.donation_created_date}</td>
                                            <td>
                                                {!isPrivate && userData?.id === hallData.user_id &&
                                                    <button className="x-buttons" onClick={() => deleteDonation(tddata?.id)}>
                                                        <img src="../img/closeGray.svg" alt="" />
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        }
                    </div>

                    {donationHistoryTableData?.donationHistoryData.length > 0 &&
                        <div className="pagination-notice">
                            <Pagination
                                itemClass="page-item-custom"
                                activeLinkClass="activepage"
                                linkClass="page-link-custom"
                                linkClassFirst="page-first-arrow"
                                linkClassPrev="page-first-arrow"
                                linkClassNext="page-first-arrow"
                                linkClassLast="page-first-arrow"
                                prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                                firstPageText={<><FontAwesomeIcon icon={faAngleLeft} /><FontAwesomeIcon icon={faAngleLeft} /></>}
                                lastPageText={<><FontAwesomeIcon icon={faAngleRight} /><FontAwesomeIcon icon={faAngleRight} /></>}
                                nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                                activePage={donetionHistoryTablePageNo}
                                itemsCountPerPage={10}
                                pageRangeDisplayed={10}
                                totalItemsCount={donationHistoryTableData?.count}
                                onChange={(e: any) => {
                                    setdonetionHistoryTablePageNo(e);
                                }}
                            />
                        </div>
                    }
                </div>
            }
            {!donationHistoryTableData?.donationHistoryData.length && !isPrivate &&
                <div className="no-donetion-history">
                    <div className="memorialmessage">
                        <div className="memorialmessage-content">
                            <img src="../../img/DonationHistory-img.png" alt="" />
                            <h1>{`${t("DonationHistory.Theres_no_donation_history")}`}</h1>
                        </div>
                    </div>
                </div>
            }
            {isPrivate && (
                <div className="memorialmessage">
                    <div className="memorialmessage-content">
                        <img src="../../img/lock-img.svg" alt="" />
                        <h1>{`${t("MemorialMessage.This_is_a_private_account")}`}</h1>
                        <h1>{`${t("MemorialMessage.Please_follow_the_account_to_see_photo_and_video")}`}</h1>
                    </div>
                </div>
            )}
            <DeletePopUp show={showDeleteDonationPopup} onHide={hideDeleteDonationPopup} handleDelete={handleDelete} />
        </>
    )
}

export default DonationHistory
