import Router from "@koa/router";
import DB from "@/db";
import jwt from "jsonwebtoken";

let router = new Router();
interface payLoadType {
  id: number;
}
router.get("/user/info", async ctx => {
  let token = ctx.header.authorization;

  try {
    let { id } = jwt.verify(token + "", process.env.KEY as string) as payLoadType;
    await DB.User.findByPk(id, { attributes: { exclude: ["password"] } })
      .then(row => {
        if (!row) {
          ctx.body = { success: false, messgae: "没有查询到用户信息" };
          return;
        }
        ctx.body = { success: true, messgae: "查询成功", data: row };
      })
      .catch(err => {
        ctx.body = { success: false, messgae: "查询错误" };
      });
  } catch {
    ctx.body = { success: false, messgae: "Token解析失败" };
  }

});
export default router;
