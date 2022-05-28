import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AboutRemembered = () => {
    const { t } = useTranslation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="bg-gray-trans">
            <div className="body-content">
                <div className="body-content-inner">
                    <div className="bg-flower">
                        <div className="flower-overlay">
                            <div className="about-inner-content small-container">
                                <div className="header-about">
                                    <h1>{`${t("About_Remembered_Page.About_Title1")}`}<br />{`${t("About_Remembered_Page.About_Title2")}`}</h1>
                                </div>
                                <div className="about-content">
                                    <h3>{`${t("About_Remembered_Page.About_Content1")}`} <br />
                                        {`${t("About_Remembered_Page.About_Content2")}`}<br />
                                        {`${t("About_Remembered_Page.About_Content3")}`}<br />
                                        {`${t("About_Remembered_Page.About_Content4")}`}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="about-board small-container">
                        <div className="about-board-inner">
                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/namskar-img.svg" className="about-deskimg" alt=""/>
                                    <img src="./img/mob-1.svg" className="about-mobiimg" alt=""/>
                                </div>
                                <div className="ml-auto data-single-board">
                                    <h3>{`${t("About_Remembered_Page.Funeral_Culture")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Funeral_Culture")}`}</h6>

                                </div>
                            </div>

                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/pan-img.svg" className="about-deskimg" alt=""/>
                                    <img src="./img/mob-2.svg" className="about-mobiimg" alt=""/>
                                </div>
                                <div className="ml-auto data-single-board">
                                    <h3>{`${t("About_Remembered_Page.Obituary_and_Memorial")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Obituary_and_Memorial")}`}</h6>
                                </div>
                            </div>

                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/world-img.svg" className="about-deskimg" alt=""/>
                                    <img src="./img/mob-3.svg" className="about-mobiimg" alt=""/>
                                </div>
                                <div className="ml-auto data-single-board">
                                    <h3>{`${t("About_Remembered_Page.Online_funeral")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Online_funeral")}`}</h6>
                                </div>
                            </div>

                            <div className="about-single-board d-flex align-items-center">
                                <div>
                                    <img src="./img/hart-img.svg" className="about-deskimg" alt=""/>
                                    <img src="./img/mob-4.svg" className="about-mobiimg" alt=""/>
                                </div>
                                <div className="ml-auto data-single-board">
                                    <h3>{`${t("About_Remembered_Page.Online_service")}`}</h3>
                                    <h6>{`${t("About_Remembered_Page.About_Online_service")}`}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutRemembered
