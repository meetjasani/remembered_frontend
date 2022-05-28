import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import Buttons from '../../components/Buttons';
import { useHistory } from 'react-router';

function PriceGuides() {
    const { t } = useTranslation();
    const history = useHistory();
    const inquiryForm = () => {
        history.push("/premiumfree")
    }
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="bg-gray-trans">
            <div className="body-content price-page">
                <div className="body-content-inner">
                    <div className="bg-flower">
                        <div className="flower-overlay">
                            <div className="about-inner-content small-container">
                                <div className="home-title-tex" >
                                    <div className="title-priceGuide">
                                        <h1>{`${t("PriceGuide.Premium_Service")}`}</h1>
                                        <h2>{`${t("PriceGuide.Guide")}`} <span>{`${t("PriceGuide.Price")}`}</span></h2>
                                    </div>
                                    <div className="priceguide-contact">
                                        <div>
                                            <p>{`${t("PriceGuide.Contact_Number")}`}   <span>  080-1588-0000 </span>
                                                <br />{`${t("PriceGuide.Hours_of_Service")}`}  <span>   09 : 00 - 18 : 00 </span></p>
                                        </div>
                                        <div>
                                            <Buttons
                                                ButtonStyle="apply-consulation"
                                                onClick={inquiryForm}
                                                children={`${t("PriceGuide.Apply_consultation_Btn")}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="small-container priceguide-page">
                        <div className="price-guide-inner">
                            <div className="priceguide-box" >
                                <div className="single-priceguide-inner">
                                    <div className="price-guide-and-image">
                                        <div>
                                            <img src="./img/book-img.svg" className="d-md-block d-none" alt="" />
                                            <img src="./img/book-img-mob.svg" className="d-md-none" alt="" />

                                        </div>
                                        <div className="price-priceguide">
                                            <h3>{`${t("PriceGuide.PriceGuide_card1_tag")}`}</h3>
                                        </div>
                                    </div>
                                    <div className="priceguide-left-content">
                                        <div className="content-priceguide">
                                            <h1>{`${t("PriceGuide.PriceGuide_card1_title1")}`}</h1>
                                            <h3>{`${t("PriceGuide.PriceGuide_card1_title2")}`}</h3>
                                            <p>{`${t("PriceGuide.PriceGuide_card1_content")}`}</p>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            <div className="priceguide-box" >
                                <div className="single-priceguide-inner">
                                    <div className="price-guide-and-image">
                                        <div>
                                            <img src="./img/Frame-youtube.svg" className="d-md-block d-none" alt="" />
                                            <img src="./img/Frame-youtube-mob.svg" className="d-md-none" alt="" />

                                        </div>
                                        <div className="price-priceguide">
                                            <h3>{`${t("PriceGuide.PriceGuide_card2_tag1")}`}</h3>
                                            <p>{`${t("PriceGuide.PriceGuide_card2_tag2")}`}</p>
                                            <p>{`${t("PriceGuide.PriceGuide_card2_tag3")}`}</p>
                                        </div>
                                    </div>
                                    <div className="priceguide-left-content">
                                        <div className="content-priceguide">
                                            <h1>{`${t("PriceGuide.PriceGuide_card2_title1")}`}</h1>
                                            <h3>{`${t("PriceGuide.PriceGuide_card2_title2")}`}</h3>
                                            <p>{`${t("PriceGuide.PriceGuide_card2_content")}`}</p>
                                        </div>


                                    </div>
                                </div>
                            </div>


                            <div className="priceguide-box" >
                                <div className="single-priceguide-inner">
                                    <div className="price-guide-and-image">
                                        <div>
                                            <img src="./img/Group 12841.svg" className="d-md-block d-none" alt="" />
                                            <img src="./img/board-mob.svg" className="d-md-none" alt="" />

                                        </div>
                                        <div className="price-priceguide">
                                            <h3>{`${t("PriceGuide.PriceGuide_card3_tag")}`}</h3>
                                        </div>
                                    </div>
                                    <div className="priceguide-left-content">
                                        <div className="content-priceguide">
                                            <h1>{`${t("PriceGuide.PriceGuide_card3_title1")}`}</h1>
                                            <h3>{`${t("PriceGuide.PriceGuide_card3_title2")}`}</h3>
                                            <p>{`${t("PriceGuide.PriceGuide_card3_content")}`}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="priceguide-box" >
                                <div className="single-priceguide-inner">
                                    <div className="price-guide-and-image">
                                        <div>
                                            <img src="./img/Group 12840.svg" className="d-md-block d-none" alt="" />
                                            <img src="./img/dollar-mob.svg" className="d-md-none" alt="" />

                                        </div>
                                        <div className="price-priceguide">
                                            <h3>BASIC <br /> PREMIUM</h3>
                                        </div>
                                    </div>
                                    <div className="priceguide-left-content">
                                        <div className="content-priceguide">
                                            <h1>{`${t("PriceGuide.PriceGuide_card4_title1")}`}</h1>
                                            <h3>{`${t("PriceGuide.PriceGuide_card4_title2")}`}</h3>
                                            <h3>{`${t("PriceGuide.PriceGuide_card4_title3")}`}</h3>
                                            <p>{`${t("PriceGuide.PriceGuide_card4_content")}`}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="premium-table-main" >
                                    <table className="premium-table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>BASIC</th>
                                                <th>PREMIUM</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row1_cell1")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row1_cell2")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row1_cell3")}`}</td>
                                            </tr>

                                            <tr>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row2_cell1")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row2_cell2")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row2_cell3")}`}</td>
                                            </tr>

                                            <tr>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row3_cell1")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row3_cell2")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row3_cell3")}`}</td>
                                            </tr>

                                            <tr>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row4_cell1")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row4_cell2")}`}</td>
                                                <td>{`${t("PriceGuide.PriceGuide_table_row4_cell3")}`}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* 
                    <div className="about-board small-container">
                        <div className="about-board-inner">
                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/namskar-img.svg" />
                                </div>
                                <div className="ml-auto data-single-board">
                                    <h3>{`${t("About_Remembered_Page.Funeral_Culture")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Funeral_Culture")}`}</h6>

                                </div>
                            </div>

                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/pan-img.svg" />
                                </div>
                                <div className="ml-auto data-single-board data-single-price">
                                    <h3>{`${t("About_Remembered_Page.Obituary_and_Memorial")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Obituary_and_Memorial")}`}</h6>
                                </div>
                                <div className="priceguid-price">
                                    <h3>30만원 -</h3>
                                    <p>모니터대여비</p>
                                    <p>5만원</p>
                                </div>
                            </div>

                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/world-img.svg" />
                                </div>
                                <div className="ml-auto data-single-board">
                                    <h3>{`${t("About_Remembered_Page.Online_funeral")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Online_funeral")}`}</h6>
                                </div>
                            </div>

                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/hart-img.svg" />
                                </div>
                                <div className="ml-auto data-single-board">
                                    <h3>{`${t("About_Remembered_Page.Online_service")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Online_service")}`}</h6>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default PriceGuides
