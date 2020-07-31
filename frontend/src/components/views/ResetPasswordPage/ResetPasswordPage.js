import React, { useState } from 'react'
import { Typography, Button, Form, message, Input } from 'antd';
import axios from 'axios';

const { Title } = Typography;

function ResetPasswordPage() {

    const [Email, setEmail] = useState('')
    const [Account, setAccount] = useState('')

    const onChangeEmail = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onChangeAccount = (event) => {
        setAccount(event.currentTarget.value)
    }

    const onSubmitAccount = (event) => {
        event.preventDefault();
        
        if (!Account) return message.warning('아이디를 입력해주세요'); 

        const variables = {
            account: Account,
        }

        axios.post(`/api/users/findEmailByAccount`, variables)
            .then(response => {
                if (response.data.success) {
                    message.success(`${Account}의 이메일은 주소는 ${response.data.email}입니다.`);
                } else {
                    message.warning(`${response.data.message}`);
                }
                setEmail('');
            })
    }


    const onSubmit = (event) => {
        event.preventDefault();

        if (!Email) return message.warning('이메일을 입력해주세요'); 

        const variables = { email: Email }

        //먼저 이메일이 있는 것인지 확인하자 
        axios.post(`/api/users/reset_password`, variables)
            .then(response => {
                if (response.data.success) {
                    message.success(`${Email}에 이메일 전송에 성공했습니다.`);
                } else {
                    message.warning(`${response.data.message}`);
                }
                setEmail('');
            })

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <br />
            <div style={{ textAlign: 'center' }}>
                <Title level={2}>비밀 번호를 찾기 위한 이메일 발송</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <br />
                    <Input
                        value={Email}
                        onChange={onChangeEmail}
                        placeholder="이메일을 작성해 주세요"
                        type="email"
                    />

                    <br /><br /><br />
                    <Button
                        size="large"
                        htmlType="submit"
                        className=""
                        onSubmit={onSubmit}
                    >
                        이메일 전송
                    </Button>
                </div>
            </Form>

            <br />

            <div style={{ textAlign: 'center' }}>
                <Title level={2}>이메일을 잊어 버리셨나요 ?</Title>
            </div>
            <Form onSubmit={onSubmitAccount}>
                <div style={{ textAlign: 'center', margin: '2rem', }}>
                    <br />
                    <Input
                        value={Account}
                        onChange={onChangeAccount}
                        placeholder="아이디를 알려 주세요"
                        type="text"
                    />

                    <br /><br /><br />
                    <Button
                        size="large"
                        htmlType="submit"
                        className=""
                        onSubmit={onSubmitAccount}
                    >
                        이메일 찾기
                    </Button>
                </div>
            </Form>


        </div>
    )
}

export default ResetPasswordPage
