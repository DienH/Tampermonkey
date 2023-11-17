UF = 
planning = 
dr_1 = 
dr_2 = 
cs_int = 

user = %username%


#SingleInstance force
#InstallKeybdHook
SetTitlematchmode, 2
DetectHiddenWindows, on
planning_type = Planning Service
Coordmode, Pixel, Screen
Coordmode, Mouse, Screen

Menu, Tray, Nostandard
Menu, Tray, Add, Relancer, ReloadScript
Menu, Tray, Add, WinSpy, LaunchWinSpy
Menu, Tray, Add
Menu, Tray, standard
Menu, Tray, Default, Relancer
Menu, Tray, Tip, Logon Helper


;If !WinExist("ahk_exe chrome.exe")
;	Run, %userprofile%\AppData\Local\Google\Chrome\Application\chrome.exe


UFs:={"Gravenoire":2848, "Pariou":2845, "Berlioz":2838, "Ravel":2837, "Domes":2846, "UHDL":3852, "UHCD":3111, "Chaumiere":3221}

;clipboard := manipulateKey(manipulateKey(manipulateKey("bouh", true), true), true)
;MsgBox, % clipboard
;MsgBox, % manipulateKey(manipulateKey(manipulateKey(clipboard)))

;return

;#Include %A_ScriptDir%\Activite-EHLSA-Gui.ahk
;Hotkey, IfWinActive, 



RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run\, AutoLogon, % """" A_AhkPath """ """ A_ScriptFullPath """"
return


; remove text format, keep only text
^+v::
	;Send,% Clipboard
	Clipboard := Clipboard
	Send, ^v
	return

Logon_Login:
	WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
	ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
	if (user){
		ControlSetText, % Edit4ID ? "Edit2" : "Edit1", %user%, ahk_id %hLogonRef%
	} else if (username){
		ControlSetText, % Edit4ID ? "Edit2" : "Edit1", %username%, ahk_id %hLogonRef%
	}
	ControlGetText, logon_id, % Edit4ID ? "Edit2" : "Edit1", ahk_id %hLogonRef%
	;tooltip, % logon_id " " user " " Edit4ID
	ControlSetText, % Edit4ID ? "Edit3" : "Edit2", % manipulateKey(StrSplit(GetRValue(manipulateKey(logon_id, true)), "|")[1]), ahk_id %hLogonRef%
	ControlFocus, % Edit4ID ? "Edit3" : "Edit2"
	Send {enter}
	return
	
DossierMed_1:
	WinWait Plan de travail ahk_exe logon.exe,, 10
	WinActivate Plan de travail ahk_exe logon.exe
	Sleep 10
	Send {Home}
	Send USV2 Do
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
	
Unit_2_bis:
	WinWait Choix du planning ahk_exe unit.exe,, 10
	WinActivate Choix du planning ahk_exe unit.exe
	Send {tab 2}
	Sleep 10
	Send %UF_bis%
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
	WinActivate, Choix du planning ahk_exe rdvwin.exe
	Send {tab 2}
	Sleep 10
	Send %planning_type%
	Sleep 10
	Send {tab}
	Sleep 10
	Send %planning%
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

Planning_semaine:
	WinWait, Planning de ahk_exe rdvwin.exe
	hBoutonAffichage := 0
	Count := 0
	While (!hBoutonAffichage || Count++ > 10){
		ControlGet, hBoutonAffichage, hWnd, , TMcKButton4, Planning de ahk_exe rdvwin.exe
		Sleep 500
	}
	ControlClick, , ahk_id %hBoutonAffichage%
	Sleep 500
	ControlClick, , ahk_id %hBoutonAffichage%
	return

