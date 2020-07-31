import React, { useState } from 'react'
import { Modal, Button, Input } from 'antd';
import Axios from 'axios';
import { TokenAndTokenExp } from '../../../Config';

function PasswordChangeModal(props) {

    const [Password, setPassword] = useState('')

    const onChangePassword = (e) => {
        setPassword(e.currentTarget.value);
    }

    const onSubmitPassword = (e) => {
        e.preventDefault();
        const variable = { password: Password }

        Axios.post(`/api/users/checkPassword?${TokenAndTokenExp}`, variable)
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
                title="비밀 번호 변경 전 비밀 번호 확인"
                visible={props.visible}
                onCancel={props.onCancel}
                footer={null}
            >
                <Input
                    style={{ width: '80%', borderRadius: '5px' }}
                    onChange={onChangePassword}
                    value={Password}
                    placeholder="현재 비밀 번호를 입력 해주세요."
                    type="password"
                />

                <Button style={{ width: '20%' }}
                    onClick={onSubmitPassword}>
                    Submit
                </Button>
            </Modal>
        </div>
    )
}

export default PasswordChangeModal
