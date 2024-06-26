let video;
let poseNet;
let logo1;
let poses = [];
let mode = "i";
let pose;
let minConfidence = 0.4;
let poseDict = {
  "nose": {"x":0, "y":0, "score": 0},
  "leftEye": {"x":0, "y":0, "score": 0},
  "rightEye": {"x":0, "y":0, "score": 0},
  "leftEar": {"x":0, "y":0, "score": 0},
  "rightEar": {"x":0, "y":0, "score": 0},
  "leftShoulder": {"x":0, "y":0, "score": 0},
  "rightShoulder": {"x":0, "y":0, "score": 0},
  "leftElbow": {"x":0, "y":0, "score": 0},
  "rightElbow": {"x":0, "y":0, "score": 0},
  "leftWrist": {"x":0, "y":0, "score": 0},
  "rightWrist": {"x":0, "y":0, "score": 0},
  "leftHip": {"x":0, "y":0, "score": 0},
  "rightHip": {"x":0, "y":0, "score": 0},
  "leftKnee": {"x":0, "y":0, "score": 0},
  "rightKnee": {"x":0, "y":0, "score": 0},
  "leftAnkle": {"x":0, "y":0, "score": 0},
  "rightAnkle": {"x":0, "y":0, "score": 0}
}
let tempTime;
let seed = 99;
let sTime = 0;
let timeSet = false;
let nextEx;
let nextEf;
let nextEy;
let speed = 7;
let freq;
let lastUpdatedTime = 0;
let nextEc;
let highscore = 0;
let cScore = 0;
let typeE = true;
let probOfOr = 0.8;
let frameR = 60;
let lHandPos = [0,0];
let rHandPos = [0,0];
let handOffSet = 0.5;
let normalF;
let boldF;

/*function preload() {
  logo1 = loadImage('Images/Logo.png');
}*/

