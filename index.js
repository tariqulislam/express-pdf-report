var fs = require('fs');
var ejs = require('ejs');
var phantom = require('phantom');

var employeefile = fs.readFileSync('./employee.json');
var employees = JSON.parse(employeefile);

ejs.renderFile('./template/employee.ejs', {employees: employees}, function(err, html) {
   if(err) {
       console.log(err);
   }

   var renderFile = (async function (html) {
      const instance = await phantom.create();
      const page = await instance.createPage();
      page.setting('loadImages', true);
      page.setting('localToRemoteUrlAccessEnabled', true);
      page.setting('javascriptEnabled', true);
      page.setting('dpi', '72');

      page.property('viewportSize',{ width: 595, height: 842});
      page.property('paperSize', {
                  format: 'A4',
                  orientation: 'portrait',
                  margin: {
                     top: '50px',
                     left: '50px',
                     bottom: '20px' 
                 },
                 header:{ 
                     height: '1cm',
                     contents: instance.callback(function(pageNum, numPages) {        
                        return "<h6>Header <span style='float:right'>" + pageNum + " / " + numPages + "</span></h6>";
                    })
                 }
                });
     page.property('content', html);
     await page.render('./employees.pdf',{ format: 'pdf', quality: '100' });
     instance.exit(); 
   });

   renderFile(html);
});