import { text } from '@fortawesome/fontawesome-svg-core'
import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Buttons from '../components/Buttons'
import { useTranslation } from "react-i18next";


interface Props{
    show: boolean,
    onHide: () => void
}

const EditPost: React.FC<Props> = ({onHide, show}) => {
    const { t } = useTranslation();
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            size="lg"
            dialogClassName="edit-pop-up bg-color "
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="delete-pop-up-title" id="contained-modal-title-vcenter">
                    기부금 보내기
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="edit-pop-up-content">
                <h4 className="">해당 글을 수정하시겠습니까? </h4>
                <p>글 작성 시 입력했던 비밀번호를 입력해주세요.</p>
                <label className="edit-pop-up-lable">수정하기</label>
                <Form.Control
                    name=""
                    value=""
                    className="edit-pop-up-input"
                    type="text"
                    placeholder="Enter password"
                    onChange={() => { }}
                    autoComplete="off"
                    maxLength={10}
                />
            </Modal.Body>
            <Modal.Footer className="edit-pop-up-edit">
                <Button onClick={onHide} className="edit-pop-up-edit-btn">확인</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditPost
