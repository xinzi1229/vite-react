import { Hono } from "hono";

// 1. 定义 Env 类型，告诉 TypeScript 我们有一个名为 DB 的 D1 数据库绑定
type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

// 2. 修改路由为 /api/user，并使用 async/await 处理异步数据库操作
app.get("/api/user", async (c) => {
  try {
    // 3. 从上下文环境中获取数据库实例
    const db = c.env.DB;

    // 4. 执行 SQL 查询，获取所有用户
    //    假设你的表名是 'tbuser'
    const { results } = await db.prepare("SELECT * FROM tbuser").all();

    // 5. 返回查询到的用户列表
    return c.json({ users: results });
  } catch (error) {
    // 如果查询失败，返回错误信息
    console.error("Database query failed:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// 保留你原来的路由作为对比或测试
app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;