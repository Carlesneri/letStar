const path = require('path')
const nodemailer = require('nodemailer')
const util = require('util')
const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

const fsReadFile = util.promisify(fs.readFile)


async function sendEmail(email){
    try{
        // console.log(theMails)
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
        const ejsFile = await fsReadFile(path.join(__dirname, '/nodemailer-template-styled.ejs'), 'utf8')
        
        // console.log(ejsFile)

        const emailSended = await transporter.sendMail({
            from: 'QR Codes | LightenPic <contact@lightenpic.pro>',
            to: email,
            subject: 'Free Image QR Code Generator',
            html: ejsFile
        })
        console.log(`Mensaje enviado a ${email}: ${emailSended.messageId}`)     
        
    }catch(err){
        console.error(err)        
    }
}

module.exports = sendEmail
