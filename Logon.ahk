logon_version := "1.6.2" ; Numero de version
;@Ahk2Exe-SetVersion 1.6.2.0

#SingleInstance off
#InstallKeybdHook
#Include %A_ScriptDir%\AHKHID.ahk

DetectHiddenWindows, on
SetTitlematchmode, 2

if (A_IsCompiled){
} else {
	SplitPath, % A_AhkPath, A_AhkExeName
	Menu, Tray, Icon, %A_ScriptDir%\Logon.ico, 0
}
WinGet, ScriptIDList, List, % A_ScriptName " ahk_exe " (A_IsCompiled ? A_ScriptName : A_AhkExeName)


;Verification version de Logon.ahk et MàJ auto
;if (FileExist("\\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\Scripts\Logon.ahk"))
FileReadLine, Logon_dev_version, \\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\Scripts\Logon.ahk, 1
if (!ErrorLevel){
	Logon_dev_version_A := StrSplit(Logon_dev_version, """")
	Logon_dev_version := Logon_dev_version_A[2]
	;Tooltip, % Logon_dev_version "`t" logon_version "`n" (logon_version < Logon_dev_version)
	if (logon_version < Logon_dev_version){
		FileCopy, \\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\Scripts\Logon.ahk, %A_ScriptFullPath%, 1
		Reload
	}
}

;MsgBox, % A_ScriptName "`n" ScriptIDList "`n" OldRunningScript " `t" A_ScriptHwnd "`n" ScriptIDList1 "`t " ScriptIDList2 "`t " ScriptIDList3
if (ScriptIDList > 1)
{
	if (A_Args[1]){
		Patient_IPP := StrSplit(A_Args[1], "openbyipp:")[2]
		if (!WinExist("Recherche ahk_exe dmc.exe"))
		{
			hDMC_GestionDossier := WinExist("Gestion des dossiers ahk_exe dmc.exe")
			hDMC_Synthese := getLastPopupWindow(hDMC_GestionDossier)
			WinGetTitle, hDMC_Synthese_Titre, ahk_id %hDMC_Synthese%
			;Ttip(Format("0x{1:x}", hDMC_Synthese) "`n" hDMC_Synthese_Titre, 1000)
			WinActivate, ahk_id %hDMC_GestionDossier%
			if (hDMC_Synthese_Titre = "Synthèse"){
				WinClose, ahk_id %hDMC_Synthese%
			}
			if (hDMC_GestionDossier != WinExist("A"))
			{
				Run, "N:\DMC.exe"
			}
			WinWaitActive, Gestion des dossiers ahk_exe dmc.exe
			WinMenuSelectItem, Gestion des dossiers ahk_exe dmc.exe, , 1&, 1&
			WinWaitActive, Recherche ahk_exe dmc.exe
		} else {
			WinActivate, Recherche ahk_exe dmc.exe
		}
		;if ("RechercheType = Nom")
		If Patient_IPP Is Integer
		{
			;Ttip(Patient_IPP)
			ControlSetText, TEdit4, % Patient_IPP, Recherche ahk_exe dmc.exe
			ControlSetText, TEdit6, % "", Recherche ahk_exe dmc.exe
		} else {
			Patient_NomPrenom := StrSplit(Patient_IPP, "_")
			ControlSetText, TEdit6, % Patient_NomPrenom[1], Recherche ahk_exe dmc.exe
			ControlSetText, TEdit5, % Patient_NomPrenom[2], Recherche ahk_exe dmc.exe
		}
		ControlSend, TEdit4, {Enter}, Recherche ahk_exe dmc.exe
		Sleep 500
		ControlClick, Sélectionner, Recherche ahk_exe dmc.exe
		WinActivate, Gestion des dossiers ahk_exe dmc.exe
		WinWaitActive, Gestion des dossiers ahk_exe dmc.exe
		if Patient_IPP Is Not Integer
		{
			ControlGetText, Patient_IPP, TStaticText3, Gestion des dossiers ahk_exe dmc.exe
		}
		if (!VerifierDeclarationAnterieure(Patient_IPP))
			ExitApp
		ControlClick, Synthèse, Gestion des dossiers ahk_exe dmc.exe
	} else {
		PostMessage, 0x9999,,,, % "ahk_id " ScriptIDList%ScriptIDList%
	}
	ExitApp
}

OnMessage(0x9999, "ReloadScript")
CreateOpenByIPPProtocol()


Coordmode, Pixel, Screen
Coordmode, Mouse, Screen




;Gestion du lecteur de code-bar

;Create GUI to receive messages
Gui, +LastFound
hGui := WinExist()

;Intercept WM_INPUT messages
WM_INPUT := 0xFF
;OnMessage(WM_INPUT, "CheckBarCodeReader")


;Register Remote Control with RIDEV_INPUTSINK (so that data is received even in the background)
r := AHKHID_Register(1, 6, hGui, RIDEV_INPUTSINK)
iKeyList := ""

; Fin gestion du lecteur de code-bar


;     ___       _   _                 
;    /___\_ __ | |_(_) ___  _ __  ___ 
;   //  // '_ \| __| |/ _ \| '_ \/ __|
;  / \_//| |_) | |_| | (_) | | | \__ \
;  \___/ | .__/ \__|_|\___/|_| |_|___/
;        |_|                          


;   ██████  ██████  ████████ ██  ██████  ███    ██ ███████ 
;  ██    ██ ██   ██    ██    ██ ██    ██ ████   ██ ██      
;  ██    ██ ██████     ██    ██ ██    ██ ██ ██  ██ ███████ 
;  ██    ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
;   ██████  ██         ██    ██  ██████  ██   ████ ███████ 
;                                                          
;                                                          

; Gestion du fichier d'option Logon_Options.ini

auto_open = DMC

UF_service =
; UF du service à ouvrir automatiquement par défaut si l'option "auto_open" est paramétrée sur "service"
planning =
dr_1 =
dr_2 = 
cs_int =

user = %username%
planning_type = Planning Service

Douchette_Liste = VID_05F9&PID_221C VID_05E0&PID_1200


auto_open_comment =
(
; options : "DMC" pour la recherche de dossier médical patient
; "UF_service" pour ouvrir le service numéroté par la variable qui suit %UF_service%
; "cs_int" pour ouvrir le planning de consultation de l'interne (paramétrable par la variable %cs_int%)
; ou "dr_1" ou "dr_2" pour afficher les planning de sénior, dont les noms sont paramétrables par les variables %dr_1% et %dr_2%
; ou "cs_moi" pour son propre planning de consultation
; ou "urg" pour le planning des urgences
)



if (!FileExist(A_ScriptDir "\Logon_Options.ini")){
	FileAppend, % "[Options]`n", %A_ScriptDir%\Logon_Options.ini
	for k, option in ["UF_service", "dr_1", "dr_2", "cs_int", "auto_open", "Douchette_VID", "Douchette_PID"]
	{
		FileAppend, % option "=" %option% "`n", %A_ScriptDir%\Logon_Options.ini
		;IniWrite, % %option%, %A_ScriptDir%\Logon_Options.ini, Options, % option
		switch option
		{
			case "auto_open":
				FileAppend, % auto_open_comment, %A_ScriptDir%\Logon_Options.ini
			case "UF_service":
				FileAppend, % "; Code UF à ouvrir automatiquement si auto_open est sur 'UF_service'`n", %A_ScriptDir%\Logon_Options.ini
			case "cs_int":
				FileAppend, % "; Nom du planning de CS à ouvrir si auto_open est sur 'cs_int'`n", %A_ScriptDir%\Logon_Options.ini
		}
		FileAppend, % ";`n", %A_ScriptDir%\Logon_Options.ini
	}
} else {
	IniRead, Logon_Options, %A_ScriptDir%\Logon_Options.ini, Options
	Ttip(A_ScriptDir "\Logon_Options.ini")
	Loop, parse, Logon_Options, `n
	{
		option := StrSplit(A_LoopField, "=")
		value := option[2]
		option := option[1]
		%option% := value
	}
}


Auto_open_Liste := {1:{friendly:"Aucun",short:""}
	,2:{friendly:"DMC",short:"DMC"}
	,3:{friendly:"Service",short:"UF_service"}
	,4:{friendly:"Ma consult",short:"cs_moi"}
	,5:{friendly:"Consult " dr_1,short:"dr_1"}
	,6:{friendly:"Consult " dr_2,short:"dr_2"}
	,7:{friendly:"Consult Interne",short:"cs_int"}
	,8:{friendly:"Planning Urgences",short:"urg"}}

Auto_open_Liste.length := Auto_open_Liste.Count()
Loop, Auto_open_Liste.length
{
	Auto_open_Liste[["friendly"]] := A_Index
	Auto_open_Liste[["short"]] := A_Index
}


; Liste des VID et PID reconnus comme douchettes
Douchette_Liste_A := StrSplit(Douchette_Liste, " ")
Douchette_ListeID := {}
for k,v in Douchette_Liste_A
{
	Douchette_ListeID[v] := true
}


;Menus


menu, MenuPlandetravail_Services, Add, Mon service, PdT_AfficherService
menu, MenuPlandetravail_Services, Add
menu, MenuPlandetravail_Services, Add, Berlioz, PdT_AfficherService
menu, MenuPlandetravail_Services, Add, Ravel, PdT_AfficherService
menu, MenuPlandetravail_Services, Add, Chopin, PdT_AfficherService
menu, MenuPlandetravail_Services, Add
menu, MenuPlandetravail_Services, Add, Domes, PdT_AfficherService
menu, MenuPlandetravail_Services, Add, Pariou, PdT_AfficherService
menu, MenuPlandetravail_Services, Add, UHDL, PdT_AfficherService
menu, MenuPlandetravail_Services, Add, Gravenoire, PdT_AfficherService
menu, MenuPlandetravail_Services, Add
menu, MenuPlandetravail_Services, Add, Chaumière, PdT_AfficherService
menu, MenuPlandetravail_Services, Add
menu, MenuPlandetravail_Services, Add, Urgences, PdT_AfficherService
menu, MenuPlandetravail_Services, Add, UHCD, PdT_AfficherService

Menu, MenuPlandetravail_Cs, Add, Tous les planning, PdT_AfficherCs
Menu, MenuPlandetravail_Cs, Add, Ma consult, PdT_AfficherCs
if (cs_int){
	Menu, MenuPlandetravail_Cs, Add
	Menu, MenuPlandetravail_Cs, Add, % cs_int, PdT_AfficherCs
}
if (dr_1)
	Menu, MenuPlandetravail_Cs, Add
	Menu, MenuPlandetravail_Cs, Add, % dr_1, PdT_AfficherCs
if (dr_2)
	Menu, MenuPlandetravail_Cs, Add, % dr_2, PdT_AfficherCs
if (Ambu_Service_1)
	Menu, MenuPlandetravail_Cs, Add
	Menu, MenuPlandetravail_Cs, Add, % Ambu_Service_1, PdT_AfficherCs
if (Ambu_Service_2)
	Menu, MenuPlandetravail_Cs, Add, % Ambu_Service_2, PdT_AfficherCs
	
	
Menu, MenuPlandetravail, Add, Mon service, PdT_AfficherService
Menu, MenuPlandetravail, Add, Ma consult, PdT_AfficherCs
Menu, MenuPlandetravail, Add, Planning Sismo, PdT_AfficherCs
Menu, MenuPlandetravail, Add, HdJ Sismo-Esket, PdT_AfficherService
Menu, MenuPlandetravail, Add, CS Sismo-Esket, PdT_AfficherCs
Menu, MenuPlandetravail, Add
Menu, MenuPlandetravail, Add, Accéder au service, :MenuPlandetravail_Services
Menu, MenuPlandetravail, Add, Planning de consultation, :MenuPlandetravail_Cs



Menu, XWayApplications, Add, Logon, StartXWay
Menu, XWayApplications, Add
Menu, XWayApplications, Add, DMC, StartXWay
Menu, XWayApplications, Add, Planning, :MenuPlandetravail_Cs
Menu, XWayApplications, Add, Services, :MenuPlandetravail_Services

Menu, SyntheseDMCMenu, Add, &Copier les infos du patient, CopierInfosPatientDMC
;Menu, SyntheseMenu, Add, &Listing codebar, WaitForBarcode
Menu, SyntheseDMCMenu, Add, &Lister ce patient et le déclarer, DMC_ListerEtDeclarer
Menu, SyntheseDMCMenu, Add, &Déclarer le cas suivant, AfficherSyntheseProchaineDeclaration
Menu, SyntheseDMCMenu, Add, &Ne pas déclarer ce cas, DMC_NePasDeclarerCeCas
Menu, SyntheseDMCMenu, Add, &Afficher la biologie, DMC_BiologiePatient


Menu, RdVwinChoixRapideMedecin, Add, Ma Consult, ChoixRapideConsult
Menu, RdVwinChoixRapideMedecin, Add, % dr_1, ChoixRapideConsult
Menu, RdVwinChoixRapideMedecin, Add, % dr_2, ChoixRapideConsult
Menu, RdVwinChoixRapideMedecin, Add, % cs_int, ChoixRapideConsult


Menu, SyntheseRdvwinMenu, Add, &Afficher la biologie, Rdvwin_BiologiePatient

Menu, Tray, Nostandard
Menu, Tray, Add, Relancer, ReloadScript
Menu, Tray, Add, WinSpy, LaunchWinSpy
if ((A_IsCompiled && InStr(A_AhkPath, "Internes CEIP")) || (!A_IsCompiled && InStr(A_ScriptFullPath, "Internes CEIP")))
	Menu, Tray, Add, Copie locale, InstallLocalCopy
Menu, Tray, Add
Menu, Tray, Add, Applications XWay, :XWayApplications
Menu, Tray, Add
Menu, Tray, standard
Menu, Tray, Default, Relancer
Menu, Tray, Tip, Logon Helper


StartXWay(XWayApp){
	if(XWayApp = "Logon")
		Run, % "C:\Program Files\SynchroMck\reference_prod\SynchroMcK_Client.exe"
	else if(XWayApp = "DMC")
		Run, "N:\DMC.exe"
	else if(XWayApp = "Planning")
		Run, "N:\rdvwin.exe"
	else if(XWayApp = "Services")
		Run, "N:\unit.exe"
}

;If !WinExist("ahk_exe chrome.exe")
;	Run, %userprofile%\AppData\Local\Google\Chrome\Application\chrome.exe


UFs:={"Gravenoire":2848, "Pariou":2845, "Berlioz":2838, "Ravel":2837, "Domes":2846, "UHDL":3852, "UHCD":3111, "Chaumiere":3221, "Chopin":2835, "HDJ Sismo-Esket":3855}

;clipboard := manipulateKey(manipulateKey(manipulateKey("bouh", true), true), true)
;MsgBox, % clipboard
;MsgBox, % manipulateKey(manipulateKey(manipulateKey(clipboard)))

;return

;#Include %A_ScriptDir%\Activite-EHLSA-Gui.ahk
;Hotkey, IfWinActive, 

AutoStartLogon:
if (A_IsCompiled){
	if (!InStr(A_AhkPath, "Internes CEIP")){
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run\, AutoLogon, % """" A_AhkPath """"
	}
} else {
	if (!InStr(A_ScriptFullPath, "Internes CEIP")){
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run\, AutoLogon, % """" A_AhkPath """ """ A_ScriptFullPath """"
	}
}
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
	ControlGetText, logon_id, % Edit4ID ? "Edit2" : "Edit1", ahk_id %hLogonRef%
	if (!logon_id){
		logon_id := user ? user : username
		StringUpper, logon_id, logon_id
		ControlSetText, % Edit4ID ? "Edit2" : "Edit1", % logon_id, ahk_id %hLogonRef%
	}
	;tooltip, % logon_id " " user " " Edit4ID
	if (temp_key := GetRValue(manipulateKey(logon_id, true))){
		ControlSetText, % Edit4ID ? "Edit3" : "Edit2", % manipulateKey(StrSplit(temp_key, "|")[1]), ahk_id %hLogonRef%
		ControlFocus, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
		Send {enter}
	} else {
		ControlGetText, logon_pwd, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
		if (logon_pwd)
			Send {Enter}
	}
	return
	
