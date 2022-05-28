import React from 'react'
import { Button, Modal } from 'react-bootstrap'
interface Props {
    show: boolean,
    onHide: () => void,
    errorMessage: string,
    title: string
}

const UserAlreadyExit: React.FC<Props> = ({ onHide, show }) => {
    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                size="lg"
                dialogClassName="error-pop-up"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="p-o">
                    <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                    이미 등록된 회원입니다.
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <h4 className="">로그인 후 추모글을 남겨주시길 바랍니다.</h4>
                    <Modal.Footer className="p-0">
                        <Button onClick={onHide} className="modal-title-small-f-btn">확인</Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UserAlreadyExit
