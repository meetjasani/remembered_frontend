import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { MemorialHallStatusEnum } from '../helper/Constant'
import { useTranslation } from "react-i18next";


interface Props {
    show: boolean,
    onHide: () => void,
    createHall: (type: string) => void
}

const MemorialHallStatus: React.FC<Props> = ({ onHide, show, createHall }) => {
    const { t } = useTranslation();
    const hallStatus = (type: string) => {
        createHall(type)
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            size="lg"
            dialogClassName="memorial-hall-modal bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Memorial_Hall_Status")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4>{`${t("Modal.Memorial_Hall")}`}</h4>
                <Modal.Footer className="p-0">
                    <Button onClick={() => { hallStatus(MemorialHallStatusEnum.Public) }} className="modal-title-small-f-btn">{`${t("Modal.Public")}`}</Button>
                    <Button onClick={() => { hallStatus(MemorialHallStatusEnum.Private) }} className="modal-title-small-s-btn">{`${t("Modal.Private")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default MemorialHallStatus



