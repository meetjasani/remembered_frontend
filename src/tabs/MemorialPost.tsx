import React, { useEffect, useState } from 'react';
import ReactHtmlParser from "react-html-parser";
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import Buttons from '../components/Buttons';
import InputField from '../components/Inputfield';
import MessageCKEditor from "../components/MessageCKEditor";
import { ApiGetNoAuth, ApiPost, ApiPostNoAuth } from '../helper/API/ApiData';
import DeleteMemorialPost from '../modal/DeleteMemorialPost';
import DeletePostPopUp from '../modal/DeletePostPopUp';
import SelfAuthentication from '../modal/SelfAuthentication';
import AuthStorage from '../helper/AuthStorage';
import STORAGEKEY from "../config/APP/app.config";
import UserAlreadyExit from '../modal/UserAlreadyExit';

interface Props {
    userData: any;
    hallData: any;
    isPrivate: boolean;
    getAll: () => void;
}

const MemorialPost: React.FC<Props> = ({ userData, hallData, isPrivate, getAll }) => {
    const { t } = useTranslation();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const [data, setData] = useState("");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeletePopupWithAutorization, setShowDeletePopupWithAutorization] = useState(false);
    const [writer, setWriter] = useState("");
    const [password, setPassword] = useState("");
    const [postData, setPostData] = useState([]);
    const [deletePostDataID, setDeletePostDataID] = useState("");
    const [imageUrl, setImageUrl] = useState("")
    const [videoUrl, setVideoUrl] = useState("")
    const [showSelfAuthentication, setShowSelfAuthentication] = useState(false);
    const [showWrongPaawordErr, setShowWrongPaawordErr] = useState(false);
    const [videoSize, setVideoSize] = useState(0)
    const [imageSize, setImageSize] = useState(0)
    const [uniqueId, setUniqueId] = useState("");
    const [nonMemberErrorMsg, setNonMemberErrorMsg] = useState("");
    const [errorMsgTilte, setErrorMsgTilte] = useState("");
    const [nonMemberErrorMsgPopUp, setNonMemberErrorMsgPopUp] = useState(false);
    const uniqueIdState = "";
    const [deleteMessagePopError, setDeleteMessagePopError] = useState("");

    const memorialHallPost = () => {

        if (!is_loggedin) {
            if (!password || !writer || !data) {
                return
            }
        } else {
            if (!password || !data) {
                return
            }
        }
        // if (userData?.user_type === UserType.Non) {
        if (!is_loggedin) {
            setShowSelfAuthentication(true)
        } else {
            // memorialPost()
            insertMemorialPost()
        }
    }

    const memorialPostForNonMember = (mobileNumber: any) => {
        const body = {
            content: data,
            writer: writer,
            memorial_id: hallData.id,
            random_number: uniqueId,
            mobile_no: mobileNumber,
            password: password
        }

        ApiPostNoAuth(`memorialHall/createMemorialPostByNonMember`, body)
            .then((response: any) => {
                if (response?.message === "Memorial Hall Post Save successfully") {
                    getAllMPost()
                    getAll()
                    setData("")
                    setWriter("")
                    setPassword("")
                    setImageUrl("")
                    setVideoUrl("")
                    setVideoSize(0)
                    setImageSize(0)
                    setShowSelfAuthentication(false)
                    AuthStorage.deleteKey(STORAGEKEY.uniqeId)
                }
                setShowSelfAuthentication(false)
                if (response?.message !== "Memorial Hall Post Save successfully") {
                    setNonMemberErrorMsgPopUp(true)
                }
                if (response?.message === "You have already joined. Please login and leave a memorial post") {
                    setErrorMsgTilte(`${t("MemorialPost.you_are_a_member_who_has_already_been_registered")}`)
                    setNonMemberErrorMsg(`${t("MemorialPost.You_have_already_joined_please_login_and_leave_a_memorial_post")}`)
                }
                if (response?.message === "Memorial Post Album save Max limit execute") {
                    setNonMemberErrorMsg(`${t("MemorialPost.Memorial_Post_Image_save_Max_limit_exceeds")}`)
                }
                if (response?.message === "Memorial Post Video save Max limit execute") {
                    setNonMemberErrorMsg(`${t("MemorialPost.Memorial_Post_Video_save_Max_limit_exceeds")}`)
                }
                if (response?.message === "Memorial Album And Video save Max limit execute") {
                    // setNonMemberErrorMsg(`${t("MemorialPost.Memorial_Post_Video_save_Max_limit_exceeds")}`)
                    setNonMemberErrorMsg("Memorial Album And Video save Max limit execute")
                }
                if (response?.message === "Record Not Found") {
                    setNonMemberErrorMsg(`${t("MemorialPost.Record_not_found")}`)
                }
            })
            .catch(
                (error: any) => {
                    if (error === "Memorial Hall Post already exists") {
                        setNonMemberErrorMsg("Memorial Hall Post already exists")
                    }
                });
    }

    const getAllMPost = () => {
        ApiGetNoAuth(`memorialHall/getAllMemorialHallPostByID/${hallData.id}`)
            .then((response: any) => {
                setPostData(response?.data?.memorialPostData)

            })
            .catch((error: any) => console.error(error));
    }

    const insertMemorialPost = () => {
        const MemorialPostBody = {
            content: data,
            writer: is_loggedin ? userData.name : writer,
            memorial_id: hallData?.id,
            album_url: imageUrl,
            video_url: videoUrl,
            file_size_album: imageSize,
            file_size_video: videoSize,
            password: password
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
                getAll()
            })
            .catch((error: any) => { });
    }

    const memorialPostDelete = (deletePostID: string) => {
        setDeletePostDataID(deletePostID)
        setDeleteMessagePopError("")
        if (userData?.id === hallData?.user_id) {
            setShowDeletePopup(true)
        } else {
            setShowDeletePopupWithAutorization(true)
        }
    }

    const handleChange = (newData: any, imageURL: string, videoURL: string, imageSize: number, videoSize: number) => {
        setData(newData);
        setImageUrl(imageURL)
        setVideoUrl(videoURL)
        setVideoSize(videoSize)
        setImageSize(imageSize)
    };

    //Edit Memorial Messages
    const handleEditMessage = (messageId: string, messageContent: string) => {
        setData(messageContent);
    };

    // Delete Memorial Messages
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

    const closenonMemberErrorMsgPopUp = () => {
        setNonMemberErrorMsgPopUp(false)
    }

    const getUniqueID = (uniqueID: any) => {
        setUniqueId(uniqueID)
    }

    useEffect(() => {
        getAllMPost()
    }, [])

    return (
        <>
            <div className="small-container">
                {isPrivate && (
                    <div className="memorialmessage">
                        <div className="memorialmessage-content">
                            <img src="../../img/lock-img.svg" alt="" />
                            <h1>{`${t("MemorialMessage.This_is_a_private_account")}`}</h1>
                            <h1>{`${t("MemorialMessage.Please_follow_the_account_to_see_photo_and_video")}`}</h1>
                        </div>
                    </div>
                )}

                {!isPrivate &&
                    <div className="add-posttabs">
                        <div className="d-flex">
                            <div className="header-addpost">
                                <p>{`${t("MemorialPost.Leave_a_Memorial_Post")}`}</p>
                            </div>
                            {/* <div className="post-add-media">
                            <button><img src="/img/add-image.svg" alt="" /></button>
                            <button><img src="/img/add-video.svg" alt="" /></button>
                        </div> */}
                        </div>
                        <div className="editor-post-main">
                            <MessageCKEditor
                                userData={userData}
                                hallData={hallData}
                                onChange={handleChange}
                                onEdit={handleEditMessage}
                                UniqueID={getUniqueID}
                                data={data}
                                type="memorialPost"
                                uniqueid={uniqueIdState}
                            />
                            {!is_loggedin &&
                                <div className="add-post-inputs">
                                    <InputField
                                        label={`${t("MemorialPost.Writer")}`}
                                        fromrowStyleclass=""
                                        name="writerName"
                                        value={writer}
                                        placeholder={`${t("MemorialPost.Name_of_writer")}`}
                                        type="text"
                                        lablestyleClass="login-label"
                                        InputstyleClass="login-input"
                                        onChange={(e: any) => {
                                            setWriter(e.target.value)
                                        }
                                        }
                                    />
                                </div>
                            }

                            <div className="add-post-inputs-two">
                                <InputField
                                    label={`${t("logIn.Password")}`}
                                    fromrowStyleclass=""
                                    name="newpassword"
                                    value={password}
                                    placeholder={`${t("logIn.Placeholder.Password")}`}
                                    type="password"
                                    lablestyleClass="login-label"
                                    InputstyleClass="login-input"
                                    onChange={(e: any) => {
                                        setPassword(e.target.value)
                                    }
                                    }
                                />
                                {showWrongPaawordErr &&
                                    <>
                                        <p className="error-color register-seltAuth-error">{`${t("logIn.Errors.Please_enter_password_one_more_time")}`}</p>
                                    </>
                                }
                            </div>

                            <div className="text-center">
                                <Buttons
                                    ButtonStyle={"memorial-post-btn"}
                                    // ButtonStyle={!is_loggedin ? "memorial-post-btn-disabled" : "memorial-post-btn"}
                                    onClick={memorialHallPost}
                                    children={`${t("MemorialMessage.Post")}`}
                                // disabled={!is_loggedin}
                                />
                            </div>
                        </div>
                    </div>
                }

                {!isPrivate &&
                    <div className="main-post-view d-md-block d-none">
                        {postData.map((data: any, index: any) =>
                            <div className="post-review" key={index}>
                                <div className="single-postview">
                                    <div>
                                        <img src={data?.user_image ? data?.user_image : "../img/Avatar.png"} alt="" onError={(e: any)=>{e.target.onerror = null; e.target.src="./img/Avatar.png"}}  />
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
                        )
                        }
                    </div>

                }

                {!postData.length && !isPrivate &&
                    <div className="main-post-view d-md-block d-none">
                        <div className="no-preview-box">
                            <div className="no-preview-content">
                                <img src="../img/notes.svg" alt="" />
                                <p>{`${t("MemorialPost.There_are_no_posts")}`}</p>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <DeletePostPopUp show={showDeletePopup} onHide={closeDeletePopup} handleDelete={handleDeleteForHallCreator} />
            <DeleteMemorialPost show={showDeletePopupWithAutorization} onHide={closeDeletePopupWithAutorization} handleDelete={handleDeleteIthAutorization} userData={userData} deleteMessagePopError={deleteMessagePopError} />
            <SelfAuthentication show={showSelfAuthentication} onHide={closeSelfAuthentication} handlePost={memorialPostForNonMember} userData={userData} />
            {nonMemberErrorMsgPopUp && <UserAlreadyExit show={nonMemberErrorMsgPopUp} onHide={closenonMemberErrorMsgPopUp} errorMessage={nonMemberErrorMsg} title={errorMsgTilte} />}
        </>
    )
}

export default MemorialPost
