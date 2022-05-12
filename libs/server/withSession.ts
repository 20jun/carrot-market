import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password: process.env.COOKIE_PASSWORD!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

// 이 함수가 하는 일은 iron session에게 req 오브젝트를 제공해서 iron session은 쿠키를 가져오고 쿠키를 해독한 다음,
// 그 쿠키의 결과를 req?.session.user 내부에 넣어주는 것이다.
export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOptions);
}
