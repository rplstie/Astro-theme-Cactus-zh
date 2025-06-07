import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect }) => {
  // 获取完整的查询参数字符串
  const searchParams = url.search; // 包含 ? 在内的完整查询字符串

  // 重定向到 Netlify Function，保持所有查询参数
  return redirect(`/.netlify/functions/oauth${searchParams}`, 302);
};