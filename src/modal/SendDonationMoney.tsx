import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


interface Props {
    show: boolean,
    onHide: () => void,
    onConfirm: () => void
}

const Senddonationmoney: React.FC<Props> = ({ onHide, show, onConfirm }) => {
    const { t } = useTranslation();
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            dialogClassName="Senddonationmoney-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Send_Donation_Money")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4 className="">{`${t("Modal.Send_Donation")}`}</h4>
                <Modal.Footer className="Senddonationmoney-pop-up-Confirm p-0">
                    <Button onClick={onConfirm} className="modal-title-small-f-btn">{`${t("Modal.Confirm")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default Senddonationmoney
