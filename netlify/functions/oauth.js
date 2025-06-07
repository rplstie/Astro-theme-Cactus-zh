exports.handler = async (event, context) => {
  const { httpMethod, path, queryStringParameters } = event;

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
    const redirectUri = `${new URL(event.headers.origin || 'https://mudotarrowmu.netlify.app')}/.netlify/functions/oauth`;
    const state = site_id || ''; // 保存状态

    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${scope || 'repo'}&` +
      `state=${encodeURIComponent(state)}`;

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

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data.error_description || data.error })
        };
      }

      if (data.access_token) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "text/html"
          },
          body: `
            <script>
              window.opener.postMessage({
                token: "${data.access_token}",
                provider: "github"
              }, "*");
              window.close();
            </script>
          `
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Failed to get access token" })
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

  // 情况3：无效请求
  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Invalid OAuth request" })
  };
};