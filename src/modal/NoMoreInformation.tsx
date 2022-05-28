import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


interface Props{
    show: boolean,
    onHide: () => void
}

const NoMoreInformation: React.FC<Props> = ({onHide, show}) => {
    const { t } = useTranslation();

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
                <Modal.Header  closeButton className="p-0">
                    <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                        {`${t("Modal.Title.Main_Information")}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-title-small-content p-0">
                    <h4 className="">{`${t("Modal.Title.No_More_Information")}`}</h4>
                    <Modal.Footer className="p-0">
                    <Button onClick={onHide} className="modal-title-small-f-btn">{`${t("Modal.Ok")}`}</Button>
                </Modal.Footer>
                </Modal.Body>
               
            </Modal>
        </>
    )
}

export default NoMoreInformation
