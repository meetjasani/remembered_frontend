import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Buttons from '../components/Buttons'


interface Props {
    show: boolean,
    onHide: () => void
}

const Loginmodal: React.FC<Props> = ({ onHide, show }) => {

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
            <Modal.Header closeButton className="p-0">
                <Modal.Title className="modal-title-small" id="contained-modal-title-vcenter">
                    로그인
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-title-small-content p-0">
                <h4 className="">해당 메뉴는 로그인 이후 가능한 서비스입니다.</h4>
                <p className="pb-50">지금 바로 리멤버드에 로그인하시겠어요? :)</p>
                <Modal.Footer className="p-0">
                    <Button onClick={onHide} className="modal-title-small-f-btn">로그인</Button>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    )
}

export default Loginmodal
