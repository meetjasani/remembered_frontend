import React, { useEffect, useState } from 'react'
import moment from "moment";
import { Button } from 'react-bootstrap';
import Buttons from '../../components/Buttons';
import { ApiPost, ApiPostNoAuth } from '../../helper/API/ApiData';
import Album from '../../tabs/Album';
import DonationHistory from '../../tabs/DonationHistory';
import MemorialMessage from '../../tabs/MemorialMessage';
import MemorialPost from '../../tabs/MemorialPost';
import Video from '../../tabs/Video';
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { getUserData } from '../../redux/actions/userDataAction';
import MemorialDirectionPopup from './MemorialDirectionPopup';
import { useTranslation } from 'react-i18next';
import SharePopUp from '../../modal/SharePopUp';
import { MemorialHallStatusEnum, StatusType, ServiceDuration_en } from '../../helper/Constant';
import AuthStorage from "../../helper/AuthStorage";
import { useHistory } from 'react-router';
import fillHeartSVG from '../../img/fill-heart.svg'
import sliderHartVecotar from '../../img/slider-hart-vecotar.svg'
import STORAGEKEY from '../../config/APP/app.config';
import AddFriend from '../../modal/AddFriend';
import CancelFriend from '../../modal/CancelFriend';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Register from '../../modal/Register';
import MobMemorialView from '../mobile memorial view/MobMemorialView'

