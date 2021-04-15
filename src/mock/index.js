const Mock = require('mockjs');

const Random = Mock.Random;

const product = (e) => {
  console.log(e);
  let arr = [];
  for(let i = 0; i < 10; i++) {
    let obj = {
      name: Random.name(),
      date: Random.date(),
      number: Random.integer()
    }
    arr.push(obj)
  }
  return {
    data: arr
  }
}


Mock.mock('/test', /post|get/i, product);