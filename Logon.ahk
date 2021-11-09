#SingleInstance force
#InstallKeybdHook
SetTitlematchmode, 2
DetectHiddenWindows, on


Coordmode, Pixel, Screen
Coordmode, Mouse, Screen
user = 
password = 
UF = 2845
type = Planning Ser
planning = ADDICTO
If !WinExist("ahk_exe chrome.exe")
	Run, c:\users\aharry\AppData\Local\Google\Chrome\Application\chrome.exe

;#Include %A_ScriptDir%\Activite-EHLSA-Gui.ahk
return

;^+R::Reload

Logon_Login:
	ControlSetText, Edit1, %user%
	ControlSetText, Edit2, %password%
	ControlFocus, Edit2
	Sleep 10
	Send {Enter}
	return
Cs_1:
	WinWait Plan de travail ahk_exe logon.exe,, 10
	Sleep 10
	Send {Home}
	Send USV2 R
	Sleep 10
	Send {Enter}
	return
Cs_2:
	WinWait Choix du planning ahk_exe rdvwin.exe,, 10
	Sleep 10
	Send {tab 2}
	Sleep 10
	Send %type%
	Sleep 10
	Send {tab}
	Sleep 10
	Send %planning%
	Sleep 10
	Send {enter}
	return
	
Cs_3_EHLSA:
	WinWait, Planning de ADDICTO ahk_exe rdvwin.exe
	Send !f
	Sleep 10
	Send h
	ControlGet, PlanningComboBoxVisible, Visible,, TMcKComboBox1, Planning de ahk_exe rdvwin.exe
	While (!PlanningComboBoxVisible){
		Sleep 100
		ControlGet, PlanningComboBoxVisible, Visible,, TMcKComboBox1, Planning de ahk_exe rdvwin.exe
	}
	ControlSend, TMcKComboBox1, {Down 2}, Planning de ahk_exe rdvwin.exe
	return

#IfWinActive, Synthèse ahk_exe unit.exe
F8::
	return
#If

#IfWinActive, Planning de ADDICTO ahk_exe rdvwin.exe
&::
	Goto Cs_3_EHLSA
	return
F9::
	;Goto Cs_3_EHLSA
	ControlGetText, InfosPatient, ,ahk_class TFormSpreadPlanningNote ahk_exe rdvwin.exe
	Tooltip, % "bouh`n"
	return

F11::
	Loop
	{
		MouseGetPos, XX, YY
		ToolTip, % XX "x" YY
		Sleep 250
	}
	return
#If

#IfWinActive, ahk_exe unit.exe
F7::
	Logon_1_Doc_HWND := WinExist("Liste des Documents - Volet CPT_RENDU ahk_exe unit.exe")
	WinGet, Logon_1_PID, PID, ahk_id %Logon_1_Doc_HWND%
	Logon_1_Plan_HWND := WinExist("PLANNING d' HEBERGEMENT - ahk_pid " Logon_1_PID)
	Logon_1_Lettre_HWND := WinExist("CHU Lettre de Liaison PSY ahk_pid " Logon_1_PID)
	Logon_2_Syn_HWND := WinExist("Synthèse ahk_exe unit.exe")
	WinGet, Logon_2_PID, PID, ahk_id %Logon_2_Syn_HWND%
	Logon_2_Plan_HWND := WinExist("PLANNING d' HEBERGEMENT - ahk_pid " Logon_2_PID)
	WinMove, ahk_id %Logon_1_Doc_HWND%,, 0, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_1_Plan_HWND%,, 0, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_1_Lettre_HWND%,, 0, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_2_Plan_HWND%,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_2_Syn_HWND%,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	return
#If

^!q::
	if not WinExist("LOGON - Reference")
		Run, C:\Program Files\SynchroMck\reference_prod\SynchroMcK_Client.exe /alancer=0, C:\TEMP_MCK
	WinWait LOGON - Reference
	WinActivate LOGON - Reference
	Sleep 2000
	Send %user%
	Send {TAB}
	Send %password%
	Send {Enter}
	return

NoHotkey:
	return

#ifwinactive LOGON - Reference ahk_exe logon.exe
²::
	ControlSetText, Edit1, %user%
	ControlSetText, Edit2, %password%
	ControlFocus, Edit2
	Sleep 10
	Send {Enter}
	WinWait Plan de travail ahk_exe logon.exe,, 10
	Send {End}
	Sleep 10
	Send {Enter}
	WinWait Choix du planning ahk_exe unit.exe
	Send {tab 2}
	Sleep 10
	Send %UF%
	Sleep 10
	Send {enter}
	return
#ifwinactive Plan de travail ahk_exe logon.exe
²::
	Send {End}
	Sleep 10
	Send {Enter}
	WinWait Choix du planning ahk_exe unit.exe,, 10
	Send {tab 2}
	Sleep 10
	Send %UF%
	Sleep 10
	Send {enter}
	return

#ifwinactive LOGON - Reference ahk_exe logon.exe
&::
	GoSub Logon_Login
	Gosub Cs_1
	GoSub Cs_2
	Goto Cs_3_EHLSA
	return

#ifwinactive Plan de travail ahk_exe logon.exe
&::
	Send {Home}
	Send USV2 R
	Sleep 10
	Send {Enter}
	WinWait Choix du planning ahk_exe rdvwin.exe,, 10
	Sleep 10
	Send {tab 2}
	Sleep 10
	Send %type%
	Sleep 10
	Send {tab}
	Sleep 10
	Send %planning%
	Sleep 10
	Send {enter}
	Sleep 500
	Send !f
	Sleep 10
	Send h
	Sleep 500
	ControlSend, TMcKComboBox1, {Down 2}, Planning de ahk_exe rdvwin.exe
	return

#ifwinactive Choix du planning ahk_exe rdvwin.exe
&::
	Sleep 10
	Send {tab 2}
	Sleep 10
	Send %type%
	Sleep 10
	Send {tab}
	Sleep 10
	Send %planning%
	Sleep 10
	Send {enter}
	Sleep 500
	Send !f
	Sleep 10
	Send h
	Sleep 500
	ControlSend, TMcKComboBox1, {Down 2}, Planning de ahk_exe rdvwin.exe
	return
#ifwinactive Choix du planning ahk_exe unit.exe
²::
	Send {tab 2}
	Sleep 10
	Send %UF%
	Sleep 10
	Send {enter}
	return