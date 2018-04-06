// File Reader
// read from 3 file types [.txt, .json, .xml] to change properties of a composition

#include "json2.js"

// global vars
var file = new File;
var check = 0;

// UI
var mainWindow = new Window("palette", "File Reader", undefined);
mainWindow.orientatizzaaq1on = "column";

var groupOne = mainWindow.add("group", undefined, "groupOne");
groupOne.orientation = "row";
var fileLocBox = groupOne.add("edittext", undefined, "Selected File Location");
fileLocBox.size = [150, 20];
var getFileButton = groupOne.add("button", undefined, "File...");
getFileButton.helpTip = "Select a .txt, .json, or .xml file to change the comp";

var groupTwo = mainWindow.add("group", undefined, "groupTwo");
groupTwo.orientation = "row";
var applyButton = groupTwo.add("button", undefined, "Apply");

mainWindow.center();
mainWindow.show();

getFileButton.onClick = function() {
    file = file.openDlg("Open a file", "Acceptable Files:*.txt,*.json,*xml");
    fileLocBox.text = file.fsName;
    check = 1;
    }

applyButton.onClick = function() {
        if(check == 0) {
                alert("Please select a file");
                return false;
            } else {
                //app.beginUndoGroup("Comp Changes");
                var fileExtension = fileLocBox.text;
                var fileData;
                
                if(fileExtension.substring(fileExtension.length-4, fileExtension.length) == "json") {
                    fileData = readJson();
                    } else {
                        switch(fileExtension.substring(fileExtension.length-3, fileExtension.length)) {
                            case "txt":
                                fileData = readTxt();
                            break;
                            case "xml":
                                fileData = readXml();
                            break;
                            }
                        }
                    changeComp(fileData);
                }
            alert("done");
   }

function readTxt() {
    var txtArray = [];
    var currentLine;
    file.open("r");
                while(!file.eof){
                        currentLine = file.readln();
                        txtArray.push(currentLine);
                    }
                file.close();
    
    var txtObj = {
            compName: txtArray[0],
            bgColour: txtArray[1],
            lensFlare: txtArray[2]
        };

    return txtObj;
    }

function readJson() {
    var currentLine;
    var jsonStuff = [];
    file.open("r");
        while(!file.eof) {
                currentLine = file.readln();
                jsonStuff.push(currentLine);
            }
        file.close();
        jsonStuff = jsonStuff.join("");
        var parsedJson = JSON.parse(jsonStuff);
        
        return parsedJson;
    }

function readXml() {
    file.open("r");
    var xmlString = file.read();
    var myXml = new XML(xmlString);
    file.close();
    return myXml;
    }

function changeComp(data) {
    var comp = app.project.activeItem;
    comp.name = data.compName;

    changeBgColour(comp, data.bgColour.toString());

    if(data.lensFlare == "Yes") {
        addLensFlare(comp);
        }
    }

function changeBgColour(comp, colour) {
    colour = colour.substring(1, colour.length-1);
    var colourArray = colour.split(", ");
    comp.bgColor = [colourArray[0], colourArray[1], colourArray[2]];
    }

function addLensFlare(comp) {
    var lensFlare = comp.layers.addSolid([0, 0, 0], "OF", comp.width, comp.height, 1, comp.duration);
    lensFlare.Effects.addProperty("VIDEOCOPILOT OpticalFlares");
    var renderProp = lensFlare("Effects")("Optical Flares")("Render Mode");
    renderProp.setValue(2);
    }
