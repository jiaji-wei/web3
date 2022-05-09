# NextJS Typescript Boilerplate

Bootstrap a developer-friendly NextJS app configured with:

- [Typescript](https://www.typescriptlang.org/)
- Preconfigured green theme with [TailwindCSS](https://tailwindcss.com/) and its [Just-in-Time Mode](https://tailwindcss.com/docs/just-in-time-mode)

## Refernce

Thanks for people in these projects, for helps to create this project.

- https://github.com/vercel/next.js/tree/canary/examples/with-typescript-eslint-jest
- https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss

# 项目结构

页面放置在 Pages 目录
组件放置在 Components 目录
Hook 相关方法放置在 /libs/hooks
    第三方库的初始化和引入在 hooks 中完成，并对外提供方法调用，可参考 set.js 的初始化和引用
    常用 hook 的封装，如查询 Token Allowance，Token balance

# WAGMI library
wagmi 库的引入方便了前端 web3 开发工作，提供了钱包链接的管理，Network 的切换及大量 hook 的封装。
相关文档： https://0.2.x.wagmi.sh/，注意 0.2和0.3版本相差较大，此项目中固定版本为 0.2.x，请注意版本

