; hotkey: CapsLock::Backspace
	CapsLock::
		SetKeyDelay, -1
		Send, {Blind}{Backspace DownR}
	return
	CapsLock up::
		SetKeyDelay, -1
		Send, {Blind}{Backspace up}
	return

; hotkey: ^CapsLock::CapsLock
	^CapsLock::
		SetKeyDelay, -1
		Send, {Blind}{CapsLock DownR}
	return
	^CapsLock up::
		SetKeyDelay, -1
		Send, {Blind}{CapsLock up}
	return

; hotkey: RAlt::AppsKey
	RAlt::
		SetKeyDelay, -1
		Send, {Blind}{AppsKey DownR}
	return
	RAlt up::
		SetKeyDelay, -1
		Send, {Blind}{AppsKey up}
	return

; hotkey: Sc056::Shift
	Sc056::
		SetKeyDelay, -1
		Send, {Blind}{Shift DownR}
	return
	Sc056 up::
		SetKeyDelay, -1
		Send, {Blind}{Shift up}
	return

RShift::
	WinMinimize, A
return

#w::
	If (WinExist("ahk_exe notepad++.exe")) {
		WinActivate
	} else {
		Run, E:/@programs/notepad++/notepad++.exe
		WinWait, ahk_exe notepad++.exe
		WinActivate
	}
return