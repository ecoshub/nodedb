const os = require('os');
const path = require('path');
const fs = require('fs');

const preProcess = (dir) => {
	if (dir === 'desk') {
		dir = path.join(os.homedir(), 'Desktop');
	} else if (dir === 'down') {
		dir = path.join(os.homedir(), 'Downloads');
	} else if (dir === 'docu') {
		dir = path.join(os.homedir(), 'Documents');
	}
	return dir
}

const writeToDataBase = (name, dir, input, done) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	fs.exists(file, err => {
		let exists = err ? true : false;
		if (exists) {
			fs.access(file, fs.constants.W_OK, err => {
				if (err) {
					done(err);
				}
				let arrExist = [];
				let arrNew = [];
				let str = '';
				let reader = fs.readFileSync(file, 'utf8');
				arrNew.push(input);
				if (reader !== '') {
					arrExist = JSON.parse(reader);
				}
				arrNew = arrNew.concat(arrExist);
				str = JSON.stringify(arrNew);
				fs.open(file, 'w', function(err, fd) {
					if (err) {
						done(err);
					}
					fs.write(fd, str, err => {
						if (err) {
							done(err);
						}
						fs.close(fd, () => {
							done(err);
						});
					});
				});
			});
		} else {
			fs.open(file, 'w', function(err, fd) {
				if (err) {
					done(err);
				}
				let arr = [];
				arr.push(input);
				arr = arr.reverse();
				let str = JSON.stringify(arr);
				fs.write(fd, str, function(err) {
					if (err) {
						done(err);
					}
					fs.close(fd, function() {
						done(err);
					});
				});
			});
		}
	});
};

const writeToDataBaseArray = (name, dir, arr, done) => {
	if (!arr.length) {
		return done();
	}

	let len = arr.length;
	let index = 0;

	reqSave(name, dir, arr, len, index, err => {
		done(err);
	});
};

const reqSave = (name, dir, arr, len, index, done) => {
	writeToDataBase(name, dir, arr[index], err => {
		index++;
		if (index !== len) {
			reqSave(name, dir, arr, len, index, () => {
				done(err);
			});
		} else {
			done(err);
		}
	});
};

const getFromDataBase = (name, dir, start, end, done) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	fs.exists(file, err => {
		let exists = err ? true : false;
		let arr = [];
		if (exists) {
			fs.access(file, fs.constants.W_OK, err => {
				if (err) {
					done(err, arr, 0);
				}
				let reader = fs.readFileSync(file, 'utf8');
				if (reader !== '') {
					arr = JSON.parse(reader);
				}
				const slice = [];
				const lenarr = arr.length;
				if (start === 0 && end === 0) {
					done(err, arr, lenarr);
				} else {
					if (lenarr <= start) {
						done(err, [], -1);
					} else {
						let count = 0;
						if (end > lenarr) {
							for (let i = start; i <= lenarr - 1; i++) {
								slice.push(arr[i]);
								count++;
							}
						} else {
							for (let i = start; i < end; i++) {
								slice.push(arr[i]);
								count++;
							}
						}
						done(err, slice, count);
					}
				}
			});
		} else {
			done(false, arr, 0);
		}
	});
};

const getFromDataBaseSync = (name, dir, start, end) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	let exist = false;
	try {
		let stat = fs.statSync(file);
		exist = true;
	} catch (err) {
		exist = false;
	}
	if (exist) {
		let arr = [];
		let reader = fs.readFileSync(file, 'utf8');
		if (reader !== '') {
			arr = JSON.parse(reader);
		}
		const slice = [];
		const lenarr = arr.length;
		if (start === 0 && end === 0) {
			return { done: true, arr: arr, len: lenarr };
		} else {
			if (lenarr <= start) {
				return { done: true, arr: [], len: -1 };
			} else {
				let count = 0;
				if (end > lenarr) {
					for (let i = start; i < lenarr; i++) {
						slice.push(arr[i]);
						count++;
					}
				} else {
					for (let i = start; i < end; i++) {
						slice.push(arr[i]);
						count++;
					}
				}
				return { done: true, arr: slice, len: count };
			}
		}
	} else {
		return { done: false, arr: [], len: -2 };
	}
}

const findFromDataBaseSync = (name, dir, keys, value) => {
	dir = preProcess(dir);
	let file = path.join(dir, name);
	let exist = false;
	try {
		let stat = fs.statSync(file);
		exist = true;
	} catch (err) {
		exist = false;
	}
	if (exist) {
		let arr = [];
		let reader = fs.readFileSync(file, 'utf8');
		if (reader !== '') {
			arr = JSON.parse(reader);
		}
		let mainObject = {};
		let count = 0; 
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < keys.length; j++) {
				let currKey = keys[j]
				if (typeof arr[i][currKey] === 'string' && arr[i][currKey] !== null) {
					let start = arr[i][currKey].toLowerCase().indexOf(value.toLowerCase());
					if (start !== -1) {
						if (i > 0 ){
							mainObject[i - 1] = arr[i - 1];
							count++;
						}
						arr[i][currKey] = addSpan(arr[i][currKey], value, start);
						mainObject[i] = arr[i];
						count++;
						if (i < arr.length - 1){
							mainObject[i + 1] = arr[i + 1];
							count++;
						}
					}
				}
			}
		}
		const finalArray = [];
		const objKeys = Object.keys(mainObject);
		let tempArr = [];
		for ( var i = 0 ; i < objKeys.length ; i ++ ){
			if (objKeys.length - 1 === i){
				if (parseInt(objKeys[i]) - 1 === parseInt(objKeys[i - 1])){
					tempArr.push(mainObject[objKeys[i]]);
				}else{
					tempArr.push(mainObject[objKeys[i]]);
					finalArray.push(tempArr);
					tempArr = [];
				}
			}else{
				if (parseInt(objKeys[i]) + 1 === parseInt(objKeys[i + 1])){
					tempArr.push(mainObject[objKeys[i]]);
				}else{
					tempArr.push(mainObject[objKeys[i]]);
					finalArray.push(tempArr);
					tempArr = [];
				}
			}
		}
		if (tempArr.length !== 0 ){
			finalArray.push(tempArr);
		}
		console.log(finalArray)
		return { done: true, arr: finalArray};
	}
	return { done: false, arr: []};
}


