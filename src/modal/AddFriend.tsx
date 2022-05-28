import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

interface Props {
    show: boolean,
    onHide: () => void,
    addfriend: () => void,
    cancelStatusOfFriendRequest: () => void
}

const AddFriend: React.FC<Props> = ({ onHide, show, addfriend, cancelStatusOfFriendRequest }) => {
    const { t } = useTranslation();
    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                size="lg"
                dialogClassName="add-friends-popup bg-color "
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="p-0">
                    <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                        {`${t("Modal.Title.Add_Friend")}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="delete-pop-up-content p-0">
                    <h4>{`${t("Modal.Add")}`}</h4>
                    <Modal.Footer className="p-0">
                        <Button onClick={addfriend} className="modal-title-small-f-btn">{`${t("Modal.Yes")}`}</Button>
                        <Button onClick={() => {
                            onHide()
                            cancelStatusOfFriendRequest()
                        }} className="modal-title-small-s-btn">{`${t("Modal.No")}`}</Button>
                    </Modal.Footer>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default AddFriend
