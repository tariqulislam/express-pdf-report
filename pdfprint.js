var system = require('system');
var args = system.args;
if (args.length === 3) {
    console.log("Argument passed");
    var url = args[1];
    var filelocation = args[2];
    console.log("url-->" + url);
    var booleanCorrectInput = true;
} else {
    var booleanCorrectInput = false;
    console.log("Pass some arguments");
    throw new Error("Pass some arguments!");
}

if(booleanCorrectInput === true){
    var page = require('webpage').create();
    page.viewportSize = { width: 1366, height: 768  };
    page.paperSize = {
        format: 'A3',
        orientation: 'landscape',
        margin: {
            top: '50px',
            left: '50px'
        },
        header: {
            height: "1cm",
            contents: phantom.callback(function(pageNum, numPages) {
              return "<h6>Header <span style='float:right'>" + pageNum + " / " + numPages + "</span></h6>";
            })
          },
          footer: {
            height: "1cm",
            contents: phantom.callback(function(pageNum, numPages) {
              return "<h6>Footer <span style='float:right'>" + pageNum + " / " + numPages + "</span></h6>";
            })
          }
    };
    page.settings.dpi = "120";

    page.open(url, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit();
        } else {
            window.setTimeout(function () {
                page.render(filelocation, { format: 'pdf', quality: '100' });
                phantom.exit();
            }, 10000); // Change timeout as required to allow sufficient time
        }
    });
}