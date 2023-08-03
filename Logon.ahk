#SingleInstance force
#InstallKeybdHook
SetTitlematchmode, 2
DetectHiddenWindows, on

Menu, Tray, Nostandard
Menu, Tray, Add, Relancer, ReloadScript
Menu, Tray, Add
Menu, Tray, standard
Menu, Tray, Default, Relancer
Menu, Tray, Tip, Logon Helper

Coordmode, Pixel, Screen
Coordmode, Mouse, Screen
user = %username%
password = 
UF = 2848
type = Planning Service
planning = Interne (Psyb)
dr_1 = 
dr_2 = 
cs_int = Interne (PSYB)
;If !WinExist("ahk_exe chrome.exe")
;	Run, %userprofile%\AppData\Local\Google\Chrome\Application\chrome.exe


passkey(string)
{
    if !(DllCall("crypt32\CryptStringToBinary", "ptr", &string, "uint", 0, "uint", 0x1, "ptr", 0, "uint*", size, "ptr", 0, "ptr", 0))
        throw Exception("CryptStringToBinary failed", -1)
    VarSetCapacity(buf, size, 0)
    if !(DllCall("crypt32\CryptStringToBinary", "ptr", &string, "uint", 0, "uint", 0x1, "ptr", &buf, "uint*", size, "ptr", 0, "ptr", 0))
        throw Exception("CryptStringToBinary failed", -1)
    return StrGet(&buf, size, "UTF-8")
}

;#Include %A_ScriptDir%\Activite-EHLSA-Gui.ahk
Hotkey, IfWinActive, 

RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run\, AutoLogon, % """" A_AhkPath """ """ A_ScriptFullPath """"
return



Logon_Login:
	ControlSetText, Edit1, %user%
	;Tooltip, % passkey(password)
	ControlSetText, Edit2, % passkey(password)
	ControlFocus, Edit2
	Sleep 10
	Send {Enter}
	return
Unit_1:
	WinWait Plan de travail ahk_exe logon.exe,, 10
	WinActivate Plan de travail ahk_exe logon.exe
	Sleep 10
	Send {Home}
	Send USV2 U
	Sleep 10
	Send {Enter}
	return
Unit_2:
	WinWait Choix du planning ahk_exe unit.exe,, 10
	WinActivate Choix du planning ahk_exe unit.exe
	Send {tab 2}
	Sleep 10
	Send %UF%
	Sleep 10
	Send {enter}
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
Cs_2_bis:
	WinWait Choix du planning ahk_exe rdvwin.exe,, 10
	Sleep 10
	Send {tab 2}
	Sleep 10
	Send %type%
	Sleep 10
	Send {tab}
	Sleep 10
	Send %planning2%
	Sleep 10
	Send {enter}
	return
Cs_2_dr_1:
	WinWait Choix du planning ahk_exe rdvwin.exe,, 10
	Sleep 10
	Send {tab 3}
	Sleep 10
	Send %dr_1%
	Sleep 10
	Send {enter}
	return
Cs_2_dr_2:
	WinWait Choix du planning ahk_exe rdvwin.exe,, 10
	Sleep 10
	Send {tab 3}
	Sleep 10
	Send %dr_2%
	Sleep 10
	Send {enter}
	return
Cs_2_int:
	WinWait Choix du planning ahk_exe rdvwin.exe,, 10
	Sleep 10
	Send {tab 3}
	Sleep 10
	Send %cs_int%
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


#IfWinActive, ahk_class TWPRubricoDoc ahk_exe unit.exe
^s::
	Send !f
	Sleep 10
	Send e
	return
#if

#IfWinActive, ahk_class TWPRubricoDoc ahk_exe rdvwin.exe
^s::
	Send !f
	Sleep 10
	Send e
	return
#if

#ifWinActive, Formulaire ahk_exe unit.exe
~LButton::
	FormulaireWindow = Formulaire ahk_exe unit.exe
	Gosub ResizeFormulaire
	return
#If

#ifWinActive, Identification ahk_exe unit.exe
~LButton::
	WinGet, IdentifhWnd, ID
	Winset, Style, -0x40000000, ahk_id %IdentifhWnd%
	MouseGetPos,,,, CtrlhWnd, 2
	;WinGetClass, bah, ahk_id %CtrlhWnd%
	;Tooltip, bouh %CtrlhWnd% %bah%
	Control, Enable,,, ahk_id %CtrlhWnd%
	return
#If

#ifWinActive, Formulaire ahk_exe rdvwin.exe
~LButton::
	FormulaireWindow = Formulaire ahk_exe rdvwin.exe
	Gosub ResizeFormulaire
	return
#If
#ifWinActive, Formulaire ahk_exe crosspass.exe
~LButton::
	FormulaireWindow = Formulaire ahk_exe crosspass.exe
	Gosub ResizeFormulaire
	return
