import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  // 获取完整的查询字符串
  const search = url.search || '';

  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Redirecting...</title>
    </head>
    <body>
      <script>
        window.location.href = '/.netlify/functions/oauth${search}';
      </script>
      <noscript>
        <meta http-equiv="refresh" content="0;url=/.netlify/functions/oauth${search}">
      </noscript>
    </body>
    </html>
  `, {
    status: 200,
    headers: {
      'Content-Type': 'text/html'
    }
  });
};