Auto_DMC:
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
	Send %UF_service%
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
	if (FileExist("n:\rdvwin.exe")){
		Run, n:\rdvwin.exe
	} else {
		WinWait Plan de travail ahk_exe logon.exe,, 10
		Sleep 10
		Send {Home}
		Send USV2 R
		Sleep 10
		Send {Enter}
	}
	return
Cs_2:
	WinWaitActive Choix du planning ahk_exe rdvwin.exe
	Send {tab 2}
	Sleep 10
	if (planning_type == "Planning Service")
		Send {down 3}
	else if (planning_type == "Planning Médecin")
	{}
	else if (planning_type == "Planning SAS")
		send {down 2}
	else
		Send %planning_type%
	Sleep 10
	Send {tab}
	Sleep 10
	Send %planning%
	Sleep 10
	Send {enter}
	return
	
Auto_dr_1:
	Gosub Cs_1
Cs_2_dr_1:
	WinWaitActive Choix du planning ahk_exe rdvwin.exe
	Sleep 10
	Send {tab 3}
	Sleep 10
	Send %dr_1%
	Gosub Cs_3
	return
	
Auto_dr_2:
	Gosub Cs_1
Cs_2_dr_2:
	WinWaitActive Choix du planning ahk_exe rdvwin.exe
	Sleep 10
	Send {tab 3}
	Sleep 10
	Send %dr_2%
	Gosub Cs_3
	return
	
Auto_cs_moi:
	if (username) {
		dr_2_bak := dr_2
		dr_2 := RegExReplace(substr(username, 2), "\d" )
	}
	Gosub Cs_1
	Gosub Cs_2_dr_2
	dr_2 := dr_2_bak
	return


Cs_2_int:
	WinWait Choix du planning ahk_exe rdvwin.exe,, 10
	WinWaitActive Choix du planning ahk_exe rdvwin.exe
	Sleep 10
	Send {tab 3}
	Sleep 10
	Send %cs_int%
	Gosub Cs_3
	return
Auto_cs_int:
	Gosub Cs_1
	Gosub Cs_2_int
	Gosub Cs_3
	return
	
Cs_3:
	Sleep 10
	Send {enter}
	WinWait, Planning de ahk_exe rdvwin.exe,, 10
	Send !f
	Sleep 10
	Send h
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
	
Auto_Ambu_Service_1:
	Gosub Cs_1
	planning_type = Planning Service
	planning := Ambu_Service_1
	Gosub CS_2
	Gosub CS_3
	return

Auto_Ambu_Service_2:
	Gosub Cs_1
	planning_type = Planning Service
	planning := Ambu_Service_2
	Gosub CS_2
	Gosub CS_3
	return

Auto_Ambu_Sismo_Planning:
	Gosub Cs_1
	planning_type = Planning Service
	planning := "SISMO-"
	Gosub CS_2
	Gosub CS_3
	return

