import React, { useEffect, useState } from 'react'
import { ApiGetNoAuth } from '../../helper/API/ApiData';
import ReactHtmlParser from 'react-html-parser';
import { useTranslation } from "react-i18next";
import Buttons from '../../components/Buttons';
import { useHistory } from 'react-router';
interface noticeData {
    content: string | any,
    created_at: string,
    id: number,
    title: string
}
const Funeralnewsdetail: React.FC<any> = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const [data, setData] = useState<noticeData>();
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id')?.toString();

    const backToList = () => {
        history.push("/funeralnews")
    }

    useEffect(() => {
        if (id) {
            ApiGetNoAuth(`general/getFuneralNewsByID/${id}`)
                .then((res: any) => {
                    setData(res.data);
                })
        }
    }, [id])


    return (
        <>
            <div className="bg-gray furnel-news-page">
                <div className="small-container">
                    <div className="furnel-head">
                        <h1>{`${t("FuneralNews.Funeral_News")}`}</h1>
                    </div>
                    <div className="furnel-detailspage">
                        <div className="single-Furnel">
                            <p>{data?.title} </p>
                        </div>

                        <div className="single-funrel-details">
                            <div className="ck-content">
                                {ReactHtmlParser(data?.content)}
                            </div>
                        </div>
                    </div>
                    <div className="back-button-funeral-news">
                        <Buttons
                            ButtonStyle="back-button-funeral-news-black"
                            onClick={backToList}
                            children={`${t("FuneralNews.Look_at_the_list")}`}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Funeralnewsdetail