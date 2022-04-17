let nodemailer = require("nodemailer");

module.exports = {
  registerMail: (mail, username, link) => {
    var message =
      `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hi ` +
      username +
      `,</p>
        <br>
        <p>Bienvenido a Tekimu!!!</p>
        <br>

        <p>Gracias por registrarte.</p>
        <p>Esperamos puedas encontrar lo que buscas!!!</p>
        <p>Para acceder a Tekimu, valida tu email con el siguiente link: <a href="` +
      link +`">Presiona aqui</a></p>
        <br>
        <p>Nos vemos pronto en Tekimu.</p>
      </body>
    </html>`;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.email',
      port: 587,
      secure: false,
      requireTLS: true, 
      auth: {
          user: 'rubenalbertoeggel@gmail.com',
          pass: process.env.EMAIL_PASSWORD
      }
    });
    transporter.sendMail(
      {
        from: "registration@tekimu.com",
        to: mail,
        subject: "Bienvenido a Tekimu",
        html: message,
        contentType: "text/html",

      },
      (err, info) => {
        console.log(info.envelope);
        console.log(err);
      }
    );
  },


//   async function sendEmailGmail(data) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         host: 'smtp.gmail.email',
//         port: 587,
//         secure: false,
//         requireTLS: true, 
//         auth: {
//             user: 'rubenalbertoeggel@gmail.com',
//             pass: 'auto4casa'
//         }
//     });
//     let info = await transporter.sendMail(data)
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// }






  forgotPasswordMail: (mail, username, link) => {
    var message =
      `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>Hi ` +
      username +
      `,</p>
        <br>
        <p>Recibimos tu pedido para reiniciar tu contraseña.</p>
        
        <p>Para reiniciar tu contraseña, por favor accede al siguiete link: <a href="` +
      link +
      `">Presiona aqui</a></p>
        <br>
        <p>Nos vemos pronto en Tekimu.</p>
      </body>
    </html>`;

    let transporter = nodemailer.createTransport({
   
        service: 'gmail',
        host: 'smtp.gmail.email',
        port: 587,
        secure: false,
        requireTLS: true, 
        auth: {
            user: 'rubenalbertoeggel@gmail.com',
            pass: 'auto4casa'
        }
    });
    transporter.sendMail(
      {
        from: "noreply@tekimu.com",
        to: mail,
        subject: "Tekimu - Reset contraseña",
        html: message,
        contentType: "text/html"
      },
      (err, info) => {
        console.log(info.envelope);
        console.log(err);
      }
    );
  }
};
