import { Button, Modal } from 'react-bootstrap'

import { useTranslation } from "react-i18next";

interface Props {
    show: boolean,
    onHide: () => void;
    GoToHomepage: () => void;
}

const SavedPopUp: React.FC<Props> = ({ onHide, show, GoToHomepage }) => {
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
                    {`${t("Modal.Title.saved_it")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4 className="">{`${t("Modal.saving_is_complete")}`}</h4>
                <Modal.Footer className="p-0">
                    <Button onClick={GoToHomepage} className="modal-title-small-f-btn">{`${t("Modal.Confirm")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default SavedPopUp
