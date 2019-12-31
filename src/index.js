const puppeteer = require('puppeteer');
const login = require('./modules/login');

module.exports = async function init() {
	const browser = await puppeteer.launch({
		headless: true,
		devtools: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
	const page = await browser.newPage();
	await page.goto('http://www.etju.com/');
	await Promise.all([
		page.waitForNavigation(),
		page.click('.m-sideBar .link a:last-child'),
	]);
	login(page);
};
