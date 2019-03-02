**Warning: as version number suggests, this is an alpha version of an alpha version.
Currently, only a handful of AHK functions are implemented and the documentation is
severely lacking.**

**Continue at your own discretion, you've been warned.**


# js2ahk
A small tool for transpiling JavaScript to .ahk AutoHotkey files.

## Installation
```
npm install -g js2ahk
```
When used as a JS module, it should be installed locally.

When installed globally, it adds js2ahk command to PATH, which lets
you transpile .ahk.js files from command line.

## High-level overview
The package works by exposing a JS API. Whenever you call a function from
the API, the function is mapped to its AHK equivalent and added to an internal
parse tree. When your code finishes, the parse tree is converted to text representation
in the AHK scripting language and saved to the output file.

For example, when you call `ahk.win.minimize('exe', 'Firefox.exe')`, the package converts
the call to AHK (here: `WinMinimize ahk_exe Firefox.exe`) and stores it.

Consequence is that you can use any JS code while generating the output, but only the calls
to the `ahk.*` will be recorded and transpiled.

## Usage
#### Command line:
```
js2ahk <input-file>
```
The input file must have the .ahk.js extension. It is an ordinary JS file,
but there's an `ahk` global variable, which exposes the AHK functions.
See below for deeper explanation.

#### Node.js module
You can create scripts by including the module and calling the resulting
function with target file path and callback that contains the actual
AHK code.

Example:
```javascript
const createAhkScript = require('js2ahk')

const outputFilePath = "filename.ahk"

createAhkScript(outputFilePath, (ahk) => {
	ahk.win.minimize('exe', 'Firefox.exe')
})
```

## API
### Node.js module
#### `createAhkScript(targetFile, ahkFn)`
The package exposes single function that accepts file path where the resulting
transpiled .ahk file will be saved, and a callback. When called, the function
creates new AHK context and passes it to the callback (see below for documentation).
Inside, you can call any ahk functions. An AhkTree structure is constructed
internally of all called functions.

If nothing is returned from the callback, it is assumed that your code is synchronous
and the output will be saved after your callback finishes.
If your callback contains any asynchronous calls, you can return a `Promise` and evaluation
will be delayed until it resolves.

After your callback is finished, the function calls are transpiled to AHK and written
to the output file path. **If file path is `null`, the output won't be saved.**
The parse tree is then returned from the function.

### Standalone script & command line API
```
js2ahk <input-file>
```
When installed globally, you can invoke the `js2ahk` command from command line.
The input file must have the .ahk.js extension. Inside, you can write any JS code,
that will run in a Node.js environment. An `ahk` global object is added. Through
this object, you can call any API methods.

After your script finishes, the result is transpiled and saved to the output file,
which will have the same name as the input file, but with the `.ahk` extension.

<br>

### AHK API
Docs for the AHK API live here:
https://anagmate.github.io/js2ahk/

Currently, only a handful of AHK functions are supported.
More will be added depending on my time and public demand.