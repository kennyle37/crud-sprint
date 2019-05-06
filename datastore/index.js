const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
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
      const directory = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFileAsync(directory, text).then((err) => {
        if (err) {
          throw err;
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Error reading files');
    }
    //generate a new data file
    const data = _.map(files, (file) => {
      const id = file.split('.')[0];
      const directory = path.join(exports.dataDir, file);

      return fs.readFileAsync(directory, 'utf8').then(text => {
        return {
          id,
          text
        };
      });
    });

    Promise.all(data).then((file) => {
      return callback(null, file);
    });
  });
};

// Next, refactor the `readOne` to read a todo item from the `dataDir` 
// based on the message's `id`. 
// For this function, you **must read the contents of the todo item file** 
// and respond with it to the client.

exports.readOne = (id, callback) => {
  const directory = path.join(exports.dataDir, `${id}.txt`);
  
  fs.readFileAsync(directory, 'utf8').then(text => {
    callback(null, {id, text});
  }).catch(err => {
    return callback(err);
  });
};

exports.update = (id, text, callback) => {
  const directory = path.join(exports.dataDir, `${id}.txt`);

  fs.readFileAsync(directory, 'utf8').then(res => {
    fs.writeFileAsync(directory, text).then(res => {
      callback(null, {id, text});
    });
  }).catch(err => callback(err));
};

exports.delete = (id, callback) => {
  const directory = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(directory, (err) => {
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
