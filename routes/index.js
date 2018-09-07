var express = require('express');
var fs = require('fs');

var router = express.Router();

router.get('/', (req, res)=> {
  fs.readdir('www.tutorialspoint.com', (err, files)=> {
    res.render('index', {files: files});
  });
});

router.get('/done', (req, res)=> {
  if(req.query.q) {
    if ( fs.existsSync('Completed_Tutorials.md') )
      fs.appendFileSync('Completed_Tutorials.md', '- '+req.query.q+'\r\n');
    else
      fs.writeFileSync('Completed_Tutorials.md', req.query.q+'\r\n');
    res.redirect('/completed');
  }
  else {
    res.redirect('/completed');
  }
});

router.get('/completed', (req, res)=> {
  if ( fs.existsSync('Completed_Tutorials.md') ) {
    fs.readFile('Completed_Tutorials.md', (err, data)=> {
      res.send('<pre>'+data+'</pre>');
    });    
  } else {
    res.send('<pre></pre>');
  }
});

module.exports = router;
