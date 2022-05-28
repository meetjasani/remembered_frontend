import React, { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { Button } from "react-bootstrap";
import { RootStateOrAny, useSelector } from "react-redux";
import Buttons from "../components/Buttons";
import MessageCKEditor from "../components/MessageCKEditor";
import { ApiDelete, ApiGetNoAuth, ApiPost, ApiPostNoAuth, ApiPut } from "../helper/API/ApiData";
import { useTranslation } from "react-i18next";
import InputField from "../components/Inputfield";
import AuthStorage from "../helper/AuthStorage";
import STORAGEKEY from "../config/APP/app.config";
import DeletePopUp from "../modal/DeletePopUp";

interface Props {
    userData: any;
    hallData: any;
    isPrivate: boolean;
    editMessageData: any;
    getAllMemorialHallMessageMob: () => void;
}

const MemorialMessage: React.FC<Props> = ({ userData, hallData, isPrivate, editMessageData, getAllMemorialHallMessageMob }) => {
    const { t } = useTranslation();
    const queryParams = new URLSearchParams(window.location.search);
    const isFromHallReg = queryParams.get('isFromHallReg')?.toString();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const [title, settitle] = useState("");
    const [openTextEditor, setOpenTextEditor] = useState(false);
    const [data, setData] = useState("");
    const [fetchMemorialMessages, setFetchMemorialMessages] = useState([]);
    const [editId, setEditId] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [isFirstMessage, setIsFirstMessage] = useState(true);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const getUniqeNo = AuthStorage.getStorageData(STORAGEKEY.uniqeId)

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

    const handleChange = (newData: any) => {
        setData(newData);
    };

    const openEditor = () => {
        if (is_loggedin) {
            setOpenTextEditor(true);
        }
    };

    // GET All Memorial Messages
    const getAllMemorialHallMessage = () => {
        return ApiGetNoAuth(`memorialHall/getAllMemorialHallMessageByID/${hallData.id}`)
            .then((response: any) => {
                setFetchMemorialMessages(response?.data?.memorialMessageData);

            })
            .catch((error: any) => console.error(error));
    };

    useEffect(() => {
        // if (innerWidth > 767) {
        getAllMemorialHallMessage();
        // }
        if (getUniqeNo) {
            AuthStorage.deleteKey(STORAGEKEY.uniqeId)
            deleteTempPost()
        }
    }, []);

    useEffect(() => {
        if (fetchMemorialMessages.length > 0) {
            setIsFirstMessage(false)
            setOpenTextEditor(true);
        }
    }, [fetchMemorialMessages])


    useEffect(() => {
        if (editMessageData?.messageId) {
            openEditor()
            setEditId(editMessageData?.messageId);
            setData(editMessageData?.content);
            settitle(editMessageData?.title)
        }
    }, [editMessageData])

    // POST AND UPDATE MESSAGE
    const updatePost = () => {
        if (editId) {
            //PUT METHOD -  UPDATE Memorial Messages
            const editMemorialMessage = {
                content: data,
                title: title
            };
            ApiPut(`memorialHall/editMemorialMessage/${editId}`, editMemorialMessage)
                .then((response: any) => {
                    setEditId("");
                    getAllMemorialHallMessage();
                    getAllMemorialHallMessageMob();
                    setData("");
                    settitle("");
                })
                .catch((error: any) => console.error(error));
        } else {
            //POST Memorial Messages
            const memorialmessage = {
                content: data,
                memorial_id: hallData.id,
                title: title
            };
            ApiPost("memorialHall/memorialHallMessage", memorialmessage)
                .then((response: any) => {
                    getAllMemorialHallMessage();
                    getAllMemorialHallMessageMob();
                    setData("");
                    settitle("");
                })
                .catch((error: any) => console.error(error));
        }
    };

    //Edit Memorial Messages
    const handleEditMessage = (messageId: string, messageContent: string, title: string) => {

        window.scrollTo(0, 0);
        setOpenTextEditor(true);
        setEditId(messageId);
        setData(messageContent);
        settitle(title)
    };

    const deleteMessage = (deleteId: string) => {
        setDeleteId(deleteId)
        setShowDeletePopup(true)
    }

    const hideDeletePopup = () => {
        setShowDeletePopup(false)
    }

    // Delete Memorial Messages
    const handleDelete = () => {
        ApiDelete(`memorialHall/deleteMemorialMessage/${deleteId}`, {})
            .then((response: any) => {
                setData("");
                setShowDeletePopup(false)
                getAllMemorialHallMessage();
                getAllMemorialHallMessageMob();
            })
            .catch((error: any) => { });
    };

    return (
        <>

            <div className="memorial-msg-view">
                {isPrivate && (
                    <div className="memorialmessage">
                        <div className="memorialmessage-content">
                            <img src="../../img/lock-img.svg" alt="" />
                            <h1>{`${t("MemorialMessage.This_is_a_private_account")}`}</h1>
                            <h1>{`${t("MemorialMessage.Please_follow_the_account_to_see_photo_and_video")}`}</h1>
                        </div>
                    </div>
                )}

                {/* {isFirstMessage && !isPrivate && !openTextEditor && userData?.id === hallData?.user_id &&
                    <div className="memorialmessage">
                        <div className="memorialmessage-content">
                            <img src="../img/memorialmessage-img.png" alt="" />
                            <h1>{`${t("MemorialMessage.Write_memorial_message")}`}</h1>
                            <Button onClick={openEditor}>{`${t("Album.Post")}`}</Button>
                        </div>
                    </div>
                } */}

                {/* {isFirstMessage && !isPrivate && userData?.id !== hallData?.user_id &&
                    <div className="memorialmessage">
                        <div className="memorialmessage-content">
                            <img src="../img/memorialmessage-img.png" alt="" />
                            <h1>등록된 조문보가 없습니다.</h1>
                        </div>
                    </div>
                } */}


                {is_loggedin ?
                    <>

                        {is_loggedin && isFirstMessage && !isPrivate && !openTextEditor && userData?.id === hallData?.user_id &&
                            <>
                                <div className="memorialmessage">
                                    <div className="memorialmessage-content">
                                        <img src="../img/memorialmessage-img.png" alt="" />
                                        <h1>{`${t("MemorialMessage.Write_memorial_message")}`}</h1>
                                        <Button onClick={openEditor}>{`${t("Album.Post")}`}</Button>
                                    </div>
                                </div>
                            </>
                        }

                        {is_loggedin && isFirstMessage && !isPrivate && !openTextEditor && userData?.id !== hallData?.user_id &&
                            <>
                                <div className="memorialmessage">
                                    <div className="memorialmessage-content">
                                        <img src="../img/memorialmessage-img.png" alt="" />
                                        <h1>{t("MemorialMessage.This_is_the_state_before_the_memorial_message_was_registered")}</h1>
                                    </div>
                                </div>
                            </>
                        }

                    </>

                    :

                    <>

                        {!is_loggedin && isFirstMessage && !isPrivate &&
                            // !isFirstMessage && 
                            // !openTextEditor &&
                            <div className="memorialmessage">
                                <div className="memorialmessage-content">
                                    <img src="../img/memorialmessage-img.png" alt="" />
                                    <h1>{t("MemorialMessage.This_is_the_state_before_the_memorial_message_was_registered")}</h1>
                                </div>
                            </div>
                        }
                    </>

                }


                {is_loggedin && openTextEditor && !isPrivate && userData?.id === hallData?.user_id && (
                    <>
                        <div className="add-title">
                            <InputField
                                label=""
                                fromrowStyleclass=""
                                name="title"
                                value={title}
                                placeholder={`${t("MemorialMessage.Enter_title")}`}
                                type="text"
                                lablestyleClass="login-label"
                                InputstyleClass="login-input"
                                onChange={(e: any) => {
                                    settitle(e.target.value)
                                }
                                }
                            />
                        </div>
                        <div className="editor-view memorialmsg-editor">
                            <MessageCKEditor
                                userData={userData}
                                hallData={hallData}
                                onChange={handleChange}
                                onEdit={handleEditMessage}
                                data={data}
                                type="memorialMessage"
                            />
                        </div>

                        <div className="text-center">
                            <Buttons
                                ButtonStyle="post-updateBtn"
                                onClick={updatePost}
                                children={editId ? `${t("MemorialMessage.Edit")}` : isFromHallReg ? `${t("MemorialMessage.Post")}` : `${t("MemorialMessage.Add_a_Message")}`}
                            />
                        </div>
                    </>
                )}

                {/* React HTML Parser */}
                {!isPrivate &&
                    fetchMemorialMessages.map((message: any, index: any) => {
                        return (
                            // <div className={(userData?.id === message?.user_id) ? "full-msg-content d-md-block d-none" : "full-msg-content pb-0 d-md-block d-none"} >
                            <div className={(userData?.id === hallData?.user_id) ? "full-msg-content d-md-block d-none" : "full-msg-content pb-0 d-md-block d-none"} key={index}>
                                {(userData?.id === hallData?.user_id) &&
                                    <div className="edit-trash-btn">
                                        <button className="edit-msg-btn"
                                            onClick={() => handleEditMessage(message?.id, message?.content, message?.title)}
                                        >
                                            <img src="../img/edit.png" className="edit-msg" alt="" />
                                        </button>

                                        <button className="trash-msg-btn" onClick={() => deleteMessage(message?.id)}>
                                            <img src="../img/trash.png" className="trash-msg" alt="" />
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



            </div>

            {showDeletePopup && <DeletePopUp show={showDeletePopup} onHide={hideDeletePopup} handleDelete={handleDelete} />}
        </>
    );
};

export default MemorialMessage;
