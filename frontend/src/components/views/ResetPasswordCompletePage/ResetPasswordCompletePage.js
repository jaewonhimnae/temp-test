import React, { useState } from 'react'
import { Typography, Button, Form, message, Input } from 'antd';
import axios from 'axios';

const { Title } = Typography;
function ResetPasswordCompletePage(props) {

    const [Password, setPassword] = useState('')
    const [PasswordConfirm, setPasswordConfirm] = useState('')
    const resetToken = props.match.params.token;

    const onChangePassword = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onChangePasswordConfirm = (event) => {
        setPasswordConfirm(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if(Password.length < 6) {
            return alert('비밀 번호는 6자 이상이여야 합니다.')
        }

        if (!Password || !PasswordConfirm) {
            return alert('비밀 번호와 비밀 번호 확인 둘다 작성해 주세요.')
        }

        console.log('Password', Password)
        console.log('PasswordConfirm', PasswordConfirm)

        if(Password !== PasswordConfirm) {
            return alert('비밀 번호와 비밀 번호 확인이 같아야 합니다.')
        }

        const variables = {
            password: Password,
            resetToken: resetToken
        }

        //먼저 이메일이 있는 것인지 확인하자 
        axios.post(`/api/users/reset_password_complete`, variables)
            .then(response => {
                if (response.data.success) {
                    message.success(`비밀 번호 변경에 성공했습니다.`);
                } else {
                    alert('비밀 번호 변경을 실패 했습니다.')
                }
                setPassword('');
                setPasswordConfirm('');
            })
    }


    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <Title level={2}>비밀 번호 변경</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <Input
                        value={Password}
                        onChange={onChangePassword}
                        placeholder="새 비밀 번호 작성해 주세요"
                        type="text"
                    />
                    <br /><br />
                    <Input
                        value={PasswordConfirm}
                        onChange={onChangePasswordConfirm}
                        placeholder="새 비밀 번호를 확인 해주세요"
                        type="text"
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
        </div>
    )
}

export default ResetPasswordCompletePage