#If

ResizeFormulaire:
	NR_temp =0 ; init
	CopyAllMemoText := false
	TimeOut = 100 ; milliseconds to wait before deciding it is not responding - 100 ms seems reliable under 100% usage
	; WM_NULL =0x0000
	; SMTO_ABORTIFHUNG =0x0002
	MouseGetPos,,,hWinFormulaire,hControlText,2
	WinGetTitle, FormulaireTitle, ahk_id %hWinFormulaire%
	;SendMessage, 0x30,,1,, ahk_id %hControlText% 
	Loop 2
	{
		Responding := DllCall("SendMessageTimeout", "UInt", WinExist(FormulaireWindow), "UInt", 0x0000, "Int", 0, "Int", 0, "UInt", 0x0002, "UInt", TimeOut, "UInt *", NR_temp)
		If Responding = 1 ; 1= responding, 0 = Not Responding
		{
			;Tooltip, Responding
			Break
		} else {
			if (A_Index == 2){
				;Tooltip, Not responding
			}
		}
		Sleep 1000
	}
	if FormulaireTitle contains HOSP Entrée
	{
		CopyAllMemoText := true
		ControlGet, hMemo, Hwnd, , TMemo7, %FormulaireWindow%
		hPanel := DllCall("GetAncestor", uint, hMemo, uint, 1)
		ControlGetPos, X_Memo, Y_Memo, W_Memo, H_Memo, TMemo7, %FormulaireWindow%
		if (H_Memo < 87){
			For a, N_Control in ["TPanel29", "TPanel28", "TPanel27", "TPanel26", "TPanel25", "TPanel8", "TPanel9", "TPanel11", "TPanel12", "TPanel10"]
			{
				ControlGetPos, X_Panel, Y_Panel, W_Panel, H_Panel, % N_Control, %FormulaireWindow%
				ControlMove, % N_Control, , % Y_Panel + 100, , , %FormulaireWindow%
			}
			ControlMove,TPanel14, , , , 170, %FormulaireWindow%
			ControlMove,TPanel13, , , , 170, %FormulaireWindow%
		}
	} else {
		ControlGet, hMemo, Hwnd, , TMemo2, %FormulaireWindow%
		hPanel := DllCall("GetAncestor", uint, hMemo, uint, 1)
		ControlGetPos, X_Memo, Y_Memo, W_Memo, H_Memo, TMemo2, %FormulaireWindow%
		ControlGetPos, X_ScrollBox, Y_ScrollBox, W_ScrollBox, H_ScrollBox, TScrollBox1, %FormulaireWindow%
		ControlMove,, , , , % H_ScrollBox - Y_Memo + 100, ahk_id %hPanel%
		ControlMove, TMemo2, , , , 1000, ahk_id %hMemo%
	}
	Hotkey, IfWinActive, %FormulaireWindow%
	Loop, 75
	{
		Hotkey, % "~" Chr(0x2F + A_Index), CopyCurrentMemo
	}
	Hotkey, ~Space, CopyCurrentMemo
	Hotkey, ~Enter, CopyCurrentMemo
	Hotkey, ~Backspace, CopyCurrentMemo
	Hotkey, ^+v, PasteCurrentMemo
	Hotkey, ^s, SaveCurrentMemo
	Hotkey, ^BackSpace, CtrlBackspace
	Hotkey, ^a, SelectAllText
	Hotkey, If
	Control, Enable,, TDateTimePicker1, %FormulaireWindow%
	;ToolTip, % Memo_text
	return

SaveCurrentMemo:
	ControlClick, TMcKButton2, %FormulaireWindow%
	Sleep 2000
	ControlClick, TCwSpeedButton2, Modification de l'observation
	return


CtrlBackspace:
	Send, ^+{Left}
	Send {Del}
	return

SelectAllText:
	Send ^{Home}
	Send ^+{End}
	return

CopyCurrentMemo:
	if CopyAllMemoText
	{
		ControlGetText, Memo_text_Motif, TMemo9, ahk_id %hWinFormulaire%
		ControlGetText, Memo_text_ATCD, TMemo8, ahk_id %hWinFormulaire%
		ControlGetText, Memo_text_MDV, TMemo7, ahk_id %hWinFormulaire%
		ControlGetText, Memo_text_HDLM, TMemo6, ahk_id %hWinFormulaire%
		ControlGetText, Memo_text_TTT, TMemo5, ahk_id %hWinFormulaire%
		ControlGetText, Memo_text_Clinique, TMemo4, ahk_id %hWinFormulaire%
		ControlGetText, Memo_text_Exam, TMemo3, ahk_id %hWinFormulaire%
		ControlGetText, Memo_text_CAT, TMemo2, ahk_id %hWinFormulaire%
	} else
		ControlGetText, Memo_text, , ahk_id %hMemo%
	return

