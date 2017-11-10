var http = require('http');
var https = require('https');
var url = require('url');
var os = require("os");
var fs = require('fs');
var qrcode = require('qrcode-terminal'); // "qrcode-terminal": "^0.11.0",


var sample = fs.readFileSync('Sample.html', 'utf8');

var sdkPath = new RegExp("<script src=\"(.*speech\.browser\.sdk\.js)\"></script>").exec(sample);

if (!sdkPath || sdkPath.length < 2) {
    console.log("Failed to find a path to SDK in the Sample.html");
    return;
}
sdkPath = sdkPath[1];
var sdk = fs.readFileSync(sdkPath, 'utf8');

var enableTunnel = false;
for (let j = 0; j < process.argv.length; j++) {  
    enableTunnel |= process.argv[j] == 'enableTunnel';
}

if (fs.existsSync('speech.key')) {
    var key = fs.readFileSync('speech.key', 'utf8');
    if (!!key) {
        var before = "value=\"YOUR_BING_SPEECH_API_KEY\"";
        var after = " disabled value=\"Using token-based auth mechanism.\"";
        sample = sample.replace(before, after);
        sample = sample.replace('var useTokenAuth = false;', 'var useTokenAuth = true;');
    }
}


var port = 8765;
var server = http.createServer(function(request, response){
    var respond = function(status, data) {
        response.writeHead(status);
        !!data && response.write(data);
        response.end();
    }

    path= url.parse(request.url).pathname;    
    console.log("Incoming request:" + request.url);

    if (path == '/token') {
        getToken(key, function(token){ 
            respond(200, token);
         })
    } else if (path == '/' || path.endsWith("speech.browser.sdk.js")) {
        respond(200, (path == '/' ? sample : sdk));
    } else {
        respond(404);
    }
});


var quit = false;
if (enableTunnel) {
    var localtunnel = require('localtunnel');
    var tunnel = localtunnel(port, function(err, tunnel) {
        if (err) {
            quit = true;
            server.close(); 
            console.log('Something went south...' + err.message)
        } else {
            printServerInfo(tunnel.url)
        }
    });

    tunnel.on('close', function() {
        quit = true;
        server.close();   
    });
} else {
    printServerInfo('http://'+os.hostname() + ':' + port);
}



if (!quit) {
    server.listen(port);
}

function printServerInfo(url) {
    console.log('Up and running @ ' + url);
    qrcode.setErrorLevel('H');
    qrcode.generate(url, {small: true});
}

function getToken(apiKey, result) {
    var options = {
        host: 'api.cognitive.microsoft.com',
        path: '/sts/v1.0/issueToken',
        method: 'POST',
         headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Content-Length': '0',
            'Ocp-Apim-Subscription-Key': apiKey
        }
    };

    var callback = function(response) {
      var token = ''
      response.on('data', function (chunk) {
        token += chunk;
      });

      response.on('end', function () {
        result(token);
      });
    }

    var issueTokenRequest = https.request(options, callback);
    issueTokenRequest.end();
}