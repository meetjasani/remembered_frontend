import { Button, Modal } from 'react-bootstrap'

import { useTranslation } from "react-i18next";

interface Props {
    show: boolean,
    onHide: () => void
    goToRegister: () => void
}

const Register: React.FC<Props> = ({ onHide, show, goToRegister }) => {
    const { t } = useTranslation();

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            size="lg"
            dialogClassName="register-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("logIn.Log_In")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4 className="">{`${t("Modal.Service_AfterLog")}`}</h4>
                <h4 className="pb-50">{`${t("Modal.Service_RightWay")}`}</h4>
                <Modal.Footer className="p-0">
                    <Button onClick={goToRegister} className="modal-title-small-f-btn">{`${t("logIn.Log_In")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default Register
