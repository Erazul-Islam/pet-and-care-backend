import nodemailer from "nodemailer"
import config from "../config"

export const sendEmail = async (to:string,html :string) => {
    const transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com.',
        port : 587,
        secure : config.nodeEnv === 'production',
        auth : {
            user : 'taosif105@gmail.com',
            pass : 'thec grsj hoim bnyz'
        }
    })

    await transporter.sendMail({
        from : 'erazul89@gmail.com',
        to,
        subject : 'Reset pass',
        text : '',
        html 
    })
}