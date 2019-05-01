const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F


const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

//read the counter, taking in a callback
const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    //if error, run our callback with null and zero
    if (err) {
      callback(null, 0);
    //if not, run our callback with the fileData being turned into a number
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  //convert our counter to a string that is zero padded
  var counterString = zeroPaddedNumber(count);
  //write that counter number into the file
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

//save the current state of the coutner to the hard drive
//use the readCounter and writeCounter function

exports.getNextUniqueId = (callback) => {
  readCounter((err, res) => {
    if (err) {
      callback(err, 0);
    } else {
      writeCounter(res + 1, (err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, res);
        }
      });
    }
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
