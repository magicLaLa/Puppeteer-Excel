## 使用 puppeteer 抓去网站数据，生成 Excel

- 仅供测试、学习使用
- 使用 `tesseract.js` 进行验证码识别填写（简单版）

测试网站: http://www.etju.com

- 成功状态:
![成功状态](https://i.loli.net/2019/12/31/983B6VjxP2SGkCU.jpg)
- 失败状态
![失败状态](https://i.loli.net/2019/12/31/2qYNx1bP853pKFc.jpg)
- 生成 Excel
![Excel](https://i.loli.net/2019/12/31/PjH6gIOVoCt1Y3R.jpg)

#### 使用方法

1. `npm i` | `yarn`
2. 需要到 `src -> modules -> login.js` 中替换登录账号和密码
3. `node index.js` | `yarn index.js`

#### 提示

- `eng.traineddata` 为 `tesseract.js` 依赖保，没有的情况下会自动下载（下载时间视网络状态而定）