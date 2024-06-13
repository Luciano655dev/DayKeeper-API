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

async function sendVerificationEmail(name, email, imgSrc = '', verificationCode) {
  const transporter = nodemailer.createTransport(transporterOptions)

  transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: 'Ative sua conta no DayKeeper!',
    html: `
      <p>${imgSrc}</p>
      <img src="${imgSrc}"></img>
      <h1>Bem vindo(a) ao DayKeeper ${name}!</h1>

      <h3>Seu código de verificação é: <strong>${verificationCode}</strong></h3>

      <h4>Apriveite ao máximo nossa plataforma!</h4>
      <h4>Qualquer dúvida, entre em contato:</h4>
      <h4><a href="https://twitter.com/luciano655dev">Twitter</a></h4>
      <h4><a href="https://github.com/luciano655dev">Github</a></h4>
    `,
  }, (error, info) => {
    if (error)
      return error.toString()

    console.log(`Verification code sent: ${verificationCode}`)
  })
}

const sendPasswordResetEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: 'Redefinição de Senha no DayKeeper',
    text: `Você está recebendo este email porque solicitou uma redefinição de senha para a sua conta. 
           
          <h3>Seu código de verificação é: <strong>${verificationCode}</strong></h3>`,
  }, (error, info) => {
    if (error)
      return error.toString()

    console.log(`Verification code sent: ${verificationCode}`)
  })
}

const sendBanEmail = async({ username, email, adminUsername, reason }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Sua conta ${username} foi banida no DayKeeper :(`,
    text: `Você está recebendo este email pois <strong>Sua conta de nome ${username} foi banida no DayKeeper</strong>
            Sua conta foi revisada e banida do DayKeeper por ${adminUsername} pelo seguinte motivo:

            ${reason}

            Você ainda pode solicitar o desbanimento da sua conta respondendo este Gmail
            Caso isso não seja feito, sua conta e suas interações serão <strong>permanentemente excluidas</strong> em 1(um) mês

            Obrigado pela compreensão
            DayKeeper`,
  })
}

const sendUnbanEmail = async({ username, email, adminUsername, reason }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Sua conta ${username} foi DESBANIDA do DayKeeper ;)`,
    text: `Temos boas noticias! <strong>Sua conta de nome ${username} foi DESBANIDA no DayKeeper</strong>
            Sua conta foi revisada por ${adminUsername} e, concluimos que, pelo seguinte motivo:

            ${reason}

            Sua conta foi desbanida
            Todos os seus posts e interações voltaram ao ar!
            Desculpe-nos por qualquer inconveniência, espero que aproveite a conta!

            Obrigado
            DayKeeper`,
  })
}

const sendUserDeletionEmail = async({ username, email, adminUsername, reason, message }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Sua conta "${username}" foi permanentemente excluida do DayKeeper`,
    text: ` Após uma analise da sua conta por nossos admininstradores, decidimos excluir sua conta
            Sua conta de nome ${username} já havia sido banida antes e, após analises, ela foi excluida.

            Sua conta, banida e revisada por ${adminUsername}, foi banida pelo seguinte motivo:

            "${reason}"

            e o ADM concluiu com a seguinte mensagem:

            "${message}"

            Hoje, todas as ações interações pertencentes a ela foram excluidas
            Infelizmente, não há possibilidade de volta de nenhuma das informações
            Desculpe-nos por qualquer inconveniência

            Obrigado pela compreensão
            DayKeeper`,
  })
}

// ========== POST ==========
const sendPostBanEmail = async({ username, email, title, id, adminUsername, reason }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Seu post do dia ${title} foi banido do DayKeeper`,
    text: ` Após uma analise da sua conta por nossos admininstradores, decidimos banir seu post
            do dia ${title}, de id "${id}", pertencente a sua conta de nome ${username}, do DayKeeper.

            Esse post, revisado por ${adminUsername}, foi banido pelo seguinte motivo:

            "${reason}"

            Caso você acredite que esse banimento foi feito de forma equivocada, contate-nos
            em um período de até uma semana
            Caso contrário, o post será permanentemente excluido da plataforma.

            Obrigado pela compreensão
            DayKeeper`,
  })
}

const sendPostUnbanEmail = async({ username, email, title, id, adminUsername, reason }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Seu post do dia ${title} foi DESBANIDO do DayKeeper ;)`,
    text: `Post do dia ${bannedPostTitle} com o id "${id}", da conta ${username}
          foi desbanido por ${adminUsername} pela razao: "${reason}"`,
  })
}
const sendPostDeletionEmail = async({ username, email, title, id, adminUsername, reason, message }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Seu post do dia ${title} foi excluido permanentemente do DayKeeper`,
    text: ` Por falta de resposta ou por confirmação de admininstradores, decidimos excluir permanentemente
            seu post do dia ${title} com o id "${id}", pertencente a sua conta de nome ${username}, no DayKeeperr.

            Esse post, que já havia sido banido por ${adminUsername}, foi permanentemente excluido pelo seguinte motivo:

            "${reason}"

            E o ADM concluiu com a seguinte mensagem:

            "${message}"

            Infelizmente, esta ação não poderá ser revertida

            Obrigado pela compreensão
            DayKeeper`,
  })
}

// ========== STORIES ==========
const sendStorieBanEmail = async({ username, email, title, id, adminUsername, reason }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Seu Storie do dia ${title} foi banido do DayKeeper`,
    text: ` ${username}, seu storie do dia ${title} com o id "${id}" foi banido pelo admin ${adminUsername} pelo motivo:
    
          "${reason}"
          `,
  })
}

const sendStorieUnbanEmail = async({ username, email, title, id, adminUsername, reason }) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  await transporter.sendMail({
    from: 'Day Keeper <daykeepeer655@gmail.com>',
    to: email,
    subject: `Seu Storie do dia ${title} foi DESBANIDO do DayKeeper`,
    text: ` ${username}, seu storie do dia ${title} com o id "${id}" foi desbanido pelo admin ${adminUsername} que concluiu:
    
          "${reason}"
          `,
  })
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,

  sendBanEmail,
  sendUnbanEmail,
  sendUserDeletionEmail,

  sendPostBanEmail,
  sendPostUnbanEmail,
  sendPostDeletionEmail,

  sendStorieBanEmail,
  sendStorieUnbanEmail
}