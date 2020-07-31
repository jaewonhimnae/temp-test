import React from 'react'
import { Modal, Button, Input } from 'antd';
import Axios from 'axios';
import { BACK_SERVER_URL, TokenAndTokenExp } from '../../../Config';

function EmailChangeModal(props) {

    const onChangeEmail = (e) => {
        props.refreshEmailFunction(e.currentTarget.value)
    }

    const onSubmitEmail = (e) => {
        e.preventDefault();
        const variable = { email: props.value }

        Axios.post(`/api/users/updateEmail?${TokenAndTokenExp}`, variable)
            .then(response => {
                if (response.data.success) {
                    props.refreshSubmitFunction()
                } else {
                    alert(`${response.data.message}`)
                }
            })
    }

    return (
        <div>
            <Modal
                title="이메일 주소 바꾸기"
                visible={props.visible}
                onCancel={props.onCancel}
                footer={null}
            >
                <Input
                    style={{ width: '80%', borderRadius: '5px' }}
                    onChange={onChangeEmail}
                    value={props.value}
                    placeholder="이메일 주소를 바꿔 주세요."
                />

                <Button style={{ width: '20%' }}
                    onClick={onSubmitEmail}>
                    Submit
                </Button>
            </Modal>
        </div>
    )
}

export default EmailChangeModal
