import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import Buttons from '../components/Buttons'
import STORAGEKEY from '../config/APP/app.config';
import { ApiGetNoAuth, ApiPost, ApiPostNoAuth } from '../helper/API/ApiData';
import AuthStorage from '../helper/AuthStorage';
import AddFile from '../modal/AddFile';
import ErrorPopup from '../modal/ErrorPopup';
import MainSaveCompleted from '../modal/MainSaveCompleted';

interface Props {
  showBtn: boolean;
  userData: any;
  hallData: any;
  refreshData: () => void;
  isPrivate: boolean;
}

const Album: React.FC<Props> = ({ showBtn, userData, hallData, refreshData, isPrivate }) => {
  const { t } = useTranslation();
  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
  const [albtnBtnRow, setAlbtnBtnRow] = useState(false);
  const [selectSingleAlbum, setselectSingleAlbum] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const [selectedAlbumImages, setSelectedAlbumImages] = useState<any>([]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showMainPopup, setShowMainSavePopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const getUniqeNo = AuthStorage.getStorageData(STORAGEKEY.uniqeId)

  // GET All Memorial Messages
  const getAllMemorialHallAlbumAndVideo = () => {
    return ApiGetNoAuth(`memorialHall/getAllMemorialHallAlbumAndVideoByID/${hallData.id}?post_type=Album`)
      .then((response: any) => {
        setAlbumData(response?.data?.memorialAlbumVideoData)
      })
      .catch((error: any) => console.error(error));
  };
  const selectAlbumImagesData = (Items: any) => {
    const findImage = selectedAlbumImages.findIndex((data: any) => data?.id === Items?.id)
    if (findImage < 0) {
      setSelectedAlbumImages([...selectedAlbumImages, Items])
    } else {
      const values = [...selectedAlbumImages];
      values.splice(findImage, 1);
      setSelectedAlbumImages(values)
    }
  }

  const deleteAPIcall = (imageIds: any) => {
    ApiPost(`memorialHall/deleteMemorialAlbumAndVideo`, { id: imageIds, post_type: "Album" })
      .then((response: any) => {
        setAlbtnBtnRow(false)
        setselectSingleAlbum(false)
        setSelectedAlbumImages([])
        getAllMemorialHallAlbumAndVideo()
        setAlbtnBtnRow(true)
        setselectSingleAlbum(true)
      })
      .catch((error: any) => { });
  }

  const deleteSelectedAlbum = () => {
    if (selectedAlbumImages) {
      const imageIds = selectedAlbumImages.map((data: any) => data?.id).join(',')
      deleteAPIcall(imageIds)
    }
  }

  const setMainImage = () => {
    if (selectedAlbumImages.length === 1) {
      const body = {
        memorial_id: hallData?.id,
        album_and_video_id: selectedAlbumImages[0]?.id,
        post_type: "Album"
      }
      ApiPost(`memorialHall/memorialHallMainImage`, body)
        .then((response: any) => {
          setAlbtnBtnRow(false)
          setselectSingleAlbum(false)
          setSelectedAlbumImages([])
          refreshData()
          setAlbtnBtnRow(true)
          setselectSingleAlbum(true)
          setShowMainSavePopup(true)
        })
        .catch((error: any) => { });
    } else {
      setErrorMessage(`${t("MemorialView.select_only_one_Image")}`)
      setShowErrorPopup(true)
      // alert("select only ")
    }
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

  const postAlbum = () => {
    getAllMemorialHallAlbumAndVideo()
    closeAddFile()
  }

  useEffect(() => {
    setAlbtnBtnRow(showBtn)
    setselectSingleAlbum(showBtn)
  }, [showBtn])

  useEffect(() => {
    setAlbtnBtnRow(showBtn)
    setselectSingleAlbum(showBtn)
    getAllMemorialHallAlbumAndVideo()
    if (getUniqeNo) {
      AuthStorage.deleteKey(STORAGEKEY.uniqeId)
      deleteTempPost()
    }
  }, [])

  const openAlbumFile = () => {
    setShowAddFile(true);
  }

  return (
    <div className="album-blank-box" >
      {!isPrivate && albtnBtnRow &&
        <div className="album-btn-row">
          <Buttons
            ButtonStyle="delete-album"
            onClick={deleteSelectedAlbum}
            children={`${t("Modal.Title.Delete")}`}
          />
          <Buttons
            ButtonStyle="delete-album save-album"
            onClick={setMainImage}
            children={`${t("MemorialView.Save_The_Main_Photo")}`}
          />
          <div className="ml-md-auto">
            <Buttons
              ButtonStyle="delete-album edit-album"
              onClick={openAlbumFile}
              children={`${t("memorial_hall_register.Add")}`}
            />
          </div>
        </div>
      }
      {!isPrivate &&
        <div className="">
          <div className="album-view">
            <div className="album-row">
              {albumData.map((Items: any, index: any) =>
                <div className="single-album" key={index}>
                  <img src={Items?.media_url} alt="" />
                  {selectSingleAlbum &&
                    <div className="image-select">
                      <label className="login-label-checkbox">
                        <input
                          type="checkbox"
                          onChange={() => { selectAlbumImagesData(Items) }}
                          className="checkbox-input"
                        />
                      </label>
                    </div>
                  }
                </div>
              )}

            </div>

            {!isPrivate && albumData.length === 0 &&
              <div className="memorialmessage">
                <div className="memorialmessage-content">
                  <img src="../../img/blank-album.png" alt="" />
                  <h1>{`${t("Album.There_are_no_images")}`}</h1>
                  {is_loggedin &&
                    userData?.id === hallData.user_id &&
                    <Button onClick={openAlbumFile}>{`${t("Album.Post")}`}</Button>
                  }
                </div>
              </div>
            }

          </div>
        </div>
      }

      {isPrivate && (
        <div className="memorialmessage">
          <div className="memorialmessage-content">
            <img src="../../img/lock-img.svg" alt="" />
            <h1>{`${t("MemorialMessage.This_is_a_private_account")}`}</h1>
            <h1>{`${t("MemorialMessage.Please_follow_the_account_to_see_photo_and_video")}`}</h1>
          </div>
        </div>
      )}

      <AddFile show={showAddFile} onHide={closeAddFile} type="Album" handleChange={postAlbum} hallData={hallData} />

      {showErrorPopup && <ErrorPopup show={showErrorPopup} onHide={closeErrorPopup} errorMessage={errorMessage} title="" />}

      {showMainPopup && <MainSaveCompleted show={showMainPopup} onHide={closeMainSave} />}
    </div>
  )
}

export default Album
