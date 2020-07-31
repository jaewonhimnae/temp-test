const mailer = require('nodemailer');
const { welcome } = require("./welcome_template");
const { resetPass } = require("./resetpass_template");

const getEmailData = (to, name, token, template, actionData) => {
    let data = null;

    switch (template) {
        case "welcome":
            data = {
                from: `${process.env.EMAIL}`,
                to,
                subject: `환영합니다, ${name}`,
                html: welcome()
            }
            break;
        case "reset_password":
            data = {
                from: `${process.env.EMAIL}`,
                to,
                subject: `안녕 하세요. ${name}씨, 비밀 번호를 변경해주세요.`,
                html: resetPass(actionData)
            }
            break;
        default:
            data;
    }
    return data;
}

const sendEmail = (to, name, token, type, actionData = null) => {

    const smtpTransport = mailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mail = getEmailData(to, name, token, type, actionData)

    smtpTransport.sendMail(mail, function (error, response) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email Sent Successfully !!!');
        }
        smtpTransport.close();
    })
}

module.exports = { sendEmail }