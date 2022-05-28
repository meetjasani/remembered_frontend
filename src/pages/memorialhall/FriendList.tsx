import React, { useEffect, useState } from 'react';
import { ApiGet, ApiPost } from '../../helper/API/ApiData';
import { StatusType } from '../../helper/Constant';
import { useTranslation } from "react-i18next";
import AddFriend from '../../modal/AddFriend';
import CancelFriend from '../../modal/CancelFriend';


interface Props {
    userData: any;
}

const FriendList: React.FC<Props> = ({ userData }) => {
    const [friendsList, setFriendsList] = useState([]);
    const [friendOpen, setFriendOpen] = useState<boolean>(false);
    const [addfriendOpen, setAddFriendOpen] = useState<boolean>(false);
    const [addFriendData, setAddFriendData] = useState<any>([]);
    const { t } = useTranslation();



    useEffect(() => {
        getFriendList()
    }, [])

    const getFriendList = () => {
        ApiGet("memorialHall/getAllFriendList").then((res: any) => {
            setFriendsList(res?.data?.friendListData ?? []);
        });
    }

    const openFriendpopUp = () => {
        setFriendOpen(true);
    }
    const openAddFriendpopUp = () => {
        setAddFriendOpen(true);
    }

    const onHide = () => {
        setFriendOpen(false);
        setAddFriendOpen(false);
    }


    const chnageStatusOfFriend = () => {

        if (addFriendData.display_status === StatusType.Waiting) {
            return
        }
        const body = {
            id: addFriendData.id,
            status: addFriendData.status
        }
        ApiPost(`memorialHall/chnageFriendStatus`, body)
            .then((res: any) => {
                getFriendList()
                setFriendOpen(false);
                setAddFriendOpen(false);
                addFriendData([]);
            })
            .catch((error) => {
            });
    }

    const cancelStatusOfFriendRequest = () => {

        const body = {
            id: addFriendData.id,
            status: "cancle"
        }
        ApiPost(`memorialHall/chnageFriendStatus`, body)
            .then((res: any) => {
                getFriendList()
                setFriendOpen(false);
                setAddFriendOpen(false);
                addFriendData([]);
            })
            .catch((error) => {
            });
    }

    return (
        <div className="d-flex flex-wrap memorial-hall-status">
            {friendsList.map((item: any) =>
                // <div className="main-boxes-memorial">
                <div className="boxs position-relative cursor-pointer" key={item?.id}>
                    <div className="profile-img ">
                        <img src={item.image} alt="" onError={(e: any)=>{e.target.onerror = null; e.target.src="./img/Avatar.png"}} />
                        {item.display_status === StatusType.Confirm
                            ?
                            <button className="button-heart"
                                onClick={(event: any) => {
                                    //  chnageStatusOfFriend(item)
                                    openFriendpopUp()
                                    setAddFriendData(item)
                                    event.stopPropagation()
                                }}>
                                <img src="./img/fill-heart.svg" className="liked-fill" alt="" />

                            </button>
                            :
                            item.display_status === StatusType.AddFriend
                                ?
                                <button className="add-friend-button"
                                    onClick={(event: any) => {
                                        setAddFriendData(item)
                                        openAddFriendpopUp()
                                        event.stopPropagation()
                                    }}>
                                    {`${t("FriendList.Add_Friend")}`}
                                </button>
                                :
                                <button className="waiting-friend-button"
                                    onClick={(event: any) => {
                                        setAddFriendData(item)
                                        event.stopPropagation()
                                    }}>
                                    {`${t("FriendList.Waiting")}`}
                                </button>
                        }

                    </div>
                    <div className="box-content">
                        <h2>{item.name}</h2>
                        <p>{item.date_of_birth} - {item.date_of_death}</p>
                        <h3>{item.job_title}</h3>
                    </div>
                </div>
            )}

            {addfriendOpen && <AddFriend show={addfriendOpen} onHide={onHide} addfriend={chnageStatusOfFriend} cancelStatusOfFriendRequest={cancelStatusOfFriendRequest} />}
            {friendOpen && <CancelFriend show={friendOpen} onHide={onHide} deleteFriend={chnageStatusOfFriend} />}

        </div>
    )
}

export default FriendList
