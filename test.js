const main = require('./main.js')

let name = 'qwe.json';
let dir = 'desk';
let input = {"event":"test","no":5};

// main.writeToDataBase(name, dir, input, ()=>{});

main.getFromDataBase(name, dir, 0, 5, (err, arr, len) => {
	console.log(err);
	console.log(arr);
	console.log(len);
});