import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import FaqAccordion from './FaqAccordion';
import { ApiGet } from '../../helper/API/ApiData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-js-pagination";

interface faq {
    answer: string;
    created_at: string;
    id: number;
    question: string;
    updated_at: string;
    view_count: number;
}
interface faqList {
    count: number;
    faq: faq[];
}

const Faq = () => {

    const { t } = useTranslation();
    const [faqPageNo, setFaqPageNo] = useState<number>(1)
    const [faqData, setFaqData] = useState<faqList>({
        count: 10,
        faq: [{
            answer: "",
            created_at: "",
            id: 0,
            question: "",
            updated_at: "",
            view_count: 0
        }]
    })
    const [faqOpen, setFaqOpen] = useState<boolean[]>([])
    useEffect(() => {
        ApiGet(
            `general/faq?per_page=${10}&page_number=${faqPageNo}`
        ).then((res: any) => {
            let temp = []
            if (Object.keys(res.data).length > 0) {
                for (let i = 0; i <= res.data?.faq.length; i++) {
                    temp.push(false)
                }
                setFaqData(res.data);
            } else {
                setFaqData(res.data);
            }
            setFaqOpen(temp)
        });
    }, [faqPageNo])
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="faq-bg-gray">
            <div className="small-container faq-container" >
                <div className="faq-hade">
                    <h1>{`${t("Faq.Faq_title")}`}</h1>
                </div>
                {faqData?.faq?.map((items: faq, i: number) => {
                    const faqTitle = items.question;
                    const faqAnswer = items.answer
                    return (
                        <div key={i}>
                            <FaqAccordion SrNo={(faqPageNo - 1) * 10 + (i + 1)} title={faqTitle} children={faqAnswer} faqOpen={faqOpen} index={i} setFaqOpen={setFaqOpen} />
                        </div>
                    )
                }
                )}
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
                        activePage={faqPageNo}
                        itemsCountPerPage={10}
                        pageRangeDisplayed={10}
                        totalItemsCount={faqData.count}
                        onChange={(e) => {
                            setFaqPageNo(e);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Faq

///Faq