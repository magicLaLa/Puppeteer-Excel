async function getCookies(page) {
	const cookies = await page.cookies();
	let cookieStr = '';
	const end = cookies.length - 1;
	cookies.forEach((item, ind) => {
		const str = `${item.name}=${item.value}`;
		const tag = ind === end ? '' : '; ';
		cookieStr = cookieStr + str + tag;
	});
	return cookieStr;
}

module.exports = getCookies;