Auto_Ambu_Sismo_Consult:
	Gosub Cs_1
	planning_type = Planning Service
	planning := "PSY - CS NEU"
	Gosub CS_2
	Gosub CS_3
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
	MouseGetPos,,, hUnderMouseWin, hUnderMouseCtrl, 2
	Winget, nameUnderMouseWin, ProcessName, ahk_id %hUnderMouseWin%
	;		Tooltip, % nameUnderMouseWin " id: " hUnderMouseWin
	switch nameUnderMouseWin
	{
		case "logon.exe":
			if (!LogonPwdGuihWnd || !WinExist("ahk_id " LogonPwdGuihWnd)){
				Gosub CreateLogonPwdGui
				;Ttip(nameUnderMouseWin)
				WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
				ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
				ControlGetPos, LogonPwdX, LogonPwdY, LogonPwdW, , % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
				Gui, LogonPwd:+owner%hLogonRef% +Parent%hLogonRef%
				LogonPwdX := LogonPwdX - 170
				LogonPwdY := LogonPwdY - 52
				if (LogonPwdX && LogonPwdY){
					Gui LogonPwd:Show, x%LogonPwdX% y%LogonPwdY% h80 w434, Window
				}
				ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
				ControlFocus, % Edit4ID ? "Edit2" : "Edit1", ahk_id %hLogonRef%
				Control, Hide,, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
			} else {
				ResizeAttempts := 0
				SetTimer, ResizeLogonPwd, 50
				GuiControlGet, hLogonPwdEdit, LogonPwd:hWnd, LogonPwdVal
				if (hUnderMouseCtrl == hLogonPwdEdit){
					ControlFocus, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
					ControlFocus, , ahk_id %hUnderMouseCtrl%
				}
				return
			}
			return
		case "DMC.exe":
			Goto CreateMenuAutom
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

#ifWinActive, Formulaire ahk_exe unit.exe
~LButton::
	FormulaireWindow = Formulaire ahk_exe unit.exe
	Gosub ResizeFormulaire
	return
	
#ifWinActive, Modification de l'observation ahk_exe rdvwin.exe
;'
	Hotkey, IfWinActive, Modification de l'observation ahk_exe unit.exe
	;'
	Loop, 75
	{
		Hotkey, % "~" Chr(0x2F + A_Index), CopyCurrentObserv
	}
	Hotkey, ~Space, CopyCurrentObserv
	Hotkey, ~Enter, CopyCurrentObserv
	Hotkey, ~Backspace, CopyCurrentObserv
	Hotkey, ^!v, PasteCurrentObserv
	Hotkey, ^BackSpace, CtrlBackspace
	;Hotkey, ^Del, CtrlDel
	;Hotkey, ^+Del, CtrlMajDel
	Hotkey, If
	return
	
CopyCurrentObserv:
	ControlGetText, Observ_text, TWPRichText1, Modification de l'observation ahk_exe unit.exe
	;'
	return

PasteCurrentObserv:
	ControlSetText, TWPRichText1, % Observ_text, Modification de l'observation ahk_exe unit.exe
	;'
	return
	
#ifWinActive, Identification ahk_exe unit.exe
~LButton::
	WinGet, IdentifhWnd, ID
	Winset, Style, -0x40000000, ahk_id %IdentifhWnd%
	MouseGetPos,,,, CtrlhWnd, 2
	;WinGetClass, bah, ahk_id %CtrlhWnd%
	;Tooltip, bouh %CtrlhWnd% %bah%
	Control, Enable,,, ahk_id %CtrlhWnd%
	return

#ifWinActive, Formulaire ahk_exe rdvwin.exe
~LButton::
	FormulaireWindow = Formulaire ahk_exe rdvwin.exe
	Gosub ResizeFormulaire
	return
	

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
			Gui, Transport:Show, x%TransportX%  y%TransportY% AutoSize, Window
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
	Hotkey, ^!v, PasteCurrentMemo
	Hotkey, ^s, SaveCurrentMemo
	Hotkey, ^BackSpace, CtrlBackspace
	Hotkey, ^a, SelectAllText
	Hotkey, ^Del, CtrlDel
	Hotkey, ^+Del, CtrlMajDel
	Hotkey, If
	Control, Enable,, TDateTimePicker1, %FormulaireWindow%
	;ToolTip, % Memo_text
	return

SaveCurrentMemo:
	ControlClick, TMcKButton2, %FormulaireWindow%
	Sleep 2000
	ControlClick, TCwSpeedButton2, Modification de l'observation ;'
	return


CtrlBackspace:
	Send, ^+{Left}
	Send {Del}
	return

CtrlDel:
	Send, ^+{Right}
	Send {Del}
	return

CtrlMajDel:
	Send, +{End}
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

#IfWinActive, Création d'un rendez-vous par actes ahk_exe rdvwin.exe ;'
F6::
	;ControlGetText, TMcKGroupBox1, Création d'un rendez-vous par actes ahk_exe rdvwin.exe
	ControlClick, TMcKButton17, Création d'un rendez-vous par actes ahk_exe rdvwin.exe ;'
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
	ControlClick, Valider, Création d'un rendez-vous par actes ahk_exe rdvwin.exe ;'
	return


#IfWinActive, CrossWay winword.exe
F7::Goto CRSynthSplitScreen


#IfWinActive,Planning de ahk_exe rdvwin.exe
^f::
	Send !p
	Send r
	return

;     ___ _                   _        _                        _ _ 
;    / _ \ | __ _ _ __     __| | ___  | |_ _ __ __ ___   ____ _(_) |
;   / /_)/ |/ _` | '_ \   / _` |/ _ \ | __| '__/ _` \ \ / / _` | | |
;  / ___/| | (_| | | | | | (_| |  __/ | |_| | | (_| |\ V / (_| | | |
;  \/    |_|\__,_|_| |_|  \__,_|\___|  \__|_|  \__,_| \_/ \__,_|_|_|
;                                                                   

;  ██████  ██       █████  ███    ██     ██████  ███████     ████████ ██████   █████  ██    ██  █████  ██ ██      
;  ██   ██ ██      ██   ██ ████   ██     ██   ██ ██             ██    ██   ██ ██   ██ ██    ██ ██   ██ ██ ██      
;  ██████  ██      ███████ ██ ██  ██     ██   ██ █████          ██    ██████  ███████ ██    ██ ███████ ██ ██      
;  ██      ██      ██   ██ ██  ██ ██     ██   ██ ██             ██    ██   ██ ██   ██  ██  ██  ██   ██ ██ ██      
;  ██      ███████ ██   ██ ██   ████     ██████  ███████        ██    ██   ██ ██   ██   ████   ██   ██ ██ ███████ 
;                                                                                                                 
;                                                                                                                 

#ifwinactive Plan de travail ahk_exe logon.exe
^r::Reload

@::
²::
	Gosub Auto_%auto_open%
	return

&::
	GoSub Logon_Login
	Gosub Cs_1
	GoSub Cs_2
	Gosub Cs_3
	return

RButton::
	Menu, MenuPlandetravail, Show
	return

Auto_UF_service:
	PdT_AfficherService(UF_service)
	return

PdT_AfficherService(NomService){
	global UFs, UF_bis, OpenInCurrentWindow, UF_service
	if(!(NomService > 0 && NomService < 10000)){
		if (NomService == "Chaumière"){
			NomService = Chaumiere
		}
		if (NomService == "Mon service"){
			UF_bis := UF_service
		} else
			UF_bis := UFs[NomService]
	} else {
		UF_bis := NomService
	}
	if (UF_bis){
		if(!OpenInCurrentWindow){
			Run, "n:\unit.exe"
		} else {
			OpenInCurrentWindow := false
			Sleep 50
			ControlClick, Planning, A		
			Sleep 300
		}
		Gosub Unit_2_bis
	} else {
		if (NomService == "Urgences"){
			Gosub auto_urg
		}
	}
}

PdT_AfficherCs(PlanningCs){
	global
	;if (WinExist("Plan de travail ahk_exe logon.exe")){
	;	WinActivate, Plan de travail ahk_exe logon.exe
	;} else {
	;	StartXWay("Logon")
	;	return
	;}
	if(PlanningCs == cs_int)
		GoSub Auto_cs_int
	else if (PlanningCs == dr_1)
		Gosub Auto_dr_1
	else if (PlanningCs == dr_2)
		Gosub Auto_dr_2
	else if (PlanningCs == "Ma consult")
		GoSub Auto_cs_moi
	else if (PlanningCs == Ambu_Service_1)
		GoSub Auto_Ambu_Service_1
	else if (PlanningCs == Ambu_Service_2)
		GoSub Auto_Ambu_Service_2
	else if (PlanningCs == "Sismo")
		GoSub Auto_Ambu_Sismo_Planning
	else if (PlanningCs == "CS Sismo-Esket")
		GoSub Auto_Ambu_Sismo_Consult
	else
		Gosub Cs_1
}


#ifwinactive LOGON - M-Référence ahk_exe logon.exe
~tab::
	WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
	ControlGetFocus, InputFocused, ahk_id %hLogonRef%
	ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
	;Tooltip, % InputFocused == (Edit4ID ? "Edit3" : "Edit2")
	if (InputFocused == (Edit4ID ? "Edit3" : "Edit2")){
		GuiControl, LogonPwd:Focus, LogonPwdVal
	}
	return

^r::Reload

&::
	GoSub Logon_Login
	Gosub Cs_1
	Gosub Cs_2_int
	return


Auto_logon:
²::
	GoSub Logon_Login
	Gosub Auto_%auto_open%
	;Gosub Cs_1
	;Gosub Cs_2_dr_1
	;Gosub Planning_semaine
	;Gosub Unit_1
	;Gosub Unit_2
	return

ResizeLogonPwd:
	if (ResizeAttempts > 4){
		Settimer, ResizeLogonPwd, Off
	}
	WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
	if (hLogonRef){
		ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
		ControlGetPos, LogonPwdX, LogonPwdY, LogonPwdW, , % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
		LogonPwdX := LogonPwdX - 170
		LogonPwdY := LogonPwdY - 52
		if(LogonPwdX && LogonPwdY){
			Gui LogonPwd:Show, x%LogonPwdX% y%LogonPwdY%, Window
		}
	}
	ResizeAttempts++
	return

#if

;   __                 _               
;  / _\ ___ _ ____   _(_) ___ ___  ___ 
;  \ \ / _ \ '__\ \ / / |/ __/ _ \/ __|
;  _\ \  __/ |   \ V /| | (_|  __/\__ \
;  \__/\___|_|    \_/ |_|\___\___||___/
;                                      
;  ███████ ███████ ██████  ██    ██ ██  ██████ ███████ ███████ 
;  ██      ██      ██   ██ ██    ██ ██ ██      ██      ██      
;  ███████ █████   ██████  ██    ██ ██ ██      █████   ███████ 
;       ██ ██      ██   ██  ██  ██  ██ ██      ██           ██ 
;  ███████ ███████ ██   ██   ████   ██  ██████ ███████ ███████ 
;                                                              
;                                                              


#ifwinactive Plan de travail ahk_exe logon.exe
:*:gra::
	PdT_AfficherService("Gravenoire")
	return
	
:*:par::
	PdT_AfficherService("Pariou")
	return

:*:berl::
	PdT_AfficherService("Berlioz")
	return

:*:rav::
	PdT_AfficherService("Ravel")
	return

:*:dom::
	PdT_AfficherService("Domes")
	return

:*:uhd::
	PdT_AfficherService("UHDL")
	return

:*:cho::
	PdT_AfficherService("Chaumiere")
	return

:*:cha::
	PdT_AfficherService("Chopin")
	return

:*:uhc::
	PdT_AfficherService("UHCD")
	return
	
:*:sis::
	PdT_AfficherCs("Sismo")
	return
	
auto_urg:
:*:urg::
	Gosub Cs_1
	planning_type = Planning SAS
	planning_bak := planning
	planning = URG
	Sleep 10
	Gosub Cs_2
	planning := planning_bak
	planning_type = Planning Service
	return

	
:*:int::
	Gosub Cs_1
	Gosub Cs_2_int
	return

auto_aucun:
	return

#if
    

;  ██████  ██████  ██    ██ ██     ██ ██ ███    ██ 
;  ██   ██ ██   ██ ██    ██ ██     ██ ██ ████   ██ 
;  ██████  ██   ██ ██    ██ ██  █  ██ ██ ██ ██  ██ 
;  ██   ██ ██   ██  ██  ██  ██ ███ ██ ██ ██  ██ ██ 
;  ██   ██ ██████    ████    ███ ███  ██ ██   ████ 
;                                                  
;                                                  
;  ____/\\\\\\\\\______/\\\\\\\\\\\\_____/\\\________/\\\__/\\\______________/\\\__/\\\\\\\\\\\__/\\\\\_____/\\\_        
;   __/\\\///////\\\___\/\\\////////\\\__\/\\\_______\/\\\_\/\\\_____________\/\\\_\/////\\\///__\/\\\\\\___\/\\\_       
;    _\/\\\_____\/\\\___\/\\\______\//\\\_\//\\\______/\\\__\/\\\_____________\/\\\_____\/\\\_____\/\\\/\\\__\/\\\_      
;     _\/\\\\\\\\\\\/____\/\\\_______\/\\\__\//\\\____/\\\___\//\\\____/\\\____/\\\______\/\\\_____\/\\\//\\\_\/\\\_     
;      _\/\\\//////\\\____\/\\\_______\/\\\___\//\\\__/\\\_____\//\\\__/\\\\\__/\\\_______\/\\\_____\/\\\\//\\\\/\\\_    
;       _\/\\\____\//\\\___\/\\\_______\/\\\____\//\\\/\\\_______\//\\\/\\\/\\\/\\\________\/\\\_____\/\\\_\//\\\/\\\_   
;        _\/\\\_____\//\\\__\/\\\_______/\\\______\//\\\\\_________\//\\\\\\//\\\\\_________\/\\\_____\/\\\__\//\\\\\\_  
;         _\/\\\______\//\\\_\/\\\\\\\\\\\\/________\//\\\___________\//\\\__\//\\\_______/\\\\\\\\\\\_\/\\\___\//\\\\\_ 
;          _\///________\///__\////////////___________\///_____________\///____\///_______\///////////__\///_____\/////__


#ifwinactive Choix du planning ahk_exe rdvwin.exe
&::
	GoSub Cs_2
	return
	
²::
	Send {tab 2}
	Sleep 10
	Send %UF_service%
	Sleep 10
	Send {enter}
	return
	
#ifwinactive Planning de ahk_exe rdvwin.exe
v::
	Gosub Planning_semaine
	return

#IfWinActive, ahk_exe rdvwin.exe
WaitForBarcode:
F4::
	if (WinActive("Planning de")){
		Send !f
		Send s
		Sleep 100
		Send !p
		Send r
		WinWait Recherche ahk_exe rdvwin.exe,,5
		if (ErrorLevel)
			return
		Sleep 1000
	}
	WinActivate, Recherche ahk_exe rdvwin.exe
	Controlfocus, TComboBox1, Recherche ahk_exe rdvwin.exe
	Send {Home}
	Send {down}
	Send +{tab}
	if (CheckCurrentIPP){
		ControlSetText, TEdit3, , Recherche ahk_exe rdvwin.exe
		ControlSetText, TEdit1, % CheckCurrentIPP, Recherche ahk_exe rdvwin.exe
		;Send %CheckCurrentIPP%
		Send {Enter}
		CheckCurrentIPP := ""
		Goto OuvrirSynthFromIPP
	}
	return


OuvrirSynthFromIPP:
~Enter::
	hRechercheRdvWin := WinExist("Recherche ahk_exe rdvwin.exe")
	Controlgetfocus, CurrentControlFocus, ahk_id %hRechercheRdvWin%
	if (CurrentControlFocus == "TEdit1"){
		if (CheckCurrentIPP)
			CheckCurrentIPP := ""
		Creation_Liste_Declaration_CEIP := true
		Controlfocus, fpSpread601, ahk_id %hRechercheRdvWin%
		Send {PgDn}
		Sleep 500
		ControlClick, Sélectionner, ahk_id %hRechercheRdvWin%
		WinWaitActive, Planning de ahk_exe rdvwin.exe,,15
		if (ErrorLevel)
			return
		Sleep 100
		Send !d
		Send y
		WinWait Synthèse ahk_exe rdvwin.exe,,5
		if (ErrorLevel)
			return
		Sleep 5000
		hSynth := WinExist("Synthèse ahk_exe rdvwin.exe")
		ControlGetText, Patient_IPP, TStaticText7, ahk_id %hSynth%
		if (StrSplit(Patient_IPP, "/")[2])
			ControlGetText, Patient_IPP, TStaticText9, ahk_id %hSynth%
		if(!VerifierDeclarationAnterieure(Patient_IPP))
			return
		WinWaitClose Synthèse ahk_exe rdvwin.exe
		if (ErrorLevel)
			return
		Sleep 100
		WinWaitActive, Planning de ahk_exe rdvwin.exe,,5
		if (ErrorLevel)
			return
		Sleep 100
		Gosub WaitForBarcode
	}
	return

#IfWinActive, ahk_exe rdvwin.exe
+Space::
~Space::
	if (WinActive("Synthèse")){
	CheckCurrentIPP := ""
	hSynth := WinExist("Synthèse ahk_exe rdvwin.exe")
		ControlGetText, Patient_IPP, TStaticText7, ahk_id %hSynth%
		if (StrSplit(Patient_IPP, "/")[2]){
			ControlGetText, Patient_IPP, TStaticText9, ahk_id %hSynth%
			ControlGetText, Patient_NomPrenom, TStaticText5, ahk_id %hSynth%
			ControlGetText, Patient_DDN, TStaticText7, ahk_id %hSynth%
		} else {
			ControlGetText, Patient_NomPrenom, TStaticText3, ahk_id %hSynth%
			ControlGetText, Patient_DDN, TStaticText5, ahk_id %hSynth%
		}
		if (!VerifierDeclarationAnterieure(Patient_IPP))
			return
		FormatTime, DateDuJour, , yyyy-MM-dd
		ClipboardBack := Clipboard
		Clipboard := ""
		Send ^c
		Sleep 100
		Motif :=  RegExReplace(clipboard,"(\r|\n)","") "`t" (GetKeyState("shift") ? "X" : " ") "`r`n"
		FileAppend, % Patient_IPP "`t" Patient_NomPrenom "`t" Patient_DDN "`t" Motif, \\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\Urgences\Liste_%DateDuJour%.txt
		Clipboard := ClipboardBack
		WinClose, ahk_id %hSynth%
	}
	return


MButton::
	if (WinActive("Planning de URG ahk_exe rdvwin.exe")){
		Click
		Sleep 10
		ControlClick, Synthèse, Planning de URG ahk_exe rdvwin.exe
		WinWait Synthèse ahk_exe rdvwin.exe,, 30
		Sleep 100
		WinActivate Synthèse ahk_exe rdvwin.exe
		WinGet, hSynthRdv, ID, A
		WinActivate, Planning de URG ahk_exe rdvwin.exe
		Send !e
		Sleep 100
		Send e
		Sleep 1500
		WinMove, ahk_id %hSynthRdv%,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
		WinMove, Planning de URG ahk_exe rdvwin.exe,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
		;ControlGet, hPatient_NomPrenom, hWnd,, % "(né(e)", ahk_id %hSynthRdv%
		SetTitlematchmode, 2
		ControlGet, hPatient_NomPrenom, hWnd,, % "(né(e)", Synthèse ahk_exe rdvwin.exe
		WinGetPos, Patient_NomPrenom_X, Patient_NomPrenom_Y,,, ahk_id %hPatient_NomPrenom%
		Coordmode, Mouse, Screen
		MouseGetPos, Current_X, Current_Y
		MouseMove, Patient_NomPrenom_X, Patient_NomPrenom_Y, 0
		MouseGetPos,,,, Patient_NomPrenom_ClassNN
		MouseMove, C_X, C_Y, 0
		ControlGetText, Patient_NomPrenom,, ahk_id %hPatient_NomPrenom%
		ControlGetText, Patient_Age, TStaticText6, ahk_id %hSynthRdv%
		ControlGetText, Patient_Sexe, TStaticText4, ahk_id %hSynthRdv%
		Patient_Prenom := StrSplit(Patient_NomPrenom, ")")[3]
		Patient_Nom := StrSplit(Patient_NomPrenom, " (")[1]
		Clipboard := Trim(Patient_Nom) . "|" . Format("{:T}",Trim(Patient_Prenom)) . "|" . Patient_Age "|" Patient_Sexe
	}
	return

~MButton up::
~RButton up::
	MouseGetPos, , , , hControlUnderMouse, 2
	MouseGetPos, , , , clControlUnderMouse, 1
	ControlGet, ControlUnderMouse_Enabled, Enabled,, , ahk_id %hControlUnderMouse%
	ControlGetText, ControlUnderMouse_Text, , ahk_id %hControlUnderMouse%
	;WinGetClass, clControlUnderMouse, ahk_id %hControlUnderMouse%
	;Ttip(ControlUnderMouse_Text " " clControlUnderMouse)
	if (WinActive("Recherche ahk_exe rdvwin.exe")){
		Click
		Sleep 10
		ControlClick, Sélectionner, Recherche ahk_exe rdvwin.exe
		WinWaitActive, Planning de ahk_exe rdvwin.exe
		Sleep 1000
		;if (A_thisHotkey == "~RButton up"){
		;	Send !e
		;	Sleep 100
		;	Send e
		;}
		Send !d
		Sleep 100
		Send y
	} else if ((hRdVWin_Synth := WinActive("Synthèse ahk_exe rdvwin.exe"))){
		MouseGetPos, , , , hSyntheseControlClick, 2
		ControlGet, hSyntheseControlName, Hwnd, , (né(e), Synthèse ahk_exe rdvwin.exe
		;tooltip, % SyntheseControlName
		if (hSyntheseControlClick == hSyntheseControlName){
			if (A_thisHotkey == "~MButton up"){
				ControlGetText, Patient_Nom_Prenom, , ahk_id %hSyntheseControlName%
				;ControlGetText, Patient_Age, TStaticText10, ahk_id %hDMC_Dossier%
				ControlGetText, Patient_Age, % " ans", ahk_id %hRdVWin_Synth%
				ControlGetText, Patient_Sexe, TStaticText4, ahk_id %hRdVWin_Synth%
				Patient_Prenom := StrSplit(Patient_Nom_Prenom, ") ")[3]
				Patient_Nom := StrSplit(Patient_Nom_Prenom, " (")[1]
				Clipboard := Trim(Patient_Nom) . "|" . Format("{:T}",Trim(Patient_Prenom)) . "|" . Patient_Age "|" Patient_Sexe
			} else if (A_thisHotkey == "~RButton up"){
				Goto MenuSyntheseRdvwinShow
			}
		}
	} else if (!ControlUnderMouse_Enabled){
		if (!DisabledControlMenu_Created){
			Menu, DisabledControlMenu, Add, &Activer l'item, EnableControlUnderMouse ;'
			DisabledControlMenu_Created := true
		}
		Menu, DisabledControlMenu, Show
	} else if(WinActive("Planning de ahk_exe rdvwin.exe")){
		if(ControlUnderMouse_Text = "Actes"){
			Click
			WinWaitActive, Maincare Solutions - Saisie Rapide ahk_exe rdvwin.exe,, 10
			if ErrorLevel
				Return
			hSaisieActes := WinExist("Maincare Solutions - Saisie Rapide ahk_exe rdvwin.exe")
			WinActivate, ahk_id %hSaisieActes%
			Sleep 500
			WinGetClass, clSaisiesActes, ahk_id %hSaisieActes%
			SaisieActesRevision := % StrSplit(clSaisiesActes, "_")[2]
			;Ttip(hControlUnderMouse)
			ControlClick, % "WindowsForms10.SysTreeView32.app.0.aec740_" SaisieActesRevision "_ad11", ahk_id %hSaisieActes%
			ControlSend, % "WindowsForms10.SysTreeView32.app.0.aec740_" SaisieActesRevision "_ad11", {Home}, ahk_id %hSaisieActes%
			ControlSend, % "WindowsForms10.SysTreeView32.app.0.aec740_" SaisieActesRevision "_ad11", {Enter}, ahk_id %hSaisieActes%
			ControlSetText, % "WindowsForms10.EDIT.app.0.aec740_" SaisieActesRevision "_ad14", % logon_id ? logon_id : username
			ControlSend, % "WindowsForms10.EDIT.app.0.aec740_" SaisieActesRevision "_ad14", {Enter}
			ControlSetText, % "WindowsForms10.EDIT.app.0.aec740_" SaisieActesRevision "_ad17", 4310CE
			ControlSend, % "WindowsForms10.EDIT.app.0.aec740_" SaisieActesRevision "_ad17", {Enter}
			ControlSetText, % "WindowsForms10.EDIT.app.0.aec740_" SaisieActesRevision "_ad16", 4310
			ControlSend, % "WindowsForms10.EDIT.app.0.aec740_" SaisieActesRevision "_ad16", {Enter}
			Control, Check,, % "WindowsForms10.BUTTON.app.0.aec740_" SaisieActesRevision "_ad114",  ahk_id %hSaisieActes%
		} else if(clControlUnderMouse = "TGFXComboBox1"){
			Menu, RdVwinChoixRapideMedecin, Show
		}
	}
	return

EnableControlUnderMouse:
	Control, Enable, ,, ahk_id %hControlUnderMouse%
	return

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


NoHotkey:
	return


ChoixRapideConsult(Nom_Medecin){
	Ttip(Nom_Medecin)
	if (Nom_Medecin = "Ma Consult"){
		Nom_Medecin := RegExReplace(substr(username, 2), "\d" ) " " substr(username, 1, 1)
		;TGFXComboBox1
	}
	ControlFocus, TGFXComboBox1, A
	ControlSend, TGFXComboBox1, % Nom_Medecin, A
	Sleep 500
	Send, !f
	Send, h
	return
}


;  ██████  ███    ███  ██████ 
;  ██   ██ ████  ████ ██      
;  ██   ██ ██ ████ ██ ██      
;  ██   ██ ██  ██  ██ ██      
;  ██████  ██      ██  ██████ 
;                             
;                             
;  __/\\\\\\\\\\\\_____/\\\\____________/\\\\________/\\\\\\\\\_        
;   _\/\\\////////\\\__\/\\\\\\________/\\\\\\_____/\\\////////__       
;    _\/\\\______\//\\\_\/\\\//\\\____/\\\//\\\___/\\\/___________      
;     _\/\\\_______\/\\\_\/\\\\///\\\/\\\/_\/\\\__/\\\_____________     
;      _\/\\\_______\/\\\_\/\\\__\///\\\/___\/\\\_\/\\\_____________    
;       _\/\\\_______\/\\\_\/\\\____\///_____\/\\\_\//\\\____________   
;        _\/\\\_______/\\\__\/\\\_____________\/\\\__\///\\\__________  
;         _\/\\\\\\\\\\\\/___\/\\\_____________\/\\\____\////\\\\\\\\\_ 
;          _\////////////_____\///______________\///________\/////////__


#ifwinactive ahk_exe DMC.exe
;Obtention des infos du patient sous format Nom|Prénom|Age|Sexe avec première lettre (exemple : N|P|20|F)
^r::Reload

F4::
	WinGet, hDMC_Dossier, ID, Gestion des dossiers ahk_exe dmc.exe
	WinActivate, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Nom, TStaticText6, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Prenom, TStaticText5, ahk_id %hDMC_Dossier%
	;ControlGetText, Patient_Age, TStaticText10, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Age, % " ans", ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Sexe, TStaticText1, ahk_id %hDMC_Dossier%
	Clipboard := Trim(Patient_Nom) . "|" . Format("{:T}",Trim(Patient_Prenom)) . "|" . Patient_Age "|" Patient_Sexe
	return

AfficherSyntheseProchaineDeclaration:
F3::
	if (WinActive("Gestion des dossiers")){
		if (!DerniereListeADeclarer_File){
			DerniereListeADeclarer := ""
			Loop, Files, \\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\*.txt, R
			{
				if (InStr(A_LoopFilePath, "\Declarations\Autres")){
					Continue
				}
				FileNameEndString := SubStr(A_LoopFileName, -6, 3)
				if (FileNameEndString != "- X" && FileNameEndString != "..."){
					DerniereListeADeclarer := A_LoopFilePath
					DerniereListeADeclarer_FileName := A_LoopFileName
					DerniereListeADeclarer_Folder := A_LoopFileDir
					;Ttip(DerniereListeADeclarer_Folder "\" DerniereListeADeclarer_FileName)
					break
				}
			}
			Ttip(DerniereListeADeclarer)
			DerniereListeADeclarer_File := FileOpen(DerniereListeADeclarer, "rw `n")
		} else {
			DerniereListeADeclarer_File.Seek(-3, 1)
			DerniereListeADeclarer_File.Write((DMC_NePasDeclarerCeCas_Bool ? "?" : "X") . "`r`n")
			DMC_NePasDeclarerCeCas_Bool := false
		}
		while ((DerniereListeADeclarer_Line := DerniereListeADeclarer_File.ReadLine())){
			CurrentDeclaration_Array := StrSplit(DerniereListeADeclarer_Line, "`t")
			CurrentDeclaration_IPP := CurrentDeclaration_Array[1]
			CurrentDeclaration_Done := substr(DerniereListeADeclarer_Line, -1, 1) != " "
			CurrentDeclaration_Motif := CurrentDeclaration_Array[4]
			;ToolTip, % CurrentDeclaration_IPP  "`n" CurrentDeclaration_Motif "`n" CurrentDeclaration_Done
			;Sleep 100
			Ttip(CurrentDeclaration_Motif, 10, A_ScreenWidth*3/4, 5)
			if (CurrentDeclaration_Done){
				Continue
			} else {
				WinActivate, Gestion des dossiers ahk_exe dmc.exe
				Send !d
				Send r
				WinWait Recherche ahk_exe dmc.exe,,5
				if ErrorLevel
					return
				Sleep 500
				;ControlFocus, TEdit4, Recherche ahk_exe dmc.exe
				ControlSetText, TEdit4, % CurrentDeclaration_IPP, Recherche ahk_exe dmc.exe
				ControlClick, Rechercher, Recherche ahk_exe dmc.exe
				;Send %CurrentDeclaration_IPP%
				;Send {Enter}
				if(0){
					Controlfocus, fpSpread602, Recherche ahk_exe dmc.exe
					Send {PgDn}
					ControlClick, Sélectionner, Recherche ahk_exe dmc.exe
					WinWait, Gestion des dossiers ahk_exe dmc.exe,,5
					if ErrorLevel
						return
					Sleep 500
					Send !m
					Send s
				} else {
					Goto AfficherSyntheseSelectionPatient
				}
				Break
			}
		}
		if (DerniereListeADeclarer_File && DerniereListeADeclarer_File.AtEOF){
			DerniereListeADeclarer_File.Seek(0, 0)
			DerniereListeADeclarer_Completed := 1
			while ((DerniereListeADeclarer_Line := DerniereListeADeclarer_File.ReadLine())){
				if (SubStr(DerniereListeADeclarer_Line, -1, 1) = "X"){
					Continue
				} else if (SubStr(DerniereListeADeclarer_Line, -1, 1) = "?"){
					DerniereListeADeclarer_Completed := 2
				} else {
					DerniereListeADeclarer_Completed := 0
					break
				}
			}
			DerniereListeADeclarer_File.Close()
			DerniereListeADeclarer_File := ""
			if (DerniereListeADeclarer_Completed)
			{
				FileMove, % DerniereListeADeclarer_Folder "\" DerniereListeADeclarer_FileName, % DerniereListeADeclarer_Folder "\" SubStr(DerniereListeADeclarer_FileName, 1,-4) " - " (DerniereListeADeclarer_Completed == 2 ? "..." : "X") ".txt"
				MsgBox, Déclarations terminées pour la %DerniereListeADeclarer%
			}
		}
	} else if (WinActive("Synthèse")){
		DMC_NePasDeclarerCeCas_Bool := false
		WinClose, Synthèse ahk_exe dmc.exe
		WinWaitActive, Gestion des dossiers ahk_exe dmc.exe,,5
		if ErrorLevel
			return
		SetTimer, AfficherSyntheseProchaineDeclaration, -100
	}
	return

DMC_NePasDeclarerCeCas:
	DMC_NePasDeclarerCeCas_Bool := true
	WinClose, Synthèse ahk_exe dmc.exe
	WinWaitActive, Gestion des dossiers ahk_exe dmc.exe,,5
	if ErrorLevel
		return
	SetTimer, AfficherSyntheseProchaineDeclaration, -100
	return


F7::Goto CRSynthSplitScreen

DMC_ListerEtDeclarer:
	DMC_ListerEtDeclarer_start := true
	;WinActivate, Synthèse ahk_exe dmc.exe
	;ControlFocus, TWPRichText1, Synthèse ahk_exe dmc.exe
	;Sleep 100
	;Send {Shift down}
	;Send {Space}
	;Send {Shift up}
+Space::
~Space::
	ControlGetFocus, CurrentInputFocus
	;Ttip(WinActive("Synthèse") " `n" A_ThisHotkey)
	if (WinActive("Synthèse") && ((CurrentInputFocus = "TWPRichText1") || (CurrentInputFocus = "AVL_AVView31") || DMC_ListerEtDeclarer_start)){
		DMC_ListerEtDeclarer_start := false
		;Ttip(WinActive("Synthèse"))
		CheckCurrentIPP := ""
		hSynth := WinExist("Synthèse ahk_exe dmc.exe")
		ControlGetText, Patient_IPP, TStaticText7, ahk_id %hSynth%
		if (StrSplit(Patient_IPP, "/")[2]){
			ControlGetText, Patient_IPP, TStaticText9, ahk_id %hSynth%
			ControlGetText, Patient_NomPrenom, TStaticText5, ahk_id %hSynth%
			ControlGetText, Patient_DDN, TStaticText7, ahk_id %hSynth%
		} else {
			ControlGetText, Patient_NomPrenom, TStaticText3, ahk_id %hSynth%
			ControlGetText, Patient_DDN, TStaticText5, ahk_id %hSynth%
		}
		if (!VerifierDeclarationAnterieure(Patient_IPP)){
			DMC_ListerEtDeclarer_start := false
			return
		}
		;return
		FormatTime, DateDuJour, , yyyy-MM-dd
		ClipboardBack := Clipboard
		Clipboard := ""
		Send ^c
		Sleep 100
		Motif := RegExReplace(clipboard,"(\r|\n)","") "`t" ((GetKeyState("shift") || DMC_ListerEtDeclarer_start) ? "X" : " ") "`r`n"
		FileAppend, % Patient_IPP "`t" Patient_NomPrenom "`t" Patient_DDN "`t" Motif, \\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\Labo\Liste_%DateDuJour%.txt
		Clipboard := ClipboardBack
		WinClose, ahk_id %hSynth%
		WinWaitActive, Gestion des dossiers ahk_exe dmc.exe,, 5
		DMC_ListerEtDeclarer_start := false
		if ErrorLevel
			return
		Goto DMC_RecherchePatient
	}
	return

VerifierDeclarationAnterieure(Patient_IPP){	
	Loop, Files, \\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\*.txt, R
	{
		if (InStr(A_LoopFilePath, "\Declarations\Autres")) ; pas vérifications dans le dossier Autres qui n'est pas organisé pareil
			Continue
		if (InStr(A_LoopFilePath, "\Declarations\Scripts")) ; pas vérifications dans le dossier Scripts
			Continue
		File_CreationTime := A_LoopFileTimeCreated
		ActualTime := A_Now
		EnvSub, ActualTime, % File_CreationTime, D
		if (ActualTime > 60)
			Continue
		Loop, Read, % A_LoopFilePath
		{
			CurrentLine_IPP := StrSplit(A_LoopReadLine, "`t")[1]
			if (Patient_IPP = CurrentLine_IPP)
			{
				FormatTime, TimeString, % File_CreationTime, LongDate
				FilePathByFolder := StrSplit(A_LoopFileDir, "\")
				MsgBox, 0x104, Patient déjà déclaré, % "Patient déjà listé et déclaré le " TimeString "`ndans le fichier :`t" A_LoopFileName "`ndu dossier :`tDeclarations\" FilePathByFolder[FilePathByFolder.length()] "`nmotif :`t`t" StrSplit(A_LoopReadLine, "`t")[4] "`nFaire tout de même la déclaration ?"
				IfMsgBox Yes
					return true
				else
					return false
			}
		}
	}
	return true
}
;Déclaration addictovigilance / pharmacovigilance
AfficherSyntheseSelectionPatient:
~MButton up::
~RButton up::
	if (WinActive("Recherche ahk_exe dmc.exe")){
		Click
		Sleep 10
		ControlClick, Sélectionner, Recherche ahk_exe dmc.exe
		Sleep 1000
		WinGet, hDMC_Dossier, ID, Gestion des dossiers ahk_exe dmc.exe
		WinActivate, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Nom, TStaticText6, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Prenom, TStaticText5, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_IPP, TStaticText3, ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Age, % " ans", ahk_id %hDMC_Dossier%
		ControlGetText, Patient_Sexe, TStaticText1, ahk_id %hDMC_Dossier%
		Clipboard := Trim(Patient_Nom) . "|" . Format("{:T}",Trim(Patient_Prenom)) . "|" . Patient_Age "|" Patient_Sexe
		if (A_ThisLabel != "AfficherSyntheseSelectionPatient"){
			if (!VerifierDeclarationAnterieure(Patient_IPP))
				return
			if (A_thisHotkey == "~RButton up"){
				Send !e
				Sleep 100
				Send e
			}
		}
		WinActivate, ahk_id %hDMC_Dossier%
		Send !m
		Sleep 100
		Send s
		WinWait Synthèse ahk_exe dmc.exe,, 30
		Sleep 1500
		WinMove, Synthèse ahk_exe dmc.exe,, % A_ScreenWidth/2, 0, % A_ScreenWidth/2, % A_ScreenHeight-40
		WinMove, Gestion des dossiers ahk_exe dmc.exe,, % A_ScreenWidth/2
	} else if (WinActive("Synthèse ahk_exe dmc.exe")){
		MouseGetPos, , , , hSyntheseControlClick, 2
		ControlGet, hSyntheseControlName, Hwnd, , (né(e), Synthèse ahk_exe dmc.exe
		;tooltip, % SyntheseControlName
		if (hSyntheseControlClick == hSyntheseControlName){
			if (A_thisHotkey == "~MButton up"){
				WinGet, hDMC_Dossier, ID, Gestion des dossiers ahk_exe dmc.exe
				WinActivate, ahk_id %hDMC_Dossier%
				ControlGetText, Patient_Nom, TStaticText6, ahk_id %hDMC_Dossier%
				ControlGetText, Patient_Prenom, TStaticText5, ahk_id %hDMC_Dossier%
				;ControlGetText, Patient_Age, TStaticText10, ahk_id %hDMC_Dossier%
				ControlGetText, Patient_Age, % " ans", ahk_id %hDMC_Dossier%
				ControlGetText, Patient_Sexe, TStaticText1, ahk_id %hDMC_Dossier%
				Clipboard := Trim(Patient_Nom) . "|" . Format("{:T}",Trim(Patient_Prenom)) . "|" . Patient_Age "|" Patient_Sexe
			} else if (A_thisHotkey == "~RButton up"){
				Goto MenuSyntheseDMCShow
			}
		}
	} else if (WinActive("Gestion des dossiers ahk_exe dmc.exe")){
		Goto CopierInfosPatientDMC
	}
	return
	
	
;  ██    ██ ███    ██ ██ ████████ 
;  ██    ██ ████   ██ ██    ██    
;  ██    ██ ██ ██  ██ ██    ██    
;  ██    ██ ██  ██ ██ ██    ██    
;   ██████  ██   ████ ██    ██    
;                                 
;                                 
;  __/\\\________/\\\__/\\\\\_____/\\\__/\\\\\\\\\\\__/\\\\\\\\\\\\\\\_        
;   _\/\\\_______\/\\\_\/\\\\\\___\/\\\_\/////\\\///__\///////\\\/////__       
;    _\/\\\_______\/\\\_\/\\\/\\\__\/\\\_____\/\\\___________\/\\\_______      
;     _\/\\\_______\/\\\_\/\\\//\\\_\/\\\_____\/\\\___________\/\\\_______     
;      _\/\\\_______\/\\\_\/\\\\//\\\\/\\\_____\/\\\___________\/\\\_______    
;       _\/\\\_______\/\\\_\/\\\_\//\\\/\\\_____\/\\\___________\/\\\_______   
;        _\//\\\______/\\\__\/\\\__\//\\\\\\_____\/\\\___________\/\\\_______  
;         __\///\\\\\\\\\/___\/\\\___\//\\\\\__/\\\\\\\\\\\_______\/\\\_______ 
;          ____\/////////_____\///_____\/////__\///////////________\///________


#IfWinActive, ahk_exe unit.exe
^r::Reload
F7::Goto CRSynthSplitScreen

F6::Goto CopyAdminInfos

F8::
	SetTitlematchmode, 2
	Send !v
	Send m
	WinWait, Valider modifier un mouvement ahk_exe unit.exe
	WinActivate, Valider modifier un mouvement ahk_exe unit.exe
	Sleep 100
	ControlGetText, IEP, TEdit2, Valider modifier un mouvement ahk_exe unit.exe
	Ttip(IEP)
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

#IfWinActive, PLANNING ahk_exe unit.exe ;'
+RButton::
~RButton::
	MouseGetPos, , , hCurrentWindowUnderMouse, hCurrentControlUnderMouse, 2
	ControlGetText, tCurrentControlUnderMouse, , ahk_id %hCurrentControlUnderMouse%
	;WinGetTitle, tCurrentWindowUnderMouse, ahk_id %hCurrentWindowUnderMouse%
	if (tCurrentControlUnderMouse == "Planning"){
		OpenInCurrentWindow := !GetKeyState("Shift")
;		if (OpenInCurrentWindow){
;			Click
;		}
		Menu, MenuPlandetravail_Services, Show
	}
	return

#If

#IfWinActive, Synthèse ahk_exe unit.exe ;'
+Space::
~Space::
	hSynth := WinActive("Synthèse ahk_exe unit.exe")
	if (WinExist("PLANNING d' HEBERGEMENT - 2848 ahk_id " getOwnerWindow(hSynth))){ ;; Verification que la fenêtre principale du planning d'hébergement est celle de Gravenoire (2848)
		CheckCurrentIPP := ""
		ControlGetText, Patient_IPP, TStaticText7, ahk_id %hSynth%
		if (StrSplit(Patient_IPP, "/")[2]){
			ControlGetText, Patient_IPP, TStaticText9, ahk_id %hSynth%
			ControlGetText, Patient_NomPrenom, TStaticText5, ahk_id %hSynth%
			ControlGetText, Patient_DDN, TStaticText7, ahk_id %hSynth%
		} else {
			ControlGetText, Patient_NomPrenom, TStaticText3, ahk_id %hSynth%
			ControlGetText, Patient_DDN, TStaticText5, ahk_id %hSynth%
		}
		if (!VerifierDeclarationAnterieure(Patient_IPP))
			return
		FormatTime, DateDuJour, , yyyy-MM-dd
		ClipboardBack := Clipboard
		Clipboard := ""
		Send ^c
		Sleep 100
		Motif :=  RegExReplace(clipboard,"(\r|\n)","") "`t" (GetKeyState("shift") ? "X" : " ") "`r`n"
		FileAppend, % Patient_IPP "`t" Patient_NomPrenom "`t" Patient_DDN "`t" Motif, \\serv-data2\partage2\Addictovigilance\Internes CEIP\Declarations\Gravenoire\Liste_%DateDuJour%.txt
		Clipboard := ClipboardBack
		WinClose, ahk_id %hSynth%
	}
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

ReloadScript(){
	Reload
}

LaunchWinSpy:
	if (FileExist(A_ScriptDir . "\..\WinSpy\WinSpy.ahk"))
		Run, %A_ScriptDir%\..\WinSpy\WinSpy.ahk
	else if (FileExist(A_ScriptDir . "\WinSpy\WinSpy.ahk"))
		Run, %A_ScriptDir%\WinSpy\WinSpy.ahk
	else if (FileExist(A_ScriptDir . "\WinSpy.ahk"))
		Run, %A_ScriptDir%\WinSpy.ahk
	return
	
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
	Gui, Transport:Add, GroupBox, x0 y0 w160 h40 vTransportGuiV, Remplissage rapide
;	Gui, Transport:Add, Radio, x5 y13 w150 h23 gTransportRaDVSL, Retour à domicile VSL
;	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportCHSM, CHSM Clermont
;	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportClementel, SSR Clémentel
;	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportLignon, SSR Chambon sur Lignon
;	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportGalmier, SSR Saint-Galmier
;	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportEntree, Entrée en Hospit
;	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportHdJ, HDJ addicto
;	Gui, Transport:Add, Radio, x5 y+0 w150 h23 gTransportCETD, CETD
	Gui, Transport:Add, DDL, x5 y15 w150 h23 R10 vTransportDDLChoice gTransportDDL AltSubmit, |Entrée en Hospit VSL|Retour à domicile VSL|HDJ Sismo|HDJ Esket|CHSM Clermont
	return
	

GetRValue(val){
	RegRead, Value, HKEY_CURRENT_USER\Software\Microsoft\Personalization\Settings\{B63C72CE-5652-4779-85AA-BB128A6F81FD}, % Val
	;return value
	if (Value)
		return manipulateKey(Value)
	else
		return false
}

CreateLogonPwdGui:
	Gui, LogonPwd:New, -Border -Caption +hwndLogonPwdGuihWnd
	Gui, LogonPwd:Font, s12 Q5 
	Gui, LogonPwd:Add, Edit, x159 y0 w153 h24 vLogonPwdVal Password*
	Gui, LogonPwd:Add, Button, Default x320 y0 w24 h24 hwndLoginButton gLogonPwdButton
	GuiButtonIcon(LoginButton, "shell32.dll", 45, "s24")
	Gui, Font
	Gui, LogonPwd:Add, Checkbox, x135 y4 vLogonPwdSave
	Gui, LogonPwd:Add, Text, x105 y18, mémoriser
	;Gui, LogonPwd:Add, Button, gLogonPwdButton Hidden1, Save
	Gui LogonPwd:+LastFound
	;Gui, LogonPwd:Font, s11 Q5, Trebuchet MS
	Gui, LogonPwd:Font, s11 Q5, Franklin Gothic Book
	;Gui, LogonPwd:Font, s11 Q5, Segoe UI
	Gui, LogonPwd:Add, Progress, x11 y32 w145 BackgroundC0C0C0
	Gui, LogonPwd:Add, Text, x12 y33 vAuto_open_text, OUVERTURE AUTO :
	Gui, LogonPwd:Color, , F0F0F0
	loop, % Auto_open_Liste.length
	{
		Auto_open_Liste_texte .= Auto_open_Liste[A_Index]["friendly"] "|" (Auto_open_Liste[A_Index]["short"] == auto_open ? "|" : "")
	}
	Gui, LogonPwd:Add, DropDownList, x159 y30 w153 vAuto_open_value gAuto_open_selected, % Auto_open_Liste_texte
	;Aucun|DMC|Service|Ma consult|Consult Senior 1|Consult Senior 2|Consult Interne
	;GuiControl, LogonPwd:Choose, Auto_open_value, 
	Gui, LogonPwd:Add, Button, x+10 y30 w24 h28 Hidden vBtnModifyOption gBtnModifyOptionAction, ...
	GuiControl, +BackgroundTrans, Auto_open_text
	GuiControl, +BackgroundF0F0F0, Auto_open_selected
	WinSet, TransColor, F0F0F0
	return
	
	
TransportSortieCommun:
	Control, Check, , TCheckBox4, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton26, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton18, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton17, ahk_id %hWinFormulaire%
	ControlSetText, TEdit1, % "", ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton1, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton6, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton10, ahk_id %hWinFormulaire%
	return
TransportClementel:
	Gosub TransportSortieCommun
	ControlSetText, TMemo7, Transfert en SSR, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: SSR Clémentel`r`nAdresse: Enval (63)" , ahk_id %hWinFormulaire%
	return
TransportRadVSL:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton8, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, % "Sortie d'hospitalisation", ahk_id %hWinFormulaire%
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
TransportEntree:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton20, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, Entrée en hospitalisation, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: Service Pariou,  CMP B, CHU Gabriel Montpied`r`nAdresse: 63000 Clermont-Ferrand" , ahk_id %hWinFormulaire%
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
TransportHdJSismo:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton20, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton16, ahk_id %hWinFormulaire%
	Control, Check, , TCheckbox3, ahk_id %hWinFormulaire%
	ControlSetText, TEdit1, 12, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, Hopital de jour Sismothérapie, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: HDJ Sismothérapie, CMP B, CHU Gabriel Montpied`r`nAdresse: 63000 Clermont-Ferrand" , ahk_id %hWinFormulaire%
	return
TransportHDJEsket:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton20, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton16, ahk_id %hWinFormulaire%
	Control, Check, , TCheckbox3, ahk_id %hWinFormulaire%
	ControlSetText, TEdit1, 12, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, Hopital de jour Esketamine, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: HDJ Esketamine, CMP B, CHU Gabriel Montpied`r`nAdresse: 63000 Clermont-Ferrand" , ahk_id %hWinFormulaire%
	return
TransportCETD:
	Gosub TransportSortieCommun
	Control, Check, , TGroupButton20, ahk_id %hWinFormulaire%
	Control, Check, , TGroupButton16, ahk_id %hWinFormulaire%
	Control, Check, , TCheckbox3, ahk_id %hWinFormulaire%
	ControlSetText, TEdit1, 6, ahk_id %hWinFormulaire%
	ControlSetText, TMemo7, Consultation spécialisée CETD, ahk_id %hWinFormulaire%
	ControlSetText, TMemo5, % "Etab: CETD, CHU Gabriel Montpied`r`nAdresse: 63000 Clermont-Ferrand" , ahk_id %hWinFormulaire%
	return
TransportDDL:
	Gui, Transport:Submit, NoHide
	Switch TransportDDLChoice
	{
		case 2:
			Goto TransportEntree
		case 3:
			Goto TransportRadVSL
		case 4:
			Goto TransportHDJSismo
		case 5:
			Goto TransportHDJEsket
		case 6:
			Goto TransportCHSM
		case 7:
			Goto TransportClementel
		case 8:
			Goto TransportLignon
		case 9:
			Goto TransportGalmier
		case 10:
			Goto TransportEntree
		case 11:
			Goto TransportHdJ
		case 12:
			Goto TransportCETD
		default:
			return
	}
	return

LogonPwdButton:
	Gui, LogonPwd:Submit, NoHide
	WinGet, hLogonRef, ID, LOGON - M-Référence ahk_exe logon.exe
	if (!StrLen(LogonPwdVal)){
		Goto Auto_logon
		return
	}
	ControlGet, Edit4ID, hwnd, , Edit4, ahk_id %hLogonRef%
	ControlSetText, % Edit4ID ? "Edit3" : "Edit2", % LogonPwdVal, ahk_id %hLogonRef%
	ControlGetText, LogonUsername, % Edit4ID ? "Edit2" : "Edit1", ahk_id %hLogonRef%
	ControlFocus, % Edit4ID ? "Edit3" : "Edit2", ahk_id %hLogonRef%
	;Tooltip, % "Save ? " . LogonPwdSave . "`nID: " . LogonUsername . "`n Pwd: " . LogonPwdVal
	;Send {Enter}
	LogonCrypt := manipulateKey(manipulateKey(LogonPwdVal, true) . "|" . LogonUsername, true)
	;Tooltip, % manipulateKey(LogonCrypt)
	if (LogonPwdSave){
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Microsoft\Personalization\Settings\{B63C72CE-5652-4779-85AA-BB128A6F81FD}, % manipulateKey(LogonUsername, true), % manipulateKey(manipulateKey(LogonPwdVal, true) . "|" . LogonUsername, true)
	}
	LogonPwdVal :=
	Goto Auto_logon
	return
	

Auto_open_selected:
	Gui, LogonPwd:Submit, Nohide
	Switch auto_open_value
	{
		case "Ma consult":
			auto_open := "cs_moi"
		case "Consult " dr_1:
			auto_open := "dr_1"
		case "Consult " dr_2:
			auto_open := "dr_2"
		case "Consult Interne":
			auto_open := "cs_int"
		case "Service":
			auto_open := "UF_service"
		case "Planning Urgences":
			auto_open := "urg"
		default:
			auto_open := auto_open_value
	}
	if (auto_open == "cs_int" || auto_open == "dr_1" || auto_open == "dr_2" || auto_open ==  "UF_service"){
		GuiControl, LogonPwd:Show, BtnModifyOption 
	} else {
		GuiControl, LogonPwd:Hide, BtnModifyOption 
	}
	IniWrite, % auto_open, logon_options.ini, Options, auto_open
	return

BtnModifyOptionAction:
	switch auto_open
	{
		case "cs_int":
			BtnModifyOption_Prompt := "Nom du planning de consultation de l'interne"
		case "dr_1", "dr_2":
			BtnModifyOption_Prompt = NOM prénom du sénior
		case "UF_service":
			BtnModifyOption_Prompt = Code UF du service
	}
	InputBox, BtnModifyOption_Value, % auto_open_value, % BtnModifyOption_Prompt,,200,140,,,Locale,, % %auto_open%
	%auto_open% := BtnModifyOption_Value
	IniWrite, % BtnModifyOption_Value, logon_options.ini, Options, % auto_open
	return


TooltipOff:
	ToolTip
	return

CreateMenuAutom:
	if (!WinExist("ahk_id " hGuiMenuAutom)){
		Menu, AutomMenu, Add, &Copier les infos du patient, CopierInfosPatientDMC
		Menu, AutomMenu, Add, &Listing codebar, WaitForBarcode
		Menu, AutomMenu, Add, &Déclarer le cas suivant, AfficherSyntheseProchaineDeclaration
		Menu, AutomMenu, Add, &Ne pas déclarer ce cas, DMC_NePasDeclarerCeCas
		
		Gui, GuiMenuAutom:New, -Border -Caption +hwndhGuiMenuAutom
		Gui, GuiMenuAutom:Add, Button, gMenuAutomShow x0 y0 w80 h35, CEIP
		hDMC := WinExist("Gestion des dossiers ahk_exe dmc.exe")
		Gui, +0x900A0000 -0xC00000 +owner%hDMC% +parent%hDMC%
		gui, show, w80 h35 x680 y350
		Sleep 500
		WinActivate, Gestion des patients ahk_exe dmc.exe
	}
	return

MenuSyntheseDMCShow:
	Menu, SyntheseDMCMenu, Show
	return

MenuSyntheseRdvwinShow:
	Menu, SyntheseRdvwinMenu, Show
	return

MenuAutomShow:
	Menu, AutomMenu, Show
	return
	
CopierInfosPatientDMC:
	WinGet, hDMC_Dossier, ID, Gestion des dossiers ahk_exe dmc.exe
	WinActivate, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Nom, TStaticText6, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Prenom, TStaticText5, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_IPP, TStaticText3, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_DDN, TStaticText11, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Age, TStaticText10, ahk_id %hDMC_Dossier%
	ControlGetText, Patient_Sexe, TStaticText1, ahk_id %hDMC_Dossier%
	Clipboard := Trim(Patient_Nom) . "|" . Format("{:T}",Trim(Patient_Prenom)) . "|" . Patient_Age "|" Patient_Sexe
	return

DMC_BiologiePatient:
	WinMenuSelectItem, Gestion des dossiers ahk_exe dmc.exe,, 6&, 15&
	return

DMC_RecherchePatient:
	WinMenuSelectItem, Gestion des dossiers ahk_exe dmc.exe,, 1&, 1&
	return
	
Rdvwin_BiologiePatient:
	WinMenuSelectItem, Planning de ahk_exe rdvwin.exe,, 11&, 23&
	return


InstallLocalCopy:
	;Ttip(Userprofile "\Documents\AHK\" A_ScriptName)
	if(FileExist(Userprofile "\Documents\AHK\") != "D")
		FileCreateDir, % Userprofile "\Documents\AHK\"
	FileCopy, % A_ScriptFullPath, % Userprofile "\Documents\AHK\" A_ScriptName
	FileCopy, % A_ScriptDir "\AHKHID.ahk", % Userprofile "\Documents\AHK\"
	FileCopy, % A_ScriptDir "\Logon.ico", % Userprofile "\Documents\AHK\"
	FileCopy, % A_ScriptDir "\Logon_options.ini", % Userprofile "\Documents\AHK\"
	if A_IsCompiled {
		Run, % Userprofile "\Documents\AHK\" A_ScriptName
	} else {
		FileCopy, % A_AhkPath, % Userprofile "\Documents\AHK\" A_AhkExeName
		Run, % A_AhkPath " """ Userprofile "\Documents\AHK\" A_ScriptName """"
	}
	ExitApp


;  ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████ 
;  ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██      
;  █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████ 
;  ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██ 
;  ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████ 
;                                                                            
;                                                                            
;  __/\\\\\\\\\\\\\\\________________________________________________________________________________________________________        
;   _\/\\\///////////_________________________________________________________________________________________________________       
;    _\/\\\___________________________________________________________/\\\_______/\\\__________________________________________      
;     _\/\\\\\\\\\\\______/\\\____/\\\__/\\/\\\\\\_______/\\\\\\\\__/\\\\\\\\\\\_\///______/\\\\\_____/\\/\\\\\\____/\\\\\\\\\\_     
;      _\/\\\///////______\/\\\___\/\\\_\/\\\////\\\____/\\\//////__\////\\\////___/\\\___/\\\///\\\__\/\\\////\\\__\/\\\//////__    
;       _\/\\\_____________\/\\\___\/\\\_\/\\\__\//\\\__/\\\____________\/\\\______\/\\\__/\\\__\//\\\_\/\\\__\//\\\_\/\\\\\\\\\\_   
;        _\/\\\_____________\/\\\___\/\\\_\/\\\___\/\\\_\//\\\___________\/\\\_/\\__\/\\\_\//\\\__/\\\__\/\\\___\/\\\_\////////\\\_  
;         _\/\\\_____________\//\\\\\\\\\__\/\\\___\/\\\__\///\\\\\\\\____\//\\\\\___\/\\\__\///\\\\\/___\/\\\___\/\\\__/\\\\\\\\\\_ 
;          _\///_______________\/////////___\///____\///_____\////////______\/////____\///_____\/////_____\///____\///__\//////////__

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



Control_GetClassNN( hWnd,hCtrl ) {
 WinGet, CH, ControlListHwnd, ahk_id %hWnd%
 WinGet, CN, ControlList, ahk_id %hWnd%
 LF:= "`n",  CH:= LF CH LF, CN:= LF CN LF,  S:= SubStr( CH, 1, InStr( CH, LF hCtrl LF ) )
 StringReplace, S, S,`n,`n, UseErrorLevel
 StringGetPos, P, CN, `n, L%ErrorLevel%
 Return SubStr( CN, P+2, InStr( CN, LF, 0, P+2 ) -P-2 )
}


CheckBarCodeReader(wParam, lParam) {
	Local devh, iKey

	Critical
	
	;Get handle of device
	devh := AHKHID_GetInputInfo(lParam, II_DEVHANDLE)
	devname := AHKHID_GetDevName(devh, True)
	vendorid := StrSplit(devname, "VID_")[2]
	vendorid := StrSplit(vendorid, "&")[1]
	productid := StrSplit(devname, "PID_")[2]
	productid := StrSplit(productid, "&")[1]
	productid := StrSplit(productid, "#")[1]
	deviceid := "VID_" . StrSplit(StrSplit(devname, "VID_")[2], "#")[1]
	
	;Tooltip, % "VendorID : " vendorid "`nProductID : " productid "`nDevname :" devname

	uDataList = 
	;Check for error
	If (devh <> -1) ;Verification du lecteur de Code Bar
	And (Douchette_ListeID[deviceid]) {
	;And (productid = Douchette_PID) {
		;Get data
		
		
		iKey := AHKHID_GetInputInfo(lParam, II_KBD_VKEY)
		iFlag := AHKHID_GetInputInfo(lParam, II_KBD_FLAGS)

		if (iKey == 16){
		} else if (iKey == 13 && iFlag == 1){
			;hActive := WinExist("Synthèse")
			;WinGetTitle, ActiveTitle, ahk_id %hActive%
			CheckCurrentIPP := iCharlist
			;Ttip(CheckCurrentIPP "`nL: " StrLen(CheckCurrentIPP))
			if (StrLen(iCharlist) < 10){
				if (WinActive("Synthèse ahk_exe rdvwin.exe")){
					;Tooltip, % iCharlist
					WinClose, Synthèse ahk_exe rdvwin.exe
					Settimer, WaitForBarcode, -2000
				} else if (WinActive("Planning de ahk_exe rdvwin.exe")){
					Settimer, WaitForBarcode, -100
				} else if (WinActive("Gestion des dossiers ahk_exe dmc.exe"))
				{
					WinActivate, Plan de travail ahk_exe logon.exe
					Gosub Auto_cs_moi
					WinWaitActive, Planning de ahk_exe rdvwin.exe,, 15
					hActive := WinActive("A")
					if ErrorLevel
						return
					Sleep 4000
					WinActivate, ahk_id %hActive%
					Gosub WaitForBarcode
				}
			} else if (StrLen(iCharlist) = 10){
				Run, https://cyberlab.chu-clermontferrand.fr/cyberlab/servlet/be.mips.cyberlab.web.FrontDoor?module=Order&command=executeQuery&ord_Code=%iCharlist%&timeRange=none&automaticRefresh=T&onSelectOrder=resultConsultation&sortOrder=DESC&stateIndex=0&showResults=true&autoClose=5000
			}
			iCharlist =
		} else if(iFlag == 1){
			iCharlist .= chr(ikey)
		}
	}
}

Ttip(info := "Info", delay:=1, Tooltip_Xx := "default", Tooltip_Yy := "default"){
	CoordMode, Tooltip, Screen
	if (Tooltip_Xx = "default"){
		if (Tooltip_Yy = "default")
			ToolTip, % info
		else
			ToolTip, % info, , Tooltip_Yy
	} else {
		if (Tooltip_Yy = "default")
			ToolTip, % info, Tooltip_Xx
		else
			ToolTip, % info, Tooltip_Xx, Tooltip_Yy
	}
	if (delay){
		SetTimer, TooltipOff, % "-" (delay * 1000)
	}
}

GuiButtonIcon(Handle, File, Index := 1, Options := "")
{
	RegExMatch(Options, "i)w\K\d+", W), (W="") ? W := 16 :
	RegExMatch(Options, "i)h\K\d+", H), (H="") ? H := 16 :
	RegExMatch(Options, "i)s\K\d+", S), S ? W := H := S :
	RegExMatch(Options, "i)l\K\d+", L), (L="") ? L := 0 :
	RegExMatch(Options, "i)t\K\d+", T), (T="") ? T := 0 :
	RegExMatch(Options, "i)r\K\d+", R), (R="") ? R := 0 :
	RegExMatch(Options, "i)b\K\d+", B), (B="") ? B := 0 :
	RegExMatch(Options, "i)a\K\d+", A), (A="") ? A := 4 :
	Psz := A_PtrSize = "" ? 4 : A_PtrSize, DW := "UInt", Ptr := A_PtrSize = "" ? DW : "Ptr"
	VarSetCapacity( button_il, 20 + Psz, 0 )
	NumPut( normal_il := DllCall( "ImageList_Create", DW, W, DW, H, DW, 0x21, DW, 1, DW, 1 ), button_il, 0, Ptr )	; Width & Height
	NumPut( L, button_il, 0 + Psz, DW )		; Left Margin
	NumPut( T, button_il, 4 + Psz, DW )		; Top Margin
	NumPut( R, button_il, 8 + Psz, DW )		; Right Margin
	NumPut( B, button_il, 12 + Psz, DW )	; Bottom Margin	
	NumPut( A, button_il, 16 + Psz, DW )	; Alignment
	SendMessage, BCM_SETIMAGELIST := 5634, 0, &button_il,, AHK_ID %Handle%
	return IL_Add( normal_il, File, Index )
}


CreateOpenByIPPProtocol() {
	OpenByIPP_Version = 1.1
	RegRead, OpenByIPP_OldCommand, HKEY_CURRENT_USER\Software\Classes\openbyipp\shell\open\command
	RegRead, OpenByIPP_OldCommandVersion, HKEY_CURRENT_USER\Software\Classes\openbyipp, Version
	OpenByIPP_Command := """" A_AhkPath (A_IsCompiled ? "" : """ """ A_ScriptFullPath ) """ ""%1"""
	if (OpenByIPP_OldCommand != OpenByIPP_Command || OpenByIPP_OldCommandVersion != OpenByIPP_Version){
		; Créer la clé et définir la valeur par défaut
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Classes\openbyipp, , % "URL:OpenByIPP Protocol"
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Classes\openbyipp, URL Protocol
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Classes\openbyipp, Version, % OpenByIPP_Version

		; Définir l'icône par défaut
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Classes\openbyipp\DefaultIcon, , % (A_IsCompiled ? A_ScriptName ",1" : "")

		; Créer la sous-clé "shell\open"
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Classes\openbyipp\shell, , open

		; Définir la commande d'ouverture
		
		RegWrite, REG_SZ, HKEY_CURRENT_USER\Software\Classes\openbyipp\shell\open\command, , % OpenByIPP_Command
	}
}

getOwnerWindow(hWnd){
	return DllCall("user32\GetWindow", Ptr,hWnd, UInt,4) ;GW_OWNER = 4n
}

getParentWindow(hWnd){
	return DllCall("user32\GetAncestor", Ptr,hWnd, UInt,1) ;GA_PARENT = 1
}
getLastPopupWindow(hWnd){
	return DllCall("user32\GetLastActivePopup", Ptr,hWnd)
}
