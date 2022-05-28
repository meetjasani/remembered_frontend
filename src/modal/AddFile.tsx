import React, { useState, useCallback, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import InputField from '../components/Inputfield';
import { useDropzone } from 'react-dropzone';
import { ApiPost } from '../helper/API/ApiData';
import Select from 'react-select';


interface Props {
    show: boolean,
    onHide: () => void,
    type: string,
    handleChange: () => void,
    hallData: any
}

const fileFormat = [
    {
        label: "mp4",
        value: "video/mp4"
    },
    {
        label: "Avi",
        value: "video/avi"
    },
    {
        label: "webm",
        value: "video/webm"
    },
    {
        label: "mpeg",
        value: "video/mpeg"
    }
]

const imageFormat = [
    {
        label: "JPG",
        value: "image/jpeg"
    },
    {
        label: "PNG",
        value: "image/png"
    },
    {
        label: "JPEG",
        value: "image/jpeg"
    }
]

const AddFile: React.FC<Props> = ({ onHide, show, type, handleChange, hallData }) => {
    const [selectedFileType, setSelectedFileType] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [error, setError] = useState("")
    const [isUploadDisable, setIsUploadDisable] = useState(false)
    const [isSaveBtnDisable, setIsSaveBtnDisable] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File>()


    const onDrop = useCallback(acceptedFiles => {
        setSelectedFile(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    const addFileForm = {
        writer: "",
        file: ""
    };

    const [addFileDataForm, setAddFileDataForm] = useState(addFileForm);
    const { t } = useTranslation();

    const handleInputChange = (e: any) => {
        setAddFileDataForm({ ...addFileDataForm, [e.target.name]: e.target.value });
    }

    const checkFiletype = (): boolean => {
        let flag = false

        if (selectedFile?.type !== selectedFileType) {
            setError(`${t("MemorialPost.Selected_file_and_file_type_are_different")}`)
            flag = false
        } else {
            setError("")
            flag = true
        }
        return flag
    }

    const postAlbumVideo = () => {
        if (!checkFiletype()) {
            return
        }
        if (type === "Video") {

            let formData = new FormData();
            formData.append('post_type', "Video");
            formData.append('memorial_id', hallData.id);

            if (selectedFile) {
                formData.append('AlbumAndVideo', selectedFile);
            }

            ApiPost(`memorialHall/memorialHallAlbumAndVideo`, formData)
                .then((response: any) => {
                    setErrorMessage("")
                    if (response.message === "Memorial Album Save Max limit execute") {
                        setErrorMessage(`${t("MemorialPost.Memorial_Post_Video_save_Max_limit_exceeds")}`)
                    }
                    else if (response.message === "Memorial album size maximum 10 mb") {
                        setErrorMessage(`${t("MemorialPost.Maximum_size_of_video_is_10MB")}`)
                        // }
                    } else {
                        setSelectedFile(undefined)
                        handleChange()
                        setAddFileDataForm(addFileForm)
                    }
                })
                .catch((error: any) => { });
        }

        if (type === "Album") {
            let formData = new FormData();
            formData.append('post_type', "Album");
            formData.append('memorial_id', hallData.id);

            if (selectedFile) {
                formData.append('AlbumAndVideo', selectedFile);
            }

            ApiPost(`memorialHall/memorialHallAlbumAndVideo`, formData)
                .then((response: any) => {
                    if (response.message === "Memorial Album Save Max limit execute") {
                        setErrorMessage(`${t("MemorialPost.Memorial_Post_Image_save_Max_limit_exceeds")}`)
                    } else {
                        setSelectedFile(undefined)
                        handleChange()
                        setAddFileDataForm(addFileForm)
                    }
                })
                .catch((error: any) => { });
        }

    }

    const hidePopUp = () => {
        onHide()
        setAddFileDataForm(addFileForm)
    }

    useEffect(() => {
        setError("")
        setSelectedFileType("")
    }, [show])

    useEffect(() => {
        if (selectedFileType) {
            setIsUploadDisable(false)
        } else {
            setIsUploadDisable(true)
        }
    }, [selectedFileType])

    useEffect(() => {
        if (selectedFile) {
            setIsSaveBtnDisable(false)
        } else {
            setIsSaveBtnDisable(true)
        }
    }, [selectedFile])

    const customStyles = {
        option: (provided: any, state: { isSelected: any; }) => ({
            ...provided,
            borderBottom: '1px solid #CACACA',
            color: '#010100',
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 15,
            marginRight: 15,
            maxWidth: 336,
            width: 'auto',
            fontSize: 16,
            cursor: 'pointer',
        }),
        menu: () => ({
            border: 'none',
            borderRadius: 10,
        }),
        menuList: () => ({
            border: '1px solid #CACACA',
            borderRadius: 10,
        }),

    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            dialogClassName="addFile-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Add_File")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <form className="memorialhall-form">

                    <div>
                        <label className="login-label">
                            {`${t("Modal.Title.File_Format")}`}
                        </label>
                        <div className="position-relative selector-set-main-full">
                            {type === "Video" &&
                                <Select
                                    styles={customStyles}
                                    options={fileFormat}
                                    select={selectedFileType}
                                    // value={selectOption(selectedFileType, "Video")}
                                    onChange={(event: any) => {
                                        setSelectedFileType(event.value)
                                    }}
                                    placeholder={`${t("Modal.Placeholder.Select_file_format")}`}
                                    className="w-100"
                                    theme={(theme) => ({
                                        ...theme,

                                        colors: {
                                            ...theme.colors,
                                            primary25: '#fff',
                                            primary: '#fff',
                                        },
                                    })}
                                />
                            }
                            {type === "Album" &&
                                <Select
                                    styles={customStyles}
                                    options={imageFormat}
                                    select={selectedFileType}
                                    // value={selectOption(selectedFileType, "Album")}
                                    onChange={(event: any) => {
                                        setSelectedFileType(event.value)
                                    }}
                                    placeholder={`${t("Modal.Placeholder.Select_file_format")}`}
                                    className="w-100"
                                    theme={(theme) => ({
                                        ...theme,

                                        colors: {
                                            ...theme.colors,
                                            primary25: '#fff',
                                            primary: '#fff',
                                        },
                                    })}
                                />
                            }
                            {/* <select
                                className={fileFormat.length === 1 ? 'selector-set w-100 minimal' : 'selector-set-gray w-100 minimal'}
                                onChange={(event: any) => {
                                    setSelectedFileType(event.target.value)
                                }}>
                                <option selected> {`${t("Modal.Placeholder.Select_file_format")}`}</option>
                                {type === "Video" &&
                                    fileFormat.map((item) =>
                                        <option className="redText" value={item.value} >{item.fileFormate}</option>
                                    )
                                }

                                {type === "Album" &&
                                    imageFormat.map((item) =>
                                        <option className="redText" value={item.value} >{item.fileFormate}</option>
                                    )
                                }
                            </select> */}
                            <div className="react-select-down"> <img src="img/arrows.png" alt="" /> </div>
                        </div>
                    </div>

                    <div>
                        <label className="login-label">
                            {`${t("Modal.Title.Import_File")}`}
                        </label>
                        <div {...getRootProps()} className={isUploadDisable ? 'upload-file-btn-disable input-filetypes' : 'input-filetypes'}>
                            {!isUploadDisable &&
                                <input {...getInputProps()} accept={selectedFileType} />
                            }
                            {`${t("Modal.Title.Import_File")}`}
                        </div>
                    </div>
                </form>
                {errorMessage &&
                    <div>
                        <p className="error-color register-seltAuth-error">{errorMessage}</p>
                    </div>
                }
                {error &&
                    <div>
                        <p className="error-color register-seltAuth-error">{error}</p>
                    </div>
                }
                <Modal.Footer className="Senddonationmoney-pop-up-Confirm p-0">
                    <Button onClick={postAlbumVideo} disabled={isSaveBtnDisable} className={isSaveBtnDisable ? "modal-title-small-f-btn-disabled" : "modal-title-small-f-btn"}>{`${t("Album.Post")}`}</Button>
                    <Button onClick={hidePopUp} className="modal-title-small-s-btn">{`${t("Modal.Cancels")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default AddFile

