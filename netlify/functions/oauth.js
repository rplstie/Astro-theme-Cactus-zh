
const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  const { httpMethod, path, queryStringParameters, body } = event;
  
  // 处理 OAuth 回调
  if (httpMethod === "GET" && path.includes("/oauth/callback")) {
    const { code } = queryStringParameters;
    
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing authorization code" })
      };
    }

    try {
      // 交换 code 获取 access token
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
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" })
      };
    }
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ error: "Not found" })
  };
};
