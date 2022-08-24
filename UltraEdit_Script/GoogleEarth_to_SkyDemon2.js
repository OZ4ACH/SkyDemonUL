// Define working environment.
UltraEdit.insertMode();
UltraEdit.columnModeOff();
UltraEdit.activeDocument.hexOff();
UltraEdit.ueReOn();
UltraEdit.activeDocument.top();
UltraEdit.activeDocument.gotoLine(1,1);

/* Find the tab index of the active document */
function getActiveDocumentIndex () {
   var tabindex = -1; /* start value */

   for (var i = 0; i < UltraEdit.document.length; i++)
   {
      if (UltraEdit.activeDocument.path==UltraEdit.document[i].path) {
         tabindex = i;
         break;
      }
   }
   return tabindex;
}


// Use user clipboard 9 during script execution.
UltraEdit.selectClipboard(9);

// Help with unicode. Copy values to a separate ASCII file.
var KMLFile = getActiveDocumentIndex();

// Creat debug file
UltraEdit.newFile();
var debug = UltraEdit.document.length - 1;
UltraEdit.document[debug].unicodeToASCII();
UltraEdit.document[debug].write("Start Debug\r\n");

// Creat airspace file
UltraEdit.newFile();
var SkyDemonFile_airspace = UltraEdit.document.length - 1;
UltraEdit.document[SkyDemonFile_airspace].unicodeToASCII();

// Creat vrps file (report punkter)
UltraEdit.newFile();
var SkyDemonFile_vrps = UltraEdit.document.length - 1;
UltraEdit.document[SkyDemonFile_vrps].unicodeToASCII();

// Creat airways file
UltraEdit.newFile();
var SkyDemonFile_airways = UltraEdit.document.length - 1;
UltraEdit.document[SkyDemonFile_airways].unicodeToASCII();

UltraEdit.document[KMLFile].setActive();

// Define the needed search and replace properties.
UltraEdit.activeDocument.findReplace.matchWord=false;
UltraEdit.activeDocument.findReplace.replaceAll=false;
UltraEdit.activeDocument.findReplace.searchDown=true;
UltraEdit.activeDocument.findReplace.matchCase=false;
UltraEdit.activeDocument.findReplace.preserveCase=false;
UltraEdit.activeDocument.findReplace.regExp=true;
UltraEdit.perlReOn();
UltraEdit.activeDocument.findReplace.replaceInAllOpen=false;
UltraEdit.activeDocument.findReplace.selectText=false;

// Make SkyDemon header
UltraEdit.document[SkyDemonFile_airspace].write("#\r\n");
UltraEdit.document[SkyDemonFile_airspace].write("TYPE=OTHER\r\n");
UltraEdit.document[SkyDemonFile_airspace].write("SUBTYPE=\r\n");
UltraEdit.document[SkyDemonFile_airspace].write("#\r\n");
UltraEdit.document[SkyDemonFile_airspace].write("CLASS=UNKNOWN\r\n");
UltraEdit.document[SkyDemonFile_airspace].write("ACTIVE=EVERYDAY\r\n");

// Make file name fro SkyDemon file
var KMLFileName = UltraEdit.activeDocument.path;
var KMLFilePath = KMLFileName.replace(/^(.+)\..+.*$/,"$1");
var SkyDemonFileName_debug = KMLFilePath + ".debug";
var SkyDemonFileName_airspace = KMLFilePath + ".airspace";
var SkyDemonFileName_vrps = KMLFilePath + ".vrps.csv";
var SkyDemonFileName_airways = KMLFilePath + ".airways";


UltraEdit.document[KMLFile].setActive();
UltraEdit.activeDocument.gotoLine(1,1);
UltraEdit.activeDocument.findReplace.find("<Folder>");

var KordinaterSelection;
var KordinaterStr;
var lineNum;

var bd;
var bm;
var bs;
var bdeg;
var b;

var ld;
var lm;
var ls;
var ldeg
var l;

var placemake_line;
var placemake_linenext;

var airways_count;
airways_count = 0;


