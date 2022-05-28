import React from 'react'
import { Button, Modal} from 'react-bootstrap';
import { useHistory } from 'react-router';
import STORAGEKEY from '../config/APP/app.config';
import { ApiPatch } from '../helper/API/ApiData';
import AuthStorage from '../helper/AuthStorage';
import { useTranslation } from "react-i18next";

interface Props {
    show: boolean,
    onHide: () => void
}
const DeleteAccount: React.FC<Props> = ({ onHide, show }) => {

    const { t } = useTranslation();
    const history = useHistory();
    // const [hidden,setHidden] = useState(false)
    const Delete = () => {
        ApiPatch('user/auth/delete', null)
            .then((res) => {
                if (AuthStorage.getToken() === localStorage.getItem(STORAGEKEY.token)) {
                    localStorage.removeItem(STORAGEKEY.token);
                    localStorage.removeItem(STORAGEKEY.userData);
                }
                else {
                    sessionStorage.removeItem(STORAGEKEY.token);
                    sessionStorage.removeItem(STORAGEKEY.userData);
                }
                // dispatch(changeLoginState(false))
                history.push("/");
            })
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            size="lg"
            dialogClassName="delete-account-popup bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Delete_Account")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4>{`${t("Modal.Delete_Your_Account")}`}</h4>
                <Modal.Footer className="p-0">
                    <Button onClick={() => { onHide() }} className="modal-title-small-f-btn">{`${t("Modal.No")}`}</Button>
                    <Button onClick={() => { Delete(); }} className="modal-title-small-s-btn">{`${t("Modal.Yes")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default DeleteAccount
