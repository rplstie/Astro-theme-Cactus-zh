<div align="center">
  <img alt="Astro Cactus logo" src="https://github.com/chrismwilliams/astro-theme-cactus/assets/12715988/85aa0d3c-ef6a-44e2-954d-ef035b4f4315" width="70" />
</div>
<h1 align="center">
  Astro 仙人掌
</h1>

Astro 仙人掌 是一个基于 Astro 框架的博客主题，使用 Astro 和 TailwindCSS。是 Astro Cactus 主题项目的中文汉化版。同时集成 **decap cms**，实现在线编辑、发布。

原主题地址: https://github.com/chrismwilliams/astro-theme-cactus

## 演示站点 💻

点击预览 [Demo](https://demo.343700.xyz/)

## 快速开始 🚀

### A、网页编辑模式（Netlify 部署）

1. **Fork 项目到 GitHub**
   - 点击 Fork 按钮，复制本项目到你的 GitHub 仓库

2. **创建 GitHub OAuth 应用**
   - 访问 [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
   - 创建新的 OAuth 应用，填写以下信息：
     - **Application name**: 你的应用名称（如：我的博客）
     - **Homepage URL**: `https://你的站点名.netlify.app`
     - **Authorization callback URL**: `https://你的站点名.netlify.app/oauth/callback`
   - 记录生成的 **Client ID** 和 **Client Secret**

3. **部署到 Netlify**
   - 访问 [Netlify](https://netlify.com) 并注册登录
   - 点击 "New site from Git"
   - 选择 GitHub 并授权访问
   - 选择你刚才 Fork 的仓库
   - 构建设置：
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - 点击 "Deploy site"

4. **配置环境变量**
   - 在 Netlify 项目设置中，进入 **Site settings** > **Environment variables**
   - 添加以下环境变量：
     - `OAUTH_GITHUB_CLIENT_ID`: 你的 GitHub OAuth Client ID
     - `OAUTH_GITHUB_CLIENT_SECRET`: 你的 GitHub OAuth Client Secret

5. **修改 CMS 配置**
   - 编辑 `public/admin/config.yml` 文件：
   ```yaml
   backend:
     name: github
     branch: main
     repo: 你的用户名/你的仓库名  # 例如：johndoe/my-blog
     site_domain: 你的站点名.netlify.app  # 例如：my-awesome-blog.netlify.app
     base_url: https://你的站点名.netlify.app
     auth_endpoint: oauth
   ```

6. **重新部署**
   - 提交配置更改到 GitHub
   - Netlify 将自动重新部署

7. **访问博客**
   - **前台**: `https://你的站点名.netlify.app`
   - **后台管理**: `https://你的站点名.netlify.app/admin`

### CMS 配置参数详解

在 `public/admin/config.yml` 中的关键参数：

- **repo**: GitHub 仓库路径，格式为 `用户名/仓库名`
- **site_domain**: 你的 Netlify 站点域名（可在 Netlify 项目设置中查看或自定义）
- **base_url**: 完整的站点 URL，用于 OAuth 认证
- **auth_endpoint**: OAuth 认证端点，固定为 `oauth`

### 自定义域名（可选）

如果你有自己的域名：
1. 在 Netlify 项目设置中添加自定义域名
2. 配置 DNS 记录指向 Netlify
3. 更新 `config.yml` 中的 `site_domain` 和 `base_url`
4. 更新 GitHub OAuth 应用中的 URL 设置



### B、本地编辑模式

先完成【A、网页编辑模式】中的步骤，然后执行下面的步骤

1. 点击 Fork 按钮，复制本项目到你的GitHub 仓库，然后点击 Code 按钮，复制项目地址。
2. 本地电脑上执行下面代码，安装项目
```bash
git clone https://github.com/your-username/astro-theme-cactus-zh-cn.git

cd astro-theme-cactus-zh-cn

pnpm install
```
3. 在 `src/content` 文件夹中，新建 markdown 文件，例如 `src/content/posts/hello-world.md`
4. 保存md文件，执行 git push 推送到远程仓库

#### 命令

| 命令             | 操作                                                         |
| :--------------- | :------------------------------------------------------------- |
| `pnpm install`   | 安装依赖项                                                   |
| `pnpm dev`       | 在 `localhost:3000` 启动本地开发服务器                       |
| `pnpm build`     | 将生产站点构建到 `./dist/` 目录下                             |
| `pnpm postbuild` | 执行 Pagefind 脚本，为博客文章构建静态搜索功能                |
| `pnpm preview`   | 在部署前本地预览构建结果                                       |
| `pnpm sync`      | 根据 `src/content/config.ts` 中的配置生成类型                 |

## 个性化配置 ⚙

- 修改导航栏标题，图片 -> `src/components/layout/Header.astro`
- 修改网站配置 -> `src/site.config.ts`
- 修改框架配置 -> `astro.config.ts`
- 修改社交图标链接 -> `src/components/SocialList.astro`


## License

MIT
