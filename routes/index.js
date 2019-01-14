var express = require('express');
var fs = require('fs');

var router = express.Router();

router.get('/', (req, res)=> {
  const dirContent = fs.readdirSync('www.tutorialspoint.com');
  if ( !fs.existsSync('completed-tutorials.json') ) {
    fs.writeFileSync('completed-tutorials.json', '[]');
  }
  const data = fs.readFileSync('completed-tutorials.json');
  const completed = JSON.parse(data.toString());
  const files = dirContent.map((path) => {
    let color = 'lightgreen';
    completed.forEach((data) => {
      if (data.path === path) {
        color = 'orange';
      }
    });
    return {
      path, color,
    };
  });
  res.render('index', {files});
});

router.get('/:tutors/done', (req, res) => {
  if(req.query.q) {
    if ( !fs.existsSync('completed-tutorials.json') ) {
      fs.writeFileSync('completed-tutorials.json', '[]');
    }
    const data = fs.readFileSync('completed-tutorials.json');
    const name = req.query.q;
    const path = req.params.tutors;
    const oldArray = JSON.parse(data.toString());
    const newArray = oldArray.concat({ name, path });
    fs.writeFileSync('completed-tutorials.json', JSON.stringify(newArray));
  }
  res.redirect('/completed');
});

router.get('/completed', (req, res)=> {
  if ( fs.existsSync('completed-tutorials.json') ) {
    const data = fs.readFileSync('completed-tutorials.json');
    const arrayOfData = JSON.parse(data.toString());
    res.send(arrayOfData);
  } else {
    fs.writeFileSync('completed-tutorials.json', '[]');
    res.redirect('/completed');
  }
});

module.exports = router;
