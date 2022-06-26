import colors from 'colors'

import http from 'http'
import fs from 'fs'
import {searchCSS, insertCSS} from './src/modules/serverCSS.js'

const PORT = 7777;

http.createServer((req, res) => {
    if (req.url == '/traduct') {
        res.writeHead(200, { 'Content-Type':  'text/html'});
        const HTML = selectPath ( req.url ) ;
        getParams (req, text => {
            const translation = translateToJapanese(text);
            const totally = insertStr (
                HTML,
                HTML.search('<body>')+'<body>'.length,
                '<div class="japanese"><p>Konnichi wa, '+translation+'-san</p></div>'
            ) 

            res.write(totally);
            return res.end();
        }) 
    }else {
        res.writeHead(200, { 'Content-Type':  'text/html'});
        res.write( selectPath ( req.url ) );
        return res.end();
    }

}).listen( PORT , _ => {
    const MSG = colors.bold('Listening on port ');
    const cPORT =  colors.yellow(String(PORT));

    console.log (MSG+cPORT)
})


function selectPath ( path ) {
    switch ( path ) {
        case '/': {
            const CSS = searchCSS ( './src/public/css/', 'style.css' ) ;
            const HTML = loadView( './src/views/index.html' ) ;
            return insertCSS(HTML, CSS) ;
        }

        case '/traduct': {
            const CSS = searchCSS ( './src/public/css/', 'style.css' ) ;
            const HTML = loadView( './src/views/result.html') ;
            return insertCSS(HTML, CSS) ;
        }


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
