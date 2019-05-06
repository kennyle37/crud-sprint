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
// At this point, it's time to circle back to finishing your work on `readAll`. 
//  Next, you'll need to refactor the function. Because each todo entry is stored in its own file, 
//  you'll end up with many async operations (`n` files = `n` async operations) 
//  that all need to complete before you can respond to the API request. 
//  This poses a significant challenge: your next task is to read up on promises to see how they can help you. 
//  (Hint, you'll very likely need to make use of `Promise.all`.)

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
