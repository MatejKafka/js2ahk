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

ahk.remap('CapsLock', 'Backspace')
ahk.remap(['Ctrl', 'CapsLock'], 'CapsLock')

ahk.remap('RAlt', 'AppsKey')


// convert left backslash to shift
ahk.remap('sc056', 'Shift')

// minimize windows with right shift
ahk.remap('RShift', () => {
	ahk.win.minimize(null, 'A')
})

mapKeyToProgram(
	['Win', 'w'],
	'notepad++.exe',
	'E:/@programs/notepad++/notepad++.exe'
)