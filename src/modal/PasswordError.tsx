import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Buttons from '../components/Buttons'
import { useTranslation } from "react-i18next";


interface Props{
    show: boolean,
    onHide: () => void
}

const PasswordError: React.FC<Props> = ({onHide, show}) => {
    const { t } = useTranslation();
    const [modalShow, setModalShow] = React.useState(true);

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                size="lg"
                dialogClassName="Senddonationmoney-pop-up bg-color "
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                        {`${t("Modal.Title.Password_Error")}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="Senddonationmoney-pop-up-content">
                    <h4 className="">{`${t("Modal.Passwords")}`}</h4>
                </Modal.Body>
                <Modal.Footer className="Senddonationmoney-pop-up-Confirm">
                    <Button onClick={onHide} className="loginmodal-pop-up-Log-In-btn">{`${t("Modal.Confirm")}`}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PasswordError
