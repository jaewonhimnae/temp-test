const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { sendEmail } = require("../utils/mail/index");
const moment = require("moment");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        company: req.user.company
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    console.log('req.body', req.body)
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.status(200).json({
                    loginSuccess: true, userId: user._id,
                    tokenExp: user.tokenExp, token: user.token
                });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/getUserInfo", auth, (req, res) => {
    User.findOne({ _id: req.user._id })
        .exec((err, userInfo) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true, userInfo })
        })
});

router.post("/updateProfileImage", auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                image: req.body.image,
            }
        },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true, image: user.image
            });
        }
    );
});

router.post("/updateEmail", auth, (req, res) => {
    User.findOne({ email: req.body.email })
        .exec((err, user) => {
            if (user) return res.json({ success: false, message: '이미 이 이메일은 사용되고 있습니다.' })
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $set: {
                        email: req.body.email,
                    }
                },
                { new: true },
                (err, user) => {
                    if (err) return res.json({ success: false, message: err });
                    return res.status(200).send({
                        success: true, email: user.email
                    });
                }
            );
        })
});

router.post("/reset_password", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) return res.send({ success: false, message: '이메일과 맞는 사용자가 없습니다.' })
        user.generateResetToken((err, user) => {
            if (err) return res.json({ success: false, message: err });
            sendEmail(user.email, user.name, null, "reset_password", user);
            return res.json({ success: true });
        });
    });
});

router.post("/findEmailByAccount", (req, res) => {
    User.findOne({ account: req.body.account }, (err, user) => {
        if (!user) return res.send({ success: false, message: '아이디와 맞는 사용자가 없습니다.' })
        res.status(200).json({ success: true, email: user.email })
    });
});

router.post("/reset_password_complete", (req, res) => {
    var today = moment()
        .startOf("day")
        .valueOf();

    User.findOne(
        {
            resetToken: req.body.resetToken,
            resetTokenExp: {
                $gte: today
            }
        },
        (err, user) => {
            if (!user)
                return res.json({
                    success: false,
                    message: "Sorry, token bad, generate a new one."
                });

            user.password = req.body.password;
            user.resetToken = "";
            user.resetTokenExp = "";

            user.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({
                    success: true
                });
            });
        }
    );
});

router.post("/reset_password_complete_profile_page", auth, (req, res) => {
    User.findOne({ _id: req.user._id },
        (err, user) => {
            user.password = req.body.password;
            user.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({
                    success: true
                });
            });
        }
    );
});

router.post("/checkPassword", auth, (req, res) => {
    User.findOne({ email: req.user.email }, (err, user) => {
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ success: false, message: "비밀 번호가 틀렸습니다." });
            return res.status(200).json({
                success: true
            })
        });
    });
});


module.exports = router;
