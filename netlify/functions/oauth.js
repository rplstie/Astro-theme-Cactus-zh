exports.handler = async (event, context) => {
  const { httpMethod, path, queryStringParameters } = event;

  // 只处理 GET 请求到 /oauth 相关路径
  if (httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const { code } = queryStringParameters || {};

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing authorization code" })
    };
  }

  // 检查环境变量
  if (!process.env.OAUTH_GITHUB_CLIENT_ID || !process.env.OAUTH_GITHUB_CLIENT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing OAuth configuration" })
    };
  }

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
};