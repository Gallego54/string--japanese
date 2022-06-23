const http = require ('http')
const fs = require ('fs')

http.createServer((req, res) => {
    if (req.url == '/traduct') {
        res.writeHead(200, { 'Content-Type':  'text/html'});
        const HTML = selectPath ( req.url ) ;
        getParams (req, text => {
            const translation = translateToJapanese(text);
            const totally = insertStr (
                HTML,
                HTML.search('<body>')+'<body>'.length,
                '<div class="japanese" >Konnichi wa, '+translation+'-san</div>'
            ) 

            res.write(totally);
            return res.end();
        }) 
    }else {
        res.writeHead(200, { 'Content-Type':  'text/html'});
        res.write( selectPath ( req.url ) );
        return res.end();
    }

}).listen( 7777 )


function selectPath ( path ) {
    switch ( path ) {
        case '/': return loadView( './views/index.html' )
        case '/traduct': return loadView( './views/result.html' )

        default: return ''
    }
}

function loadView ( localPath ) {
    return fs.readFileSync (localPath, { encoding: 'utf8' })
}

function getParams(req, callback) {
    let data = ''
    req.on('data', d => {
      data += d
    })
    req.on('end', () => {
        const params = new URLSearchParams(data)
        callback (params.get('name'))
    })
  }

function translateToJapanese ( data ) {
    for ( let i=0 ; i<data.length ; i++ ) {
        if (!notNeedU(data[i])) {
            if (data[i+1] == undefined) {
                data = insertStr(data, i+1, 'u')
            }else if (!notNeedU(data[i+1])) {
                data = insertStr(data, i+1, 'u')
            }
        }
    }
    console.log(data);
    return data;
}


function notNeedU ( char ) {
    switch ( char.toLowerCase() ) {
        case ' ':
        case 'a':  
        case 'e':   
        case 'i':  
        case 'o':   
        case 'u':   
        case 'n':   return true;

        default: return false;
    }
}

function insertStr (str, index, data) {
    return str.slice(0, index) + data +
    str.slice (index, str.length); 
}