PasteCurrentMemo:
	if CopyAllMemoText
	{
		ControlSetText, TMemo9, % Memo_text_Motif, ahk_id %hWinFormulaire%
		ControlSetText, TMemo8, % Memo_text_ATCD, ahk_id %hWinFormulaire%
		ControlSetText, TMemo7, % Memo_text_MDV, ahk_id %hWinFormulaire%
		ControlSetText, TMemo6, % Memo_text_HDLM, ahk_id %hWinFormulaire%
		ControlSetText, TMemo5, % Memo_text_TTT, ahk_id %hWinFormulaire%
		ControlSetText, TMemo4, % Memo_text_Clinique, ahk_id %hWinFormulaire%
		ControlSetText, TMemo3, % Memo_text_Exam, ahk_id %hWinFormulaire%
		ControlSetText, TMemo2, % Memo_text_CAT, ahk_id %hWinFormulaire%
	} else
		ControlSetText, , % Memo_text, ahk_id %hMemo%
	return

/*
;~LButton up::
;	MouseGetPos,,, CurrentMouseWindow
;	if (winExist("CHU Lettre de Liaison ahk_id " CurrentMouseWindow)){
;		ControlSend, TWPRichText1, {Alt down}f{Alt up},  ahk_id %CurrentMouseWindow%
;		Sleep 10
;		;ControlSend, , {e}, ahk_id %CurrentMouseWindow%
;	}
;	return
*/

CopyCurrentLettre:
	Clipboard_old := Clipboard
	Send ^a
	Send ^c
	Send {Esc}
	Lettre_text := Clipboard
	Clipboard := Clipboard_old
	return
	
PasteCurrentLettre:
	Clipboard_old := Clipboard
	Clipboard := Lettre_text
	Send ^a
	Send ^v
	Clipboard := Clipboard_old
	return

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

#IfWinActive, Création d'un rendez-vous par actes ahk_exe rdvwin.exe
F6::
	;ControlGetText, TMcKGroupBox1, Création d'un rendez-vous par actes ahk_exe rdvwin.exe
	ControlClick, TMcKButton17, Création d'un rendez-vous par actes ahk_exe rdvwin.exe
	WinWait, Modes de soins du patient ahk_exe rdvwin.exe
	Sleep 500
	ControlClick, Ajouter, Modes de soins du patient ahk_exe rdvwin.exe
	Tooltip, bouh
	WinWait, Détail du mode de soins ahk_exe rdvwin.exe
	Sleep 500
	Tooltip
	ControlSend, TComboBox1, SL, Détail du mode de soins ahk_exe rdvwin.exe
	Sleep 100
	ControlClick, Valider, Détail du mode de soins ahk_exe rdvwin.exe
	Sleep 500
	ControlClick, Valider, Modes de soins du patient ahk_exe rdvwin.exe
	Sleep 500
	ControlClick, Valider, Création d'un rendez-vous par actes ahk_exe rdvwin.exe
	return

#IfWinActive, ahk_exe unit.exe
^r::Reload
F7::Goto CRSynthSplitScreen

F6::Goto CopyAdminInfos

F8::
	SetTitlematchmode, 2
	Send !v
	Send m
	WinWait, Valider modifier un mouvement ahk_exe unit.exe
	Sleep 1500
	ControlGetText, IEP, TEdit2, Valider modifier un mouvement ahk_exe unit.exe
	if (!IEP)
		return
	WinClose
	Loop 2
	{
		GoSub Unit_1
		Sleep 3000
		WinWait, Choix du planning ahk_exe unit.exe
		Send {enter}
		Sleep 100
		Send !p
		Send h
		WinWait, Recherche ahk_exe unit.exe
		Send {tab 3}
		Sleep 100
		Send %IEP%
		Sleep 100
		Send {tab}
		Send {down}
		Send {enter}
		Sleep 500
		Send {tab 7}
		Send {enter}
		Sleep 1500
		if (A_Index == 1)
		{
			ControlClick, Synthèse, PLANNING ahk_exe unit.exe
		} else {
			Send !s
			Send t
		}
		Sleep 2000
	}
	Sleep 3000
	Gosub CRSynthSplitScreen
	WinWait, CHU Lettre de Liaison PSY ahk_exe unit.exe,,30
	if (errorlevel)
		return
	Goto CRSynthSplitScreen
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

#ifwinactive LOGON - M-Référence ahk_exe logon.exe
^r::Reload
@::
²::
	GoSub Logon_Login
	Gosub Unit_1
	Gosub Unit_2
	return

#ifwinactive Plan de travail ahk_exe logon.exe
@::
²::
	Send {End}
	Sleep 10
	Send {Enter}
	WinWait Choix du planning ahk_exe unit.exe,, 10
	WinActivate Choix du planning ahk_exe unit.exe
	Send {tab 2}
	Sleep 10
	Send %UF%
	Sleep 10
	Send {enter}
	return

