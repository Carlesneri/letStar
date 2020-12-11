const nodemailer = require('nodemailer')
// const path = require('path')
// const util = require('util')
// const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

// const fsReadFile = util.promisify(fs.readFile)


async function sendEmail(email, receiver){
    try{
        // console.log(process.env.NODEMAILER_USER, process.env.NODEMAILER_PASSWORD)

        const transport = {
            host: 'mail.privateemail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASSWORD
            }
        }

        const transporter = nodemailer.createTransport(transport)
        // const ejsFile = await fsReadFile(path.join(__dirname, '/nodemailer-template-styled.ejs'), 'utf8')
        // const ejsFile = fs.readFileSync(path.join(__dirname, '/nodemailer-template-styled.ejs'), {
        //     encoding: 'utf8',
        //     flag: 'r'
        // })

        // console.log(ejsFile)

        const emailSended = await transporter.sendMail({
            from: 'QR Codes with LightenPic <contact@lightenpic.pro>',
            to: receiver,
            subject: 'Free Image QR Code Generator',
            html: email
        })

        console.log(`Mensaje enviado a ${receiver}: ${emailSended.messageId}`)


        // console.log(ejsFile)

        // const emailSended = await transporter.sendMail({
        //     from: 'QR Codes | LightenPic <contact@lightenpic.pro>',
        //     to: email,
        //     subject: 'Free Image QR Code Generator',
        //     html: ejsFile
        // })
        // console.log(`Mensaje enviado a ${email}: ${emailSended.messageId}`)

    }catch(err){
        console.error(`Error enviando mail a ${receiver}: ${err}`)
    }
}

module.exports = sendEmail
