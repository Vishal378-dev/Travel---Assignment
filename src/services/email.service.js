import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";


export  async function sendEmails(email,name,id){
try{

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_TOKEN,
});

const sentFrom = new Sender(process.env.MAILER_DOMAIN, "TMTC");

const recipients = [
  new Recipient(email, name)
];

const personalization = [
  {
    email: email,
    data: {
      id: id,
      name: name,
      email: email,
      year: new Date().getFullYear(),
      subject: "TMTC - Itinerary Registration"
    },
  }
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setPersonalization(personalization)
  .setSubject("Subject, {{ subject }}")
  .setHtml(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Registration Successful</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #0d6efd;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 30px;
    }
    .content h2 {
      margin-top: 0;
      color: #0d6efd;
    }
    .details {
      background-color: #f8f9fa;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
    }
    .details p {
      margin: 8px 0;
      font-size: 14px;
    }
    .footer {
      background-color: #f1f3f5;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #6c757d;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <h1>Registration Successful 🎉</h1>
    </div>

    <div class="content">
      <h2>Hello {{ name }},</h2>

      <p>
        We’re happy to inform you that your itinerary has been
        <strong>successfully registered</strong>.
      </p>

      <div class="details">
        <p><strong>Itinerary ID:</strong> {{ id }}</p>
        <p><strong>Name:</strong> {{ name }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
      </div>

      <p>
        Please keep this information for your records.
        If you have any questions or need further assistance,
        feel free to reach out to our support team.
      </p>

      <p>
        Thank you for choosing <strong>TMTC</strong>!
      </p>

      <p>
        Best regards,<br />
        <strong>TMTC Team</strong>
      </p>
    </div>

    <div class="footer">
      © {{ year }} TMTC. All rights reserved.
    </div>
  </div>

</body>
</html>
`)
  .setText("Hi, {{ test }}");

await mailerSend.email.send(emailParams);
}catch(err){
    console.error(err)
}
};