exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;

  console.log('OAuth function called with:', queryStringParameters);

  if (httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const { code, provider, site_id, scope } = queryStringParameters || {};

  // 检查环境变量
  if (!process.env.OAUTH_GITHUB_CLIENT_ID || !process.env.OAUTH_GITHUB_CLIENT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing OAuth configuration" })
    };
  }

  // 情况1：初始授权请求（没有code，但有provider）
  if (!code && provider === 'github') {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    const redirectUri = `https://mudotarrowmu.netlify.app/.netlify/functions/oauth`;
    const state = site_id || '';

    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${scope || 'repo'}&` +
      `state=${encodeURIComponent(state)}`;

    console.log('Redirecting to GitHub:', githubAuthUrl);

    return {
      statusCode: 302,
      headers: {
        Location: githubAuthUrl
      },
      body: ''
    };
  }

  // 情况2：GitHub回调（有code参数）
  if (code) {
    console.log('Processing GitHub callback with code:', code);

    try {
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
          client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
          code: code
        })
      });

      const data = await response.json();
      console.log('GitHub response:', data);

      if (data.access_token) {
        console.log('Returning access token to CMS');
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "text/html"
          },
          // 在 GitHub 回调处理部分，修改返回的 HTML：
          body: `
            <script>
              console.log('Sending token to CMS:', '${data.access_token}');
              console.log('Window opener exists:', !!window.opener);

              if (window.opener) {
                try {
                  window.opener.postMessage({
                    token: "${data.access_token}",
                    provider: "github"
                  }, "*");
                  console.log('Message sent successfully');

                  // 延迟关闭，给你时间查看调试信息
                  setTimeout(() => {
                    console.log('Closing window in 3 seconds...');
                    setTimeout(() => window.close(), 3000);
                  }, 1000);

                } catch (error) {
                  console.error('Error sending message:', error);
                }
              } else {
                console.error('No window.opener found');
                document.body.innerHTML = '<p>Authentication successful! Please close this window.</p>';
              }
            </script>
          `
        };
      } else {
        console.error('No access token in response:', data);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Failed to get access token", details: data })
        };
      }
    } catch (error) {
      console.error("OAuth error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" })
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Invalid OAuth request" })
  };
};