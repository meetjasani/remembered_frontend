import React, { useState, useEffect } from 'react'
import Pagination from "react-js-pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ApiGetNoAuth } from '../../helper/API/ApiData';
import { useHistory } from 'react-router';
import { useTranslation } from "react-i18next";

interface noticeData {
    content: string,
    created_at: string,
    date_of_entry: string,
    id: string,
    title: string,
    updated_at: string,
    write: string,
}
interface noticeDataList {
    count: number,
    funeralnews: noticeData[]
}
const Funeralnews = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [FuneralnewsDetailsPageNo, setFuneralnewsDetailsPageNo] = useState<number>(1)
    const [FuneralnewsDetailsData, setFuneralnewsDetailsData] = useState<noticeDataList>({
        count: 10,
        funeralnews: [{
            content: "",
            created_at: "",
            date_of_entry: "",
            id: "",
            title: "",
            updated_at: "",
            write: "",
        }]
    })
    const gotoFuneralNewsDetail = (id: string) => {
        history.push(`/funeralDetails?id=${id}`);
    }
    useEffect(() => {
        ApiGetNoAuth(
            `general/getFuneralNewsByUser?per_page=${10}&page_number=${FuneralnewsDetailsPageNo}`
        ).then((res: any) => {
            setFuneralnewsDetailsData(res.data);
        });
    }, [FuneralnewsDetailsPageNo])

    return (
        <>
            <div className="bg-gray furnel-news-page">
                <div className="small-container">
                    <div className="furnel-head">
                        <h1>{`${t("FuneralNews.Funeral_News")}`}</h1>
                    </div>
                    <table className="furnel-table">
                        <tbody>
                            {FuneralnewsDetailsData?.funeralnews?.map((items: noticeData, i: number) => {
                                return (
                                    <tr className="funeralnews-table cursor-pointer" key={i}>
                                        <td className="sr-number">{(FuneralnewsDetailsPageNo - 1) * 10 + (i + 1)}</td>
                                        <td className="content-table" onClick={() => { gotoFuneralNewsDetail(items.id) }}>{items.title}</td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                    <div className="pagination-notice">
                        <Pagination
                            itemClass="page-item-custom"
                            activeLinkClass="activepage"
                            linkClass="page-link-custom"
                            linkClassFirst="page-first-arrow"
                            linkClassPrev="page-first-arrow"
                            linkClassNext="page-first-arrow"
                            linkClassLast="page-first-arrow"
                            firstPageText={<></>}
                            lastPageText={<></>}
                            prevPageText={<FontAwesomeIcon icon={faChevronLeft} />}
                            nextPageText={<FontAwesomeIcon icon={faChevronRight} />}
                            activePage={FuneralnewsDetailsPageNo}
                            itemsCountPerPage={10}
                            pageRangeDisplayed={10}
                            totalItemsCount={FuneralnewsDetailsData.count}
                            onChange={(e) => {
                                setFuneralnewsDetailsPageNo(e);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Funeralnews