#ifwinactive Plan de travail ahk_exe logon.exe
&::
	GoSub Logon_Login
	Gosub Cs_1
	GoSub Cs_2
	;Goto Cs_3_EHLSA
	return
#ifwinactive LOGON - Reference ahk_exe logon.exe
&::
	GoSub Logon_Login
	Gosub Cs_1
	GoSub Cs_2
	;Goto Cs_3_EHLSA
	return

#ifwinactive Plan de travail ahk_exe logon.exe
h::
	Gosub Cs_1
	GoSub Cs_2
	return

t::
	Gosub Cs_1
	GoSub Cs_2_bis
	return

m::
	Gosub Cs_1
	Gosub Cs_2_dr_1
	return
;f::
;	Gosub Cs_1
;	Gosub Cs_2_dr_2
;	return
	
i::
	Gosub Cs_1
	Gosub Cs_2_int
	return

#ifwinactive Choix du planning ahk_exe rdvwin.exe
&::
	GoSub Cs_2
	return
	
é::
	GoSub Cs_2_bis
	return
#ifwinactive Choix du planning ahk_exe unit.exe
²::
	Send {tab 2}
	Sleep 10
	Send %UF%
	Sleep 10
	Send {enter}
	return
	

CRSynthSplitScreen:
	Logon_1_Doc_HWND := WinExist("Liste des Documents - Volet CPT_RENDU ahk_exe unit.exe")
	WinGet, Logon_1_PID, PID, ahk_id %Logon_1_Doc_HWND%
	Logon_1_Plan_HWND := WinExist("PLANNING d' HEBERGEMENT - ahk_pid " Logon_1_PID)
	Logon_1_Lettre_HWND := WinExist("CHU Lettre de Liaison ahk_pid " Logon_1_PID)
	Logon_2_Syn_HWND := WinExist("Synthèse ahk_exe unit.exe")
	WinGet, Logon_2_PID, PID, ahk_id %Logon_2_Syn_HWND%
	Logon_2_Plan_HWND := WinExist("PLANNING d' HEBERGEMENT - ahk_pid " Logon_2_PID)
	WinMove, ahk_id %Logon_1_Doc_HWND%,, 0, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_1_Plan_HWND%,, 0, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_1_Lettre_HWND%,, 0, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_2_Plan_HWND%,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinMove, ahk_id %Logon_2_Syn_HWND%,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
	WinActivate, ahk_id %Logon_2_Syn_HWND%
	WinActivate, ahk_id %Logon_1_Doc_HWND%
	WinActivate, ahk_id %Logon_1_Lettre_HWND%
	return

ReloadScript:
	Reload
	Return
	
CopyAdminInfos:
	Send, {Alt down}
	Sleep 10
	Send a
	Sleep 10
	Send r
	Sleep 10
	Send, {Alt up}
	WinWait, Renseignements ahk_exe unit.exe
	ControlGetText, Info_Nom_naissance, TStaticText23, Renseignements ahk_exe unit.exe
	ControlGetText, Info_Nom_usage, TStaticText31, Renseignements ahk_exe unit.exe
	ControlGetText, Info_Prenom, TStaticText30, Renseignements ahk_exe unit.exe
	ControlGetText, Info_DDN, TStaticText29, Renseignements ahk_exe unit.exe
	ControlGetText, Info_Sexe, TStaticText27, Renseignements ahk_exe unit.exe
	;ControlGetText, Info_TelPort, TElMaskEdit5, Renseignements ahk_exe unit.exe
	ControlGetText, Info_Tel, TElMaskEdit1, Renseignements ahk_exe unit.exe
		Info_Tel := Join("", StrSplit(StrSplit(Info_Tel, " ")[1], "-"))
	ControlGetText, Info_Adresse_Rue, TStaticText15, Renseignements ahk_exe unit.exe
	ControlGetText, Info_Adresse_CP, TStaticText12, Renseignements ahk_exe unit.exe
	ControlGetText, Info_Adresse_Ville, TStaticText11, Renseignements ahk_exe unit.exe
	ControlGetText, Info_NSS, TStaticText9, Renseignements ahk_exe unit.exe
	WinClose, Renseignements ahk_exe unit.exe
	;Tooltip, % Info_Tel
	Infos := ""
	For k, info in ["Nom_naissance", "Nom_usage", "Prenom", "DDN", "Sexe", "Tel", "Adresse_Rue", "Adresse_CP", "Adresse_Ville", "NSS"]
		Infos .= Info_%info% . "`t"
	;Tooltip, % Infos
	Clipboard := Infos	
	return

Join(sep, params) {
    for index,param in params
        str .= param . sep
    return StrLen(sep) > 0 ? SubStr(str, 1,  -StrLen(sep)) : str
}
