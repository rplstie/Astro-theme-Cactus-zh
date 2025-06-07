import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect }) => {
  // 手动重新建查询参数
  const params = new URLSearchParams();

  // 获取所有查询参数
  for (const [key, value] of url.searchParams.entries()) {
    params.append(key, value);
  }

  // 构建查询字符串
  const queryString = params.toString();
  const targetUrl = queryString 
    ? `/.netlify/functions/oauth?${queryString}`
    : `/.netlify/functions/oauth`;

  console.log('Original URL:', url.href);
  console.log('Target URL:', targetUrl);

  return redirect(targetUrl, 302);
};