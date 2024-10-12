import nodemailer from "nodemailer"

export const sendEmail = async (to:string,html :string) => {
    const transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com.',
        port : 587,
        auth : {
            user : 'taosif105@gmail.com',
            pass : 'thec grsj hoim bnyz'
        }
    })

    await transporter.sendMail({
        from : 'erazul89@gmail.com',
        to,
        subject : 'Reset Your password',
        text : 'You have 10 minute. After this link will be exprired',
        html 
    })
}