// dekode positioner
while (1) {
	UltraEdit.document[KMLFile].setActive();
	
	UltraEdit.activeDocument.findReplace.find("<Placemark>");
	if (UltraEdit.activeDocument.isNotFound()) {
		UltraEdit.document[debug].write("break line 146\r\n");
		break;
	}
  placemake_line = UltraEdit.activeDocument.currentLineNum;
	UltraEdit.activeDocument.findReplace.find("</Placemark>");
	if (UltraEdit.activeDocument.isNotFound()) {
		UltraEdit.document[debug].write("break line 120\r\n");
		break;
	}
  placemake_linenext = UltraEdit.activeDocument.currentLineNum;
	UltraEdit.activeDocument.gotoLine(placemake_line+1,1);

	UltraEdit.document[debug].write("Palcemark line: ");
	UltraEdit.document[debug].write(placemake_line.toString());
	UltraEdit.document[debug].write(",");
	UltraEdit.document[debug].write(placemake_linenext.toString());
	UltraEdit.document[debug].write("\r\n");


	UltraEdit.document[KMLFile].setActive();
	UltraEdit.activeDocument.findReplace.find("<Polygon>");
	if ((UltraEdit.activeDocument.isFound()) && (placemake_linenext > UltraEdit.activeDocument.currentLineNum)) {
			//-------------------------------------------------------------------------------------------------------------
		// Polygon airspace
		UltraEdit.document[debug].write("Polygon found\r\n");
		UltraEdit.document[KMLFile].setActive();
		UltraEdit.activeDocument.gotoLine(placemake_line,1);

		UltraEdit.activeDocument.findReplace.find("<name>.+</name>");
		if (UltraEdit.activeDocument.isNotFound()) {
			UltraEdit.document[debug].write("break line 132\r\n");
			break;
		}

		var OmraadeNavn = UltraEdit.activeDocument.selection.replace(/^<name>(.+)<\/name>.*$/,"$1");

		UltraEdit.document[debug].write("Navn: ");
		UltraEdit.document[debug].write(OmraadeNavn);
		UltraEdit.document[debug].write("\r\n");

		UltraEdit.document[SkyDemonFile_airspace].write("#\r\n");
		UltraEdit.document[SkyDemonFile_airspace].write("TITLE=");
		UltraEdit.document[SkyDemonFile_airspace].write(OmraadeNavn);
		UltraEdit.document[SkyDemonFile_airspace].write("\r\n");
		UltraEdit.document[SkyDemonFile_airspace].write("BASE=MSL\r\n");
		UltraEdit.document[SkyDemonFile_airspace].write("TOPS=1000 AGL\r\n");

		// 12.25847215414245,55.75172875341272,0 
		// POINT=N561517.30 E0122624.70

		UltraEdit.document[KMLFile].setActive();
		UltraEdit.activeDocument.findReplace.find("<coordinates>");
		UltraEdit.activeDocument.key("DOWN ARROW");
		UltraEdit.activeDocument.key("HOME");
		//UltraEdit.activeDocument.selectLine();
	  //KordinaterSelection = UltraEdit.activeDocument.selection;
	  
	  lineNum = UltraEdit.activeDocument.currentLineNum;
	  
		while (1) {
			UltraEdit.activeDocument.findReplace.find("[0-9]+\.[0-9]+,[0-9]+\.[0-9]+,0");
			if (UltraEdit.activeDocument.isNotFound() || (lineNum < UltraEdit.activeDocument.currentLineNum)) break;
			
			KordinaterStr = UltraEdit.activeDocument.selection;
			//UltraEdit.document[SkyDemonFile_airspace].write(KordinaterStr);
			//UltraEdit.document[SkyDemonFile_airspace].write(" ! ");

			ldeg = parseFloat(KordinaterStr.replace(/^([0-9]+\.[0-9]+),[0-9]+\.[0-9]+,0$/,"$1"));
			ld = Math.floor(ldeg);
			lm = Math.floor((ldeg-ld) * 60);
			ls = ((ldeg-ld - (lm/60)) * 3600);
			l =  Math.floor(((ld*10000) + (lm*100) + ls)*100)/100;

			bdeg = parseFloat(KordinaterStr.replace(/^[0-9]+\.[0-9]+,([0-9]+\.[0-9]+),0$/,"$1"));
			bd = Math.floor(bdeg);
			bm = Math.floor((bdeg-bd) * 60);
			bs = ((bdeg-bd - (bm/60)) * 3600);
			b =  Math.floor(((bd*10000) + (bm*100) + bs)*100)/100;

			UltraEdit.document[SkyDemonFile_airspace].write("POINT=N");
			UltraEdit.document[SkyDemonFile_airspace].write(b.toFixed(2));
			UltraEdit.document[SkyDemonFile_airspace].write(" E0");
			UltraEdit.document[SkyDemonFile_airspace].write(l.toFixed(2));
			UltraEdit.document[SkyDemonFile_airspace].write("\r\n");
		}

		UltraEdit.document[KMLFile].setActive();
		UltraEdit.activeDocument.gotoLine(placemake_linenext,1);
	} else {
		UltraEdit.document[KMLFile].setActive();
		UltraEdit.activeDocument.gotoLine(placemake_line,1);
		UltraEdit.activeDocument.findReplace.find("<Point>");
		if ((UltraEdit.activeDocument.isFound()) && (placemake_linenext > UltraEdit.activeDocument.currentLineNum)) {
			//-------------------------------------------------------------------------------------------------------------
			// Point vrps report punkter
			UltraEdit.document[debug].write("Point found\r\n");
			UltraEdit.document[KMLFile].setActive();
			UltraEdit.activeDocument.gotoLine(placemake_line,1);

			UltraEdit.activeDocument.findReplace.find("<name>.+</name>");
			if (UltraEdit.activeDocument.isNotFound()) {
				UltraEdit.document[debug].write("break line 190\r\n");
				break;
			}

			var OmraadeNavn = UltraEdit.activeDocument.selection.replace(/^<name>(.+)<\/name>.*$/,"$1");

			UltraEdit.document[debug].write("Navn: ");
			UltraEdit.document[debug].write(OmraadeNavn);
			UltraEdit.document[debug].write("\r\n");

			UltraEdit.document[KMLFile].setActive();
			UltraEdit.activeDocument.findReplace.find("<coordinates>");
			//UltraEdit.activeDocument.key("DOWN ARROW");
			UltraEdit.activeDocument.key("HOME");
			//UltraEdit.activeDocument.selectLine();
		  //KordinaterSelection = UltraEdit.activeDocument.selection;
		  
		  lineNum = UltraEdit.activeDocument.currentLineNum;
		  
			UltraEdit.activeDocument.findReplace.find("[0-9]+\.[0-9]+,[0-9]+\.[0-9]+,0");
			if (UltraEdit.activeDocument.isNotFound() || (lineNum < UltraEdit.activeDocument.currentLineNum)) break;
				
			KordinaterStr = UltraEdit.activeDocument.selection;
			//UltraEdit.document[SkyDemonFile_airspace].write(KordinaterStr);
			//UltraEdit.document[SkyDemonFile_airspace].write(" ! ");

			ldeg = parseFloat(KordinaterStr.replace(/^([0-9]+\.[0-9]+),[0-9]+\.[0-9]+,0$/,"$1"));
			ld = Math.floor(ldeg);
			lm = Math.floor((ldeg-ld) * 60);
			ls = ((ldeg-ld - (lm/60)) * 3600);
			l =  Math.floor(((ld*10000) + (lm*100) + ls)*100)/100;

			bdeg = parseFloat(KordinaterStr.replace(/^[0-9]+\.[0-9]+,([0-9]+\.[0-9]+),0$/,"$1"));
			bd = Math.floor(bdeg);
			bm = Math.floor((bdeg-bd) * 60);
			bs = ((bdeg-bd - (bm/60)) * 3600);
			b =  Math.floor(((bd*10000) + (bm*100) + bs)*100)/100;

			UltraEdit.document[SkyDemonFile_vrps].write("N");
			UltraEdit.document[SkyDemonFile_vrps].write(b.toFixed(2));
			UltraEdit.document[SkyDemonFile_vrps].write(" E0");
			UltraEdit.document[SkyDemonFile_vrps].write(l.toFixed(2));
			UltraEdit.document[SkyDemonFile_vrps].write(",,");
			UltraEdit.document[SkyDemonFile_vrps].write(OmraadeNavn);
			UltraEdit.document[SkyDemonFile_vrps].write(",0,0,non");
			UltraEdit.document[SkyDemonFile_vrps].write("\r\n");


			UltraEdit.document[KMLFile].setActive();
			UltraEdit.activeDocument.gotoLine(placemake_linenext,1);
		} else {
			UltraEdit.document[KMLFile].setActive();
			UltraEdit.activeDocument.gotoLine(placemake_line,1);
			UltraEdit.activeDocument.findReplace.find("<LineString>");
			if ((UltraEdit.activeDocument.isFound()) && (placemake_linenext > UltraEdit.activeDocument.currentLineNum)) {
				//-------------------------------------------------------------------------------------------------------------
				// LineString airways
				UltraEdit.document[debug].write("LineString found\r\n");
				UltraEdit.document[KMLFile].setActive();
				UltraEdit.activeDocument.gotoLine(placemake_line,1);

				UltraEdit.activeDocument.findReplace.find("<name>.+</name>");
				if (UltraEdit.activeDocument.isNotFound()) {
					UltraEdit.document[debug].write("break line 132\r\n");
					break;
				}

				var OmraadeNavn = UltraEdit.activeDocument.selection.replace(/^<name>(.+)<\/name>.*$/,"$1");

				UltraEdit.document[debug].write("Navn: ");
				UltraEdit.document[debug].write(OmraadeNavn);
				UltraEdit.document[debug].write("\r\n");

				UltraEdit.document[SkyDemonFile_airways].write("[");
				UltraEdit.document[SkyDemonFile_airways].write(OmraadeNavn);
				UltraEdit.document[SkyDemonFile_airways].write("|non]\r\n");

				UltraEdit.document[KMLFile].setActive();
				UltraEdit.activeDocument.findReplace.find("<coordinates>");
				UltraEdit.activeDocument.key("DOWN ARROW");
				UltraEdit.activeDocument.key("HOME");
				//UltraEdit.activeDocument.selectLine();
			  //KordinaterSelection = UltraEdit.activeDocument.selection;
			  
			  lineNum = UltraEdit.activeDocument.currentLineNum;
			  
				while (1) {
					UltraEdit.activeDocument.findReplace.find("[0-9]+\.[0-9]+,[0-9]+\.[0-9]+,0");
					if (UltraEdit.activeDocument.isNotFound() || (lineNum < UltraEdit.activeDocument.currentLineNum)) break;
					
					KordinaterStr = UltraEdit.activeDocument.selection;
					//UltraEdit.document[SkyDemonFile_airspace].write(KordinaterStr);
					//UltraEdit.document[SkyDemonFile_airspace].write(" ! ");

					ldeg = parseFloat(KordinaterStr.replace(/^([0-9]+\.[0-9]+),[0-9]+\.[0-9]+,0$/,"$1"));
					ld = Math.floor(ldeg);
					lm = Math.floor((ldeg-ld) * 60);
					ls = ((ldeg-ld - (lm/60)) * 3600);
					l =  Math.floor(((ld*10000) + (lm*100) + ls)*100)/100;

					bdeg = parseFloat(KordinaterStr.replace(/^[0-9]+\.[0-9]+,([0-9]+\.[0-9]+),0$/,"$1"));
					bd = Math.floor(bdeg);
					bm = Math.floor((bdeg-bd) * 60);
					bs = ((bdeg-bd - (bm/60)) * 3600);
					b =  Math.floor(((bd*10000) + (bm*100) + bs)*100)/100;

					if (airways_count	> 0) {
						UltraEdit.document[SkyDemonFile_airways].write(",SFC,UNL,1,VFR,U\r\n");
					}
					airways_count++;

					UltraEdit.document[SkyDemonFile_airways].write("N");
					UltraEdit.document[SkyDemonFile_airways].write(b.toFixed(2));
					UltraEdit.document[SkyDemonFile_airways].write(" E0");
					UltraEdit.document[SkyDemonFile_airways].write(l.toFixed(2));
				}
				UltraEdit.document[SkyDemonFile_airways].write("\r\n");
				airways_count = 0;

				UltraEdit.document[KMLFile].setActive();
				UltraEdit.activeDocument.gotoLine(placemake_linenext,1);
			} else {
				UltraEdit.document[debug].write("break line 269\r\n");
				UltraEdit.document[KMLFile].setActive();
				UltraEdit.activeDocument.gotoLine(placemake_linenext,1);
				break;
			}
	  }
	}
}


// Restore default working environment.
UltraEdit.clearClipboard();
UltraEdit.selectClipboard(0);



UltraEdit.document[debug].setActive();
UltraEdit.saveAs(SkyDemonFileName_debug);
UltraEdit.document[SkyDemonFile_airspace].setActive();
UltraEdit.saveAs(SkyDemonFileName_airspace);
UltraEdit.document[SkyDemonFile_vrps].setActive();
UltraEdit.saveAs(SkyDemonFileName_vrps);
UltraEdit.document[SkyDemonFile_airways].setActive();
UltraEdit.saveAs(SkyDemonFileName_airways);

UltraEdit.document[SkyDemonFile_airspace].top();