function setup() {
  //scale(-1,1);
  
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  rectMode(CENTER);
  textAlign(CENTER);
  normalF = loadFont('MuseoModerno-Regular.ttf');
  boldF = loadFont('MuseoModerno-Bold.ttf');
  
  //randomSeed(seed);
  nextEc = color('orange');
  freq = ceil(height/speed/45);
  //console.log(freq);
  
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  video.hide();
  
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  push();
  translate(width,0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  //drawKeypoints();
  //drawSkeleton();
  pop();
  
  
  flipCoordinates();
  
  
  fill(0);
  if (poses.length != 0){
    let leftWristPos = poses[0].pose.keypoints[9].position;
    let leftElbowPos = poses[0].pose.keypoints[7].position;
    
    let difx = (width-leftWristPos.x)-(width-leftElbowPos.x);
    let dify = (leftWristPos.y - leftElbowPos.y)
    
    lHandPos[0] = (width-leftWristPos.x) + difx*handOffSet;
    lHandPos[1] = leftWristPos.y + dify*handOffSet;
    
    
    let rightWristPos = poses[0].pose.keypoints[10].position;
    let rightElbowPos = poses[0].pose.keypoints[8].position;
    
    let difx2 = (width-rightWristPos.x)-(width-rightElbowPos.x);
    let dify2 = (rightWristPos.y - rightElbowPos.y)
    
    rHandPos[0] = (width-rightWristPos.x) + difx2*handOffSet;
    rHandPos[1] = rightWristPos.y + dify2*handOffSet;
    
    
    /*fill(0);
    ellipse(lHandPos[0],lHandPos[1],100,100);
    ellipse(rHandPos[0],rHandPos[1],100,100);*/
  }
  
  
  
  if (mode == "i"){
    
    fill('purple');
    textSize(40);
    textFont(boldF);
    text("AI VS HUMANS",320,60);
    fill(177,156,217);
    ellipse(580,175,100,100);
    textSize(15);
    textFont(boldF);
    fill(0);
    text("Hover your hand here to play", 582,200,100,100);
    //image(logo1, 320,200);
    
    getPose();
    
    if (pose != null){
      if (checkWristClick(580,175,100,100)){
        mode = "a";
      }
    }
    
  } 
  else if (mode == "a") {
    
    fill(54,0,104);
    textSize(25);
    textFont(normalF);
    text("Mission: \n Collect ORANGE balls; \nAvoid RED balls;\nUse your hands to pick up the balls",width/2,3*height/7, 350,400);
    fill(54,0,104);
    textFont(boldF);
    textSize(30)
    text("Current Highscore:\n" + highscore, 7*width/8,1.35*height/3,100,200);
    
    fill(177,156,217);
    ellipse(60,175,100,100);
    textSize(20);
    fill(0);
    textFont(boldF);
    text("Continue", 62,210,100,100);
    
    if (pose != null){
      if (checkWristClick(60,175,100,100)){
        mode = "pp";
        tempTime = 0;
      }
    }
    
  } 
  else if (mode == "pp"){
    
    let dOfEyes = dist(poseDict.rightEye.x, poseDict.rightEye.y, poseDict.leftEye.x, poseDict.leftEye.y);
    
    /*if (dOfEyes > 40){
      fill(54,0,104);
      textSize(45);
      textFont(boldF);
      text("Please move farther away",width/2,height/2);
      tempTime = 0;
    } else if (dOfEyes < 10){
      fill(54,0,104);
      textSize(45);
      textFont(boldF);
      text("Please come closer",width/2,height/2);
      tempTime = 0;
    } else {*/
      if (tempTime == 0){
        tempTime = second();
      } else if (second() - tempTime >= 5){
        mode = "p";
      } else if (second() - tempTime < 0 || second() - tempTime > 10) {
        tempTime = 0;
      } else {
        fill(0,200,0);
        textSize(45);
        textFont(boldF);
        text("Analyzing...",width/2,1*height/3);
        textSize(25);
        text("Stand about 3 meters away from the monitor", width/2, height/2);
        text("Hold for " + (5-(second() - tempTime)) + " seconds longer",width/2,2*height/3);
      }
    //}
    
  } 
  else if (mode == "p"){
    if (!timeSet){
      setTimeStart();
      timeSet = true;
    }
    
    
    
    if (timeSincePlay()%freq == 0 && timeSincePlay() != lastUpdatedTime){
      nextEx = round(random(0,width));
      nextEy = 0;
      nextEf = random(1,10);
      if (random() < probOfOr){
        nextEc = color('orange');
        typeE = true;
      } else {
        nextEc = color('red');
        typeE = false;
      }
      
      
      
      lastUpdatedTime = timeSincePlay();
    }
    
    updateEPosition();
    
    //console.log(freq);
    
    fill(nextEc);
    ellipse(nextEx,nextEy,30,30);
    
    /*fill(0);
    ellipse(width-poses[0].pose.keypoints[9].position.x,poses[0].pose.keypoints[9].position.y,100,100);
    ellipse(width-poses[0].pose.keypoints[10].position.x,poses[0].pose.keypoints[10].position.y,100,100);*/
    
    if (checkWristClick(nextEx,nextEy,100,100)){
      if (typeE){
        nextEy = height + 100;
        cScore++;
        if (cScore%10 == 0){
          speed+=2;
          probOfOr*=0.85;
          freq = ceil(height/speed/45);
          //console.log(freq);
        }
      } else if (!typeE){
        mode = 'e';
      }
    }
    
    textSize(35);
    textFont(boldF);
    fill('#5B0987');
    text("Score: " + cScore, 1.2*width/8,height/8);
    
    
    
  } 
  else if (mode == 'e'){
    
    if (cScore >= highscore){
      highscore = cScore;
    }
    
    fill(45,0,80);
    textSize(35);
    textFont(boldF);
    text("YOU LOST!",width/2,height/10);
    textSize(25);
    fill(79,0,144);
    text("Your Score: " + cScore,1*width/3,0.4*height,100,200);
    text("Current Highscore: " + highscore, 2*width/3,0.4*height,100,200);
    
    
    fill(177,156,217);
    ellipse(580,175,100,100);
    ellipse(60,175,100,100);
    textSize(23);
    fill(0);
    textFont(boldF);
    text("PLAY AGAIN", 582,190,100,100);
    text("EXIT", 62,208,100,100);
    
    if (pose != null){
      if (checkWristClick(580,175,100,100)){
        mode = "a";
        resetStats();
      } else if (checkWristClick(60,175,100,100)){
        mode = "i";
        resetStats();
      }
    }
    
  }
  
}

function resetStats(){
  speed = 7;
  freq = ceil(height/speed/45);
  
  cScore = 0;
  tempTime = 0;
  sTime = 0;
  timeSet = false;
  lastUpdatedTime = 0;
  typeE = true;
  
  nextEc = color('orange');
  nextEy = height + 100;
  nextEx = 0;
  probOfOr = 0.8;
}

function checkWristClick(xpos,ypos,xsize,ysize){
  if (poses.length > 0){
    
    /*
    let leftW = poses[0].pose.keypoints[9].position;
    let rightW = poses[0].pose.keypoints[10].position;

    if ((xpos - xsize/2 < (width - leftW.x) && xpos + xsize/2 > (width - leftW.x) && ypos - ysize/2 < leftW.y && ypos + ysize/2 > leftW.y) || (xpos - xsize/2 < (width - rightW.x) && xpos + xsize/2 > (width - rightW.x) && ypos - ysize/2 < rightW.y && ypos + ysize/2 > rightW.y)){
      return true;
    }*/
    
    if ((xpos-xsize/2 < lHandPos[0] && xpos+xsize/2 > lHandPos[0] && ypos-ysize/2 < lHandPos[1] && ypos+ysize/2 > lHandPos[1]) || (xpos-xsize/2 < rHandPos[0] && xpos+xsize/2 > rHandPos[0] && ypos-ysize/2 < rHandPos[1] && ypos+ysize/2 > rHandPos[1])){
      return true;
    }
    
  }
}

function updateEPosition(){
  nextEy += speed;
}

function checkForClick(xpos, ypos, xsize, ysize){
  /*
  if (xpos - xsize/2 < poseDict.rightWrist.x && xpos + xsize/2 > poseDict.rightWrist.x && ypos - ysize/2 < poseDict.rightWrist.y && ypos + ysize/2 > poseDict.rightWrist.y){
    return true;
  }
  */
}

function getPose(){
  //console.log(poses);
  if (poses.length > 0){
    pose = poses[0].pose.keypoints;
  }
}

function flipCoordinates(){
  for (let i = 0; i < poses.length; i++){
    let p = poses[i].pose;
    let j = 0;
    for (let r in poseDict){
      let keyp = p.keypoints[j];
      
      poseDict[r].x = width - keyp.position.x;
      poseDict[r].y = keyp.position.y;
      poseDict[r].score = keyp.score;
      
      j++
    }
  }
}

function drawKeypoints()  {
  for (let i = 0; i < poses.length; i++) {
    let p = poses[i].pose;
    for (let j = 0; j < p.keypoints.length; j++) {
      let keypoint = p.keypoints[j];
      
      if (keypoint.score > minConfidence) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function timeSincePlay(){
  return round((millis() - sTime)/1000);
}

function setTimeStart(){
  sTime = millis();
}