var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.testLoopback;
ds.automigrate('blogs', function(err) {
  if (err) throw err;
//initialize the data to be inserted
  var blogs = [
    {
      title: 'My first Blog',
      author: 'Skillgaze',
      creationDate: new Date(),
      body:'Test data for the blog',
      tags:'loopback',
      updateDate: new Date()
    },
    {
      title: 'Another Blog',
      author: 'Skillgaze',
      creationDate: new Date(),
      body:'Test again for loopback with postgresql',
      tags:'loopback',
      updateDate: new Date()
    }
  ];
  var count = blogs.length;
  //for each row create the data
  blogs.forEach(function(blog) {
    app.models.blogs.create(blog , function(err, model) {
      if (err) throw err;

      console.log('Created:', model);

      count--;
      if (count === 0)
        ds.disconnect();
    });
  });
});
