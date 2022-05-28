import React, {useState} from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Buttons from '../components/Buttons';
import { ApiPost } from '../helper/API/ApiData';

interface Props {
    show: boolean,
    onHide: () => void,
    hallId: any
}

const SharePopUp: React.FC<Props> = ({ onHide, show, hallId }) => {

    const { t } = useTranslation();
    const [showPopUp, setShowPopUp] = useState(show);
    const [showErrorPopUp, setShowErrorPopUp] = useState(false);
    
    return (
        <>
        {showErrorPopUp && <Modal
                show={showErrorPopUp}
                onHide={onHide}
                backdrop="static"
                size="lg"
                dialogClassName="error-pop-up"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="p-o">
                    <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                    부고를 전할 수 없습니다.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <h4 className="">현재 고객님의 팔로워가 0명이기 때문에 부고를 전할 수 없습니다.<br/><br/>(친구조회 페이지에서 친구추가를 수락 수 다시 이용하여주세요.)</h4>
                    <Modal.Footer className="p-0">
                        <Button onClick={onHide} className="modal-title-small-f-btn">{`${t("Modal.Ok")}`}</Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        }
        <Modal
            show={showPopUp}
            onHide={onHide}
            backdrop="static"
            size="lg"
            dialogClassName="share-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        // className="sharepopup-content"
        >
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                    {`${t("Modal.Title.Share")}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4>{`${t("Modal.Share_Pop_Up")}`}</h4>
                <div className="kakaotalk-btn-set">
                    <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => { }}>
                        <img src="./img/kakaotalk 1.svg" className="kakaotalk-img" alt=""/>
                        {`${t("Modal.Kakaotalk")}`}
                    </Buttons>
                    <Buttons ButtonStyle="login-btn-Kakaotalk" onClick={() => {
                        
                        localStorage.getItem('loginUser');
                        localStorage.getItem('loginWith');
                        localStorage.getItem('loginMobile');
                    
                        let objData = {
                            "memorial_id" : hallId
                        }
                        
                        ApiPost(`memorialHall/send-sms`, objData)
                        .then((response: any) => {
                        })
                        .catch((error: any) => {
                            setShowPopUp(false);
                            setShowErrorPopUp(true);

                        });
                        
                    }}>
                        <img src="./img/Frame.svg" className="kakaotalk-img" alt=""/>
                        {`${t("Modal.Text_Message")}`}
                    </Buttons>
                </div>
                <Modal.Footer className="share-pop-up-footer p-0">
                    <Button onClick={onHide} className="modal-title-small-s-btn ">{`${t("Modal.Cancels")}`}</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
        </>
    )
}

export default SharePopUp
