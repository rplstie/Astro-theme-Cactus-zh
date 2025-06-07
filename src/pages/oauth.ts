import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  return new Response(`<!DOCTYPE html>
<html>
<head>
  <title>Redirecting to OAuth...</title>
</head>
<body>
  <p>Redirecting to OAuth...</p>
  <script>
    // 获取当前页面的完整查询参数
    const currentSearch = window.location.search;
    const targetUrl = '/.netlify/functions/oauth' + currentSearch;

    console.log('Current URL:', window.location.href);
    console.log('Target URL:', targetUrl);

    // 立即重定向
    window.location.href = targetUrl;
  </script>
  <noscript>
    <p><a href="/.netlify/functions/oauth${url.search}">Click here to continue</a></p>
  </noscript>
</body>
</html>`, {
    status: 200,
    headers: {
      'Content-Type': 'text/html'
    }
  });
};