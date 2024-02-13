const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const transporterOptions = {
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: "daykeepeer655@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
}

async function sendVerificationEmail(name, email, imgSrc = ''){
  const emailToken = jwt.sign(
      { email },
      process.env.EMAIL_SECRET,
      { expiresIn: 3 * 60 } // 3 minutes
  )

  const transporter = nodemailer.createTransport(transporterOptions)

  transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: 'Ative sua conta no DayKeeper!',
    html: `
      <p>${imgSrc}</p>
      <img src="${imgSrc}"></img>
      <h1>Bem vindo(a) ao DayKeeper ${name}!</h1>

      <h3><a href="http://localhost:5173/confirm_email?token=${emailToken}">Clique aqui para confirmar seu registro.</a></h3>

      <h4>Apriveite ao máximo nossa plataforma!</h4>
      <h4>Qualquer dúvida, entre em contato:</h4>
      <h4><a href="https://twitter.com/luciano655dev">Twitter</a></h4>
      <h4><a href="https://github.com/luciano655dev">Github</a></h4>
    `,
  }, (error, info) => {
    if (error) return res.status(500).send(error.toString())

    console.log(`http://localhost:3000/auth/confirm_email?token=${emailToken}`)
  })
}

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: 'Redefinição de Senha no DayKeeper',
    text: `Você está recebendo este email porque solicitou uma redefinição de senha para a sua conta. 
           Por favor, clique no seguinte link ou cole-o no seu navegador para completar o processo: 
           http://localhost:5173/reset_password?token=${resetToken}`,
  })
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
}