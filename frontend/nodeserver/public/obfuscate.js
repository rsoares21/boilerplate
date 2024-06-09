const fs = require('fs');
const { minify } = require('uglify-js');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Path to the input and output files
const inputFile = 'app.js';
const outputMinifiedFile = 'app-min.js';
const outputObfuscatedFile = 'app-obf.js';

// Read the contents of the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }

    // Minify the JavaScript code
    const minifiedCode = minify(data).code;

    // Write the minified code to the output file
    fs.writeFile(outputMinifiedFile, minifiedCode, 'utf8', (err) => {
        if (err) {
            console.error('Error writing minified code to output file:', err);
            return;
        }
        console.log(`File "${outputMinifiedFile}" created successfully.`);
    });

    // Obfuscate the JavaScript code
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(data, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 1,
        //debugProtection: true,
        //debugProtectionInterval: 1,
        //disableConsoleOutput: true,
        //domainLock: ['localhost'],
        //identifierNamesGenerator: 'hexadecimal',
        //log: false,
        //renameGlobals: true,
        rotateStringArray: true,
        //selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ['rc4'],
        stringArrayThreshold: 1,
        unicodeEscapeSequence: false
    }).getObfuscatedCode();

    // Write the obfuscated code to the output file
    fs.writeFile(outputObfuscatedFile, obfuscatedCode, 'utf8', (err) => {
        if (err) {
            console.error('Error writing obfuscated code to output file:', err);
            return;
        }
        console.log(`File "${outputObfuscatedFile}" created successfully.`);
    });
});
