#!/usr/bin/env node

const createAhkScript = require('..')
const fs = require('fs')
const path = require('path')

const AHK_JS_FILE_EXTENSION = '.ahk.js'
const EXIT_CODES = {
	noInputFile: 101,
	invalidInputExtension: 102,
	nonExistentInputFile: 103
}


const jsFilePath = process.argv[2]
if (jsFilePath == null) {
	console.error('No input file specified!')
	console.error('First argument must be the input file')
	process.exit(EXIT_CODES.noInputFile)

}
if (jsFilePath.slice(-AHK_JS_FILE_EXTENSION.length) !== AHK_JS_FILE_EXTENSION) {
	console.error('Invalid file extension - input file must have .ahk.js extension')
	process.exit(EXIT_CODES.invalidInputExtension)

}

const fullSrcPath = path.resolve(process.cwd(), jsFilePath)

if (!fs.existsSync(fullSrcPath)) {
	console.error('Input file does not exist: ' + fullSrcPath)
	process.exit(EXIT_CODES.nonExistentInputFile)
}

// remove .js extension, leaving *.ahk
const outputPath = fullSrcPath.slice(0, -3)

createAhkScript(outputPath, (ahk) => {
	// noinspection JSUndefinedPropertyAssignment
	/**
	 * @type {ahk}
	 */
	global.ahk = ahk
	require(fullSrcPath)
	// noinspection JSUnresolvedVariable
	delete global.ahk
})