var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var phantom = require('phantom');
var tmpdir = require('os').tmpdir();


exports.renderForceDownloadPDF = function (res, columns, data, filename){
    var file = path.join(tmpdir,filename);
   //console.log(file);

    var template = path.join(__dirname, 'template', 'list-view.ejs');

    ejs.renderFile(template, {columns: columns, data: data}, function(err, html) {
        if(err) {
            console.log(err)
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
          await page.render(file,{ format: 'pdf', quality: '100' });
          instance.exit();

          function getFile(file, res) {
            var myInterval = setInterval(function () {
               dosomething(file, res);
            }, 400)
      
            function dosomething (file, res) {      
              const fileExists = fs.existsSync(file);
              const filename = require('path').basename(file)
              console.log('file exists', fileExists);
              if(fileExists) {
                console.log('file is exists', filename);
                clearInterval(myInterval);
             //  res.header('Content-disposition', 'attachment; filename="' + filename+'"');
              // res.header('Content-type', 'application/pdf');
             //  const fsStream = fs.createReadStream(file);
               res.download(file, filename, function (err) {
                   if(err) {
                       console.log(err);
                   } else {
                    fs.unlink(file, (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log('file deleted successfully')
                        }
                      });
                   }
               });
              // fsStream.pipe(res);
              }
            }
          }
          getFile(file, res);
          
        });
        renderFile(html);
     });
    
}

exports.renderListPDFToDir = function(columns, data, location) {
    var template = path.join(__dirname, 'template', 'list-view.ejs');

    ejs.renderFile(template, {columns: columns, data: data}, function(err, html) {
        if(err) {
            console.log(err)
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
          // await  page.renderBase64('pdf').then(resp => console.log('resp'))
          await page.render(location,{ format: 'pdf', quality: '100' });
        });
        renderFile(html)
     });
}

// var renderPDFWithForceDownload = require('.').renderPDFWithForceDownload;

