// class ProtAjax {
//   num: string;
//   constructor() {
//     this.num = "1"
//   };
// }

function protAjax() {
  var result;
  result = fetch('../../data/prot.json', {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    
  })
  .then( res => res.json())
  .then((data) => {
    // console.log(data);
    // result = data
  });
  return result
}

// let i = new ProtAjax();
var prot = protAjax();
console.log(prot);
// console.log(user);