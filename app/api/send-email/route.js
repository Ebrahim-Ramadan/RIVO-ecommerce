
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_ACC,
    pass: process.env.apppassword,
  },
});

const subject = 'DONOT REPLY - Order Confirmation | Rivo Gallery';
const emailContentTemplate = `
<div>
  <div>
    Dear [clientName]
  </div>
  <div>
  You've got great taste! We're thrilled you chose 
  <span>
  <a href='https://e-commerce-myass.vercel.app'>RIVO</a>
  </span>
  .
  </div>
  <div>
  Your order,
  <span>
  <a href='https://e-commerce-myass.vercel.app/orders?id=[orderID]'>[orderID]</a>
  </span>
  , is now under our care and is being processed by our crew.
  </div>
  <div>We'll notify you by email when your items are dispatched and ready for delivery. For precise delivery dates or to track and manage your order, please check your 'Order Summary'.</div>
  <a href='https://e-commerce-myass.vercel.app/orders'>View Orders Summary</a>
 

<div>
<img src='https://lh3.googleusercontent.com/a-/ALV-UjW0d-5_0GPPnlvExjAFxhFyxAFm1CO2QXtbZ8hVVR4CqJkKnrI=s40-p' width='50px' height='50px' />
</div>
</div>
`;

export async function POST(request) {
  const { email, orderID, clientName , secret_token} = await request.json();

  if (!email || !clientName || !orderID) {
    return NextResponse.json({ error: 'Email, orderID, and clientName are required' }, { status: 400 });
  }
  if (!secret_token || secret_token !=process.env.secret_token) {
    return NextResponse.json({ error: 'You are not authorized to do so my dear' }, { status: 400 });
  }

  let emailContent = emailContentTemplate.replace(/\[clientName\]/g, clientName);
  emailContent = emailContent.replace(/\[orderID\]/g, orderID);

  const mailOptions = {
    from: process.env.GMAIL_ACC,
    to: email,
    subject: subject,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
    return NextResponse.json({ message: `Email sent to ${email}` }, { status: 200 });
  } catch (error) {
    console.error(`Error sending email to ${email}: ${error}`);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}