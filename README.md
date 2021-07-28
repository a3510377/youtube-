# youtube 留言抓取器

###### tags: `youtube` `server/web` `comment` `google youtube API` `express`

## 目前進度

- [x] 添加 **heroku** 支援
- [x] 將訊息抓取上限添加至 `.env` 檔案中
- [x] 隨機抓取略過 以抓取新對象( 同用戶 || 同訊息
- [x] 填寫 meta 標籤
- [x] 添加網頁 icon
- [x] 隨機抓取
- [x] 關鍵字查尋
- [x] server API
- [x] 網頁 架構
- [x] 抓取留言

## 注意

若無需使用 **heroku** 架設伺服器，可以把 `Procfile` `app.json` 拔掉

## 前置設定

請參考 `.env.example`，於檔案中創建一個 `.env` 文件，放入您的 Google Api Token \ 抓取上限

## 架設方法

注意!!
需先安裝環境: `node.js(npm`

windows 安裝方式 && 啟動方式:

```cmd
npm i
npm start
```
