let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let sampleObj = {}
let videoResolution = 0;
let screenOrient;


//Function that initializes the decoder and all the lists in the app
async function init(){
  try{
    
    await CortexDecoder.CDDecoder.init("./WASM");
    console.log(await CortexDecoder.CDLicense.activateLicense("sk1rgkUboQiiRTYaiFwysMY/Ft2g/SUvDQzXsEw9HUcmBiqqPk9AILTMzOeIiQm+mS10gTq8ALVq4dLbZwgRSQAcF07zxZ8cU2ZGoTjdLEu0pE/bLbDn9xyk9BfvYjMFMF1P6wPzfSOU1lHuJ6tLGoCF3N0kVgLNM6iJAFIZyKfJoTL+06eLyH9nM4MhbpKti62bfk4byU6/7MpzqROFErbnrUGVAwKeURuDmfTRj95XSp/95rtHJug6F3NyCKV3jra8n03RMEK/fA65vAPVRCDgGtSKNscojbkyFrraGkHqeBLG8g4H2asoHFwrx7GxxRQbUa3V19fsFemboomimpWNkJdtrSHtUblpEGYHMwenEt4loEKlTCgCwWCJp6/xbDbhkPvl+d8AaYWPV4O7KQ==").catch(e => console.log(e)));

    // await createCanvas()
    if(isMobile){
      switchVideoSize()
    }
    await CortexDecoder.CDCamera.init();

    //This is because we are using CDCamera.setCameraPosition API for mobile devices
    if(isMobile){
      document.getElementById("cameraSelector").hidden = true;
    }

    console.log(CortexDecoder.CDSymbology.QR)
    getAvailableCameraDevices(CortexDecoder.CDCamera.getConnectedCameras())

    await setDefaultSettings()
    getSupportedResolutions(CortexDecoder.CDResolution)
    getduplicateFilteringList()
    getCharacterEncodingList()
    getSecurityLevelList()
    getDPM_ModeList()

  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

//ROI needs to be set for preview coordinates.. Conversion happens in SDK
function setROIcoordinates(){
  if(document.querySelector("canvas") !== null)document.querySelector("canvas").remove();
    let CDRect = new CortexDecoder.CDRect();
      CDRect.BottomRight.X = document.getElementById("bottomRightX").value
      CDRect.BottomRight.Y = document.getElementById("bottomRightY").value
      CDRect.TopLeft.X = document.getElementById("topLeftX").value;
      CDRect.TopLeft.Y = document.getElementById("topLeftY").value;
      CDRect.TopRight.X = document.getElementById("topRightX").value
      CDRect.TopRight.Y = document.getElementById("topRightY").value
      CDRect.BottomLeft.X = document.getElementById("bottomLeftX").value
      CDRect.BottomLeft.Y = document.getElementById("bottomLeftY").value

    setROI([CDRect]);
}

async function setROI(ROIArray){
  await CortexDecoder.CDDecoder.setROIdimensions(ROIArray);
  
  for(let i=0; i<ROIArray.length; i++){
    let canvas = document.createElement("canvas");
    let videoElement = document.getElementById("video");
    canvas.width = videoElement.width
    canvas.height = videoElement.height
    canvas.style.zIndex = i+1; canvas.style.position = "absolute"; canvas.style.marginLeft = "auto";canvas.style.marginRight = "auto";
    canvas.style.left = 0; canvas.style.right = 0; canvas.style.textAlign = "center"
    document.getElementById("videoContainer").appendChild(canvas);
    let ctx = canvas.getContext('2d');

     //Scale coordinates from video resolution to preview resolution
    // let coordinates = await scaleCoordinates(canvas, ROIArray[i])

    let X = ROIArray[i].TopLeft.X;
    let Y = ROIArray[i].TopLeft.Y;
    let width = ROIArray[i].TopRight.X - ROIArray[i].TopLeft.X;
    let height = ROIArray[i].BottomLeft.Y - ROIArray[i].TopLeft.Y;
    ctx.beginPath();
    ctx.rect(X, Y, width, height);
    ctx.stroke();
  }
}

function handleDataParsing(e, type, subtype){
  e.stopImmediatePropagation()
  if(type == 0){
    setDataParsing(0,0)
  }else if(type == 1){
    let DLParsingList = document.getElementById("DLParsingList")
    if(subtype == "name"){
      setDataParsing(1, "00000308320310832032")
    }else if(subtype == "details"){
      setDataParsing(1, "00000328130700813033109184548457")
    }
  }else if(type == 2){
    
  }else if(type == 4){

  }else if(type == 5){

  }else if(type == 6){

  }else if(type == 7){

  }else{
    setDataParsing(0,0)
  }
}

function setDataParsing(type, subtype){
  CortexDecoder.CDDecoder.setdataParsing(type, subtype)
}

function getSubString(){
  let autopick = document.getElementById("enableAutoPick")
  if(autopick.checked){
    document.getElementById("getString").hidden = false;
    document.getElementById("setConfigString").hidden = false;
  }else{
    document.getElementById("getString").hidden = true;
    document.getElementById("setConfigString").hidden = true;
    CortexDecoder.CDDecoder.setdataParsing(0, 0);
  }
}

function getConfigString(){
  let autopick = document.getElementById("enableGS1parsing")
  if(autopick.checked){
    document.getElementById("getConfigString").hidden = false;
    document.getElementById("setGS1ConfigString").hidden = false;
  }else{
    document.getElementById("getConfigString").hidden = true;
    document.getElementById("setGS1ConfigString").hidden = true;
    CortexDecoder.CDDecoder.setdataParsing(0, 0);
  }
}

async function setConfigString(){
  
  let str1 = "000000000000||";
  let str2 = "*^A!,,";
  if(document.getElementById("getString").value){
    let configString = str1+document.getElementById("getString").value+str2;
    try{
      await CortexDecoder.CDDecoder.setdataParsing(4, configString);
    }catch(err){
      if(isMobile)alert(err)
      else console.log(err);
    }
  }
}

async function setGS1ConfigString(){
  if(document.getElementById("getConfigString").value){
    let configString = document.getElementById("getConfigString").value;
    configString = configString.replace(/\s/g, '');
    try{
      await CortexDecoder.CDDecoder.setdataParsing(5, configString);
    }catch(err){
      if(isMobile)alert(err)
      else console.log(err);
    }
  }
}


function getAvailableCameraDevices(cameraDevices){
  try{
    let selectElement = document.getElementById("cameradevices");
    let backCameras = []

    for(let i of cameraDevices){
      if(i.label !== null)
      if(i.label.toUpperCase().includes("BACK")){
        backCameras.push(i)
      }
      let opt = document.createElement("option");
      opt.value = i.label;
      opt.innerHTML = i.label;
      selectElement.appendChild(opt)
    }
    if(backCameras[0] != null)
    selectElement.value = backCameras[0].label;
    // setCameraDevice(document.getElementById("cameradevices").value);

  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }

}


async function setCameraDevice(cameraLabel){
  // resetElements()
  try{
    if(isMobile){
      CortexDecoder.CDCamera.setCameraPosition("BACK")
    }else{
      await CortexDecoder.CDCamera.setCamera(cameraLabel)
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}


getResult  = (result)=>{
  try{
    if(result !== undefined){
      drawTable(result)
      highlightResult(result)
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

async function highlightResult(result){
  if(Object.keys(result.results).length !== 0){
    //Create a canvas and place it on video element
    let canvas = document.createElement("canvas")
    let videoElement = document.getElementById("video");
    canvas.width = videoElement.width
    canvas.height = videoElement.height
    canvas.style.zIndex = 40; canvas.style.position = "absolute"; canvas.style.marginLeft = "auto";canvas.style.marginRight = "auto";
    canvas.style.left = 0; canvas.style.right = 0; canvas.style.textAlign = "center"
    document.getElementById("videoContainer").appendChild(canvas);
    let ctx = canvas.getContext('2d');

    //Scale coordinates from video resolution to preview resolution
    let coordinates = await scaleCoordinates(canvas, result.results[0].barcodeCoordinates)
    
    //Draw box around scanned barcode
    ctx.beginPath();
    ctx.moveTo(coordinates.TopLeft.X, coordinates.TopLeft.Y)
    ctx.lineTo(coordinates.TopRight.X, coordinates.TopRight.Y)
    ctx.lineTo(coordinates.BottomRight.X, coordinates.BottomRight.Y)
    ctx.lineTo(coordinates.BottomLeft.X, coordinates.BottomLeft.Y)
    ctx.lineTo(coordinates.TopLeft.X, coordinates.TopLeft.Y)
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.fillStyle = 'green';
    ctx.stroke();
    setTimeout(()=>{
      ctx.clearRect(0,0,canvas.width, canvas.height)
      canvas.remove()
    },1000)
  }
}

async function scaleCoordinates(canvas, coordinates){
  let videoWidth = CortexDecoder.CDResolution[videoResolution].width;
  let videoHeight = CortexDecoder.CDResolution[videoResolution].height;

  let canvasWidth = canvas.width; 
  let canvasHeight = canvas.height;

  let widthRatio; let heightRatio;
  if(screenOrient === "portrait-secondary" || screenOrient === "portrait-primary" || screenOrient === undefined){
    widthRatio = videoHeight / canvasWidth;
    heightRatio = videoWidth / canvasHeight;
  }else{
    widthRatio = videoWidth / canvasWidth;
    heightRatio = videoHeight / canvasHeight;
  }

  return scaledCoordinates = {TopLeft : {X : coordinates.TopLeft.X / widthRatio , Y : coordinates.TopLeft.Y / heightRatio},
                            TopRight : {X : coordinates.TopRight.X / widthRatio , Y : coordinates.TopRight.Y / heightRatio},
                            BottomLeft : {X : coordinates.BottomLeft.X / widthRatio , Y : coordinates.BottomLeft.Y / heightRatio},
                            BottomRight : {X : coordinates.BottomRight.X / widthRatio , Y : coordinates.BottomRight.Y / heightRatio}}
}

async function drawTable(result){
  try{
    if(Object.keys(result.results).length !== 0){

      let table = document.getElementById("resultTable");
      let tablebody = document.getElementById("tableBody");
      var tableRow = document.createElement("tr");
      let resultString = document.createElement("td");
      let symbologyName = document.createElement("td");
      let decodeTime = document.createElement("td");

      resultString.innerHTML = result.results[0].barcodeData;
      symbologyName.innerHTML = result.results[0].symbologyName;
      decodeTime.innerHTML = result.results[0].decodeTime;

      tableRow.appendChild(resultString);
      tableRow.appendChild(symbologyName);
      tableRow.appendChild(decodeTime);
      tablebody.appendChild(tableRow);
      
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function clearTable(){
  try{
    document.querySelector("tbody").parentNode.removeChild(document.querySelector("tbody"));
    let tableBody = document.createElement("tbody")
    tableBody.setAttribute("id", "tableBody")
    document.getElementById("resultTable").appendChild(tableBody);
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

async function setDefaultSettings(){
  await startCamera()
  await startCameraPreview()
  toggleDeviceAudio()
}



function getSupportedResolutions(allResolutions){
  try{
    let resolutionList = document.getElementById("resolutionsList");
    for(let i of Object.keys(allResolutions)){
      let opt = document.createElement("button");
      opt.value = i;
      opt.innerHTML = i;
      opt.style.display = "block"
      opt.style.fontSize = "20px"
      opt.style.margin = "auto"
      opt.setAttribute("class", "dropdown-btn")
      opt.onclick = function(){
        let header = document.getElementById("resolutionsList");
        let btns = header.getElementsByClassName("dropdown-btn");
        for (let i = 0; i < btns.length; i++) {
          if(btns[i].className == "dropdown-btn active")btns[i].className = "dropdown-btn"
        }
        this.className += " active";
        selectResolution(this.value)
      }
      resolutionList.appendChild(opt)
    }
    preselectDefaultResolution()
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function preselectDefaultResolution(){
  let header = document.getElementById("resolutionsList");
  let btns = header.getElementsByClassName("dropdown-btn");
  btns[1].className += " active";
  // CortexDecoder.CDCamera.setResolution(btns[1].value)
}


function resetElements(){
  document.getElementById("zoomSliderLabel").innerHTML = "Zoom not available";
  document.getElementById("zoomSlider").hidden = true;
  document.getElementById("TorchtoggleButton").value = 0;
  document.getElementById("TorchtoggleButton").innerHTML = "Turn Flash ON";
  document.getElementById("TorchtoggleButton").disabled = false;
  document.getElementById("toggleCamera").value = 0;
  document.getElementById("toggleCamera").innerHTML = "Start Camera";
  document.getElementById("toggleCamera").style.backgroundColor = "#4CAF50";
  document.getElementById("toggleCameraPreview").value = 0;
  document.getElementById("toggleCameraPreview").innerHTML = "Start Camera Preview";
  document.getElementById("toggleCameraPreview").style.backgroundColor = "#4CAF50";
  document.getElementById("toggleDecoding").value = 0;
  document.getElementById("toggleDecoding").innerHTML = "Start Decode";
  document.getElementById("toggleDecoding").style.backgroundColor = "#4CAF50";
}

async function startCamera(){
  try{
    await setCameraDevice(document.getElementById("cameradevices").value);
    
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

async function startCameraPreview(){
  try{
    await CortexDecoder.CDCamera.startPreview(getResult);
    setZoomSlider()
    videoResolution = await CortexDecoder.CDCamera.getResolution();
    screenOrient = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;

    if(CortexDecoder.CDCamera.isFocusSupported()){
      document.getElementById("selectFocusModeLabel").innerHTML = "Select focus mode"
      if(document.getElementById("selectFocusModeLabel").disabled)document.getElementById("selectFocusModeLabel").disabled = false
      addFocusModeSelection()
    }else{
      document.getElementById("selectFocusModeLabel").innerHTML = "Focus not available"
      document.getElementById("selectFocusModeLabel").disabled = true
    }

    if(!CortexDecoder.CDCamera.isTorchSupported()){
      document.getElementById("TorchtoggleButton").disabled = true;
      document.getElementById("TorchtoggleButton").innerHTML = "Flash not supported"
    }else{
      document.getElementById("TorchtoggleButton").disabled = false;
      document.getElementById("TorchtoggleButton").innerHTML = "Turn Flash ON"
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);  }
}

function stopCamera(){
  try{
    CortexDecoder.CDCamera.setCamera(0);
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function stopCameraPreview(){
  try{
    CortexDecoder.CDCamera.stopPreview();
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function toggleCamera(){
  try{
    let val = document.getElementById("toggleCamera").value;
    if(val == 0){
      startCamera()
      document.getElementById("toggleCamera").value = 1;
      document.getElementById("toggleCamera").innerHTML = "Stop Camera";
      document.getElementById("toggleCamera").style.backgroundColor = "red";
    }else{
      stopCamera()
      resetElements()
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function toggleCameraPreview(){
  try{
    let val = document.getElementById("toggleCameraPreview").value;
    if(val == 0){
      if(document.getElementById("toggleCamera").value == 0)alert("Start Camera First")
      else{
        startCameraPreview()
        document.getElementById("toggleCameraPreview").value = 1;
        document.getElementById("toggleCameraPreview").innerHTML = "Stop Camera Preview";
        document.getElementById("toggleCameraPreview").style.backgroundColor = "red";
        toggleDecoding()
      }
    }else{
      stopCameraPreview()
      document.getElementById("toggleCameraPreview").value = 0;
      document.getElementById("toggleCameraPreview").innerHTML = "Start Camera Preview";
      document.getElementById("toggleCameraPreview").style.backgroundColor = "#4CAF50";
      if(document.getElementById("toggleDecoding").value = 1)
        toggleDecoding()
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function startDecoding(){
  try{
    CortexDecoder.CDDecoder.setDecoding(true);
    // CortexDecoder.CDCamera.setVideoCapturing(true)
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function stopDecoding(){
  try{
    CortexDecoder.CDDecoder.setDecoding(false);
    // CortexDecoder.CDCamera.setVideoCapturing(false)
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function toggleDecoding(){
  try{
    let val = document.getElementById("toggleDecoding").value;
    if(val == 0){
      if(document.getElementById("toggleCamera").value == 0)alert("Start Camera First")
      else if(document.getElementById("toggleCamera").value == 1 && document.getElementById("toggleCameraPreview").value == 0)alert("Start Camera Preview First")
      else{
        startDecoding()
        document.getElementById("toggleDecoding").value = 1;
        document.getElementById("toggleDecoding").innerHTML = "Stop Decode";
        document.getElementById("toggleDecoding").style.backgroundColor = "red";
      }
    }else{
      stopDecoding()
      document.getElementById("toggleDecoding").value = 0;
      document.getElementById("toggleDecoding").innerHTML = "Start Decode";
      document.getElementById("toggleDecoding").style.backgroundColor = "#4CAF50";
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function toggleMultiResolution(e){
  e.stopImmediatePropagation()
  if(document.getElementById("toggleMultiResolution").value == 0){
    document.getElementById("toggleMultiResolution").value = 1
    document.getElementById("toggleMultiResolution").innerHTML = "Disable MultiResolution"
    document.getElementById("toggleMultiResolution").className += " active";
    enableMultiResolution(true)
  }else if(document.getElementById("toggleMultiResolution").value == 1){
    document.getElementById("toggleMultiResolution").value = 0
    document.getElementById("toggleMultiResolution").innerHTML = "Enable MultiResolution"
    document.getElementById("toggleMultiResolution").className = "dropdown-btn"
    enableMultiResolution(false)
  }
}

function enableMultiResolution(ch){
  try{
    CortexDecoder.CDDecoder.multiResolution = ch
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

function toggleLowContrastDecoding(e){
  e.stopImmediatePropagation()
  if(document.getElementById("toggleLowContrastDecoding").value == 0){
    document.getElementById("toggleLowContrastDecoding").value = 1
    document.getElementById("toggleLowContrastDecoding").innerHTML = "Disable Low Contast Decoding"
    document.getElementById("toggleLowContrastDecoding").className += " active";
    enableLowContrastDecoding(true)
  }else if(document.getElementById("toggleLowContrastDecoding").value == 1){
    document.getElementById("toggleLowContrastDecoding").value = 0
    document.getElementById("toggleLowContrastDecoding").innerHTML = "Enable Low Contast Decoding"
    document.getElementById("toggleLowContrastDecoding").className = "dropdown-btn"
    enableLowContrastDecoding(false)
  }
}

function enableLowContrastDecoding(ch){
  try{
    CortexDecoder.CDDecoder.lowContrastDecoding = ch
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}


function toggleDeviceAudio(e){
  if(e != null)
  e.stopImmediatePropagation();
  if(document.getElementById("toggleDeviceAudio").value == 0){
    try{
      enabletoggleDeviceAudio(true)
      document.getElementById("toggleDeviceAudio").value = 1
      document.getElementById("toggleDeviceAudio").innerHTML = "Disable Beep on Decode"
      document.getElementById("toggleDeviceAudio").className += " active";
    }catch(e){
      if(isMobile)alert(e)
      else console.log(e);
    }
  }else if(document.getElementById("toggleDeviceAudio").value == 1){
    enabletoggleDeviceAudio(false)
    document.getElementById("toggleDeviceAudio").value = 0
    document.getElementById("toggleDeviceAudio").innerHTML = "Enable Beep on Decode"
    document.getElementById("toggleDeviceAudio").className = "dropdown-btn"
  }
}

function enabletoggleDeviceAudio(ch){
  try{
    CortexDecoder.CDDevice.audio = ch
  }catch(err){
    throw new Error(err);
  } 
}

function toggleDeviceVibration(e){
  if(e != null)
  e.stopImmediatePropagation();
  if(document.getElementById("toggleDeviceVibration").value == 0){
    try{
      enabletoggleDeviceVibration(true)
      document.getElementById("toggleDeviceVibration").value = 1
      document.getElementById("toggleDeviceVibration").innerHTML = "Disable Vibration on Decode"
      document.getElementById("toggleDeviceVibration").className += " active";
    }catch(e){
      if(isMobile)alert(e)
      else console.log(e);
    }
  }else if(document.getElementById("toggleDeviceVibration").value == 1){
    enabletoggleDeviceVibration(false)
    document.getElementById("toggleDeviceVibration").value = 0
    document.getElementById("toggleDeviceVibration").innerHTML = "Enable Vibration on Decode"
    document.getElementById("toggleDeviceVibration").className = "dropdown-btn"
  }
}

function enabletoggleDeviceVibration(ch){
  try{
    CortexDecoder.CDDevice.vibration = ch
  }catch(err){
    throw new Error(err);
  } 
}


async function selectResolution(resolution){
  try{
    resetElements()
    await CortexDecoder.CDCamera.setResolution(resolution)
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

function getduplicateFilteringList(){
  let duplicateDelays = [0, 5000, 10000]
  try{
    let duplicateFilteringList = document.getElementById("duplicateFilteringList");
    for(let i of duplicateDelays){
      let opt = document.createElement("button");
      opt.value = i;
      opt.innerHTML = i/1000 +" sec delay";
      opt.style.display = "block"
      opt.style.fontSize = "20px"
      opt.style.margin = "auto"
      opt.setAttribute("class", "dropdown-btn")
      opt.onclick = function(){
        let header = document.getElementById("duplicateFilteringList");
        let btns = header.getElementsByClassName("dropdown-btn");
        for (let i = 0; i < btns.length; i++) {
          if(btns[i].className == "dropdown-btn active")btns[i].className = "dropdown-btn"
        }
        this.className += " active";
        setDuplicateFilterDuration(this.value)
      }
      duplicateFilteringList.appendChild(opt)
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function setDuplicateFilterDuration(duration){
  try{
    CortexDecoder.CDDecoder.setDuplicateDelay(duration)
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

function getCharacterEncodingList(){
  let characterEncodings = [{id:1, name:"ASCII"},{id:2, name:"ISO88591"},{id:3, name:"UTF8"},{id:4, name:"UTF16"},{id:5, name:"UTF16BE"},{id:6, name:"UTF16LE"},{id:7, name:"SHIFTJIS"}]
  try{
    let characterEncodingList = document.getElementById("characterEncodingList");
    for(let i of characterEncodings){
      let opt = document.createElement("button");
      opt.value = i.name;
      opt.innerHTML = i.name;
      opt.style.display = "block"
      opt.style.fontSize = "20px"
      opt.style.margin = "auto"
      opt.setAttribute("class", "dropdown-btn")
      opt.onclick = function(){
        let header = document.getElementById("characterEncodingList");
        let btns = header.getElementsByClassName("dropdown-btn");
        for (let i = 0; i < btns.length; i++) {
          if(btns[i].className == "dropdown-btn active")btns[i].className = "dropdown-btn"
        }
        this.className += " active";
        setCharacterSetEncoding(this.value)
      }
      characterEncodingList.appendChild(opt)
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function setCharacterSetEncoding(type){
  try{
    CortexDecoder.CDDecoder.characterSetEncoding = type;
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

function getDPM_ModeList(){
  let DPM_Modes = [{id:0, type:"Disabled"},{id:1, type:"DarkonLight"},{id:2, type:"LightonDark"},{id:3, type:"LaserChemEtch"}]
  try{
    let DPM_ModeList = document.getElementById("DPM_ModeList");
    for(let i of DPM_Modes){
      let opt = document.createElement("button");
      opt.value = i.id;
      opt.innerHTML = i.type;
      opt.style.display = "block"
      opt.style.fontSize = "20px"
      opt.style.margin = "auto"
      opt.setAttribute("class", "dropdown-btn")
      opt.onclick = function(){
        let header = document.getElementById("DPM_ModeList");
        let btns = header.getElementsByClassName("dropdown-btn");
        for (let i = 0; i < btns.length; i++) {
          if(btns[i].className == "dropdown-btn active")btns[i].className = "dropdown-btn"
        }
        this.className += " active";
        setDPM_Mode(this.value)
      }
      DPM_ModeList.appendChild(opt)
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function setDPM_Mode(mode){
  try{
    CortexDecoder.CDDecoder.DPMMode = mode;
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}



function getSecurityLevelList(){
  let SecurityLevels = [0,1,2,3,11,12,21]
  try{
    let securityLevelList = document.getElementById("securityLevelList");
    for(let i of SecurityLevels){
      let opt = document.createElement("button");
      opt.value = i;
      opt.innerHTML = i;
      opt.style.display = "block"
      opt.style.fontSize = "20px"
      opt.style.margin = "auto"
      opt.setAttribute("class", "dropdown-btn")
      opt.onclick = function(){
        let header = document.getElementById("securityLevelList");
        let btns = header.getElementsByClassName("dropdown-btn");
        for (let i = 0; i < btns.length; i++) {
          if(btns[i].className == "dropdown-btn active")btns[i].className = "dropdown-btn"
        }
        this.className += " active";
        setSecurityLevel(parseInt(this.value))
      }
      securityLevelList.appendChild(opt)
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function setSecurityLevel(security){
  try{
    CortexDecoder.CDDecoder.securityLevel = security;
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

function setPicklist(){
  try{
    let PicklistSlider = document.getElementById("PicklistSlider");
    CortexDecoder.CDDecoder.PicklistMode = parseInt(PicklistSlider.value, 10);
    drawCenterPointer()

  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function drawCenterPointer(){  
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "picklistLines")
  let videoElement = document.getElementById("video");
  canvas.width = videoElement.width
  canvas.height = videoElement.height
  canvas.style.zIndex = 50; canvas.style.position = "absolute"; canvas.style.marginLeft = "auto";canvas.style.marginRight = "auto";
  canvas.style.left = 0; canvas.style.right = 0; canvas.style.textAlign = "center"
  let ctx = canvas.getContext('2d');
  

  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(0, canvas.height/2);
  ctx.lineTo(canvas.width, canvas.height/2);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  document.getElementById("videoContainer").appendChild(canvas);
}

function setZoomSlider(){
  try{
    let zoomCapability = CortexDecoder.CDCamera.getSupportedZoomRange();
    if(!zoomCapability)return;
    document.getElementById("zoomSliderLabel").innerHTML = "Adjust the zoom";
    let zoomSlider = document.getElementById("zoomSlider");
    zoomSlider.min = zoomCapability.min;
    zoomSlider.max = zoomCapability.max;
    zoomSlider.step = zoomCapability.step;
    zoomSlider.hidden = false;
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  } 
}

function setZoom(){
  try{
    let zoomSlider = document.getElementById("zoomSlider");
    CortexDecoder.CDCamera.setZoom(parseFloat(zoomSlider.value));
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function addFocusModeSelection(){
  try{
    let focusMode = CortexDecoder.CDCamera.getFixedFocusRange();

    let currentFocusMode = CortexDecoder.CDCamera.getFocus();

    let focusModeList = document.getElementById("focusModeList");
    for(let i of Object.keys(focusMode)){
      let opt = document.createElement("button");
      opt.value = i;
      opt.innerHTML = i;
      opt.style.display = "block"
      opt.style.fontSize = "20px"
      opt.style.margin = "auto"
      opt.setAttribute("class", "dropdown-btn")
      if(currentFocusMode == i)opt.setAttribute("class", "dropdown-btn active")
      else opt.setAttribute("class", "dropdown-btn")

      opt.onclick = function(){
        let header = document.getElementById("focusModeList");
        let btns = header.getElementsByClassName("dropdown-btn");
        for (let i = 0; i < btns.length; i++) {
          if(btns[i].className == "dropdown-btn active")btns[i].className = "dropdown-btn"
        }
        this.className += " active";
        selectFocusMode(this.value)
      }
      focusModeList.appendChild(opt)
    }
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function selectFocusMode(focusMode){
  try{
    
    CortexDecoder.CDCamera.setFocus(focusMode)
  }catch(err){
    if(isMobile)alert(err)
    else console.log(err);
  }
}

function toggleTorch(){
  try{
    let val = document.getElementById("TorchtoggleButton").value;
    if(val == 0){
      if(document.getElementById("toggleCamera").value == 1){
        CortexDecoder.CDCamera.setTorchMode(true)
        document.getElementById("TorchtoggleButton").value = 1;
        document.getElementById("TorchtoggleButton").innerHTML = "Turn Flash OFF";
      }else{
        alert("You should start preview first to access flash")
      }  
    }else{
      CortexDecoder.CDCamera.setTorchMode(false)
      document.getElementById("TorchtoggleButton").value = 0;
      document.getElementById("TorchtoggleButton").innerHTML = "Turn Flash ON";
    }
  }catch(err){
    alert(err)
  }
}

/* Open the sidenav */
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
  document.getElementById("mySidenav").onclick = ()=>{
    closeNav()
  }
}

/* Close/hide the sidenav */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function toggleDropdown(e, dropdownId){
  e.stopImmediatePropagation();
  let dropdownContent = document.getElementById(dropdownId)
  if(dropdownId == "focusModeList"){
    if(document.getElementById("toggleCamera").value == 0)alert("Start Camera Preview First")
  }
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none";
  } else {
    dropdownContent.style.display = "block";
  }
}

function stopPropogation(e){
  e.stopImmediatePropagation()
}

function switchVideoSize(){
  if(document.getElementById("video").width == 360){
    document.getElementById("video").width = 640
    document.getElementById("video").height = 360
  }else{
    document.getElementById("video").width = 360
    document.getElementById("video").height = 640
  }
}

function iPhone() {
  return [
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
}

window.addEventListener("orientationchange", function() {
  screenOrient = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
  switchVideoSize()
}, false);

document.addEventListener('visibilitychange', () => {
  console.log(document.visibilityState);
});
