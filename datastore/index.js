const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      const dataDirectory = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(dataDirectory, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      let arr = [];

      files.forEach(file => {
        const id = file.split('.')[0];
        arr.push({ 
          id,
          text: id
        });
      });
      callback(null, arr);
    }
  });
};

// Next, refactor the `readOne` to read a todo item from the `dataDir` 
// based on the message's `id`. 
// For this function, you **must read the contents of the todo item file** 
// and respond with it to the client.

exports.readOne = (id, callback) => {
  const directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(err, {id, text: data});
    }
  });
};

exports.update = (id, text, callback) => {
  const directory = path.join(exports.dataDir, `${id}.txt`);

  fs.readFile(directory, 'utf8', (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(directory, text, (err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  const directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, (err, res) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(directory, (err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, res);
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
