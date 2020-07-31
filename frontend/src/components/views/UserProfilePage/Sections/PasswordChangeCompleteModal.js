import React, { useState } from 'react'
import { Form, Modal, Button, Input, message } from 'antd';
import Axios from 'axios';
import { BACK_SERVER_URL, TokenAndTokenExp } from '../../../Config';

function PasswordChangeCompleteModal(props) {

    const [Password, setPassword] = useState('')
    const [PasswordConfirm, setPasswordConfirm] = useState('')

    const onChangePassword = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onChangePasswordConfirm = (event) => {
        setPasswordConfirm(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (Password.length < 6) {
            return alert('비밀 번호는 6자 이상이여야 합니다.')
        }

        if (!Password || !PasswordConfirm) {
            return alert('비밀 번호와 비밀 번호 확인 둘다 작성해 주세요.')
        }

        if (Password !== PasswordConfirm) {
            return alert('비밀 번호와 비밀 번호 확인이 같아야 합니다.')
        }

        const variables = {
            password: Password,
        }

        Axios.post(`/api/users/reset_password_complete_profile_page?${TokenAndTokenExp}`, variables)
            .then(response => {
                if (response.data.success) {
                    message.success(`비밀 번호 변경에 성공했습니다.`);
                } else {
                    alert('비밀 번호 변경을 실패 했습니다.')
                }
                props.refreshSubmitFunction()
                setPassword('');
                setPasswordConfirm('');
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
                <Form onSubmit={onSubmit}>
                    <div style={{ textAlign: 'center', margin: '2rem', }}>
                        <Input
                            value={Password}
                            onChange={onChangePassword}
                            placeholder="새 비밀 번호 작성해 주세요"
                            type="password"
                        />
                        <br /><br />
                        <Input
                            value={PasswordConfirm}
                            onChange={onChangePasswordConfirm}
                            placeholder="새 비밀 번호를 확인 해주세요"
                            type="password"
                        />
                        <br /><br />

                        <Button
                            size="large"
                            htmlType="submit"
                            className=""
                            onSubmit={onSubmit}
                        >
                            비밀 번호 변경
                    </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default PasswordChangeCompleteModal
