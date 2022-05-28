import { useEffect, useState } from 'react'
import moment from "moment";
import { Button } from 'react-bootstrap';
import Buttons from '../../components/Buttons';
import { ApiPost, ApiPostNoAuth, ApiDelete, ApiGetNoAuth } from '../../helper/API/ApiData';
import Album from '../../tabs/Album';
import MemorialMessage from '../../tabs/MemorialMessage';
import MemorialPost from '../../tabs/MemorialPost';
import Video from '../../tabs/Video';
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { getUserData } from '../../redux/actions/userDataAction';
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
import ReactHtmlParser from "react-html-parser";
import './MobMemorial.css';
import DeletePostPopUp from '../../modal/DeletePostPopUp';
import DeleteMemorialPost from '../../modal/DeleteMemorialPost';
import SelfAuthentication from '../../modal/SelfAuthentication';
import DeletePopUp from '../../modal/DeletePopUp';
import Register from '../../modal/Register';
import CopyToClipboard from 'react-copy-to-clipboard';
import NoMoreInformation from '../../modal/NoMoreInformation';

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

declare global {
    interface Window {
        kakao: any;
    }
}

const MobMemorialView = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [data, setData] = useState<any>()
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id')?.toString();
    const isFromLogin = queryParams.get('isFromLogin')?.toString();
    const donetionHistoryTablePageNo = 1;
    const [activeBtn, setActiveBtn] = useState("");
    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
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
    const [fetchMemorialMessages, setFetchMemorialMessages] = useState([]);
    const [postData, setPostData] = useState([]);
    const [allPostData, setAllPostData] = useState([]);
    const [deletePostDataID, setDeletePostDataID] = useState("");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeletePopupWithAutorization, setShowDeletePopupWithAutorization] = useState(false);
    const [showDeletePopupMessage, setShowDeletePopupMessage] = useState(false);
    const [showSelfAuthentication, setShowSelfAuthentication] = useState(false);
    const [password, setPassword] = useState("");
    const [writer, setWriter] = useState("");
    const [imageUrl, setImageUrl] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [videoSize, setVideoSize] = useState(0)
    const [imageSize, setImageSize] = useState(0)
    const [deleteID, setDeleteID] = useState("")
    const [deleteMessageID, setDeleteMessageID] = useState("")
    const [showDeleteDonationPopup, setShowDeleteDonationPopup] = useState(false);
    const [isShowMemorialPost, setIsShowMemorialPost] = useState(false)
    const [showKnowMoreInkfo, setShowKnowMoreInkfo] = useState(false)
    const [copyAddress, setCopyAddress] = useState(false)

    const [editMessageData, setEditMessageData] = useState({
        content: "",
        title: "",
        messageId: ""

    });
    const [donationHistoryTableData, setDonationHistoryTableData] = useState<TableList>({
        AllCount: 10,
        count: 10,
        donationHistoryData: []
    })
    const [deleteMessagePopError, setDeleteMessagePopError] = useState("");
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const [splitAddress, setSplitAddress] = useState("");
    const [isDonationMoneyService, setIsDonationMoneyService] = useState<boolean>(false);


    const hideDeletePopup = () => {
        setShowDeletePopupMessage(false)
    }

    const handleDeleteMessage = () => {
        // ApiDelete(`memorialHall/deleteMemorialMessage/${deleteId}`, {})
        //     .then((response: any) => {
        //         setData("");
        //         setShowDeletePopup(false)
        //         getAllMemorialHallMessage();
        //         // getAllMemorialHallMessageMob();
        //     })
        //     .catch((error: any) => {});
        ApiDelete(`memorialHall/deleteMemorialMessage/${deleteMessageID}`, {})
            .then((response: any) => {
                getAllMemorialHallMessage();
                hideDeletePopup()
            })
            .catch((error: any) => { });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setCopiedClass("")
    }, []);


    const goToLogin = () => {
        history.push("/login");
    }

    const onHideShowKnowMoreInkfo = () => {
        setShowKnowMoreInkfo(false)
    }

    useEffect(() => {

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

        if (data) {
            getAllMemorialHallMessage();
            getAllMPost();
            getDonationHistoryData();
        }

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
                            ;
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
    useEffect(() => {
        if (data) {
            const today = moment();
            const hall_created_date = moment(data?.date_of_death, 'YYYY-MM-DD');
            const today_date = moment(today, 'YYYY-MM-DD');
            const dayDiff = today_date.diff(hall_created_date, 'days');
            if (data?.donation_serives[0]?.service_duration === "" || data?.donation_serives[0]?.service_duration === null || data?.donation_serives[0]?.service_duration === undefined) {
                const todayDate = moment(new Date()).format('YYYY.MM.DD')
                if (moment(todayDate).isSameOrBefore(data?.date_of_death)) {
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

        }

    }, [data])

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
            if (isFromLogin === "true") {
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
                    setData(res?.data)
                    VisitorCount(res?.data?.id)
                    setActiveBtn("MemorialMessage")
                })
                .catch((error) => {
                });
        } else {
            ApiPostNoAuth(`memorialHall/getMemorialHallViewNoAuth/${id}`, {})
                .then((res: any) => {
                    setData(res?.data)
                    VisitorCount(res?.data?.id)
                    setActiveBtn("MemorialMessage")
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
        setLoginOpen(false);
    }


    const addFriend = () => {
        const body = {
            sender_id: userData?.id,
            receiver_id: friendData?.user_id,
            memorial_id: friendData?.id
        }

        ApiPost(`memorialHall/addFriend`, body)
            .then((res: any) => {
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

    const handleEditMessage = (messageId: string, messageContent: string, title: string) => {
        setActiveBtn("MemorialMessage")
        setEditMessageData({
            content: messageContent,
            title: title,
            messageId: messageId
        })

    };

    useEffect(() => {
        if (editMessageData?.messageId) {
            setActiveBtn("MemorialMessage")
        }
    }, [editMessageData])

    const handleDeleteMsg = (deleteId: string) => {
        setDeleteMessageID(deleteId)
        setShowDeletePopupMessage(true)
    };

    const getAllMemorialHallMessage = () => {
        return ApiGetNoAuth(`memorialHall/getAllMemorialHallMessageByID/${data.id}`)
            .then((response: any) => {
                setFetchMemorialMessages(response?.data?.memorialMessageData);
                // setFetchMemorialMessages(response?.data?.memorialMessageData);
            })

            .catch((error: any) => console.error(error));

    };

    const getAllMPost = () => {
        ApiGetNoAuth(`memorialHall/getAllMemorialHallPostByID/${data.id}`)
            .then((response: any) => {
                const slicedArray = response?.data?.memorialPostData.slice(0, 5);
                setAllPostData(response?.data?.memorialPostData)
                setPostData(slicedArray)
            })
            .catch((error: any) => console.error(error));
    }

    const fnSeeMore = () => {
        setPostData(allPostData)
        if (postData.length === allPostData.length) {
            setShowKnowMoreInkfo(true)
        }
    }

    const mnSeeMore = () => {
        setPostData(allPostData)
        if (postData.length === allPostData.length) {
            setShowKnowMoreInkfo(true)
        }
    }

    const memorialPostDelete = (deletePostID: string) => {
        setDeletePostDataID(deletePostID)
        if (data?.user_id === userData?.id) {
            setShowDeletePopup(true)
        } else {


            setDeleteMessagePopError("")
            setShowDeletePopupWithAutorization(true)
        }
    }

    const closeDeletePopup = () => {
        setShowDeletePopup(false)
    }

    const closeDeletePopupWithAutorization = () => {
        setDeleteMessagePopError("")
        setShowDeletePopupWithAutorization(false)
    }

    const closeSelfAuthentication = () => {
        setShowSelfAuthentication(false)
    }

    const handleDeleteForHallCreator = (pass: string) => {
        const body = {
            id: deletePostDataID,
        }
        ApiPost(`memorialHall/deleteMemorialPostByIdNoPassword`, body)
            .then((response: any) => {
                // if (response.message === "Can not delete memorial post") {
                //     setDeleteMessagePopError(`${t("Modal.Invalid_password")}`)
                //     return
                // }
                closeDeletePopup()
                setDeletePostDataID("")
                setDeleteMessagePopError("")
                setShowDeletePopupWithAutorization(false)
                getAllMPost();
            })
            .catch((error: any) => {
                if (error === "Can not delete memorial post") {
                    setDeleteMessagePopError(`${t("Modal.Invalid_password")}`)
                    return
                }
            });
    };

    const handleDeleteIthAutorization = (pass: string) => {

        const body = {
            id: deletePostDataID,
            password: pass
        }
        ApiPostNoAuth(`memorialHall/deleteMemorialPost`, body)
            .then((response: any) => {
                if (response.message === "Can not delete memorial post") {
                    setDeleteMessagePopError(`${t("Modal.Invalid_password")}`)
                    return
                }
                closeDeletePopup()
                setDeletePostDataID("")
                setDeleteMessagePopError("")
                setShowDeletePopupWithAutorization(false)
                getAllMPost();
            })
            .catch((error: any) => {
                if (error === "Can not delete memorial post") {
                    setDeleteMessagePopError(`${t("Modal.Invalid_password")}`)
                    return
                }
            });
    };

    // // Delete Memorial Messages
    // const handleDeleteIthAutorization = () => {
    //     ApiDelete(`memorialHall/deleteMemorialPost/${deletePostDataID}`, {})
    //         .then((response: any) => {
    //             closeDeletePopup()
    //             setDeletePostDataID("");
    //             setShowDeletePopupWithAutorization(false)
    //             getAllMPost();
    //         })
    //         .catch((error: any) =>{});
    // };

    // // Delete Memorial Messages
    // const handleDelete = () => {
    //     ApiDelete(`memorialHall/deleteMemorialPost/${deletePostDataID}`, {})
    //         .then((response: any) => {
    //             closeDeletePopup()
    //             setDeletePostDataID("");
    //             getAllMPost();
    //         })
    //         .catch((error: any) => {});
    // };

    const memorialPost = () => {
        setShowSelfAuthentication(false)
        const body = {
            email: userData?.email,
            mobile: userData?.mobile,
            password: password
        }

        const insertMemorialPost = () => {
            const MemorialPostBody = {
                content: data,
                writer: writer,
                memorial_id: data?.id,
                album_url: imageUrl,
                video_url: videoUrl,
                file_size_album: imageSize,
                file_size_video: videoSize
            }
            ApiPost(`memorialHall/memorialHallPost`, MemorialPostBody)
                .then((response: any) => {
                    getAllMPost()
                    setData("")
                    setWriter("")
                    setPassword("")
                    setImageUrl("")
                    setVideoUrl("")
                    setVideoSize(0)
                    setImageSize(0)
                })
                .catch((error: any) => { });
        }

        ApiPost(`user/checkPassword`, body)
            .then((response: any) => {
                if (response?.data) {
                    insertMemorialPost()
                }
                if (response?.message === "User password not match") {
                }
            })
            .catch((error: any) => { });
    }

    const deleteDonation = (deleteID: string) => {
        setDeleteID(deleteID)
        setShowDeleteDonationPopup(true);
    }

    const getDonationHistoryData = () => {
        ApiGetNoAuth(`memorialHall/getAllMemorialHallDonationByID/${data?.id}?per_page=10&page_number=${donetionHistoryTablePageNo}`)
            .then((res: any) => {
                setDonationHistoryTableData(res?.data)
            })
            .catch((error) => {
            });
    }

    const hideDeleteDonationPopup = () => {
        setShowDeleteDonationPopup(false);
    }


    const handleDeleteDonationHistory = () => {
        ApiDelete(`memorialHall/deleteMemorialHallDonationById/${deleteID}`, {})
            .then((response: any) => {
                setDeleteID("")
                getDonationHistoryData()
                hideDeleteDonationPopup()
            })
            .catch((error: any) => { });
    }

    const goToPost = () => {
        setIsShowMemorialPost(!isShowMemorialPost)
    }

    useEffect(() => {
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

    }, [data]);


    const copyTextBtn = () => {
        setCopyAddress(true)
    }

    return (
        <>

            <div className={!isPrivate ? 'edit-button-edit' : 'edit-button-edit private-edit-button-edit'}>
                {!isPrivate && <div className="copied-tooltip">
                    <CopyToClipboard onCopy={onCopy} text={window.location.href}>
                        {/* <span>Copy to clipboard with span</span> */}
                        {/* <button onClick={copyLink}> */}
                        <img src="../img/edit-profile.svg" alt="" />
                        {/* </button> */}
                    </CopyToClipboard>
                    {/* <button onClick={copyLink}><img src="../img/edit-profile.svg" alt="" /></button> */}
                    <span className={`${copiedClass} copied-tooltiptext`}>{`${t("MemorialView.Link_Copied")}`}</span>
                </div>
                }
                {(userData?.id === data?.user_id) &&
                    <button onClick={goToEditHall}><img src="../img/edit-icons.svg" alt="" /></button>
                }
            </div>
            <img src="./img/white-arrow.svg" className="d-md-none d-block page-back-arrow" onClick={BackMemorialView} alt=''></img>
            <div className="mobile-view-profile ">
                <div className="body-content-inner bg-gray-color memorial-view-all">
                    <div className="memorial" style={{ backgroundImage: `url(${data?.image || "../img/flower.png"})` }}>
                        <div className="mobile-conatainer">
                            <div className="mobile-hero-section">
                                <h3>
                                    {`${t("MemorialView.MemorialView_Title_We_Remember_the")}`} {`${t("MemorialView.MemorialView_Title_Valuable_Memories")}`} {`${t("MemorialView.MemorialView_Title_with_You.")}`}
                                </h3>

                                <div className="d-flex align-items-center total-counter-obitury">
                                    <div>
                                        {!isPrivate && <p>{`${t("MemorialView.Visitors")}`} <span>{data?.visitors} <span>{`${t("MemorialView.people")}`}</span> </span></p>}
                                    </div>
                                    {!isPrivate &&
                                        <div className="ml-auto">
                                            <Buttons
                                                ButtonStyle="obituryBtn"
                                                onClick={queryPopupShow}
                                                children={`${t("MemorialView.Send_Obituary")}`}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>


                        </div>
                    </div>

                    <div className="mobile-memorial-profile ">
                        <div className="memoraila-profile-mob text-center">
                            <div className="profile-image">
                                <img src={data?.image || "../img/Avatar.png"} alt="" onError={(e: any) => { e.target.onerror = null; e.target.src = "./img/Avatar.png" }} />
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
                            </div>
                            <h4>{data?.date_of_birth} - {data?.date_of_death}</h4>
                            <h2>{data?.memorial_hall_name}</h2>
                            <span className="memorial-followers"> <img src="./img/mob-user.svg" alt="" />  <p>< span className="followers"> {`${t("MemorialView.Followers")}`} </span> <span className="counters">{data?.followers}</span></p> </span>
                        </div>

                        <div className="register-section">
                            {!isPrivate && isShowSendDonationMoney &&
                                <>
                                    <div className="register-title">
                                        <h3>{`${t("MemorialView.Registerer")}`} <span> {data?.registerer} </span></h3>
                                    </div>

                                    <div className="memorial-info">
                                        <h6>{data?.Introduction}</h6>
                                    </div>
                                </>
                            }
                        </div>

                        {!isPrivate && isShowSendDonationMoney &&
                            <div className="contact-information">
                                <div className="memorial-info-row flex-wrap">
                                    <div className="memorial-info-label">
                                        <p> {`${t("MemorialView.Date_of_carrying_the_coffin_out")}`}</p>
                                    </div>
                                    <div className="ml-auto memorial-info-details">
                                        <p className="p-full-width">{data?.date_of_carrying_the_coffin_out} </p>
                                    </div>
                                </div>

                                <div className="memorial-info-row flex-wrap">
                                    <div className="memorial-info-label ">
                                        <p>{`${t("memorial_hall_register.Burial_Plot")}`}</p>
                                    </div>
                                    <div className="ml-auto memorial-info-details">
                                        <p className="p-full-width">{data?.burial_plot}</p>
                                    </div>
                                </div>
                                {isShowSendDonationMoney && data?.money_account.length > 0 &&
                                    <div className="memorial-info-row flex-wrap align-items-baseline">
                                        <div className="memorial-info-label">
                                            <p>{`${t("MemorialView.Memorial_Money_Guide")}`}</p>
                                        </div>
                                        <div className=" memorial-info-details ml-auto">
                                            {data?.money_account.map((data: any) =>
                                                // data.ac_number &&  ( 
                                                <div className="">
                                                    {/* <span>Copy to clipboard with span</span> */}
                                                    {/* <button onClick={copyLink}> */}
                                                    {/* <img src="../img/edit-profile.svg" alt="" /> */}
                                                    {/* </button> */}
                                                    <div className="copy-clipboard-row">
                                                        <p className="p-half-width">{data?.bank_name} {data?.ac_number} </p>
                                                        <CopyToClipboard text={data?.ac_number}>
                                                            <span className="colored-account-info"> 복사하기</span>
                                                        </CopyToClipboard>
                                                    </div>

                                                </div>
                                                // )
                                            )}
                                        </div>
                                    </div>
                                }


                                {!isPrivate && isShowSendDonationMoney &&
                                    <div className="memorial-info-row">
                                        <div className="memorial-info-label">
                                            <p> {`${t("MemorialView.Funeral_Address")}`}</p>
                                        </div>
                                        <div className="ml-auto memorial-info-details">
                                            <p className="p-full-width">{data?.funeral_Address}</p>
                                        </div>
                                    </div>
                                }

                                <div className="memorial-info-row">
                                    <div className="mobile-map-info ml-auto p-0">
                                        <Button className="total-counterpages">
                                            {data?.room_number}호
                                        </Button>
                                    </div>
                                </div>

                                <div className="memorial-info-row">
                                    <div className="memorial-info-label">
                                        <p>전화번호</p>
                                    </div>
                                    <div className="ml-auto memorial-info-details">
                                        <p className="p-full-width">{data?.mobile}</p>
                                    </div>
                                </div>

                                <div className="location-section">
                                    <div className="map-loaction">
                                        <div id="map" style={{ width: "100%", height: "200px", marginBottom: "15px" }} />
                                    </div>
                                </div>

                                <div className="contact-info-btn">
                                    <CopyToClipboard text={splitAddress}>
                                        <button className="copy-address-btn" onClick={copyTextBtn}>
                                            {!copyAddress ? `${t("MemorialDirectionPopup.Copy_the_address")}` : `${t("MemorialDirectionPopup.Has_copy_the_address")}`}

                                        </button>
                                    </CopyToClipboard>
                                    <a href={`tel:${data?.mobile}`}>
                                        <button className="call-btn">
                                            {`${t("MemorialView.Call")}`}
                                        </button>
                                    </a>
                                </div>
                            </div>
                        }
                        {!isPrivate &&
                            fetchMemorialMessages.length > 0 &&
                            <div className="mobile-editor-view">
                                <div className="memorial-msg-head">
                                    <h4>조문보</h4>
                                </div>
                                {!isPrivate &&
                                    fetchMemorialMessages.map((message: any) => {
                                        return (
                                            <div className={(userData?.id === message?.user_id) ? "full-msg-content" : "full-msg-content pb-0"} >
                                                {(userData?.id === message?.user_id) &&
                                                    <div className="edit-trash-btn">
                                                        <a href="#goToPost">
                                                            <button className="edit-msg-btn"
                                                                onClick={() => handleEditMessage(message?.id, message?.content, message?.title)}
                                                            >
                                                                <img src="../img/mobile-edit.svg" className="edit-msg" alt="" />
                                                            </button>
                                                        </a>

                                                        <button className="trash-msg-btn" onClick={() => handleDeleteMsg(message?.id)}>
                                                            <img src="../img/mobile-trash.svg" className="trash-msg" alt="" />
                                                        </button>
                                                    </div>
                                                }
                                                <h1 className="ck-message-title"> {message.title}</h1>
                                                <div className="ck-content">
                                                    {ReactHtmlParser(message?.content)}
                                                </div>

                                            </div>
                                        );
                                    })}
                                <h5 className="see-moreBtn" onClick={mnSeeMore}>{t("seemore")}</h5>
                            </div>
                        }
                        {!isPrivate &&
                            <div className="mobile-post-view">
                                <div className="memorial-msg-head d-md-block d-none">
                                    <h4>조문보</h4>
                                </div>
                                <div>
                                    {!isPrivate && postData.length !== 0 &&
                                        <div className="main-post-view">
                                            <div className="add-post-title-row gotoPost-btn-row d-flex align-items-center">
                                                <h5>{`${t("MemorialView.Memorial_Post")}`}</h5>
                                                {userData?.id !== data?.user_id &&
                                                    < div className="ml-auto">
                                                        <a className="gotopostbutton" onClick={goToPost}>추모글 등록하기</a>
                                                    </div>
                                                }
                                            </div>
                                            {isShowMemorialPost && <MemorialPost userData={userData} hallData={data} isPrivate={isPrivate} getAll={getAllMPost} />}
                                            {postData.map((data: any) =>
                                                <>
                                                    <div className="post-review">
                                                        <div className="single-postview">
                                                            <div>
                                                                <img src={data?.user_image ? data?.user_image : "../img/Avatar.png"} alt="" onError={(e: any) => { e.target.onerror = null; e.target.src = "./img/Avatar.png" }} />
                                                            </div>

                                                            <div className="user-date-name">
                                                                <div className="user-date">
                                                                    <h4>{data?.writer}</h4>
                                                                    <p>{data?.post_create_date}</p>
                                                                </div>
                                                                {/* {(userData?.id === data?.user_id) && */}
                                                                <div className="ml-auto">
                                                                    <Buttons
                                                                        ButtonStyle="memorial-postview-delete"
                                                                        onClick={() => memorialPostDelete(data?.id)}
                                                                        children={`${t("MemorialMessage.Delete")}`}
                                                                    />
                                                                </div>
                                                                {/* } */}
                                                            </div>
                                                        </div>

                                                        <div className="single-post-content">
                                                            {ReactHtmlParser(data?.content)}
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                            }
                                            {/* {postData.length !== allPostData.length && */}
                                            <h5 className="see-moreBtn" onClick={fnSeeMore}>{t("seemore")}</h5>
                                            {/* } */}
                                        </div>
                                    }
                                    {!postData.length && !isPrivate &&
                                        <>
                                            <div className="blank-post-title">
                                                <div className="add-post-title-row gotoPost-btn-row d-flex align-items-center">
                                                    <h5>{`${t("MemorialView.Memorial_Post")}`}</h5>
                                                    {userData?.id !== data?.user_id &&
                                                        < div className="ml-auto">
                                                            <a className="gotopostbutton" onClick={goToPost}>추모글 등록하기</a>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            {isShowMemorialPost && <MemorialPost userData={userData} hallData={data} isPrivate={isPrivate} getAll={getAllMPost} />}

                                            <div className="blank-post-view">
                                                <div className="no-preview-box">
                                                    <div className="no-preview-content">
                                                        <img src="../img/notes.svg" alt="" />
                                                        <p>{`${t("MemorialPost.There_are_no_posts")}`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        }
                        {!isPrivate &&
                            <div className="d-md-none mob-main-img-video-container">
                                {data?.main_image !== "" &&
                                    <div className="main-image-mob">
                                        <h5>{`${t("MemorialView.Main_Image")}`}</h5>
                                        <img src={data?.main_image} alt="" />
                                    </div>}
                                {data?.main_video !== "" &&
                                    <div className="main-video-mob">
                                        <h5>{`${t("MemorialView.Main_Video")}`}</h5>
                                        <video className="video-thumbnail" src={data?.main_video} controls />
                                    </div>
                                }
                                {/* {data?.main_video == "" &&
                                    <>
                                        <div className="blank-post-title">
                                            <h5>{`${t("MemorialView.Main_Video")}`}</h5>
                                            <div className="blank-post-view top-border">
                                                <div className="no-preview-box">
                                                    <div className="no-preview-content">
                                                        <img src="../img/video-img-00.svg" alt="" />
                                                        <p>{`${t("Video.There’sno_registered_video")}`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                } */}
                            </div>
                        }
                        {!isPrivate &&
                            <div className="donation-history-box">
                                <div className=" d-flex align-items-center">
                                    <div className="memorial-msg-head">
                                        <h4>기부내역</h4>
                                    </div>
                                    <div className="ml-auto">
                                        {console.log(!isShowSendDonationMoney, "------", !isDonationMoneyService)}
                                        <button
                                            className={!isShowSendDonationMoney || !isDonationMoneyService ? "send-donationBtn-disable" : "send-donationBtn"}
                                            disabled={!isShowSendDonationMoney || !isDonationMoneyService}
                                            onClick={() => { sendDonations() }}
                                        >
                                            {`${t("Modal.Title.Send_Donation_Money")}`}
                                        </button>
                                    </div>
                                </div>
                                <div className="mob-donetion-history-head">
                                    {/* <h1 className="donetion-history-title">{`${t("DonationHistory.title")}`} {`${t("DonationHistory.donation_title")}`}</h1> */}
                                    <h1 className="donetion-history-title">{data?.donation_serives[0]?.Introduction}</h1>
                                </div>


                            </div>
                        }
                        {!isPrivate &&
                            <div className="donate-history-tables">
                                {isDonationMoneyService && donationHistoryTableData?.donationHistoryData.length > 0 &&
                                    <table>
                                        <tbody>
                                            {donationHistoryTableData?.donationHistoryData.map((tddata: any, i: number) =>
                                                <tr>
                                                    <td>{(donetionHistoryTablePageNo - 1) * 10 + (i + 1)}</td>
                                                    <td>{tddata.name}</td>
                                                    <td>{tddata.organization}</td>
                                                    <td>{tddata.donation_amount}{`${t("MemorialView.Won")}`}</td>
                                                    <td>{tddata.donation_created_date}</td>
                                                    <td>
                                                        {!isPrivate && userData?.id === data.user_id &&
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
                        }
                        {!isPrivate &&

                            <div className="total-donation-amount">
                                <h3>{`${t("MemorialView.Total_Donation_Amount")}`}</h3>
                                <h1>{data?.total_donation_amount} <span>{`${t("MemorialView.Won")}`}</span> </h1>
                            </div>
                        }

                    </div>
                    {!isPrivate && is_loggedin &&
                        <div className={userData?.id === data?.user_id ? "mob-padding-tab-row" : "mob-padding-tab-row d-none"}>
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

                                </div>
                                <div className="ml-auto">
                                    {is_loggedin && !isPrivate && activeBtn === "Album" && userData?.id === data.user_id &&
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
                    }
                    {is_loggedin &&
                        <div className={userData?.id === data?.user_id ? "" : "d-none"} style={{ width: "100%" }} id="goToPost" >
                            {!isPrivate && activeBtn === "MemorialMessage" && <MemorialMessage userData={userData} hallData={data} isPrivate={isPrivate} editMessageData={editMessageData} getAllMemorialHallMessageMob={getAllMemorialHallMessage} />}
                            {!isPrivate && activeBtn === "MemorialPost" && <MemorialPost userData={userData} hallData={data} isPrivate={isPrivate} getAll={getAllMPost} />}
                            {!isPrivate && activeBtn === "Album" && <Album showBtn={showBtn} userData={userData} hallData={data} refreshData={refreshData} isPrivate={isPrivate} />}
                            {!isPrivate && activeBtn === "Video" && <Video showVideoBtn={showVideoBtn} userData={userData} hallData={data} refreshVideoData={refreshVideoData} isPrivate={isPrivate} />}
                        </div>
                    }
                    {isPrivate && (
                        <div className="memorialmessage memorial-message-border">
                            <div className="">
                                <div className="memorialmessage-content">
                                    <img src="../../img/lock-img.svg" alt="" />
                                    <h1>{`${t("MemorialMessage.This_is_a_private_account")}`}</h1>
                                    <h1>{`${t("MemorialMessage.Please_follow_the_account_to_see_photo_and_video")}`}</h1>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>


            {showDeletePopup && <DeletePostPopUp show={showDeletePopup} onHide={closeDeletePopup} handleDelete={handleDeleteForHallCreator} />}
            {showDeletePopupWithAutorization && <DeleteMemorialPost show={showDeletePopupWithAutorization} onHide={closeDeletePopupWithAutorization} handleDelete={handleDeleteIthAutorization} userData={userData} deleteMessagePopError={deleteMessagePopError} />}
            {showSelfAuthentication && <SelfAuthentication show={showSelfAuthentication} onHide={closeSelfAuthentication} handlePost={memorialPost} userData={userData} />}

            {showSharePopup && <SharePopUp hallId={id} show={showSharePopup} onHide={closeSharePopup} />}
            {addFriendOpen && <AddFriend show={addFriendOpen} onHide={onHide} addfriend={addFriend} cancelStatusOfFriendRequest={cancelStatusOfFriendRequest} />}
            {cancelFriendOpen && <CancelFriend show={cancelFriendOpen} onHide={onHide} deleteFriend={chnageStatusOfFriend} />}

            {showDeleteDonationPopup && <DeletePopUp show={showDeleteDonationPopup} onHide={hideDeleteDonationPopup} handleDelete={handleDeleteDonationHistory} />}
            {loginOpen && <Register show={loginOpen} onHide={onHide} goToRegister={goToLogin} />}
            {showDeletePopupMessage && <DeletePopUp show={showDeletePopupMessage} onHide={hideDeletePopup} handleDelete={handleDeleteMessage} />}

            {showKnowMoreInkfo && <NoMoreInformation show={showKnowMoreInkfo} onHide={onHideShowKnowMoreInkfo} />}

        </>
    )
}

export default MobMemorialView
