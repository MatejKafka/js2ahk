const createAhkScript = require('..')
const path = require('path')

const scriptPath = path.resolve(__dirname, './nodeModule_output.ahk')

createAhkScript(scriptPath, (ahk) => {
	const mapKeyToProgram = (hotkey, programExeName, programExePath) => {
		ahk.remap(hotkey, () => {
			ahk.if(() => ahk.win.exist('exe', programExeName),
				() => {
					ahk.win.activate()
				},
				() => {
					ahk.runProgram(programExePath)
					ahk.win.wait('exe', programExeName)
					ahk.win.activate()
				}
			)
		})
	}


	ahk.remap('capsLock', 'backspace')
	ahk.remap(['ctrl', 'capsLock'], 'capsLock')

	ahk.remap('rAlt', 'appsKey')


	// convert left backslash to shift
	ahk.remap('sc056', 'shift')

	// minimize windows with right shift
	ahk.remap('rShift', () => {
		ahk.win.minimize(null, 'A')
	})

	mapKeyToProgram(
		['win', 'w'],
		'notepad++.exe',
		'E:/@programs/notepad++/notepad++.exe'
	)
})