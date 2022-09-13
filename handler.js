
const fs = require('fs')


const AR_PATH_EXCLUDE = ['filelist.txt']
const FILE_NAME = 'filelist.txt';



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
                //flag obbligatorio
                demandOption: false,
                //tipo
                type: 'string'
                
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
    
      
        console.log("writing file...")
        fs.writeFileSync(path + FILE_NAME, prepareForFile(finalData))
        console.log(`filelist.txt successfully generated in "${path}" with ${finalData.length} entries`)
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





module.exports = {
    generate
}