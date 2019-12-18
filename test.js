const main = require('./main.js')

let name = 'test.json';
let dir = '';
let input = {"event":"test","no":13};

// main.writeToDataBase(name, dir, input, ()=>{});

main.getFromDataBase(name, dir, 0, 5, (err, arr, len) => {
	console.log(err);
	console.log(arr);
	console.log(len);
});