const MemorialView = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [data, setData] = useState<any>()
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id')?.toString();
    const isFromLogin = queryParams.get('isFromLogin')?.toString();

    const [activeBtn, setActiveBtn] = useState("");
    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const [memorialDirectionPopup, setMemorialDirectionPopup] = useState(false);
    const [selectBtn, setSelectBtn] = useState(false);
    const [selectVideoBtn, setSelectVideoBtn] = useState(false);
    const [showBtn, setShowBtn] = useState(false);
    const [showVideoBtn, setShowVideoBtn] = useState(false);
    const [editBtn, setEditBtn] = useState(true);
    const [editVideoBtn, setEditVideoBtn] = useState(true);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isShowSendDonationMoney, setIsShowSendDonationMoney] = useState(false);
    const [copiedClass, setCopiedClass] = useState("");
    const [addFriendOpen, setAddFriendOpen] = useState<boolean>(false);
    const [cancelFriendOpen, setCancelFriendOpen] = useState<boolean>(false);
    const [friendData, setFriendData] = useState<any>([]);
    const getUniqeNo = AuthStorage.getStorageData(STORAGEKEY.uniqeId)
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const [isDonationMoneyService, setIsDonationMoneyService] = useState<boolean>(false);
    const { innerWidth } = window
    const [splitAddress, setSplitAddress] = useState("");

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

    const goToLogin = () => {
        history.push("/login");
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        setCopiedClass("")
        if (getUniqeNo) {
            AuthStorage.deleteKey(STORAGEKEY.uniqeId)
            deleteTempPost()
        }
    }, []);

    useEffect(() => {
        if (data?.is_donation) {
            if (data?.donation_serives) {
                if (data?.donation_serives[0]?.ac_number === "" ||
                    data?.donation_serives[0]?.bank_name === ""
                ) {
                    setIsDonationMoneyService(false)
                } else {
                    setIsDonationMoneyService(true)
                }
            }

            if (data?.memorial_hall_type === MemorialHallStatusEnum.Private) {
                if (data?.user_id === userData?.id) {
                    setIsPrivate(false)
                } else {
                    if (is_loggedin) {
                        if (data?.friend_list) {
                            // const findInFriendList = data?.friend_list.filter((friendListdata: any) => (friendListdata?.sender_id === userData?.id && friendListdata?.status === StatusType.Confirm))
                            const findInFriendList = []
                            if (findInFriendList.length > 0) {
                                setIsPrivate(false)
                            } else {
                                setIsPrivate(true)
                            }
                        }
                    } else {
                        if (data?.memorial_hall_type === MemorialHallStatusEnum.Private) {
                            setIsPrivate(true)
                        } else {
                            setIsPrivate(false)
                        }
                    }
                }
            } else {
                setIsPrivate(false)
            }

        } else {
            setIsShowSendDonationMoney(false)
        }

        if (data?.is_condolences) {
            const today = moment();
            const hall_created_date = moment(data?.date_of_death, 'YYYY-MM-DD');
            const today_date = moment(today, 'YYYY-MM-DD');
            const dayDiff = today_date.diff(hall_created_date, 'days');

            if (data?.donation_serives[0]?.service_duration === "" || data?.donation_serives[0]?.service_duration === null || data?.donation_serives[0]?.service_duration === undefined) {
                // const todayDate = moment(new Date()).format('YYYY.MM.DD')
                if (moment(today_date).isSameOrBefore(hall_created_date)) {
                    setIsShowSendDonationMoney(true)
                } else {
                    setIsShowSendDonationMoney(false)
                }
            } else {

                if (data?.donation_serives[0]?.service_duration === ServiceDuration_en.days) {
                    if (dayDiff <= 3) {
                        setIsShowSendDonationMoney(true)
                    } else {
                        setIsShowSendDonationMoney(false)
                    }
                }
                if (data?.donation_serives[0]?.service_duration === ServiceDuration_en.week) {
                    if (dayDiff <= 7) {
                        setIsShowSendDonationMoney(true)
                    } else {
                        setIsShowSendDonationMoney(false)
                    }
                }
                if (data?.donation_serives[0]?.service_duration === ServiceDuration_en.month) {
                    if (dayDiff <= 30) {
                        setIsShowSendDonationMoney(true)
                    } else {
                        setIsShowSendDonationMoney(false)
                    }
                }
            }
        } else {
            setIsShowSendDonationMoney(false)
        }

        const script = document.createElement('script');

        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=c38ef9667188c5012eda6562f4403007&autoload=false&libraries=services`;
        document.head.appendChild(script);

        script.onload = () => {
            window?.kakao.maps.load(() => {
                let container = document.getElementById('map');
                let options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                };

                let tmpMap = new window.kakao.maps.Map(container, options);

                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new window.kakao.maps.services.Geocoder();
                // 주소로 좌표를 검색합니다
                if (data?.funeral_Address) {
                    let splitAddress = data?.funeral_Address.split(",");
                    setSplitAddress(splitAddress[2]);
                    geocoder.addressSearch(splitAddress[2], function (result: any, status: any) {
                        // 정상적으로 검색이 완료됐으면 
                        var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        tmpMap.setCenter(coords);
                    });
                }
            });
        };

        return () => script.remove();


    }, [data, userData])


    useEffect(() => {
        VisitorCount(id ? id : "")
        if (is_loggedin) {
            dispatch(getUserData())
        }

        if (id) {
            if (isFromLogin === "true") {
                ApiPost(`memorialHall/getMemorialHallByViewByInvitation/${id}`, {})
                    .then((res: any) => {
                        setData(res?.data)
                        setActiveBtn("MemorialMessage")
                    })
                    .catch((error) => {
                    });
            } else {
                if (is_loggedin) {
                    ApiPost(`memorialHall/getMemorialHallByView/${id}`, {})
                        .then((res: any) => {
                            setData(res?.data)
                            setActiveBtn("MemorialMessage")
                        })
                        .catch((error) => {
                        });
                } else {
                    ApiPostNoAuth(`memorialHall/getMemorialHallViewNoAuth/${id}`, {})
                        .then((res: any) => {
                            setData(res?.data)
                            setActiveBtn("MemorialMessage")
                        })
                        .catch((error) => {
                        });
                }
            }
        }

    }, [is_loggedin])


    const sendDonations = () => {
        if (is_loggedin) {
            AuthStorage.deleteKey(STORAGEKEY.donationData)
            history.push(`/senddonation?id=${id}`)
        } else {
            setLoginOpen(true)
        }

    }

    const getAllMPost = () => {

    }


    const refreshData = () => {
        setActiveBtn("Album")
        if (id) {
            if (isFromLogin === "true") {
                ApiPost(`memorialHall/getMemorialHallByViewByInvitation/${id}`, {})
                    .then((res: any) => {
                        setData(res?.data)
                    })
                    .catch((error) => {
                    });
            } else {
                if (is_loggedin) {
                    ApiPost(`memorialHall/getMemorialHallByView/${id}`, {})
                        .then((res: any) => {
                            setData(res?.data)
                        })
                        .catch((error) => {
                        });
                } else {
                    ApiPostNoAuth(`memorialHall/getMemorialHallViewNoAuth/${id}`, {})
                        .then((res: any) => {
                            setData(res?.data)
                        })
                        .catch((error) => {
                        });
                }
            }
        }
    }

    const refreshVideoData = () => {
        setActiveBtn("Video")
        if (id) {
            if (isFromLogin === "true" || is_loggedin) {
                ApiPost(`memorialHall/getMemorialHallByViewByInvitation/${id}`, {})
                    .then((res: any) => {
                        setData(res?.data)
                    })
                    .catch((error) => {
                    });
            } else {
                ApiPostNoAuth(`memorialHall/getMemorialHallViewNoAuth/${id}`, {})
                    .then((res: any) => {
                        setData(res?.data)
                    })
                    .catch((error) => {
                    });
            }
        }
    }

    const editAlbumBtn = (selectBtn: boolean, showBtn: boolean, editBtn: boolean) => {
        setSelectBtn(selectBtn)
        setShowBtn(showBtn)
        setEditBtn(editBtn)
    }

    const editvideoBtn = (selectBtn: boolean, showVideoBtn: boolean, editBtn: boolean) => {
        setSelectVideoBtn(selectBtn)
        setShowVideoBtn(showVideoBtn)
        setEditVideoBtn(editBtn)
    }

    const closeSharePopup = () => {
        setShowSharePopup(false)
    }

    const queryPopupShow = () => {
        setShowSharePopup(true)
    }
    // const copyLink = () => {
    //     setCopiedClass("copied-tooltiptext-visible")
    //     navigator.clipboard.writeText(window.location.href)
    // }

    const onCopy = () => {
        setCopiedClass("copied-tooltiptext-visible")
        // navigator.clipboard.writeText(window.location.href)
    }

    useEffect(() => {
        setTimeout(() => {
            setCopiedClass("")
        }, 2000);
    });

    const goToEditHall = () => {
        history.push(`/memorialhall?id=${id}`)
    }

    const getStatus = (): boolean => {
        let flag: boolean = false;
        if (data?.friend_list?.length > 0) {
            data?.friend_list?.map((data: any) => {
                if (data.sender_id === userData?.id && data.status === StatusType.Confirm) {
                    return flag = true
                } else {
                    return flag = false
                }
            })
        } else {
            flag = false
        }
        return flag
    }

    const getmemorialViewByID = () => {
        if (is_loggedin) {
            ApiPost(`memorialHall/getMemorialHallByView/${id}`, {})
                .then((res: any) => {
                    console.log("***************getMemorialHallByView", res);
                    setData(res?.data)
                    VisitorCount(res?.data?.id)
                    setActiveBtn("MemorialMessage")
                })
                .catch((error) => {
                });
        } else {
            ApiPostNoAuth(`memorialHall/getMemorialHallViewNoAuth/${id}`, {})
                .then((res: any) => {
                    console.log("***************getMemorialHallViewNoAuth", res);
                    setData(res?.data)
                    VisitorCount(res?.data?.id)
                    setActiveBtn("MemorialMessage")
                })
                .catch((error) => {
                });
        }
    }

    const getHallFromDonation = () => {
        if (is_loggedin) {
            ApiPost(`memorialHall/getMemorialHallByView/${id}`, {})
                .then((res: any) => {

                    console.log("***************getMemorialHallByView", res);

                    setData(res?.data)
                    VisitorCount(res?.data?.id)
                    setActiveBtn("DonationHistory")
                })
                .catch((error) => {
                });
        }
    }

    const chnageStatusOfFriend = () => {

        let displayFriendStatus = friendData?.friend_list.find((data: any) => data?.sender_id === userData?.id)?.status
        if (displayFriendStatus === StatusType.Waiting) {
            return
        }
        let friendId = friendData?.friend_list.find((data: any) => data?.sender_id === userData?.id)?.id
        let friendStatus = friendData?.friend_list.find((data: any) => data?.sender_id === userData?.id)?.status
        const body = {
            id: friendId,
            status: friendStatus
        }

        ApiPost(`memorialHall/chnageFriendStatus`, body)
            .then((res: any) => {
                getmemorialViewByID();
                setCancelFriendOpen(false);
                setFriendData([]);

            })
            .catch((error) => {
            });
    }

    const openFriendpopUp = () => {
        setAddFriendOpen(true);
    }

    const openCancelFriendpopUp = () => {
        setCancelFriendOpen(true);
    }

    const onHide = () => {
        setAddFriendOpen(false);
        setCancelFriendOpen(false);
        setLoginOpen(false)
    }


    const addFriend = () => {
        const body = {
            sender_id: userData?.id,
            receiver_id: friendData?.user_id,
            memorial_id: friendData?.id
        }

        ApiPost(`memorialHall/addFriend`, body)
            .then((res: any) => {
                console.log("***************getMemorialHallByView", res);

                getmemorialViewByID()
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

    const VisitorCount = (hallID: string) => {
        ApiPostNoAuth(`memorialHall/createMemorialHallVisitor/${hallID}`, {})
            .then((res: any) => {
            })
            .catch((error) => {
            });
    }

    const BackMemorialView = () => {
        history.push('/memorialhallstatus')
    }

    const dateOfCoffOut = (date_of_carrying_the_coffin_out: any) => {
        if (date_of_carrying_the_coffin_out) {
            let var1 = date_of_carrying_the_coffin_out.split(" ")
            let var2 = var1[2]
            let var3
            if (var2 === "AM") {
                var3 = "오전"
            }
            if (var2 === "PM") {
                var3 = "오후"
            }

            return `${var1[0]} ${var3} ${var1[1]}`

        } else {
            return date_of_carrying_the_coffin_out
        }
    }

    const removeLastChild = (add: any) => {
        let splitAdd = add.split(" ")
        let newArr = splitAdd.splice(0, 1)
        let finalString = newArr.join(" ")
        return finalString
    }


    return (
        <>
            {innerWidth > 991 ?
                <>
                    <img src="./img/white-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={BackMemorialView} alt=""></img>
                    <div className="body-content-inner bg-gray-color memorial-view-all">
                        <div className="memorial" style={{ backgroundImage: `url(${data?.image || "../img/flower.png"})` }}>
                            {/* <video src="https://firebasestorage.googleapis.com/v0/b/project-r-16d2f.appspot.com/o/AlbumAndVideo-1632304523325.webm?alt=media" autoPlay className=" z-0  mx-auto" /> */}

                            {/* <div className="blur-screen"></div> */}
                            <div className="container-profile small-container">
                                <div className="profile-content">
                                    <div className="visitor visitor-personal-data" >
                                        <h6 className=" visitor-total item2" ><span className="visitor-label">{`${t("MemorialView.Visitors")}`}  </span> <span className="orange">{data?.visitors} </span> {`${t("MemorialView.people")}`}  </h6>
                                        <h1 className={!isPrivate ? 'visitor-heading item4' : 'visitor-heading item4 mb-0'} >{`${t("MemorialView.MemorialView_Title_We_Remember_the")}`}<br />{`${t("MemorialView.MemorialView_Title_Valuable_Memories")}`}<br />{`${t("MemorialView.MemorialView_Title_with_You.")}`}</h1>
                                        <div className={!isPrivate ? 'links' : 'd-none'} >
                                            <div className="visitor-links">
                                                {!isPrivate && isShowSendDonationMoney &&
                                                    <>
                                                        {`${t("MemorialView.Registerer")}`}
                                                        <p className="text-data-white register"> {data?.registerer} </p>
                                                    </>
                                                }
                                            </div>
                                            <div className="pl-pr-20">{!isPrivate && isShowSendDonationMoney && <> | </>}</div>
                                            <div className="visitor-links" >
                                                {!isPrivate && isShowSendDonationMoney &&
                                                    <>
                                                        {`${t("MemorialView.Funeral_Address")}`}
                                                        <p className="text-data-white "> {data?.funeral_Address.slice(0, 7)}</p> &nbsp; <span className="cursor-pointer" onClick={() => { setMemorialDirectionPopup(true) }}>{`${t("MemorialView.Directions")}`} </span>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <div className={!isPrivate ? 'links' : 'd-none'} >
                                            <div className="visitor-links">
                                                {!isPrivate && isShowSendDonationMoney &&
                                                    <>
                                                        {`${t("MemorialView.Date_of_carrying_the_coffin_out")}`}
                                                        <p className="text-data-white register" > {dateOfCoffOut(data?.date_of_carrying_the_coffin_out)} </p>
                                                    </>
                                                }
                                            </div>
                                            <div className="pl-pr-20">{!isPrivate && isShowSendDonationMoney && <> | </>}</div>
                                            <div className="visitor-links">
                                                {!isPrivate && isShowSendDonationMoney &&
                                                    <>
                                                        {`${t("memorial_hall_register.Burial_Plot")}`}<p className="text-data-white"> {removeLastChild(data?.burial_plot)} </p>
                                                    </>
                                                }

                                            </div>
                                        </div>
                                        <div className={!isPrivate ? 'edit-button-edit' : 'edit-button-edit private-edit-button-edit'}>
                                            <div className="copied-tooltip">
                                                <CopyToClipboard onCopy={onCopy} text={window.location.href}>
                                                    {/* <span>Copy to clipboard with span</span> */}
                                                    {/* <button onClick={copyLink}> */}
                                                    <img src="../img/edit-profile.svg" alt="" />
                                                    {/* </button> */}
                                                </CopyToClipboard>
                                                <span className={`${copiedClass} copied-tooltiptext`}>{`${t("MemorialView.Link_Copied")}`}</span>
                                            </div>
                                            {userData && userData?.id === data?.user_id &&
                                                <button onClick={goToEditHall}><img src="../img/edit-icons.svg" alt="" /></button>
                                            }
                                        </div>
                                        <div>
                                            {memorialDirectionPopup && <MemorialDirectionPopup onHide={() => { setMemorialDirectionPopup(false) }} funaralHallName={removeLastChild(data?.room_number)} addressData={data?.funeral_Address} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!isPrivate &&
                                <div className="moneyGuid bg-white " >
                                    <div className="sec-tickets">
                                        <h1>{`${t("MemorialView.Memorial_Money_Guide")}`}</h1>
                                        {isShowSendDonationMoney &&
                                            data?.money_account &&
                                            data?.money_account.map((data: any, index: any) =>
                                                <div className="jus-bet" key={index}>
                                                    <div>
                                                        <p>{data?.name}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <h2>{data?.bank_name} {data?.ac_number}</h2>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>

                                    <div className="sec-tickets" >
                                        <h1 className="text-left" style={{ letterSpacing: "-1px" }}  >{`${t("MemorialView.Total_Donation_Amount")}`}</h1>
                                        <h3 className="orange sec-ticket-count"  >{data?.total_donation_amount} <span>{`${t("MemorialView.Won")}`}</span> </h3>
                                        <Button
                                            className={!isShowSendDonationMoney || !isDonationMoneyService ? "btnDisabled" : "bg-orange"}
                                            disabled={!isShowSendDonationMoney || !isDonationMoneyService}
                                            onClick={() => { sendDonations() }}
                                        >
                                            {`${t("Modal.Title.Send_Donation_Money")}`}
                                        </Button>
                                        {/* <button className="bg-orange" disabled={!isShowSendDonationMoney} onClick={() => {  }} >{`${t("Modal.Title.Send_Donation_Money")}`}</button> */}
                                    </div>

                                    <div className="sec-tickets" >
                                        <h1> {`${t("MemorialView.Donation_History")}`}</h1>
                                        {data?.donation_history &&
                                            data?.donation_history.map((item: any, index: number) => (
                                                index <= 2 && (
                                                    <div className="jus-bet" key={index}>
                                                        <div>
                                                            <p>{item?.name}</p>
                                                        </div>
                                                        <div className="ml-auto">
                                                            <h2 className="orange" >{item?.donation_amount}{`${t("MemorialView.Won")}`} </h2>
                                                        </div>
                                                    </div>
                                                )
                                            ))
                                        }
                                    </div>

                                    <div className="sec-tickets" >
                                        <h1>{`${t("MemorialView.Family_members")}`} </h1>
                                        <div className="family-member-name-row">
                                            {data?.invite_family_members &&
                                                data?.invite_family_members.map((data: any, index: any) =>
                                                    <div className="family-member-name" key={index}>
                                                        <h3>{data.name} {data.name === "" ? null : `(${data?.relationship})`}</h3>
                                                        {/* <h3 > {`${data?.name} (${getRelationByLangauge(data?.relationship)})`}</h3> */}
                                                    </div>
                                                )

                                            }

                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="profile-big main-memorial-hall-status small-container">
                            <div className="">
                                <div className="profile-photo" >
                                    <img className="img" src={data?.image || "../img/Avatar.png"} alt="" onError={(e: any) => { e.target.onerror = null; e.target.src = "./img/Avatar.png" }} />

                                    {/* <div className="heart-icon"> */}
                                    {/* {getStatus()} */}
                                    {!isPrivate &&

                                        (is_loggedin && data?.user_id !== userData?.id) ?
                                        getStatus() === true ?
                                            <div className="heart-icon">
                                                <img
                                                    src={fillHeartSVG}
                                                    alt=""
                                                    onClick={(event: any) => {
                                                        event.stopPropagation()
                                                        setFriendData(data)
                                                        openCancelFriendpopUp()
                                                    }}
                                                />
                                            </div>
                                            :
                                            <div className="heart-icon">
                                                <img
                                                    src={sliderHartVecotar}
                                                    alt=""
                                                    onClick={(event: any) => {
                                                        event.stopPropagation()
                                                        setFriendData(data)
                                                        openFriendpopUp()
                                                    }}
                                                />
                                            </div>
                                        :
                                        ""
                                    }
                                    {/* <img src="../img/Frame.png" alt="" /> */}


                                </div>

                                <div className="profile-daterange" >
                                    <p className="date-death">{data?.date_of_birth} - {data?.date_of_death}</p>
                                    <h2 className="person-name">{data?.memorial_hall_name}</h2>
                                    <div className="person-area-sec">
                                        <p className="person-area"><span className="d-md-none ">{`${t("MemorialView.Registerer")}`} </span>{data?.job_title}</p>
                                    </div>

                                </div>


                                <div className="follower-row" >
                                    <div className="d-flex">
                                        <div className="info-persons">
                                            <div><img src="../img/Group 12430.svg" alt="" /></div>
                                            <div><label className="total-counts-label">{`${t("MemorialView.Followers")}`}</label></div>
                                            <div><p className="total-counts">{data?.followers}</p></div>
                                        </div>
                                        {userData && userData?.id === data?.user_id && isShowSendDonationMoney &&
                                            <div className="send-query ml-md-auto">
                                                <Buttons
                                                    ButtonStyle="send-query-btn"
                                                    onClick={queryPopupShow}
                                                    children={`${t("MemorialView.Send_Obituary")}`}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                                {isShowSendDonationMoney && !isPrivate &&
                                    <div className="info-death-person" >
                                        <p>{data?.Introduction}</p>
                                    </div>
                                }
                            </div>

                            <div className="d-md-none mobile-map-content" >
                                <div className="mobile-map-info ">
                                    {!isPrivate &&
                                        <>
                                            <p className="map-info-heading">{`${t("MemorialView.Date_of_carrying_the_coffin_out")}`} </p>
                                            <p className="map-info-content ml-auto" > {data?.date_of_carrying_the_coffin_out} </p>
                                        </>
                                    }
                                </div>
                                <div className="mobile-map-info">
                                    {!isPrivate &&
                                        <>
                                            <p className="map-info-heading"> {`${t("memorial_hall_register.Burial_Plot")}`}111111 </p>   <p className="map-info-content ml-auto"> {data?.burial_plot} </p>
                                        </>
                                    }
                                </div>
                                {/* <div className="mobile-map-info"> */}
                                <div className={!data?.money_account ? " d-none" : "mobile-map-info"}>
                                    {!isPrivate &&
                                        <>
                                            {data?.money_account &&
                                                data?.money_account.map((money_data: any, index: any) => (
                                                    <div key={index}>
                                                        <p className="map-info-heading"> {money_data?.name} </p>
                                                        <p className="map-info-content ml-auto"> {money_data?.bank_name} {money_data?.ac_number} </p>
                                                        <p className="colored-account-info"> {`${t("MemorialView.Copy_Bank")}`}</p>
                                                    </div>))
                                            }
                                        </>
                                    }
                                </div>
                                <div className="mobile-map-info">
                                    {!isPrivate &&
                                        <>
                                            <p className="map-info-heading"> {`${t("PremiumFree.InquiryForm.Address")}`} </p>   <p className="map-info-content ml-auto"> {data?.funeral_Address} </p>
                                        </>
                                    }
                                </div>
                                <div className="mobile-map-info">
                                    <Button className="total-counterpages">
                                        공주 장례식장 4호
                                    </Button>
                                </div>
                                <div className="mobile-map-info">
                                    {!isPrivate &&
                                        <>
                                            <p className="map-info-heading"> {`${t("MemorialView.Phone_Number")}`} </p>   <p className="map-info-content ml-auto"> -- </p>
                                        </>
                                    }
                                </div>

                                <div className="location-section">
                                    <div className="map-loaction">
                                        <div id="map" style={{ width: "100%", height: "200px", marginBottom: "15px" }} />
                                        <div className="location-button">
                                            <CopyToClipboard text={splitAddress}>
                                                <Button
                                                    onClick={() => { }}
                                                    className="copy-addressBtn"
                                                >
                                                    {`${t("MemorialDirectionPopup.Copy_the_address")}`}
                                                </Button>
                                            </CopyToClipboard>
                                            <Button
                                                onClick={() => { }}
                                                className="closeAddress-Btn"
                                            >
                                                {`${t("MemorialView.Call")}`}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="mob-padding-tab-row" >
                                <div className=" black d-flex profile-tab-row align-items-center">
                                    <div className=" black d-flex ">
                                        <Button
                                            onClick={() => { setActiveBtn("MemorialMessage") }}
                                            className={activeBtn === "MemorialMessage" ? 'memorial-view-tab-btns-silected pl-0' : 'memorial-view-tab-btns pl-0'}
                                        >
                                            {`${t("MemorialView.Memorial_Message")}`}
                                        </Button>
                                        <Button
                                            onClick={() => { setActiveBtn("MemorialPost") }}
                                            className={activeBtn === "MemorialPost" ? 'memorial-view-tab-btns-silected' : 'memorial-view-tab-btns'}
                                        >
                                            {`${t("MemorialView.Memorial_Post")}`}
                                        </Button>
                                        <Button
                                            onClick={() => { setActiveBtn("Album") }}
                                            className={activeBtn === "Album" ? 'memorial-view-tab-btns-silected' : 'memorial-view-tab-btns'}
                                        >
                                            {`${t("MemorialView.Album")}`}
                                        </Button>
                                        <Button
                                            onClick={() => { setActiveBtn("Video") }}
                                            className={activeBtn === "Video" ? 'memorial-view-tab-btns-silected' : 'memorial-view-tab-btns'}
                                        >
                                            {`${t("MemorialView.Video")}`}
                                        </Button>
                                        {isDonationMoneyService &&
                                            <Button
                                                onClick={() => { setActiveBtn("DonationHistory") }}
                                                className={activeBtn === "DonationHistory" ? 'memorial-view-tab-btns-silected ' : 'memorial-view-tab-btns'}
                                            >
                                                {`${t("MemorialView.DonationHistory")}`}
                                            </Button>
                                        }
                                    </div>
                                    <div className="ml-auto">
                                        {is_loggedin && !isPrivate && activeBtn === "Album" && userData?.id === data?.user_id &&
                                            <>
                                                {editBtn &&
                                                    <Buttons
                                                        ButtonStyle="album-saveBtn"
                                                        onClick={() => editAlbumBtn(true, true, false)}
                                                        children={`${t("Video.Edit")}`}
                                                    />
                                                }

                                                {selectBtn &&
                                                    <Buttons
                                                        ButtonStyle="album-saveBtn"
                                                        onClick={() => editAlbumBtn(false, false, true)}
                                                        children={`${t("signup.Save")}`}
                                                    />
                                                }
                                            </>
                                        }
                                        {is_loggedin && !isPrivate && activeBtn === "Video" && userData?.id === data.user_id &&
                                            <>
                                                {selectVideoBtn &&
                                                    <Buttons
                                                        ButtonStyle="album-saveBtn"

                                                        onClick={() => editvideoBtn(false, false, true)}
                                                        children={`${t("signup.Save")}`}
                                                    />
                                                }

                                                {editVideoBtn &&
                                                    <Buttons
                                                        ButtonStyle="album-saveBtn"
                                                        onClick={() => editvideoBtn(true, true, false)}
                                                        children={`${t("Video.Edit")}`}
                                                    />
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            </div >
                            <div className="" style={{ width: "100%" }}>
                                {activeBtn === "MemorialMessage" && <MemorialMessage userData={userData} hallData={data} isPrivate={isPrivate} editMessageData="" getAllMemorialHallMessageMob={() => { }} />}
                                {activeBtn === "MemorialPost" && <MemorialPost userData={userData} hallData={data} isPrivate={isPrivate} getAll={getAllMPost} />}
                                {activeBtn === "Album" && <Album showBtn={showBtn} userData={userData} hallData={data} refreshData={refreshData} isPrivate={isPrivate} />}
                                {activeBtn === "Video" && <Video showVideoBtn={showVideoBtn} userData={userData} hallData={data} refreshVideoData={refreshVideoData} isPrivate={isPrivate} />}
                                {activeBtn === "DonationHistory" && <DonationHistory isPrivate={isPrivate} userData={userData} hallData={data} getmemorialViewID={getHallFromDonation} />}
                            </div>

                            <div className="d-md-none mob-main-img-video-container" >
                                <div className="main-image-mob">
                                    <h5>{`${t("MemorialView.Main_Image")}`}</h5>
                                    <img src={data?.main_image} alt="" />
                                </div>
                                <div className="main-video-mob">
                                    <h5>{`${t("MemorialView.Main_Video")}`}</h5>
                                    <video className="video-thumbnail" src={data?.main_video} controls />
                                </div>
                            </div>

                        </div >
                    </div >
                </>
                :


                <MobMemorialView />

            }

            {showSharePopup && <SharePopUp hallId={id} show={showSharePopup} onHide={closeSharePopup} />}
            {addFriendOpen && <AddFriend show={addFriendOpen} onHide={onHide} addfriend={addFriend} cancelStatusOfFriendRequest={cancelStatusOfFriendRequest} />}
            {cancelFriendOpen && <CancelFriend show={cancelFriendOpen} onHide={onHide} deleteFriend={chnageStatusOfFriend} />}
            {loginOpen && <Register show={loginOpen} onHide={onHide} goToRegister={goToLogin} />}

        </>
    )
}

export default MemorialView;
