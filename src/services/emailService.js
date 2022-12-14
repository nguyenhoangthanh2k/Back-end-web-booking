import 'dotenv/config'
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {

    // create reusable transporter object using the default SMTP transport

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    let getBodyHTMLEmail = (dataSend) => {
        let result = '';
        if (dataSend.language === 'vi') {
            result = `
            <h3>Chào bạn ${dataSend.patientName}</h3>
            <div><p>Bạn nhận được email này do đã đặt lịch khám bệnh online</p></div>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

            <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
            </p>
            <div>
                <a href=${dataSend.redirecLink} target="_blank" >Ấn ở đây để xác nhận </a>
            </div>

            <div>Xin chân thành cảm ơn!</div>
            `
        }

        if (dataSend.language === 'en') {

            result = `
            <h3>Dear ${dataSend.patientName}</h3>
            <div><p>You received this email because you booked an online medical appointment</p></div>
            <p>Information to schedule an appointment:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>

            <p>If the above information is true, please click on the link below to confirm and complete the procedure to book an appointment.
            </p>
            <div>
                <a href=${dataSend.redirecLink} target="_blank" >Click here </a>
            </div>

            <div>Sincerely thank!</div>
            `
        }

        return result
    }

    let getBodyHTMLEmailRemedy = (dataSend) => {
        let result = '';
        if (dataSend.language === 'vi') {
            result = `
            <h3>Chào bạn ${dataSend.patientName}</h3>
            <div><p>Bạn nhận được email này do đã đặt lịch khám bệnh online</p></div>
            <p>Thông tin đơn thuốc được gửi trong file đính kèm:</p>
            <div>Xin chân thành cảm ơn!</div>
            `
        }

        if (dataSend.language === 'en') {

            result = `
            <h3>Dear ${dataSend.patientName}</h3>
            <div><p>You received this email because you booked an online medical appointment</p></div>
            <p>Information Bill</p>
            <div>Sincerely thank!</div>
            `
        }

        return result
    }


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Thư xác nhận" kasukekid123456789@gmail.com', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Xác nhận", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: '"Thư xác nhận" kasukekid123456789@gmail.com', // sender address
                to: dataSend.reciverEmail, // list of receivers
                subject: "Thông tin đơn thuốc/ hóa đơn", // Subject line
                text: "Xác nhận", // plain text body
                html: getBodyHTMLEmailRemedy(dataSend), // html body
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}- ${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }
                ]
            });

            resolve(true)

        } catch (e) {
            reject(e)
        }
    })

}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
}