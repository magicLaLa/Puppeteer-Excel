const { promisify } = require('util');
const request = require('request');

const req = promisify(request);

const downCodeLoadImg = async (url, cookie) => {
	const res = await req({
		url,
		encoding: null,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
			Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'zh-CN,zh;q=0.9',
			Host: 'www.etju.com',
			Referer: 'http://www.etju.com/mcu-common-web/KsLoginAction.action',
			Cookie: cookie,
		},
	});
	console.log('downLoadImg: ', res.body.length);
	return res.body;
};

module.exports = downCodeLoadImg;
