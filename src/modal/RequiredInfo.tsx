import { Button, Modal } from 'react-bootstrap'

import { useTranslation } from "react-i18next";

interface Props {
    show: boolean,
    onHide: () => void
}

const RequiredInfo: React.FC<Props> = ({ onHide, show }) => {
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
                    {`${t("Modal.Title.Required_information_input_error")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4 className="">{`${t("Modal.All_required_information_is_not_entered")}`}</h4>
                <h4 className="pb-50">{`${t("Modal.Please_check_again_and_enter_all_the_required_information")}`}</h4>
                <Modal.Footer className="p-0">
                    <Button onClick={onHide} className="modal-title-small-f-btn">{`${t("Modal.Confirm")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default RequiredInfo
