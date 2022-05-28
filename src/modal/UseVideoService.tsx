import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Buttons from '../components/Buttons'


interface Props{
    show: boolean,
    onHide: () => void
}

const UseVideoService: React.FC<Props> = ({onHide, show}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            size="lg"
            dialogClassName="loginmodal-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                    영상 서비스 이용
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="loginmodal-pop-up-content">
                <h4 className="">해당 메뉴는 유료 서비스입니다. </h4>
                <p className="pb-50">지금 영상 서비스를 이용하시겠어요?</p>
            </Modal.Body>
            <Modal.Footer className="loginmodal-pop-up-Log-In">
                <Button onClick={onHide} className="loginmodal-pop-up-Log-In-btn">영상 서비스 이용하러 가기</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UseVideoService
