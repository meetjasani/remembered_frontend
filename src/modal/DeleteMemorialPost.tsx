import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

interface Props {
    show: boolean,
    onHide: () => void,
    handleDelete: (pass: any) => void;
    userData: any;
    deleteMessagePopError: string
}

const DeleteMemorialPost: React.FC<Props> = ({ onHide, show, handleDelete, deleteMessagePopError }) => {

    const { t } = useTranslation();

    // const DeletePopup: DeletePopup = {
    //     DellPassword: ""
    // }

    // const [deleteMerories, setDeleteMerories] = useState(DeletePopup);
    const [dellPassword, setDellPassword] = useState("");
    const handleChange = (e: any) => {
        // setDeleteMerories({ ...deleteMerories, [e.target.name]: e.target.value })
        setDellPassword(e.target.value)
    }

    const checkPasswordAndDeletePost = () => {
        // const body = {
        //     email: userData?.email,
        //     mobile: userData?.mobile,
        //     password: deleteMerories.DellPassword
        // }
        // ApiPost(`user/checkPassword`, body)
        //     .then((response: any) => {
        //         if (response?.data) {
        //             setInvailidPassword(false)
        handleDelete(dellPassword)
        setDellPassword("")
        //     } else {
        //         setInvailidPassword(true)
        //     }
        // })
        // .catch((error: any) =>{});
    }

    useEffect(() => {
        setDellPassword("")
    }, [])

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            dialogClassName="delete-post-popup bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Delete")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4 className="">{`${t("Modal.Delete_Memorial")}`}</h4>
                <h4>{`${t("Modal.Delete_Memorial_Post")}`}</h4>


                <div className="deletepost-password">
                    <label>{`${t("logIn.Password")}`}</label>
                    <Form.Control
                        name="DellPassword"
                        value={dellPassword}
                        className="delete-post-popup-input"
                        type="password"
                        placeholder={t("logIn.Placeholder.Password")}
                        onChange={(e: any) => {
                            handleChange(e);
                        }}
                    />

                    {deleteMessagePopError &&
                        <p className="delete-post-invailid">{`${t("Modal.Placeholder.Invalid_password")}`}</p>
                    }
                </div>
                <Modal.Footer className="edit-pop-up-edit p-0">
                    <Button onClick={checkPasswordAndDeletePost} className="modal-title-small-f-btn">{`${t("Modal.Title.Delete")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default DeleteMemorialPost
