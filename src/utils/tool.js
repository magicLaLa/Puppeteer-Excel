/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');

exports.sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms || 0));
exports.getFilePath = (filePath) => path.join(filePath);

function removeFilePromise(filePath) {
	filePath = path.join(filePath);
	return new Promise(((resolve, reject) => {
		// 判断文件存不存在
		if (fs.existsSync(filePath)) {
			// 先读文件夹
			fs.stat(filePath, (err, stat) => {
				if (err) reject(err);
				if (stat.isDirectory()) {
					// eslint-disable-next-line consistent-return
					fs.readdir(filePath, (error, files) => {
						let temp = '';
						if (err) reject(error);
						temp = files.map((file) => path.join(filePath, file)); // a/b  a/m
						temp = files.map((file) => removeFilePromise(file)); // 这时候变成了promise
						Promise.all(temp).then(() => {
							fs.rmdir(filePath, resolve);
						});
					});
				} else {
					fs.unlink(filePath, resolve);
				}
			});
		} else {
			resolve('文件不存在');
		}
	}));
}

exports.removeFilePromise = removeFilePromise;
