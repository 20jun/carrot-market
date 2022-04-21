import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  return res.status(200).end();
}

export default withHandler("POST", handler);

// 폰 번호를 백엔드로 전송
// 백엔드에서 데이터베이스에 있는 유저의 폰 번호를 검색
// 유저를 위한 토큰 발급
// 랜덤 넘버를 유저의 폰 번호로 보낸다.
// 유저는 폰 번호로 토큰을 받으면 프론트엔드로 이동해서 토큰을 입력한다.
// 입력한 토큰을 백엔드로 보내면 그 토큰과 연결된 유저 정보를 가져오고
// 유저를 찾으면 로그인이 됨
