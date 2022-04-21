import twilio from "twilio";

import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PWD,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: +phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  // 이 조건을 만족하는 user가 있는 경우에는(where) token과 연결해라
  // 만족하는 user가 없다면(create) 이 프로퍼티를 가지고 user를 만들고 token과 연결해라
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}.`,
    // });
    // console.log(message);
  } else if (email) {
    // const sendEmail = await transporter
    //   .sendMail({
    //     from: `ABC <aaa@gmail.com>`,
    //     to: email,
    //     subject: "token",
    //     text: `your login token is ${payload}`,
    //     html: `
    //       <div style="text-align: center;">
    //         <h3 style="color: #FA5882">ABC</h3>
    //         <br />
    //         <p>your login token is ${payload}</p>
    //       </div>`,
    //   })
    //   .then((result: any) => console.log(result))
    //   .catch((err: any) => console.log(err));
  }

  // if (email) {
  //   user = await client.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (user) console.log("found it.");
  //   if (!user) {
  //     console.log("Did not find. Will create");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }

  // if (phone) {
  //   user = await client.user.findUnique({
  //     where: {
  //       phone: +phone,
  //     },
  //   });
  //   if (user) console.log("found it.");
  //   if (!user) {
  //     console.log("Did not find. Will create");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }

  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);

// 폰 번호를 백엔드로 전송
// 백엔드에서 데이터베이스에 있는 유저의 폰 번호를 검색
// 유저를 위한 토큰 발급
// 랜덤 넘버를 유저의 폰 번호로 보낸다.
// 유저는 폰 번호로 토큰을 받으면 프론트엔드로 이동해서 토큰을 입력한다.
// 입력한 토큰을 백엔드로 보내면 그 토큰과 연결된 유저 정보를 가져오고
// 유저를 찾으면 로그인이 됨
