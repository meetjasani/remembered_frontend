import React from "react";
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import AuthStorage from "../helper/AuthStorage";
import { changeLoginState } from "../redux/actions/loginAction";
import { removeUserData } from "../redux/actions/userDataAction";
import { useTranslation } from "react-i18next";
// 

interface Props {
    show: boolean,
    onHide: () => void
}

const Logout: React.FC<Props> = ({ onHide, show }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const LogoutAc = () => {
        dispatch(changeLoginState(false));
        dispatch(removeUserData());
        AuthStorage.deauthenticateUser();
        history.push("/");
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            dialogClassName="logout-confirm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Log_Out")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4>{`${t("Modal.logout")}`}</h4>
                <Modal.Footer className="p-0">
                    <Button onClick={onHide} className="modal-title-small-f-btn">{`${t("Modal.No")}`}</Button>
                    <Button onClick={LogoutAc} className="modal-title-small-s-btn">{`${t("Modal.Yes")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default Logout
