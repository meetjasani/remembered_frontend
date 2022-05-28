import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import Buttons from '../components/Buttons';
import STORAGEKEY from '../config/APP/app.config';
import { ApiGetNoAuth, ApiPost, ApiPostNoAuth } from '../helper/API/ApiData';
import AuthStorage from '../helper/AuthStorage';
import AddFile from '../modal/AddFile';
import ErrorPopup from '../modal/ErrorPopup';
import MainSaveCompleted from '../modal/MainSaveCompleted';

interface Props {
    showVideoBtn: boolean;
    userData: any;
    hallData: any;
    refreshVideoData: () => void;
    isPrivate: boolean;
}


const Video: React.FC<Props> = ({ showVideoBtn, userData, hallData, refreshVideoData, isPrivate }) => {
    const { t } = useTranslation();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
    const [modalShow, setModalShow] = useState(false);
    const [videoUrl, setvideoUrl] = useState("");
    const [albtnBtnRow, setAlbtnBtnRow] = useState(false);
    const [selectSingleVideo, setselectSingleVideo] = useState(false);
    const [videoData, setVideoData] = useState([]);
    const [selectedVideoData, setSelectedVideoData] = useState<any>([]);
    const [showAddFile, setShowAddFile] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showMainPopup, setShowMainSavePopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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


    // GET All Memorial Messages
    const getAllMemorialHallAlbumAndVideo = () => {
        return ApiGetNoAuth(`memorialHall/getAllMemorialHallAlbumAndVideoByID/${hallData.id}?post_type=Video`)
            .then((response: any) => {
                setVideoData(response?.data?.memorialAlbumVideoData)
            })
            .catch((error: any) => console.error(error));
    };

    const selectVideoData = (Items: any) => {
        const findImage = selectedVideoData.findIndex((data: any) => data?.id === Items?.id)
        if (findImage < 0) {
            setSelectedVideoData([...selectedVideoData, Items])
        } else {
            const values = [...selectedVideoData];
            values.splice(findImage, 1);
            setSelectedVideoData(values)
        }
    }

    const deleteAPIcall = (imageIds: any) => {
        ApiPost(`memorialHall/deleteMemorialAlbumAndVideo`, { id: imageIds, post_type: "Video" })
            .then((response: any) => {
                setAlbtnBtnRow(false)
                setselectSingleVideo(false)
                setSelectedVideoData([])
                getAllMemorialHallAlbumAndVideo()
                setAlbtnBtnRow(true)
                setselectSingleVideo(true)
            })
            .catch((error: any) => { });
    }

    const deleteSelectedAlbum = () => {
        if (selectedVideoData) {
            const videoIds = selectedVideoData.map((data: any) => data?.id).join(',')
            deleteAPIcall(videoIds)
        }
    }

    const DataSetInModal = (modalOpen: boolean, VideoUrl: string) => {
        setModalShow(modalOpen);
        setvideoUrl(VideoUrl);
    }

    const closeAddFile = () => {
        setShowAddFile(false)
    }

    const closeMainSave = () => {
        setShowMainSavePopup(false)
    }

    const closeErrorPopup = () => {
        setShowErrorPopup(false)
    }

    const postVideo = () => {
        getAllMemorialHallAlbumAndVideo()
        closeAddFile()
    }

    useEffect(() => {
        setAlbtnBtnRow(showVideoBtn)
        setselectSingleVideo(showVideoBtn)
    }, [showVideoBtn])

    useEffect(() => {
        setAlbtnBtnRow(showVideoBtn)
        setselectSingleVideo(showVideoBtn)
        getAllMemorialHallAlbumAndVideo()
        if (getUniqeNo) {
            AuthStorage.deleteKey(STORAGEKEY.uniqeId)
            deleteTempPost()
        }
    }, [])

    const addFileBtn = () => {
        setShowAddFile(true);
    }

    const setMainVideo = () => {
        if (selectedVideoData.length === 1) {
            const body = {
                memorial_id: hallData?.id,
                album_and_video_id: selectedVideoData[0]?.id,
                post_type: "Video"
            }
            ApiPost(`memorialHall/memorialHallMainImage`, body)
                .then((response: any) => {
                    setAlbtnBtnRow(false)
                    setselectSingleVideo(false)
                    setSelectedVideoData([])
                    refreshVideoData()
                    setAlbtnBtnRow(true)
                    setselectSingleVideo(true)
                    setShowMainSavePopup(true)
                })
                .catch((error: any) => { });
        } else {
            setErrorMessage(`${t("Video.select_only_one_Video")}`)
            setShowErrorPopup(true)
        }
    }
    return (
        <div className="album-blank-box">
            {!isPrivate && albtnBtnRow &&
                <div className="album-btn-row">
                    <Buttons
                        ButtonStyle="delete-album"
                        onClick={deleteSelectedAlbum}
                        children={`${t("Modal.Title.Delete")}`}
                    />
                    <Buttons
                        ButtonStyle="delete-album save-album"
                        onClick={setMainVideo}
                        children={`${t("Video.Main_Save")}`}
                    // children="메인저장"
                    />
                    <div className="ml-md-auto">
                        <Buttons
                            ButtonStyle="delete-album edit-album"
                            onClick={addFileBtn}
                            children={`${t("memorial_hall_register.Add")}`}
                        />
                    </div>
                </div>
            }
            {!isPrivate &&
                <div className="video-section">
                    <div className="video-content">
                        {!isPrivate &&
                            videoData.map((items: any, index: any) =>
                                <div className="video-content-img-set" key={index}>
                                    {/* <img src={items.media_url} className="video-thumbnail" /> */}
                                    <video className="video-thumbnail" src={items.media_url} />
                                    <img src="../../img/video-playr-img-1.svg" alt="" className="playr-img cursor-pointer" onClick={() => { DataSetInModal(true, items.media_url) }} />
                                    {selectSingleVideo &&
                                        <div className="image-select">
                                            <label className="login-label-checkbox">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => { selectVideoData(items) }}
                                                    className="checkbox-input"
                                                />
                                            </label>
                                        </div>
                                    }
                                </div>
                            )}

                    </div>
                    {!isPrivate && videoData.length === 0 && is_loggedin && userData?.id === hallData.user_id &&
                        <div className="memorialmessage">
                            <div className="memorialmessage-content">
                                <img src="../../img/video-img-00.svg" alt="" />
                                <h1>{`${t("Video.There’sno_registered_video")}`}</h1>
                                <Button onClick={addFileBtn}>{`${t("Album.Post")}`}</Button>
                            </div>
                        </div>
                    }


                    {!isPrivate && videoData.length === 0 && !is_loggedin &&
                        <div className="memorialmessage">
                            <div className="memorialmessage-content">
                                <img src="../../img/video-img-00.svg" alt="" />
                                <h1>{`${t("Video.The_administrator_is_to_upload_the_video")}`}</h1>
                                <h1>{`${t("Video.Feel_free_to_contact_customer_center_080_1588_0000_for_more_information")}`}</h1>
                            </div>
                        </div>

                    }

                    {!isPrivate && videoData.length === 0 && is_loggedin && userData?.id !== hallData.user_id &&
                        <div className="memorialmessage">
                            <div className="memorialmessage-content">
                                <img src="../../img/video-img-00.svg" alt="" />
                                <h1>{`${t("Video.The_administrator_is_to_upload_the_video")}`}</h1>
                                <h1>{`${t("Video.Feel_free_to_contact_customer_center_080_1588_0000_for_more_information")}`}</h1>
                            </div>
                        </div>

                    }

                </div>
            }
            <div className="video-player-popup">
                <Modal
                    show={modalShow}
                    onHide={() => { setModalShow(false) }}
                    // backdrop="static"
                    dialogClassName="model-width video-modal"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>

                    <Modal.Body className="p-0">
                        <video width="100%" height="100%" controls autoPlay>
                            <source src={videoUrl} type="video/mp4" />
                        </video>
                    </Modal.Body>

                </Modal>
            </div>

            {isPrivate && (
                <div className="memorialmessage">
                    <div className="memorialmessage-content">
                        <img src="../../img/lock-img.svg" alt="" />
                        <h1>{`${t("MemorialMessage.This_is_a_private_account")}`}</h1>
                        <h1>{`${t("MemorialMessage.Please_follow_the_account_to_see_photo_and_video")}`}</h1>
                    </div>
                </div>
            )}

            <AddFile show={showAddFile} onHide={closeAddFile} type="Video" handleChange={postVideo} hallData={hallData} />

            {showErrorPopup && <ErrorPopup show={showErrorPopup} onHide={closeErrorPopup} errorMessage={errorMessage} title="" />}

            {showMainPopup && <MainSaveCompleted show={showMainPopup} onHide={closeMainSave} />}
        </div>
    )
}

export default Video