~LButton::
	MouseGetPos,,, hUnderMouseWin
	Winget, nameUnderMouseWin, ProcessName, ahk_id %hUnderMouseWin%
	;		Tooltip, % nameUnderMouseWin " id: " hUnderMouseWin
	switch nameUnderMouseWin
	{
		case "logon.exe":
			if (!LogonPwdGuihWnd || !WinExist("ahk_id " LogonPwdGuihWnd)){
				Gosub CreateLogonPwdGui
				WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
				ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
				ControlGetPos, LogonPwdX, LogonPwdY, LogonPwdW, , % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
				;ControlGet, hLogonOldPwdEdit, Hwnd,, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
				Gui, LogonPwd:+owner%hLogonRef% +Parent%hLogonRef%
				LogonPwdX := LogonPwdX - 120
				LogonPwdY := LogonPwdY - 52
				if (LogonPwdX && LogonPwdY){
					Gui LogonPwd:Show, x%LogonPwdX% y%LogonPwdY% h40 w434, Window
				}
				ControlFocus, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
			} else {
				ResizeAttempts := 0
				SetTimer, ResizeLogonPwd, 50
				return
			}
			return
	}
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
	} else if FormulaireTitle contains prescription transport
	{
		ControlGetPos, TransportX, TransportY, TransportW, , TPanel28, ahk_id %hWinFormulaire%
		GuiControlGet, TransportGuiShown, Visible, TransportGuiV
		
		if (!WinExist("ahk_id " TransportGuihWnd)){
			Gosub CreateTransportGui
			ControlGet, hFormulaireTransportScroll, Hwnd,, TScrollBox1, ahk_id %hWinFormulaire%
			Gui, Transport:+owner%hWinFormulaire% +Parent%hFormulaireTransportScroll%
			TransportX := TransportX+TransportW+10
			TransportY := TransportY - 120
			Gui Transport:Show, x%TransportX%  y%TransportY% AutoSize, Window
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
	;Tooltip, % "bouh`n"
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
	;Tooltip, bouh
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


#IfWinActive, ahk_exe dmc.exe
F7::Goto CRSynthSplitScreen

#IfWinActive, CrossWay winword.exe
F7::Goto CRSynthSplitScreen

#IfWinActive, ahk_exe rdvwin.exe
F7::Goto CRSynthSplitScreen

F8::
	WinGet, hRdVWin, ID, A
	WinActivate, ahk_id %hRdVWin%
	Send !s
	Send c
	Gosub DossierMed_1
	WinWait, ahk_exe dmc.exe
	Sleep 500
	WinActivate, Gestion des dossiers ahk_exe dmc.exe
	Send !m
	Send s
	WinWait, Synthèse ahk_exe dmc.exe,,10
	Sleep 2000
	Gosub CRSynthSplitScreen
	WinWait, CrossWay ahk_exe winword.exe,,30
	if (errorlevel)
		return
	Goto CRSynthSplitScreen
	return
#If

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


ResizeLogonPwd:
	if (ResizeAttempts > 4){
		Settimer, ResizeLogonPwd, Off
	}
	WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
	if (hLogonRef){
		ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
		ControlGetPos, LogonPwdX, LogonPwdY, LogonPwdW, , % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
		LogonPwdX := LogonPwdX - 120
		LogonPwdY := LogonPwdY - 52
		if(LogonPwdX && LogonPwdY){
			Gui LogonPwd:Show, x%LogonPwdX% y%LogonPwdY%, Window
		}
	}
	ResizeAttempts++
	return

#ifwinactive LOGON - M-Référence ahk_exe logon.exe	

^r::Reload

&::
	GoSub Logon_Login
	Gosub Cs_1
	Gosub Cs_2_int
	return
	
²::
	GoSub Logon_Login
	;Gosub Cs_1
	;Gosub Cs_2_dr_1
	;Gosub Planning_semaine
	;Gosub Unit_1
	;Gosub Unit_2
	return



#ifwinactive ahk_exe DMC.exe
;Déclaration addictovigilance / pharmacovigilance
~RButton up::
	if (WinActive("Recherche ahk_exe dmc.exe")){
		Sleep 10
		ControlClick, Sélectionner, Recherche ahk_exe dmc.exe
		Sleep 1000
		WinGet, hDMC_Dossier, ID, Gestion des dossiers ahk_exe dmc.exe
		WinActivate, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Nom, TStaticText6, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Prenom, TStaticText5, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Age, TStaticText10, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Sexe, TStaticText1, ahk_id %hDMC_Dossier%
		Clipboard := SubStr(Patient_Nom, 1, 1) . "|" . SubStr(Patient_Prenom, 1, 1) . "|" . Patient_Age "|" Patient_Sexe
		Send !e
		Sleep 100
		Send e
		WinActivate, ahk_id %hDMC_Dossier%
		Send !m
		Sleep 100
		Send s
		WinWait Synthèse ahk_exe dmc.exe,, 30
		Sleep 1500
		WinMove, Synthèse ahk_exe dmc.exe,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
		WinMove, Gestion des dossiers ahk_exe dmc.exe,, % A_ScreenWidth/2
	}
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
	
&::
	GoSub Logon_Login
	Gosub Cs_1
	GoSub Cs_2
	;Goto Cs_3_EHLSA
	return
	
;h::
;	Gosub Cs_1
;	GoSub Cs_2
;	return

;g::
:*:gr::
	Gosub Unit_1
	UF_bis := UFs.Gravenoire
	Gosub Unit_2_bis
	return
	
;p::
:*:pa::
	Gosub Unit_1
	UF_bis := UFs.Pariou
	Gosub Unit_2_bis
	return
	
;b::
:*:be::
	Gosub Unit_1
	UF_bis := UFs.Berlioz
	Gosub Unit_2_bis
	return

;r::
:*:ra::
	Gosub Unit_1
	UF_bis := UFs.Ravel
	Gosub Unit_2_bis
	return

;d::
:*:do::
	Gosub Unit_1
	UF_bis := UFs.Domes
	Gosub Unit_2_bis
	return

;u::
:*:uhd::
	Gosub Unit_1
	UF_bis := UFs.UHDL
	Gosub Unit_2_bis
	return

;c
:*:ch::
	Gosub Unit_1
	UF_bis := UFs.Chaumiere
	Gosub Unit_2_bis
	return

:*:uhc::
	Gosub Unit_1
	UF_bis := UFs.UHCD
	Gosub Unit_2_bis
	return
	
:*:urg::
	Gosub Cs_1
	planning_type = Planning SAS
	planning_bak = planning
	planning = URG
	Sleep 10
	Gosub Cs_2
	planning := planning_bak
	planning_type = Planning Service
	return


h::
	Gosub Cs_1
	Gosub Cs_2_dr_2
	return
	
i::
	Gosub Cs_1
	Gosub Cs_2_int
	return

#ifwinactive Choix du planning ahk_exe rdvwin.exe
&::
	GoSub Cs_2
	return
	
#ifwinactive Choix du planning ahk_exe unit.exe
²::
	Send {tab 2}
	Sleep 10
	Send %UF%
	Sleep 10
	Send {enter}
	return
	
#ifwinactive Planning de ahk_exe rdvwin.exe
v::
	Gosub Planning_semaine
	return
	

CRSynthSplitScreen:
	Logon_1_Doc_HWND := WinExist("Liste des Documents - Volet CPT_RENDU ahk_exe unit.exe")
	if(!Logon_1_Doc_HWND){
		Logon_1_Doc_HWND := WinExist("Liste des Documents - Volet COURRIER ahk_exe rdvwin.exe")
	}
	WinGet, Logon_1_PID, PID, ahk_id %Logon_1_Doc_HWND%
	Logon_1_Plan_HWND := WinExist("PLANNING d' HEBERGEMENT - ahk_pid " Logon_1_PID)
	if(!Logon_1_Plan_HWND){
		Logon_1_Plan_HWND := WinExist("Planning de ahk_pid " Logon_1_PID)
	}
	Logon_1_Lettre_HWND := WinExist("CHU Lettre de Liaison ahk_pid " Logon_1_PID)
	if(!Logon_1_Lettre_HWND){
		Logon_1_Lettre_HWND := WinExist("Document dans ahk_pid " Logon_1_PID)
	}
	if(!Logon_1_Lettre_HWND){
		Logon_1_Lettre_HWND := WinExist("Document dans ahk_exe winword.exe")
	}
	
	Logon_2_Syn_HWND := WinExist("Synthèse ahk_exe unit.exe")
	if(!Logon_2_Syn_HWND){
		Logon_2_Syn_HWND := WinExist("Synthèse ahk_exe dmc.exe")
	}
	WinGet, Logon_2_PID, PID, ahk_id %Logon_2_Syn_HWND%
	Logon_2_Plan_HWND := WinExist("PLANNING d' HEBERGEMENT - ahk_pid " Logon_2_PID)
	if(!Logon_2_Plan_HWND){
		Logon_2_Plan_HWND := WinExist("Gestion des dossiers ahk_pid " Logon_2_PID)
	}
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

LaunchWinSpy:
	Run, %A_ScriptDir%\..\WinSpy\WinSpy.ahk
	
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

CreateTransportGui:
	Gui, Transport:New, -Border -Caption +hwndTransportGuihWnd
	Gui, Transport:Add, GroupBox, x0 y0 w160 h180 vTransportGuiV, Remplissage rapide
	Gui, Transport:Add, Radio, x5 y13 w150 h23 gTransportRaDVSL, Retour à domicile VSL
	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportCHSM, CHSM Clermont
	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportClementel, SSR Clémentel
	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportLignon, SSR Chambon sur Lignon
	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportGalmier, SSR Saint-Galmier
	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportEntree, Entrée en Hospit
	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportHdJ, HDJ addicto
;	Gui, Transport:Add, DDL, x5 y15 w150 h23 R10 vTransportDDLChoice gTransportDDL AltSubmit, |Retour à domicile VSL|CHSM Clermont|SSR Clémentel|SSR Chambon sur Lignon|SSR Saint-Galmier|Entrée en Hospit|HDJ addicto
	return
	

GetRValue(val){
	RegRead, Value, HKEY_CURRENT_USER\Software\Microsoft\Personalization\Settings\{B63C72CE-5652-4779-85AA-BB128A6F81FD}, % Val
	;return value
	return manipulateKey(Value)
}

CreateLogonPwdGui:
	Gui, LogonPwd:New, -Border -Caption +hwndLogonPwdGuihWnd
	Gui, Font, s12 
	Gui, LogonPwd:Add, Edit, x109 y0 w153 h24 gLogonPwdGetVal vLogonPwdVal Password*
	Gui, Font
	Gui, LogonPwd:Add, Checkbox, x85 y4 vLogonPwdSave
	Gui, LogonPwd:Add, Text, x55 y18, mémoriser
	Gui, LogonPwd:Add, Button, Default gLogonPwdButton Hidden1, Save
	Gui LogonPwd:+LastFound
	WinSet, TransColor, F0F0F0
	return
	
	
TransportClementel:
	Gosub TransportSortieCommun
	ControlSetText, TMemo7, Transfert en SSR, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: SSR Clémentel`r`nAdresse: Enval (63)" , ahk_id %hWinFormulaire%
	return
TransportRadVSL:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton3, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, Sortie d'hospitalisation, ahk_id %hWinFormulaire%
	return
TransportCHSM:
	Gosub TransportSortieCommun
	ControlSetText, TMemo7, Transfert pour hospitalisation de secteur, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: CH Sainte-Marie`r`nAdresse: Clermont-Ferrand (63)" , ahk_id %hWinFormulaire%
	return
TransportLignon:
	Gosub TransportSortieCommun
	ControlSetText, TMemo7, Transfert en SSR, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: SSR Clinique Le Haut Lignon`r`nAdresse: 43400 Le Chambon-sur-Lignon" , ahk_id %hWinFormulaire%
	return
TransportGalmier:
	Gosub TransportSortieCommun
	ControlSetText, TMemo7, Transfert en SSR, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: SSR Centre Mutualiste d'Addictologie `r`nAdresse: 42330 Saint-Galmier" , ahk_id %hWinFormulaire%
	return
TransportSortieCommun:
	Control, Check, , TCheckBox4, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton26, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton18, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton1, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton5, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton9, ahk_id %hWinFormulaire%
	return
TransportEntree:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton20, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, Entrée en hospitalisation, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: Service Gravenoire,  CMP B, CHU Gabriel Montpied`r`nAdresse: 63000 Clermont-Ferrand" , ahk_id %hWinFormulaire%
	return
TransportHdJ:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton20, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton16, ahk_id %hWinFormulaire%
	Control, Check, , TCheckbox3, ahk_id %hWinFormulaire%
	ControlSetText, TEdit1, 6, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, Hopital de jour addictologie, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: HDJ addictologie, CHU Gabriel Montpied`r`nAdresse: 63000 Clermont-Ferrand" , ahk_id %hWinFormulaire%
	return
TransportDDL:
	Gui, Transport:Submit, NoHide
	Switch TransportDDLChoice
	{
		case 2:
			Goto TransportRadVSL
		case 3:
			Goto TransportCHSM
		case 4:
			Goto TransportClementel
		case 5:
			Goto TransportLignon
		case 6:
			Goto TransportGalmier
		case 7:
			Goto TransportEntree
		case 8:
			Goto TransportHdJ
		default:
			return
	}
	return

manipulateKey(text, encode := false){
	if(encode){
		len := StrPutBuff(text, buf)
		base64 := CryptBinaryToString(&buf, len)
		for k, v in [["=", ""], ["+", "-"], ["/", "_"]]
			base64 := StrReplace(base64, v[1], v[2])
		Return base64
	} else {
		for k, v in [["-", "+"], ["_", "/"]]
			text := StrReplace(text, v[1], v[2])
		len := CryptStringToBinary(text, data)
		Return StrGet(&data, len, "UTF-8")
   }
}


Base64UrlDecode(base64Url) {
   for k, v in [["-", "+"], ["_", "/"]]
      base64Url := StrReplace(base64Url, v[1], v[2])
   len := CryptStringToBinary(base64Url, data)
   Return StrGet(&data, len, "UTF-8")
}

CryptBinaryToString(pData, size, formatName := "CRYPT_STRING_BASE64", NOCRLF := true)
{
   static formats := { CRYPT_STRING_BASE64: 0x1
                     , CRYPT_STRING_HEX:    0x4
                     , CRYPT_STRING_HEXRAW: 0xC }
        , CRYPT_STRING_NOCRLF := 0x40000000
   fmt := formats[formatName] | (NOCRLF ? CRYPT_STRING_NOCRLF : 0)
   if !DllCall("Crypt32\CryptBinaryToString", "Ptr", pData, "UInt", size, "UInt", fmt, "Ptr", 0, "UIntP", chars)
      throw "CryptBinaryToString failed. LastError: " . A_LastError
   VarSetCapacity(outData, chars << !!A_IsUnicode)
   DllCall("Crypt32\CryptBinaryToString", "Ptr", pData, "UInt", size, "UInt", fmt, "Str", outData, "UIntP", chars)
   Return outData
}

CryptStringToBinary(string, ByRef outData, formatName := "CRYPT_STRING_BASE64")
{
   static formats := { CRYPT_STRING_BASE64: 0x1
                     , CRYPT_STRING_HEX:    0x4
                     , CRYPT_STRING_HEXRAW: 0xC }
   fmt := formats[formatName]
   chars := StrLen(string)
   if !DllCall("Crypt32\CryptStringToBinary", "Str", string, "UInt", chars, "UInt", fmt
                                            , "Ptr", 0, "UIntP", bytes, "UIntP", 0, "UIntP", 0)
      throw "CryptStringToBinary failed. LastError: " . A_LastError
   VarSetCapacity(outData, bytes)
   DllCall("Crypt32\CryptStringToBinary", "Str", string, "UInt", chars, "UInt", fmt
                                        , "Str", outData, "UIntP", bytes, "UIntP", 0, "UIntP", 0)
   Return bytes
}

StrPutBuff(str, ByRef buff, encoding := "UTF-8") {
   VarSetCapacity(buff, len := (StrPut(str, encoding) - 1) << (encoding ~= "i)^(UTF-16|cp1200)$"))
   StrPut(str, &buff, encoding)
   Return len
}

LogonPwdGetVal:
	return

LogonPwdButton:
	Gui, LogonPwd:Submit, NoHide
	WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
	ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
	ControlSetText, % Edit4ID ? "Edit3" : "Edit2", % LogonPwdVal, ahk_id %hLogonRef%
	ControlGetText, LogonUsername, % Edit4ID ? "Edit2" : "Edit1", ahk_id %hLogonRef%
	ControlFocus, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
	;Tooltip, % "Save ? " . LogonPwdSave . "`nID: " . LogonUsername . "`n Pwd: " . LogonPwdVal
	;Send {Enter}
	LogonCrypt := manipulateKey(manipulateKey(LogonPwdVal, true) . "|" . LogonUsername, true)
	Tooltip, % manipulateKey(LogonCrypt)
	if (LogonPwdSave){
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Personalization\Settings\{B63C72CE-5652-4779-85AA-BB128A6F81FD}, % manipulateKey(LogonUsername, true), % manipulateKey(manipulateKey(LogonPwdVal, true) . "|" . LogonUsername, true)
	}
	LogonPwdVal :=
	return


;these
#IfWinActive These-
d::
	Send 1
	Send {Enter}
	return
	
q::
	Send 0
	Send {Enter}
	return
z::
	Send {up}
	return
s::
	Send *
	Send {Enter}
	return
f::
	Send 2
	Send {Enter}
	return
