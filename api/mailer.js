import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'violinhell@gmail.com',
        pass: 'abandon_all_hope_549510o'
    }
});

let mailOptions = {
    from: 'violinhell@gmail.com',
    to: 'tqwqts@gmail.com',
    subject: 'Matcha account verification',
    html: '<h1>Hello</h1>'
};
const sendMailVerify =  (email, login, token) => {


    mailOptions.to = email;
    mailOptions.html = `<h1>Hello ${login} !</h1>
                        <p>Thanks for register.</p>
                <p>Activate your account with this <a href="http://localhost:8088/confirm/${login}/${token}">link</a></p>
                <p>Best regards!</p>
                <p>Matcha.</p>`;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return error;
        } else {
            console.log('Email sent: ' + info.response);
        }
    })};
const sendMailRestore = (email, token) => {
    mailOptions.to = email;
    mailOptions.subject = "Forgot password";
    mailOptions.html = `<h1>Hello from Matcha!</h1>
                        <p>You probably click on Forgot password.</p>
                <p>You can chagne your password via this <a href="http://localhost:8088/restoreData/${email}/${token}">link</a></p>
                <p>Best regards!</p>
                <p>Matcha.</p>`;
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return true;
};
export {sendMailVerify as  sendVerify, sendMailRestore as sendRestore}
