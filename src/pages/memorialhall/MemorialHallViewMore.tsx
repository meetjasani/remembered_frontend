import { useEffect, useState } from 'react'
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ApiGet, ApiGetNoAuth, ApiPost } from '../../helper/API/ApiData';
import UserImage from "../../img/user.svg";
import fillHeartSVG from '../../img/fill-heart.svg'
import sliderHartVecotar from '../../img/slider-hart-vecotar.svg'
import { StatusType } from '../../helper/Constant';
import AddFriend from '../../modal/AddFriend';
import CancelFriend from '../../modal/CancelFriend';
import Register from '../../modal/Register';
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

const MemorialHallViewMore = () => {
    const history = useHistory()
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const queryParams = new URLSearchParams(window.location.search);
    const searchTerm = queryParams.get('search_term')?.toString();
    const [details, setDetails] = useState([]);
    const { innerWidth } = window
    const [registerOpen, setRegisterOpen] = useState<boolean>(false);
    const [addFriendOpen, setAddFriendOpen] = useState<boolean>(false);
    const [cancelFriendOpen, setCancelFriendOpen] = useState<boolean>(false);
    const [friendData, setFriendData] = useState<any>([]);

    const goToHallView = (id: string) => {
        if (innerWidth > 767) {
            history.push('/memorialview?id=' + id)
        } else {
            history.push('/memorialprofile?id=' + id)
        }
    }

    const getStatus = (item: memorialHallDetail): boolean => {
        let flag: boolean = false;
        if (item?.friend_list?.length > 0) {
            item?.friend_list?.map((data: any) => {
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

    const openFriendpopUp = () => {
        setAddFriendOpen(true);
    }

    const openCancelFriendpopUp = () => {
        setCancelFriendOpen(true);
    }

    const onHides = () => {
        setAddFriendOpen(false);
        setCancelFriendOpen(false);
        setRegisterOpen(false);
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

    const GetMemorialHallsNoAuth = () => {
        ApiGetNoAuth(`memorialHall/memorialHalls?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
            setDetails(res.data.memorials ?? []);
        });
    }

    const GetMemorialHalls = () => {
        ApiGet(`memorialHall/getMemorialHallAuth?search_term=${searchTerm ? searchTerm : ""}`).then((res: any) => {
            setDetails(res.data.memorials ?? []);
        });
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

    const goToRegister = () => {
        history.push("/login");
    }

    useEffect(() => {
        if (is_loggedin) {
            GetMemorialHalls()
        } else {
            GetMemorialHallsNoAuth()
        }
    }, [is_loggedin])
    return (
        <>
            <div className="d-flex flex-wrap memorial-hall-status">
                {details.map((detail: any) => (
                    // <div className="boxs cursor-pointer">
                    // <div className="main-boxes-memorial">
                    <div className="boxs cursor-pointer" onClick={() => goToHallView(detail.id)} key={detail?.id} >
                        <div className="profile-img-div ">
                            <img className="profile-img" src={detail?.image ? detail?.image : UserImage || "./img/Avatar.png"} alt="" onError={(e: any)=>{e.target.onerror = null; e.target.src="./img/Avatar.png"}}  />
                            {!is_loggedin &&
                                <img
                                    src={sliderHartVecotar}
                                    alt=""
                                    className="hart-img 1"
                                    onClick={(event: any) => {
                                        event.stopPropagation()
                                        setRegisterOpen(true)
                                    }}
                                />
                            }
                            <>

                                {(is_loggedin && detail?.user_id !== userData?.id) ?
                                    getStatus(detail) === true ?
                                        <img
                                            src={fillHeartSVG}
                                            alt=""
                                            className="hart-img 1"
                                            onClick={(event: any) => {
                                                event.stopPropagation()
                                                setFriendData(detail)
                                                openCancelFriendpopUp()
                                            }}
                                        />
                                        :
                                        <img
                                            src={sliderHartVecotar}
                                            alt=""
                                            className="hart-img 1"
                                            onClick={(event: any) => {
                                                event.stopPropagation()
                                                setFriendData(detail)
                                                openFriendpopUp()
                                            }}
                                        />
                                    :
                                    ""
                                }
                            </>
                        </div>
                        <div className="box-content">
                            <h2>{(detail?.name).length >= 10 ? (detail?.name).slice(0, 10) + '...' : detail?.name}</h2>
                            <p>{detail?.date_of_death}</p>
                            <h3>{(detail?.job_title).length >= 20 ? (detail?.job_title).slice(0, 20) + '...' : detail?.job_title}</h3>
                        </div>
                    </div>
                    // </div>
                ))
                }
            </div>

            {registerOpen && <Register show={registerOpen} onHide={onHides} goToRegister={goToRegister} />}
            {addFriendOpen && <AddFriend show={addFriendOpen} onHide={onHides} addfriend={addFriend} cancelStatusOfFriendRequest={cancelStatusOfFriendRequest} />}
            {cancelFriendOpen && <CancelFriend show={cancelFriendOpen} onHide={onHides} deleteFriend={chnageStatusOfFriend} />}

        </>
    )
}

export default MemorialHallViewMore