const addSpan = (str, value, index) => {
	let lenval = value.length;
	const start = `<span class="highlight">`;
	const end = `</span>`;
	return str.slice(0,index) + start + value + end + str.slice(index + lenval, str.length);
}


const getBlockFromDataBaseSync = (name, dir, key, value, up, below) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	let exist = false;
	try {
		let stat = fs.statSync(file);
		exist = true;
	} catch (err) {
		exist = false;
	}
	if (exist) {
		let arr = [];
		let reader = fs.readFileSync(file, 'utf8');
		if (reader !== '') {
			arr = JSON.parse(reader);
		}
		let index = -1;
		for (let i = 0 ; i < arr.length ; i ++) {
			if (arr[i][key] === value) {
				index = i;
				break;
			}
		}
		if (index === -1 ){
			return { done: false, arr: [], lenUp: -2, lenDown: -2};
		}
		const upperSlice = [];
		const belowSlice = [];
		for (let i = index - 1 ; i > -1 ; i --) {
			if (i === index - up - 1){
				break;
			}else{
				upperSlice.push(arr[i]);
			}
		}
		for (let i = index + 1 ; i < arr.length ; i ++) {
			if (i === index + below + 1){
				break;
			}else{
				belowSlice.push(arr[i]);
			}
		}
		return { done: true, arr: upperSlice.reverse().concat(arr[index]).concat(belowSlice), lenUp: upperSlice.length, lenDown: belowSlice.length };
	}
	return { done: false, arr: [], lenUp: -1, lenDown: -1};
}

const getBlockFromDataBaseWithKeySync = (name, dir, mainKey, mainValue, key, value, up, below) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	let exist = false;
	try {
		let stat = fs.statSync(file);
		exist = true;
	} catch (err) {
		exist = false;
	}
	if (exist) {
		let arr = [];
		let reader = fs.readFileSync(file, 'utf8');
		if (reader !== '') {
			arr = JSON.parse(reader);
		}
		let index = -1;
		for (let i = 0 ; i < arr.length ; i ++) {
			if (arr[i][mainKey] === mainValue) {
				index = i;
				break;
			}
		}
		if (index === -1 ){
			return { done: false, arr: [], lenUp: -2, lenDown: -2};
		}
		const upperSlice = [];
		const belowSlice = [];
		let upCount = 0;
		let belowCount = 0;
		for (let i = index - 1 ; i > -1 ; i --) {
			if (arr[i][key] == value) {
				upperSlice.push(arr[i]);
				upCount++;
				if (upCount == up){
					break
				}
			}
		}
		for (let i = index + 1 ; i < arr.length ; i ++) {
			if (arr[i][key] == value) {
				belowSlice.push(arr[i]);
				belowCount++;
				if (belowCount == below){
					break
				}
			}
		}
		return { done: true, arr: upperSlice.reverse().concat(arr[index]).concat(belowSlice), lenUp: upperSlice.length, lenDown: belowSlice.length };
	}
	return { done: false, arr: [], lenUp: -1, lenDown: -1};
}


const deleteFromDataBase = (name, dir, key, value) => {
	let file = path.join(dir, name);
	if (!fs.existsSync(file)) {
		return;
	}
	let reader = fs.readFileSync(file, 'utf8');
	let arr = JSON.parse(reader)
	const newArr = [];
	for (let k in arr) {
		if (arr[k][key] === value) {
			continue
		}
		newArr.push(arr[k]);
	}
	fs.writeFileSync(file, JSON.stringify(newArr));
};

const deleteDataBase = (name, dir, done) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	fs.unlink(file, err => {
		done(err);
	});
};

const deleteDataBaseSync = (name, dir) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	try {
		fs.unlinkSync(file);
	} catch (error) {}
};

const writeObject = (name, dir, data) => {
	dir = preProcess(dir)
	let file = path.join(dir, name);
	fs.writeFileSync(file, JSON.stringify(data));
};

module.exports = {
	findFromDataBaseSync: findFromDataBaseSync,
	getBlockFromDataBaseWithKeySync: getBlockFromDataBaseWithKeySync,
	getBlockFromDataBaseSync: getBlockFromDataBaseSync,
	writeToDataBase: writeToDataBase,
	writeToDataBaseArray: writeToDataBaseArray,
	getFromDataBase: getFromDataBase,
	getFromDataBaseSync: getFromDataBaseSync,
	deleteFromDataBase: deleteFromDataBase,
	deleteDataBase: deleteDataBase,
	deleteDataBaseSync: deleteDataBaseSync,
	writeObject: writeObject
};
