import React from 'react'
import { Button, Modal} from 'react-bootstrap';
import { useTranslation } from "react-i18next";


interface Props {
    show: boolean,
    onHide: () => void,
    handleDelete: () => void
}

const DeletePopUp: React.FC<Props> = ({ onHide, show, handleDelete }) => {

    const { t } = useTranslation();

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            size="lg"
            dialogClassName="delete-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Delete")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4>{`${t("Modal.Delete_Pop_Up")}`}</h4>
                <Modal.Footer className="p-0">
                    <Button onClick={onHide} className="modal-title-small-f-btn">{`${t("Modal.No")}`}</Button>
                    <Button onClick={handleDelete} className="modal-title-small-s-btn">{`${t("Modal.Yes")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default DeletePopUp
