import { useEffect, useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import '../homepage/homepage.css'
import Buttons from '../../components/Buttons';
import { useTranslation } from 'react-i18next';
import { ApiGet, ApiGetNoAuth, ApiPost } from '../../helper/API/ApiData';
import { useHistory } from 'react-router';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../redux/actions/userDataAction';
import { StatusType } from '../../helper/Constant';
import fillHeartSVG from '../../img/fill-heart.svg'
import sliderHartVecotar from '../../img/slider-hart-vecotar.svg'
import Register from "../../modal/Register";
import ReactHtmlParser from 'react-html-parser';
import AddFriend from '../../modal/AddFriend';
import CancelFriend from '../../modal/CancelFriend';
import AOS from 'aos';

interface memorialHallDetail {
    id: string,
    image: string,
    name: string,
    date_of_death: string,
    date_of_birth: string,
    job_title: string,
    user_id: string,
    friend_list: Array<[]>
}

const Homepage = () => {
    const { t } = useTranslation();
    const history = useHistory()
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(window.location.search);
    const searchTerm = queryParams.get('search_term')?.toString();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const [memorialHallDetailCard, setMemorialHallDetailCard] = useState<memorialHallDetail[]>([])
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const [servicePlan, setServicePlan] = useState("");
    const [addFriendOpen, setAddFriendOpen] = useState<boolean>(false);
    const [cancelFriendOpen, setCancelFriendOpen] = useState<boolean>(false);
    const [friendData, setFriendData] = useState<any>([]);
    const [funeralnewsData, setFuneralnewsData] = useState([]);

    const { innerWidth } = window
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const basicServicePlan = () => {
        if (!is_loggedin) {
            // history.push(`/login`);
            setLoginOpen(true)
        } else {
            setServicePlan("Basic");
        }
    }

    const premiumServicePlan = () => {
        // if (innerWidth < 768) {
        //     if (!is_loggedin) {
        //         setLoginOpen(true)
        //     } else {
        //         setServicePlan("Premium");
        //     }
        // } else {
        setServicePlan("Premium");
        // }


    }

    useEffect(() => {
        if (servicePlan !== "") {
            history.push(`/premiumfree?servicePlanType=${servicePlan}`);
        }
    }, [servicePlan])

    const homepagefirstcard = {
        arrows: true,
        infinite: false,
        speed: 500,
        centerMode: false,
        centerPadding: '0px',
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    centerMode: false,
                }
            },
            {
                breakpoint: 991,

                settings: {
                    slidesToShow: 2,
                    centerMode: false,

                }
            },
            {
                breakpoint: 768,

                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    centerPadding: '10px 0 0 0',
                }
            },
            // {
            //     breakpoint: 480,
            //     centerMode: true,
            //     centerPadding: '100px',
            //     settings: {
            //         slidesToShow: 2,

            //     }
            // }

        ]
    };
    const homepagesecondcard = {
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: false,
        centerPadding: '0px',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,

                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    centerPadding: '35px 0 0 0',


                }
            }

        ]
    };

    const goToHallView = (id: string) => {
        if (innerWidth > 767) {
            history.push('/memorialview?id=' + id)
        } else {
            history.push('/memorialprofile?id=' + id)
        }
    }

    const goToMemorialHallStatus = () => {
        history.push(`/memorialhallstatus?search_term=${searchTerm ? searchTerm : ""}`)
    }

    const GetMemorialHallsNoAuth = () => {
        ApiGetNoAuth(`memorialHall/memorialHalls?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
            setMemorialHallDetailCard(res?.data?.memorials.slice(0, 9));
        }).catch()
    }

    const GetMemorialHalls = () => {
        ApiGet(`memorialHall/getMemorialHallAuth?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
            setMemorialHallDetailCard(res?.data?.memorials.slice(0, 9));
        }).catch()
    }

    const openFriendpopUp = () => {
        setAddFriendOpen(true);
    }

    const openCancelFriendpopUp = () => {
        setCancelFriendOpen(true);
    }

    const onHides = () => {
        setAddFriendOpen(false);
        setCancelFriendOpen(false);
    }

    const addFriend = () => {
        const body = {
            sender_id: userData?.id,
            receiver_id: friendData?.user_id,
            memorial_id: friendData?.id
        }

        ApiPost(`memorialHall/addFriend`, body)
            .then((res: any) => {
                GetMemorialHalls()
                setAddFriendOpen(false)
                setFriendData([]);
            })
            .catch((error) => {
                setAddFriendOpen(false)
                setFriendData([]);
            });

    }

    const cancelStatusOfFriendRequest = () => {

        // const body = {
        //     id: addFriendData.id,
        //     status: addFriendData.status
        // }
        // ApiPost(`memorialHall/chnageFriendStatus`, body)
        //     .then((res: any) => {
        //         getFriendList()
        //         setFriendOpen(false);
        //         setAddFriendOpen(false);
        //         addFriendData([]);
        //     })
        //     .catch((error) => {
        //     });
    }

    const getStatus = (item: memorialHallDetail): boolean => {
        let flag: boolean = false;
        if (item?.friend_list?.length > 0) {
            item?.friend_list?.map((data: any) => {
                if (data.sender_id === userData?.id && data.status === StatusType.Confirm) {
                    flag = true
                } else {
                    flag = false
                }
            })
        } else {
            flag = false
        }
        return flag
    }

    const chnageStatusOfFriend = () => {
        let friendId = friendData?.friend_list.find((data: any) => data?.sender_id === userData?.id)?.id
        let friendStatus = friendData?.friend_list.find((data: any) => data?.sender_id === userData?.id)?.status

        const body = {
            id: friendId,
            status: friendStatus
        }
        ApiPost(`memorialHall/chnageFriendStatus`, body)
            .then((res: any) => {
                GetMemorialHalls()
                setCancelFriendOpen(false);
                setFriendData([]);
            })
            .catch((error) => {
            });
    }

    const goToRegisterHall = () => {
        if (is_loggedin) {
            history.push('/memorialhall')
        } else {
            setLoginOpen(true)
        }
    }

    const goToPriceGuide = () => {
        history.push('/priceguide')
    }

    const goToFuneralNews = () => {
        history.push('/funeralnews')
    }

    const onHide = () => {
        setLoginOpen(false)
    }

    const goToLogin = () => {
        history.push("/Registration");
    }

    const getFuneralNews = () => {
        ApiGet(
            `general/getFuneralNewsHomeByUser`
        ).then((res: any) => {
            setFuneralnewsData(res.data);
        });
    }

    useEffect(() => {
        if (is_loggedin) {
            setMemorialHallDetailCard([]);
            dispatch(getUserData())
            GetMemorialHalls()
        } else {
            setMemorialHallDetailCard([]);
            GetMemorialHallsNoAuth()
        }
        getFuneralNews()
    }, [is_loggedin])

    useEffect(() => {
        if (is_loggedin) {
            setMemorialHallDetailCard([]);
            dispatch(getUserData())
            GetMemorialHalls()
            getFuneralNews()
        } else {
            setMemorialHallDetailCard([]);
            GetMemorialHallsNoAuth()
        }
    }, [searchTerm])

    useEffect(() => {
        AOS.init({
            duration: 2000
        });
    }, []);

    return (
        <>
            <div className="body-content home-page">
                <div className="body-content-inner">
                    <div className="bg-flower">
                        <div className="flower-overlay" >
                            <div className="about-inner-content small-container" >
                                <div className="home-title-tex" data-aos="fade-up" data-aos-duration="1500">
                                    <h1>{`${t("Home_Page.title")}`}</h1>
                                    <h2>{`${t("Home_Page.title2")}`}</h2>
                                    <p>{`${t("Home_Page.titlep1")}`}<br />{`${t("Home_Page.titlep2")}`}<br />{`${t("Home_Page.titlep3")}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home-board small-container" >
                        {/* <div className="home-container"> */}
                        <div className="slid-content testimonial" data-aos="fade-left" data-aos-duration="1500">
                            {memorialHallDetailCard?.length > 0 &&
                                memorialHallDetailCard?.length >= 3 &&
                                <Slider {...homepagefirstcard}>
                                    {memorialHallDetailCard && memorialHallDetailCard?.map((item) =>
                                        // <div className="slide-card cursor-pointer">
                                        <div className="slide-card cursor-pointer" onClick={() => goToHallView(item?.id)} key={item?.id}>
                                            <div className="home-slide-cad-content">
                                                <div className="card-img">
                                                    <img src={item?.image || "./img/Avatar.png"} className="slider-profil-img" alt="" onError={(e: any) => { e.target.onerror = null; e.target.src = "./img/Avatar.png" }} />
                                                    {!is_loggedin &&
                                                        <img
                                                            src={sliderHartVecotar}
                                                            alt=""
                                                            className="slider-hart-img 1"
                                                            onClick={(event: any) => {
                                                                event.stopPropagation()
                                                                setLoginOpen(true)
                                                            }}
                                                        />
                                                    }
                                                    {(is_loggedin && item?.user_id !== userData?.id) ?
                                                        getStatus(item) === true ?
                                                            <img
                                                                src={fillHeartSVG}
                                                                alt=""
                                                                className="slider-hart-img 1"
                                                                onClick={(event: any) => {
                                                                    event.stopPropagation()
                                                                    setFriendData(item)
                                                                    openCancelFriendpopUp()
                                                                }}
                                                            />
                                                            :
                                                            <img
                                                                src={sliderHartVecotar}
                                                                alt=""
                                                                className="slider-hart-img 1"
                                                                onClick={(event: any) => {
                                                                    event.stopPropagation()
                                                                    setFriendData(item)
                                                                    openFriendpopUp()
                                                                }}
                                                            />
                                                        :
                                                        ""
                                                    }
                                                </div>
                                                <div className="card-content">
                                                    <h3>{(item?.name).length >= 10 ? (item?.name).slice(0, 10) + '...' : item?.name}</h3>
                                                    <h5>{item?.date_of_birth} - {item?.date_of_death}</h5>
                                                    <h4>{(item?.job_title).length >= 20 ? (item?.job_title).slice(0, 20) + '...' : item?.job_title}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Slider>
                            }


                            <div className="d-flex" >
                                {memorialHallDetailCard?.length > 0 &&
                                    memorialHallDetailCard?.length < 3 &&
                                    memorialHallDetailCard?.map((item) => (
                                        <div className="slide-card cursor-pointer custom-width-card" onClick={() => goToHallView(item?.id)} data-aos="fade-left" data-aos-duration="1500" key={item?.id}>
                                            <div className="home-slide-cad-content">
                                                <div className="card-img">
                                                    <img src={item?.image || "./img/Avatar.png"} className="slider-profil-img" alt="" onError={(e: any) => { e.target.onerror = null; e.target.src = "./img/Avatar.png" }} />
                                                    {getStatus(item) === true}
                                                    {(is_loggedin && item?.user_id !== userData?.id) ?
                                                        getStatus(item) === true ?
                                                            <img
                                                                src={fillHeartSVG}
                                                                alt=""
                                                                className="slider-hart-img 1"
                                                                onClick={(event: any) => {
                                                                    event.stopPropagation()
                                                                    setFriendData(item)
                                                                    openCancelFriendpopUp()
                                                                }}
                                                            />
                                                            :
                                                            <img
                                                                src={sliderHartVecotar}
                                                                alt=""
                                                                className="slider-hart-img 1"
                                                                onClick={(event: any) => {
                                                                    event.stopPropagation()
                                                                    setFriendData(item)
                                                                    openFriendpopUp()
                                                                }}
                                                            />
                                                        :
                                                        ""
                                                    }
                                                </div>
                                                <div className="card-content">
                                                    <h3>{item?.name}</h3>
                                                    <h5>{item?.date_of_death}</h5>
                                                    <h4>{item?.job_title}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div data-aos="fade-up" data-aos-duration="1500">
                                {memorialHallDetailCard?.length > 0 &&
                                    <Buttons
                                        ButtonStyle="memorial-card-caraousel-btn"
                                        onClick={goToMemorialHallStatus}
                                        children={`${t("Home_Page.View_more_btn")}`}
                                    />
                                }
                            </div>
                        </div>
                        <div className="apply-memorialhall-sec"
                            data-aos="fade-zoom-in"
                            data-aos-easing="ease-in-back"
                            data-aos-delay="300"
                            data-aos-offset="0">
                            <div className="apply-memorialhall-sec-title">
                                <h1>{`${t("Home_Page.Apply_Memorial_Hall_title1")}`}</h1>
                                <div className="apply-memorialhall-sec-header">
                                    <h1>{`${t("Home_Page.Apply_Memorial_Hall_title2")}`}</h1>
                                    <Buttons
                                        ButtonStyle="apply-memorialhall-sec-Btn"
                                        onClick={goToRegisterHall}
                                        children={`${t("Home_Page.Apply_btn")}`}
                                    />
                                </div>
                            </div>
                            <div className="apply-memorialhall-sec-content">
                                <div className="apply-memorialhall-sec-card mt-0">
                                    <div className="apply-memorialhall-sec-img">
                                        <img src="./img/Video-Sharing-Service-img.svg" alt="" />
                                    </div>
                                    <div className="apply-memorialhall-sec-text">
                                        <h1>{`${t("Home_Page.apply_hall_card1_title")}`}</h1>
                                        <h2>{`${t("Home_Page.apply_hall_card1_text")}`}</h2>
                                    </div>
                                </div>
                                <div className="apply-memorialhall-sec-card2 mt-0">
                                    <div className="apply-memorialhall-sec-img">
                                        <img src="./img/Memorial-Message-img.svg" alt="" />
                                    </div>
                                    <div className="apply-memorialhall-sec-text">
                                        <h1>{`${t("Home_Page.apply_hall_card2_title")}`}</h1>
                                        <h2>{`${t("Home_Page.apply_hall_card2_text")}`}</h2>
                                    </div>
                                </div>
                                <div className="apply-memorialhall-sec-card2">
                                    <div className="apply-memorialhall-sec-img">
                                        <img src="./img/Footprints-img.svg" alt="" />
                                    </div>
                                    <div className="apply-memorialhall-sec-text">
                                        <h1>{`${t("Home_Page.apply_hall_card3_title")}`}</h1>
                                        <h2>{`${t("Home_Page.apply_hall_card3_text")}`}</h2>
                                    </div>
                                </div>
                                <div className="apply-memorialhall-sec-card">
                                    <div className="apply-memorialhall-sec-img">
                                        <img src="./img/Memorial-Donation-Money-img.svg" alt="" />
                                    </div>
                                    <div className="apply-memorialhall-sec-text">
                                        <h1>{`${t("Home_Page.apply_hall_card4_title")}`}</h1>
                                        <h2>{`${t("Home_Page.apply_hall_card4_text")}`}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>





                        <div className="home-price-guide" data-aos="fade-up" data-aos-duration="1500">
                            <div className="home-price-guide-title">
                                <h1>{`${t("Home_Page.Basic_Free_Service_title1")}`}</h1>
                                <h1>{`${t("Home_Page.Basic_Free_Service_title2")}`}</h1>
                                <div className="home-price-guide-header">
                                    <h1>{`${t("Home_Page.Basic_Free_Service_title3")}`}</h1>
                                    <Buttons
                                        ButtonStyle="home-price-guide-btn"
                                        onClick={goToPriceGuide}
                                        children={`${t("Home_Page.Price_Guide_btn")}`}
                                    />
                                </div>
                            </div>
                            <div className="home-price-guide-content">
                                <div className="Basic-Free-Service-card">
                                    <div className="Basic-Free-Service-card-title">
                                        <h1>{`${t("Home_Page.Basic_Free_Service_card_title")}`}</h1>
                                        <img src="./img/basic-hart-img.svg" alt="" />
                                    </div>
                                    <div className="Basic-Free-Service-card-btn">
                                        <Buttons
                                            ButtonStyle="Basic-Free-Service-basic-btn"
                                            onClick={() => { }}
                                            children={`${t("Home_Page.basic_btn")}`}
                                        />
                                    </div>
                                    <div>
                                        <div className="basic-benifit-one">
                                            <h6 className="">{`${t("Home_Page.basic_card_lable1")}`}</h6>
                                            <p className="">{`${t("Home_Page.basic_card_lable1_p")}`}</p>
                                        </div>

                                        <div className="basic-benifit-two">
                                            <h6 className="">{`${t("Home_Page.basic_card_lable2")}`}</h6>
                                            <p className="">{`${t("Home_Page.basic_card_lable2_p")}`}</p>
                                        </div>

                                        <div className="basic-benifit-three">
                                            <h6 className="">{`${t("Home_Page.basic_card_lable3")}`}</h6>
                                            <p className="">{`${t("Home_Page.basic_card_lable3_p")}`}</p>
                                        </div>
                                        <div className="card-last-text">{`${t("Home_Page.basic_card_last_text")}`}</div>
                                    </div>
                                    <Buttons
                                        ButtonStyle="basic-card-bottom-btn"
                                        onClick={basicServicePlan}
                                        children={`${t("Home_Page.basic_card_Use_Service_btn")}`}
                                    />
                                </div>
                                <div className="Basic-Free-Service-card">
                                    <div className="Basic-Free-Service-card-title">
                                        <h1>{`${t("Home_Page.Premium_Service_title")}`}</h1>
                                        <img src="./img/premium-hart-img.svg" alt="" />
                                    </div>
                                    <div className="Basic-Free-Service-card-btn">
                                        <Buttons
                                            ButtonStyle="Basic-Free-Service-premium-btn"
                                            onClick={() => { }}
                                            children={`${t("Home_Page.Premium_Service_btn")}`}
                                        />
                                    </div>
                                    <div>
                                        <div className="premium-benifit-one">
                                            <h6 className="">{`${t("Home_Page.Premium_card_lable1")}`}</h6>
                                            <p className="">{`${t("Home_Page.Premium_card_lable1_p")}`}</p>
                                        </div>
                                        <div className="premium-benifit-two">
                                            <h6 className="">{`${t("Home_Page.Premium_card_lable2")}`}</h6>
                                            <p className="pa-1">{`${t("Home_Page.Premium_card_lable2_p")}`}</p>
                                            <p className="pa-2">{`${t("Home_Page.Premium_card_lable2_p2")}`}</p>
                                        </div>
                                        <div className="premium-benifit-three">
                                            <h6 className="">{`${t("Home_Page.Premium_card_lable3")}`}</h6>
                                            <p className="pa-1">{`${t("Home_Page.Premium_card_lable3_p")}`}</p>
                                            <p className="pa-2">{`${t("Home_Page.Premium_card_lable3_p2")}`}</p>
                                        </div>
                                        <div className="premium-benifit-four">
                                            <h6 className="">{`${t("Home_Page.Premium_card_lable4")}`}</h6>
                                            <p className="pa-1">{`${t("Home_Page.Premium_card_lable4_p")}`}</p>
                                            <p className="pa-2">{`${t("Home_Page.Premium_card_lable4_p2")}`}</p>
                                        </div>
                                    </div>
                                    <Buttons
                                        ButtonStyle="premium-card-bottom-btn"
                                        onClick={premiumServicePlan}
                                        children={`${t("Home_Page.Premium_card_last_btn")}`}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="testimonial-slick-card" data-aos="fade-up" data-aos-duration="1500">
                            <div className="testimonial-slick-card-title">
                                <h1>{`${t("Home_Page.Funeral_News_title")}`}</h1>
                            </div>
                            <div className="testimonial-slick-card-caraousel">
                                {funeralnewsData?.length > 0 &&
                                    funeralnewsData?.length > 2 &&
                                    <Slider {...homepagesecondcard}>
                                        {funeralnewsData?.map((data: any) =>

                                            <div className="slide-card" key={data?.id}>
                                                <div className="secon-slid-card">
                                                    <div className="second-slid-text">
                                                        <h1>{data?.title}</h1>
                                                        <h3 className="ck-content">{ReactHtmlParser(data?.content)}</h3>
                                                    </div>
                                                    <p className="testimonial-paragraph">{data?.date_of_entry} . {data?.write} </p>
                                                </div>
                                            </div>

                                        )}
                                    </Slider>
                                }

                                {funeralnewsData?.length > 0 &&
                                    funeralnewsData?.length <= 2 &&
                                    // <Slider {...homepagesecondcard}>
                                    funeralnewsData?.map((data: any) =>

                                        <div className="slide-card" key={data?.id}>
                                            <div className="secon-slid-card">
                                                <div className="second-slid-text">
                                                    <h1>{data?.title}</h1>
                                                    <h3 className="ck-content">{ReactHtmlParser(data?.content)}</h3>
                                                </div>
                                                <p className="testimonial-paragraph">{data?.date_of_entry} . {data?.write} </p>
                                            </div>
                                        </div>

                                    )
                                    // </Slider>
                                }
                                {/* <div className="slide-card">
                                        <div className="secon-slid-card">
                                            <div className="second-slid-text">
                                                <h1>{`${t("Home_Page.Funeral_slid_card_title")}`}</h1>
                                                <h3>{`${t("Home_Page.Funeral_slid_card_text")}`}</h3>
                                                <p>{`${t("Home_Page.Funeral_slid_card_date")}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="slide-card">
                                        <div className="secon-slid-card">
                                            <div className="second-slid-text">
                                                <h1>{`${t("Home_Page.Funeral_slid_card_title")}`}</h1>
                                                <h3>{`${t("Home_Page.Funeral_slid_card_text")}`}</h3>
                                                <p>{`${t("Home_Page.Funeral_slid_card_date")}`}</p>
                                            </div>
                                        </div>
                                    </div> */}

                            </div>
                            <div>
                                <Buttons
                                    ButtonStyle="testiminial-caraousel-btn"
                                    onClick={goToFuneralNews}
                                    children={`${t("Home_Page.See_news_btn")}`}
                                />
                            </div>
                        </div>
                        <div className="" data-aos="fade-up" data-aos-duration="1500">
                            <Buttons
                                ButtonStyle="banner1-btn"
                                onClick={() => { }}
                                children={`${t("Home_Page.See_banner_btn1")}`}
                            />
                            <Buttons
                                ButtonStyle="banner2-btn"
                                onClick={() => { }}
                                children={`${t("Home_Page.See_banner_btn2")}`}
                            />
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>

            {loginOpen && <Register show={loginOpen} onHide={onHide} goToRegister={goToLogin} />}
            {addFriendOpen && <AddFriend show={addFriendOpen} onHide={onHides} addfriend={addFriend} cancelStatusOfFriendRequest={cancelStatusOfFriendRequest} />}
            {cancelFriendOpen && <CancelFriend show={cancelFriendOpen} onHide={onHides} deleteFriend={chnageStatusOfFriend} />}
        </>

    )
}

export default Homepage
