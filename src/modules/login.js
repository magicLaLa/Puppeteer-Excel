const chalk = require('chalk');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const { getFilePath } = require('../utils/tool');
const getCookies = require('./getCookies');
const downCodeLoadImg = require('./downCodeLoadImg');
const transcript = require('./transcript');

// eslint-disable-next-line consistent-return
async function login(page) {
	const imgPath = getFilePath('src/img/temp.bmp');
	// ----- 这里需要替换 ---------
	await page.type('input[name=userid]', 'xxxxx');
	await page.type('input[name=password]', 'xxxxxxx');
	// --------------------------
	const codeBmp = await page.$eval('.from-list .code img', (e) => e.src);
	console.log(chalk.blue(codeBmp));
	const cookieStr = await getCookies(page);
	console.log(chalk.yellow(JSON.stringify(cookieStr)));
	const data = await downCodeLoadImg(codeBmp, cookieStr);
	console.log(chalk.green(`data: ${data.length}`));
	fs.writeFileSync(imgPath, data);
	const { data: { text } } = await Tesseract.recognize(imgPath, 'eng', {
		tessedit_char_blacklist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	});
	if (!text) return Promise.reject(new Error('验证码识别失败'));
	console.log(chalk.green(`Tesseract-succ: ${text}`));
	await page.type('input[name=rand]', text);
	let timer = null;
	page.on('dialog', async (dialog) => {
		await dialog.accept();
		if (timer) clearTimeout(timer);
		console.log(chalk.red('验证码错误！'));
		process.exit();
	});
	const cb = async () => {
		if (timer) clearTimeout(timer);
		// 这里 page.click('#dlbtn'), 会报错，加一个等待，确保到底是成功还是失败
		timer = setTimeout(() => {
			console.log(chalk.green('登录成功~'));
			transcript(page);
		}, 3000);
	};
	Promise.all([
		page.click('#dlbtn'),
		page.waitForNavigation(),
	]).then(() => {
		cb();
	}).catch((e) => {
		console.log(chalk.red(e));
		cb();
	});
}

module.exports = login;
