
const fs = require('fs')


const AR_PATH_EXCLUDE = ['filelist.txt']
const FILE_NAME = 'filelist.txt';
const FILE_NAME_JSON = 'filelistdocument.json';


function generate(yargs){
    yargs.command({

        //comando richiamabile usando quest'app
        command: 'generate',
        //descrizione del comando
        describe: 'Generate the fileList',

        // flags che mi apsetto
        builder: {

            //mi  aspetto il flag nome
            path:{
                
                //descrizione del flag
                describe: 'Base path of custom directory (if not specified, the current folder path will be used)',
                //flag non obbligatorio
                demandOption: false,
                //tipo
                type: 'string'
                
            },
            asjson: {
                //descrizione del flag
                describe: 'Export First Level Directory file as JSON file with "document" property',
                //flag facoltativo
                demandOption: false,
                //tipo
                type: 'boolean'                
            }
            // key:{
            //     //descrizione del flag
            //     describe: 'Chiave di crittografia, deve corrispondere al tipo della stringa da codificare (SOLO numerica o SOLO alfabetica)',
            //     //flag obbligatorio
            //     demandOption: true,
            //     //tipo
            //     type: 'string'
                
            // }
        },

        //handler quando richiamerò il comando get
        handler(argv){
            _generate(argv);
        }

    })
    .demandCommand();

}

function _generate(args){

    let path = args['path'];
    let asjson = args['asjson'];
    // let strToDecrypt = args['string'];
    let finalData = null;



    try{
        if(!!path && path.length > 0){
            path = path.replace(/\//g, '\\')
            if(path[path.length] != '\\'){
                path += '\\';
            }
    
            console.log('Supplied relative path: ', path)
    
            console.log('Reading directories...')
            
            finalData = getPathList(undefined, path);
        }
        else{

            console.log('Reading directories...')

            finalData = getPathList();
            path = '.\\'
        }
    
      
        console.log("writing filelist...");
        fs.writeFileSync(path + FILE_NAME, prepareForFile(finalData));
        console.log(`filelist.txt successfully generated in "${path}" with ${finalData.length} entries`);
        
        if (asjson) {
            console.log("writing document file json...");
            //Salvo anche il valore JSON
            fs.writeFileSync(path + FILE_NAME_JSON, prepareForFileJson(finalData));
            console.log(`filelistdocument.json successfully generated in "${path}"`);

        }

        
        
    }
    catch(err){
        console.error(`Error reading directory tree, make sure the path supplied is correct!`)
        console.log(err);
    }



}


/**
 * 
 * @returns {string[]} 
 */
function getPathList(relativePath = '', basePath = './'){
    let finalAr = [];
    const arPath = fs.readdirSync(`${basePath}${relativePath}`)

    finalAr = finalAr.concat(arPath
        .map(el => {
            if(!el.includes('.')){
                //forse è una directory
                try{
                    fs.readdirSync(`${basePath}${relativePath}/${el}`);
                    //è una directory, aggiungo uno slash alla fine
                    return `${el}/`;
                }
                catch(err){
                    return el;
                }
            }
            else{
                return el;
            }
        })
        .map(el => (!!relativePath && relativePath.length > 0)? `${relativePath}/${el}` : el)
        .filter(el => !AR_PATH_EXCLUDE.includes(el))

     
    );

    arPath.forEach(el => {
        if(!el.includes('.')){
            try{
                finalAr = finalAr.concat(getPathList(((!!relativePath && relativePath.length > 0)? `${relativePath}/${el}` : el), basePath))
            }
            catch(err){

            }
        }
    })

    return finalAr;

}


/**
 * 
 * @param {string[]} arLines 
 * @returns {string}
 */
function prepareForFile(arLines){
    return arLines
    .reverse()
    .reduce((el, acc) => acc + '\n' + el)
    .replace(/\//g, '\\')
}

/**
 * Crea un oggetto e lo trasforma in JSON dalla seguente forma
 * "document": [file1, file2, file3]
 * @param {*} arLines Linee con i path letti
 * @returns 
 */
function prepareForFileJson(arLines) {
    let myObject = {};
    let jsonStr = '';
    let myList = [];

    if (arLines && arLines.length != 0) {

        myList = arLines
                        .reverse()
                        .filter(elItem => {
                                let useItem = true;
                                //Tolgo quelli che finiscono contengono / o iniziano con .
                                if (elItem.trim().startsWith('.') || elItem.trim().indexOf('/') != -1) {
                                    useItem = false;
                                }
    
                                return useItem;
                        })
                        .map(el => {
                            let posPunto = el.lastIndexOf('.');
                            let myFile = el;
                            if (posPunto != -1) {
                                myFile = myFile.substring(0,posPunto);
                            }
    
                        return myFile;
                        });
    }

    myObject['document'] = myList;
    jsonStr = JSON.stringify(myObject);

    return jsonStr;

}







module.exports = {
    generate
}