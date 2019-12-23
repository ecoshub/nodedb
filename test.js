const main = require('./main.js')

let name = 'test.json';
let dir = '';
let input = {"event":"test","no":13};

const arr = [
  {
    "dbName": "virtualmint:08:00:27:fc:3d:f2",
    "userIdentity": "virtualmint:08:00:27:fc:3d:f2",
    "mac": "08:00:27:fc:3d:f2",
    "from": "MYPC",
    "to": "virtualmint",
    "content": "1",
    "contentType": "text",
    "createdAt": "Dec 22,2019 - 16:53:00",
    "uuid": "539e2470-f3f1-4409-8ea9-8039531a9ee1"
  },
  {
    "dbName": "virtualmint:08:00:27:fc:3d:f2",
    "userIdentity": "virtualmint:08:00:27:fc:3d:f2",
    "mac": "08:00:27:fc:3d:f2",
    "from": "MYPC",
    "to": "virtualmint",
    "content": "1",
    "contentType": "text",
    "createdAt": "Dec 22,2019 - 16:53:00",
    "uuid": "539e2470-f3f1-4409-8ea9-8039531a9ee1"
  },
  {
    "dbName": "virtualmint:08:00:27:fc:3d:f2",
    "userIdentity": "virtualmint:08:00:27:fc:3d:f2",
    "mac": "08:00:27:fc:3d:f2",
    "from": "MYPC",
    "to": "virtualmint",
    "content": "1",
    "contentType": "text",
    "createdAt": "Dec 22,2019 - 16:53:00",
    "uuid": "539e2470-f3f1-4409-8ea9-8039531a9ee1"
  }
]

// main.writeToDataBase(name, dir, input, ()=>{});

// main.deleteFromDataBase(name, dir, 'name', 'emre', (err) => {
// 	main.getFromDataBase(name, dir, 0, 0, (err, arr, len) => {
// 		console.log(err);
// 		console.log(arr);
// 		console.log(len);
// 	});
// })

// main.writeToDataBaseArray(name, dir, arr, ()=>{
 main.getFromDataBase(name, dir, 0, 20, (err, arr, len) => {
     console.log(err);
     console.log(arr);
     console.log(len);
 });
// });
