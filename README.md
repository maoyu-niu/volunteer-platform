# 青木志愿 - 社区志愿服务对接与培训平台

本项目是一个基于 React + Vite + Tailwind CSS 构建的现代 Web 应用。实现了从“志愿者”、“社区/街道”到“平台管理员”的多角色闭环流转。

## 🚀 如何将本项目发布到公网（让所有人都能访问）

最简单、免费且最主流的方式是使用 **Vercel** 或者 **Netlify** 进行部署。以下是使用 Vercel 的保姆级步骤：

### 步骤 1：下载代码到本地
1. 在您当前的云端工作区中，找到整个 `volunteer-platform` 文件夹。
2. 将这个文件夹打包下载到您的本地电脑上，并解压。

### 步骤 2：将代码上传到 GitHub
1. 注册一个 [GitHub](https://github.com/) 账号（如果还没有的话）。
2. 在您的本地电脑上，安装 [Git](https://git-scm.com/)。
3. 在 GitHub 网站上点击右上角的 **"+"** -> **"New repository"**，创建一个新的代码仓库（例如命名为 `volunteer-platform`），不需要勾选 "Initialize this repository with a README"。
4. 打开您本地解压后的 `volunteer-platform` 文件夹，在里面打开命令行/终端，依次运行以下命令：
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/您的GitHub用户名/您的仓库名.git
   git push -u origin main
   ```
   *此时，您的代码已经成功上传到了 GitHub。*

### 步骤 3：在 Vercel 上一键部署
1. 访问 [Vercel 官网](https://vercel.com/)。
2. 点击 **"Sign Up"** 或 **"Log In"**，选择 **"Continue with GitHub"** 进行授权登录。
3. 登录后，在 Vercel 后台面板（Dashboard）点击右上角的 **"Add New..."** -> **"Project"**。
4. Vercel 会列出您的 GitHub 仓库，找到刚刚上传的 `volunteer-platform` 仓库，点击旁边的 **"Import"** 按钮。
5. 在接下来的配置页面中，您**什么都不需要修改**。Vercel 会自动识别出这是一个 Vite + React 项目，底部的 Build Command 和 Output Directory 会自动填好。
6. 直接点击 **"Deploy"** 按钮！

### 步骤 4：获取您的公网链接
等待大约 1 分钟左右的构建时间。当屏幕上出现满天飞舞的彩色纸屑时，恭喜您部署成功！
Vercel 会自动为您分配一个类似于 `https://volunteer-platform-xxx.vercel.app` 的公网链接。

**您可以把这个链接发给任何不在同一个网络下的同学、老师，他们点击就能直接在手机或电脑浏览器中体验您设计的平台了！**

---

## 💻 开发者本地运行指南

如果您只是想在本地电脑运行和修改代码：

1. 确保您的电脑安装了 [Node.js](https://nodejs.org/) (建议版本 18+)。
2. 在项目根目录下打开终端，运行：
   ```bash
   npm install
   ```
3. 启动本地开发服务器：
   ```bash
   npm run dev
   ```
4. 在浏览器中访问 `http://localhost:5173`。