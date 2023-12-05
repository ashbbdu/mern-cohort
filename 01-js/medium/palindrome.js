/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

function isPalindrome(str) {
  let originalStr = str.split(" ").join("").toLowerCase().replace(/[\W_]/g, '');
    let reversedStr = "";
    for(let i= 0; i < str.length; i++){
        reversedStr =  str[i] + reversedStr;
    }
    console.log(originalStr , "orign")
    console.log(reversedStr.split(" ").join("").toLowerCase().replace(/[\W_]/g, '') , "trim")
    if(originalStr === reversedStr.split(" ").join("").toLowerCase().replace(/[\W_]/g, '')) {
      return true;
  }
      else {
          return false
      }
}

module.exports = isPalindrome;
