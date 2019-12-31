const chalk = require('chalk');
const XLSX = require('xlsx');
const { removeFilePromise } = require('../utils/tool');

const dlXlsx = ({ titList, tabData }) => {
	const header = titList
		.map((v, i) => ({ v, position: String.fromCharCode(65 + i) + 1 }))
		// 为 _headers 添加对应的单元格位置
		// [ { v: 'id', position: 'A1' },
		//   { v: 'name', position: 'B1' },
		//   { v: 'age', position: 'C1' },
		//   { v: 'country', position: 'D1' },
		.reduce((prev, next) => ({ ...prev, [next.position]: { v: next.v } }), {});
		// 转换成 worksheet 需要的结构
		// { A1: { v: 'id' },
		//   B1: { v: 'name' },
		//   C1: { v: 'age' },
		//   D1: { v: 'country' },
	const data = tabData
		.map((v, i) => titList.map((k, j) => ({ v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
		// 匹配 headers 的位置，生成对应的单元格数据
		// [ [ { v: '1', position: 'A2' },
		//     { v: 'test1', position: 'B2' },
		//     { v: '30', position: 'C2' },
		//     { v: 'China', position: 'D2' }],
		//   [ { v: '2', position: 'A3' },
		//     { v: 'test2', position: 'B3' },
		//     { v: '20', position: 'C3' },
		//     { v: 'America', position: 'D3' }],
		//   [ { v: '3', position: 'A4' },
		//     { v: 'test3', position: 'B4' },
		//     { v: '18', position: 'C4' },
		//     { v: 'Unkonw', position: 'D4' }] ]
		.reduce((prev, next) => prev.concat(next))
		// 对刚才的结果进行降维处理（二维数组变成一维数组）
		// [ { v: '1', position: 'A2' },
		//   { v: 'test1', position: 'B2' },
		//   { v: '30', position: 'C2' },
		//   { v: 'China', position: 'D2' },
		//   { v: '2', position: 'A3' },
		//   { v: 'test2', position: 'B3' },
		//   { v: '20', position: 'C3' },
		//   { v: 'America', position: 'D3' },
		//   { v: '3', position: 'A4' },
		//   { v: 'test3', position: 'B4' },
		//   { v: '18', position: 'C4' },
		//   { v: 'Unkonw', position: 'D4' },
		.reduce((prev, next) => ({ ...prev, [next.position]: { v: next.v } }), {});
		// 转换成 worksheet 需要的结构
		//   { A2: { v: '1' },
		//     B2: { v: 'test1' },
		//     C2: { v: '30' },
		//     D2: { v: 'China' },
		//     A3: { v: '2' },
		//     B3: { v: 'test2' },
		//     C3: { v: '20' },
		//     D3: { v: 'America' },
		//     A4: { v: '3' },
		//     B4: { v: 'test3' },
		//     C4: { v: '18' },
		//     D4: { v: 'Unkonw' }
	// 合并 headers 和 data
	const output = { ...header, ...data };
	// 获取所有单元格的位置
	const outputPos = Object.keys(output);
	// 计算出范围
	const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
	// 构建 workbook 对象
	const workbook = {
		SheetNames: ['mySheet'],
		Sheets: {
			mySheet: { ...output, '!ref': ref },
		},
	};
	// 导出 Excel
	try {
		XLSX.writeFile(workbook, 'output.xlsx');
		console.log(chalk.green('创建output.xlsx成功！'));
		process.exit();
	} catch (e) {
		console.log(chalk.red(e));
		process.exit();
	}
};

async function transcript(page) {
	await removeFilePromise('output.xlsx');
	await page.click('#ext-gen128');
	await page.evaluate(() => {
		// eslint-disable-next-line no-undef
		document.querySelector('#ext-gen130 #ext-gen132 a').click();
		return Promise.resolve();
	});
	await page.waitFor(3000);
	const iframs = await page.frames();
	const chengjidan = iframs.find((item) => item.name() === 'ChengJiDanChaXun'); // 成绩单iframe对象
	// await chengjidan.waitFor('#mainCont>table');
	const tableObj = await chengjidan.evaluate(() => {
		// eslint-disable-next-line no-undef
		const titles = document.querySelectorAll('.pn-lthead tr>th');
		// eslint-disable-next-line no-undef
		const contentsTr = document.querySelectorAll('.pn-ltbody tr');
		console.log('titles', titles);
		const titList = [...titles].map((item) => item.innerText);
		const len = titList.length;
		const tabData = [...contentsTr].map((tr) => {
			// tr.children
			const params = {};
			for (let i = 0; i < len; i++) {
				params[titList[i]] = tr.children[i].innerText.trim();
			}
			return params;
		});
		return {
			titList,
			tabData,
		};
	});
	dlXlsx(tableObj);
}

module.exports = transcript;
