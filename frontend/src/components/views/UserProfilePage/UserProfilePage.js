import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Avatar, Typography, Progress } from 'antd';
import { TokenAndTokenExp } from '../../Config';
import Dropzone from 'react-dropzone';
import { Spin } from 'antd';
import EmailChangeModal from './Sections/EmailChangeModal';
import PasswordChangeModal from './Sections/PasswordChangeModal';
import PasswordChangeCompleteModal from './Sections/PasswordChangeCompleteModal';

const { Title } = Typography;
function UserProfilePage(props) {

    const userId = props.match.params.userId;
    const [EmailChangeModalVisible, setEmailChangeModalVisible] = useState(false)
    const [PasswordChangeModalVisible, setPasswordChangeModalVisible] = useState(false)
    const [PasswordChangeCompleteModalVisible, setPasswordChangeCompleteModalVisible] = useState(false)
    const [UserInfo, setUserInfo] = useState({})
    const [Email, setEmail] = useState("")
    const [ProgressPercentage, setProgressPercentage] = useState(0)
    useEffect(() => {
        fetchUserInfo()
    }, [])

    const fetchUserInfo = () => {
        const variable = { userId: userId }
        Axios.post(`/api/users/getUserInfo?${TokenAndTokenExp}`, variable)
            .then(response => {
                if (response.data.success) {
                    setUserInfo(response.data.userInfo)
                    setEmail(response.data.userInfo.email)
                } else {
                    alert('유저 정보를 가져오는데 실패 했습니다.')
                }
            })
    }

    // EMAIL CHANGE MODAL 
    const openEmailChangeModal = () => {
        setEmailChangeModalVisible(true)
    }

    const closeEmailChangeModal = () => {
        setEmailChangeModalVisible(false)
    };

    const onChangeEmail = (updatedEmail) => {
        setEmail(updatedEmail)
    }

    const onSubmitEmail = () => {
        setEmailChangeModalVisible(false)
        fetchUserInfo()
    }

    // PASSWORD CHANGE MODAL 
    const openPasswordChangeModal = () => {
        setPasswordChangeModalVisible(true)
    }

    const closePasswordChangeModal = () => {
        setPasswordChangeModalVisible(false)
    };

    const onSubmitPassword = () => {
        setPasswordChangeModalVisible(false)
        setPasswordChangeCompleteModalVisible(true)
    }

    // PASSWORD CHANGE COMPLETE MODAL
    const closePasswordChangeCompleteModal = () => {
        setPasswordChangeCompleteModalVisible(false)
    };

    const onSubmitPasswordComplete = () => {
        setPasswordChangeCompleteModalVisible(false)
    }

    const onDrop = (files) => {

        if (props.user.userData && !props.user.userData.isAuth) {
            return alert('Please Log in first');
        }

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' },
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setProgressPercentage(percentCompleted)
            }
        }

        formData.append("file", files[0]);

        Axios.post(`/api/file/upload?userId=${userId}&${TokenAndTokenExp}`, formData, config)
            .then(response => {
                if (response.data.success) {
                    const updateProfileVariables = {
                        image: response.data.fileName,
                        userId: userId
                    }
                    Axios.post(`/api/users/updateProfileImage?${TokenAndTokenExp}`, updateProfileVariables)
                        .then(response => {
                            if (response.data.success) {
                                UserInfo.image = response.data.image
                                let newUserInfo = UserInfo
                                setUserInfo(newUserInfo)
                                window.location.reload();
                            } else {
                                alert('프로필 업로드에 실패 했습니다.')
                            }
                        })
                } else {
                    alert('이미지 업로드에 실패 했습니다.')
                }
            })
    }

    return (
        <div className="contentsWrap">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
                <Title level={2}>유저 정보</Title>
                <br />
                <Dropzone
                    accept="image/*"
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={800000000}>
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ cursor: 'pointer' }} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Avatar src={`/${UserInfo.image}`} shape="square" size={64} icon="user" />
                        </div>
                    )}
                </Dropzone>
                <br />
                <br />
                <h2 onClick={openEmailChangeModal} style={{ cursor: 'pointer' }}>{UserInfo.email}  <Spin /></h2>
                <h2>{UserInfo.name}</h2>
                <h2>{UserInfo.role === 0 ? "일반 이용자" : "관리자"}</h2>
                <h2 onClick={openPasswordChangeModal} style={{ cursor: 'pointer' }} >비밀 번호 변경</h2>

                <div>
                    {ProgressPercentage !== 0 &&
                        <Progress type="circle" percent={ProgressPercentage} />
                    }
                </div>
            </div>

            <EmailChangeModal
                visible={EmailChangeModalVisible}
                onCancel={closeEmailChangeModal}
                refreshEmailFunction={onChangeEmail}
                value={Email}
                refreshSubmitFunction={onSubmitEmail} />

            <PasswordChangeModal
                visible={PasswordChangeModalVisible}
                onCancel={closePasswordChangeModal}
                refreshSubmitFunction={onSubmitPassword} />

            <PasswordChangeCompleteModal
                visible={PasswordChangeCompleteModalVisible}
                onCancel={closePasswordChangeCompleteModal}
                refreshSubmitFunction={onSubmitPasswordComplete} />
        </div>
    )
}

export default UserProfilePage
