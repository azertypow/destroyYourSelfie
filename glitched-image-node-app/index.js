const path =  require("path")
const fs = require('fs')

const myArgs = process.argv.slice(2);

console.log(myArgs[0])

if(myArgs[0] !== undefined) {
    const imagePath = path.resolve(myArgs[0])

    const binaryContentOfFile = fs.readFileSync(imagePath, 'binary')


    // PRAMS
    // binaryContentOfFile.length -> lentgh of string in text edit
    const positionInText = binaryContentOfFile.length / 3
    const pad = 1000
    //------
    const positionOfModificationInBinaryString = positionInText

    const firstPart = binaryContentOfFile.substr(0, positionOfModificationInBinaryString - pad)
    const lastPart  = binaryContentOfFile.substr(positionOfModificationInBinaryString + pad, binaryContentOfFile.length)

    const newContent = `${firstPart}${lastPart}`

    fs.writeFileSync("_images/glitched.jpg", newContent, {encoding: 'binary'})

    console.log('myArgs: ', myArgs);
} else {
    console.log("script need file path argument");
}

