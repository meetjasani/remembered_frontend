import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


interface Props {
    show: boolean,
    onHide: () => void,
    errorMessage: string,
    title: string
}

const ErrorPopup: React.FC<Props> = ({ onHide, show, errorMessage, title }) => {
    const { t } = useTranslation();

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                size="lg"
                dialogClassName="error-pop-up"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="p-o">
                    <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                        {title ? title : t("Modal.Title.Error_Message")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <h4 className="">{errorMessage}</h4>
                    <Modal.Footer className="p-0">
                        <Button onClick={onHide} className="modal-title-small-f-btn">{`${t("Modal.Ok")}`}</Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ErrorPopup
