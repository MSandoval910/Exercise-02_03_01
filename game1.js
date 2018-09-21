/*

circle with outline code

context.beginPath();
context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
context.fillStyle = 'green';
context.fill();
context.lineWidth = 5;
context.strokeStyle = '#003300';
context.stroke();

*/

/*
/////////////////
///// IDEAS /////
/////////////////

option to prioritise certain enemies (highest HP, lowest HP, target healer)
add kills to turrets
dodger

make healers follow units (slow down when ahead etc);

enemy that becomes invisible for X time

maybe add double weekend xp

placeable bullet
placeable traps
placeable wall on tracks (enemies have to destroy it, bosses ignore it);

FIX wave speed on waves (they do not match x2 x3 speed);

splitter enemy (splits to 2 enemies after death);

summoning enemy (not boss);

spy (either changes to random enemy or becomes invisible);

new mode player vs ai. player summons enemies and AI fights with turrets.

guard enemy absorbs all damage instead of units nearby.

/////////////
// turrets //
/////////////
turret that sends enemies back
turret that slows down enemies
freezing turret
sniper (slow down chance on max level);
poison turret
bullets that go through multiple enemies
ricochet tower
building that gives money (farm style);
support tower (+50% fire rate in range for other towers etc)
flamethrower
baracks creates units that fight for you.
closer = higher damage

be able to select multiple turrets (maybe);

reset button
medals give lots of xp
sniper homing missiles ? (chance)

research upgrades for towers

*/

spop.defaults = {
  style: 'success',
  autoclose: 4000,
  position: 'top-right',
}

var map1 = [
  { x: 0, y: 50 },
  { x: 700, y: 50 },
  { x: 700, y: 100 },
  { x: 500, y: 100 },
  { x: 500, y: 175 },
  { x: 100, y: 175 },
  { x: 100, y: 250 },
  { x: 800,  y: 250 }
];

var map2 = [
  { x: 0, y: 100 },
  { x: 200, y: 100 },
  { x: 200, y: 25 },
  { x: 500, y: 25 },
  { x: 500, y: 175 },
  { x: 600, y: 175 },
  { x: 600, y: 100 },
  { x: 800,  y: 100 }
];

var map3 = [
  {x: 0, y: 150},
  {x: 600, y: 150},
  {x: 600, y: 50},
  {x: 200, y: 50},
  {x: 200, y: 250},
  {x: 700, y: 250},
  {x: 700, y: 150},
  {x: 800, y: 150},
];

var map4 = [
  {x: 350, y: 250},
  {x: 500, y: 250},
  {x: 500, y: 50},
  {x: 100, y: 50},
  {x: 100, y: 250},
  {x: 700, y: 250},
  {x: 700, y: 150},
  {x: 800, y: 150},
]

var map5 = [
  {x: 350, y: 150},
  {x: 500, y: 150},
  {x: 500, y: 50},
  {x: 100, y: 50},
  {x: 100, y: 250},
  {x: 700, y: 250},
  {x: 700, y: 150},
  {x: 800, y: 150},
]

var map6 = [
  {x: 0, y: 150},
  {x: 800, y: 150},
]
// (mission 1 map)
var map7 = [
  {x: 0, y: 150},
  {x: 200, y: 100},
  {x: 125, y: 55},
  {x: 325, y: 20},
  {x: 600, y: 60},
  {x: 450, y: 250},
  {x: 400, y: 300},
]

var map1Highscore = 0,
    map2Highscore = 0,
    map3Highscore = 0,
    map4Highscore = 0,
    map5Highscore = 0,
    map6Highscore = 0;

var mission1Completed = false,
    mission2Completed = false,
    mission3Completed = false;

var pathPoints = [];

var ctx = document.getElementById("canvas").getContext("2d");

var FPS = 50;

var level = 1;
var xp = 0;
var xpN = 25;

var money = 25;
var lives = 20;

var difficulties = ["Very Easy","Easy","Normal","Hard","Very Hard","Impossible"];

var speed = 1;

var difficulty = 0;

var currentWave = 0;

var mission2BossesKilled = 0;
var finalBossKilled = 0;

var turrets = {};
var bullets = {};
var enemies = {};
var particles = {};
var rockets = {};
var popups = {};

var turretSelected = "";
var selectedMap = "";

var mouseX,mouseY;

var clicked = false;

var mission = "";

var keys = [];

var explosionRadius = 50;

var sounds = {
  shoot: new Audio("http://s1.vocaroo.com/media/download_temp/Vocaroo_s1LaGxT7gcKe.mp3"),
}

var group = {
  speed: 2,
  hpMax: 4,
  color: "black",
  size: 5,
  reward: 0.5,
  desc: "Grouped enemy, will always attack in groups.",
}
var basic = {
  speed: 1,
  hpMax: 10,
  color: "black",
  size: 10,
  reward: 1,
  desc: "Most basic enemy. No special powers.",
}
var fast = {
  speed: 2.5,
  hpMax: 15,
  color: "blue",
  size: 8,
  reward: 1.5,
  desc: "Very fast. Rely on fast turrets here.",
}
var heavy = {
  speed: 1/2,
  color: "gray",
  hpMax: 200,
  size: 15,
  reward: 10,
  desc: "Slow, but strong. It is slow, and quite easy.",
  armor: 50,
}
var boss = {
  speed: 1/2,
  color: "black",
  hpMax: 1000,
  size: 20,
  reward: 25,
  special: "summon basic",
  desc: "Very strong boss, can summon basic enemies. Deal as much damage as possible quickly.",
}
var healer = {
  speed: 1,
  color: "white",
  hpMax: 50,
  size: 7,
  reward: 5,
  special: "heal",
  desc: "Will heal himself and enemies around him, it can overheal units up to 150%. Green health on units show unit has been overhealed.",
}
var teleporter = {
  speed: 1,
  color: "Fuchsia",
  hpMax: 25,
  size: 8,
  reward: 4,
  special: "teleport",
  desc: "Teleporter will teleport himself and units around him. Very dangerous in big groups.",
  armor: 15,
}
var fastBoss = {
  speed: 2,
  color: "darkblue",
  hpMax: 500,
  size: 18,
  reward: 25,
  special: "summon fast",
  desc: "Boss of fast units, it will summon fast units!",
}
var shielder = {
  speed: 1,
  color: "gold",
  hpMax: 50,
  size: 14,
  reward: 10,
  special: "shield",
  desc: 'Creates "shield" which destroys bullets, use lasers to kill it. When bullet has been destroyed it will be shown by yellow particles.',
  armor: 25,
}
var disabler = {
  speed: 1.5,
  color: "springgreen",
  hpMax: 75,
  size: 12,
  reward: 10,
  special: "disable",
  desc: "Disables your towers! Can be very dangerous if all your towers are short range.",
  armor: 25,
}
var runner = {
  speed: 1,
  color: "orange",
  hpMax: 35,
  size: 10,
  reward: 5,
  special: "run",
  desc: "When it has low health, it starts running!",
  armor: 15,
}
var engineer = {
  speed: 1,
  color: "cadetblue",
  hpMax: 50,
  armor: 50,
  size: 10,
  reward: 15,
  special: "repair",
  desc: "Repairs armor of other units around it.",
}
var scout = {
  speed: 2,
  color: "crimson",
  hpMax: 25,
  armor: 5,
  size: 8,
  reward: 5,
  special: "straight",
  desc: "Ignores some of the path.",
}
var finalBoss = {
  speed: 0.1,
  color: "DeepSkyBlue",
  hpMax: 200000,
  armor: 300000,
  size: 30,
  reward: 1e4,
}



var normal = {
  name: "Normal turret",
  color: "yellow",
  outline: "orange",
  range: [80,100,100,115,125,175],
  dmg: [2,2.5,3,3,3,10],
  fireRate: [20,18,15,14,13,15],
  type: "bullet",
  maxBullets: [1,1,2,2,2,3],
  price: [25,30,35,50,100,550],
  desc: "Normal turret, shoots one bullet at a time.",
  fromLevel: 1,
}
var laser = {
  name: "Laser turret",
  color: "red",
  outline: "black",
  range: [80,90,100,110,125,150],
  dmg: [0.2,0.3,0.2,0.3,0.35,1],
  fireRate: [2,2,1,1,1,1],
  type: "laser",
  maxBullets: [2,2,2,3,4,4],
  price: [50,50,60,75,100,500],
  desc: "Can attack 2 targets at the time.",
  fromLevel: 2,
}
var shotgun = {
  name: "Shotgun turret",
  color: "purple",
  outline: "black",
  range: [60,70,80,90,100,100],
  dmg: [4,5,6,7,8,20],
  fireRate: [100,95,90,85,80,120],
  type: "bullet",
  maxBullets: [3,4,5,6,7,10],
  price: [125,35,50,70,85,350],
  desc: "Can attack 3 targets at once, good for grouped enemies.",
  fromLevel: 3,
}
var sniper = {
  name: "Sniper turret",
  color: "blue",
  outline: "black",
  range: [150,175,200,225,250,300],
  dmg: [7,8,9,10,15,50],
  fireRate: [150,125,110,100,125,100],
  type: "bullet",
  maxBullets: [1,1,1,2,3,1],
  price: [75,80,90,100,150,666],
  desc: "One accurate shot can take down boss easily.",
  fromLevel: 4,
}
var rocket = {
  name: "Rocket turret",
  color: "black",
  outline: "red",
  range: [80,100,110,115,125],
  dmg: [10,12,15,17,20],
  fireRate: [200,195,190,185,180],
  type: "rocket",
  maxBullets: [1,1,1,1,2],
  price: [120,100,200,300,400],
  desc: "Shoots rocket which causes splash damage.",
  fromLevel: 5,
}
var minigun = {
  name: "Minigun turret",
  color: "white",
  outline: "black",
  range: [80,90,100,110,125,150],
  dmg: [0.75,0.8,0.9,1,1.2,4],
  fireRate: [7,6,5,5,5,5],
  type: "bullet",
  maxBullets: [1,1,1,2,2,2],
  price: [35,20,30,40,50,375],
  desc: "Shoots very fast but low damage.",
  fromLevel: 6,
}
// splits damage evenly
var splitter = {
  name: "Splitter turret",
  color: "magenta",
  outline: "black",
  range: [100,110,115,125,135,150], // 100
  dmg: [5,8,10,15,20,50],
  fireRate: [30,25,30,25,30,50], // 25
  type: "split",
  maxBullets: [10,10,10,10,10,7],
  price: [45,50,55,65,75,650],
  desc: "Splits damage evenly across 10 enemies in range.",
  fromLevel: 7,
}

var megalaser = {
  name: "Mega laser turret",
  color: "crimson",
  outline: "black",
  range: [50,60,70,80,100,150],
  dmg: [50,75,100,125,150,450],
  fireRate: [250,240,230,220,210,200],
  type: "split",
  maxBullets: [15,15,15,15,15,15],
  price: [90,120,180,240,300,780],
  desc: "Mega laser, splits damage evenly across 15 enemies, deals up to 50 damage to one enemy.",
  fromLevel: 8,
}

var ring = {
  name: "Ring turret",
  color: 'CornflowerBlue',
  outline: "black",
  range: [40,45,50,55,60,75],
  dmg: [5,6,7,8,10,25],
  fireRate: [200,190,180,160,150,150],
  type: "ring",
  maxBullets: [4,6,8,10,16,24],
  price: [50,60,70,80,100,445],
  desc: "Shoots ring of bullets around it.",
  fromLevel: 9,
}
var superTurret = {
  name: "Super turret",
  color: "black",
  outline: "black",
  range: [150,175,200,225,250,275],
  dmg: [5,6,7,8,10,25],
  fireRate: [60,50,40,30,20,50],
  type: "bullet",
  maxBullets: [1,2,2,3,4,1],
  price: [500,250,270,290,210,365],
  desc: "Super turret, very nice.",
  fromLevel: 10,
}
var tesla = {
  name: "Tesla turret",
  color: "DeepSkyBlue",
  outline: "darkblue",
  range: [100,110,120,130,140,150],
  dmg: [1.5,1,0.5,0.2,0.25,1],
  fireRate: [20,15,10,5,1,1],
  type: "chain",
  maxBullets: [1,2,3,4,5,10],
  price: [40,50,50,55,65,800],
  desc: "Shoots lightning bolts!",
  fromLevel: 11,
}
var homing = {
  name: "Homing turret",
  color: "Thistle",
  outline: "purple",
  range: [60,70,80,90,100,125],
  dmg: [2,3,4,5,6,20],
  fireRate: [50,48,46,44,35,30],
  type: "homing",
  maxBullets: [1,1,1,2,2,3],
  price: [105,110,120,130,140,400],
  desc: "Shoots homing missiles!",
  fromLevel: 12,
}
var pusher = {
  name: "Pusher turret",
  color: "Lavender",
  outline: "Fuchsia",
  range: [40,40,40,40,45,75],
  dmg: [0,0,0,0,0,0],
  fireRate: [40,39,38,36,35,45],
  type: "pusher",
  maxBullets: [1,1,1,1,1,1],
  price: [35,45,35,30,25,225],
  desc: "Pushes enemies back resulting in slowing them down.",
  fromLevel: 13,
}
var farm = {
  name: "Farm",
  color: "yellow",
  outline: "brown",
  range: [0,0,0,0,0,0],
  dmg: [1,2,3,4,5,10],
  fireRate: [800,775,750,700,600,500],
  type: "money",
  maxBullets: [0,0,0,0,0,0],
  price: [30,50,80,100,125,275],
  desc: "Makes money for you!<br>The more enemies on screen, the faster it charges.",
  fromLevel: 5,
}
var splitLaser = {
  name: "Split Laser",
  color: "RosyBrown",
  outline: "black",
  range: [75,80,85,90,100,150],
  dmg: [0.6,0.5,0.4,0.3,0.2,1],
  fireRate: [10,6,4,2,1,1],
  type: "split",
  maxBullets: [10,9,8,7,6,5],
  price: [40,50,65,85,110,250],
  desc: "Splits damage evenly across all enemies in range, shoots fast.",
  fromLevel: 7,
}

var turretList = ["normal","laser","shotgun","sniper","rocket","minigun","splitter","megalaser","ring","superTurret","tesla","homing","pusher","farm","splitLaser"].sort();

for (var i = 0; i < turretList.length; i++){
  var name = turretList[i];
  if (turretList[i] == "superTurret"){
    name = "super";
  }
  var element = '<div class="turretContainer"><p>'+name+' turret</p><div class="turret '+turretList[i]+'Turret" data-name="'+turretList[i]+'"></div><div class="info"></div></div>';
  
  $('#allTurretContainer').append(element);
}

$(document).keydown(function (e) {
    keys[e.keyCode] = true;
});

$(document).keyup(function (e) {
    delete keys[e.keyCode];
});

$('img').attr('draggable','false');

$('#mainGame').hide();
$('#mapContainer').hide();

function mapSelection(){
  $('#mainMenu').hide(500,function(){
    $('#mapContainer').show(500);
  })
}

function startGame(){
  resetGame();
  $('#mapContainer').hide(500,function(){
    $('#mainGame').show(500);
  })
  selectedMap = $('#mapSelection img.active').attr('data-mapName');
  pathPoints = window[selectedMap];
  difficulty = parseFloat($('#difficulty').val());
  if (difficulty == 2){
    lives = 1;
  }
}

function continueGame(){
  $('#mapContainer').hide();
  $('#mainGame').show();
  $('#mainMenu').hide();
}

function quitGame(){
  var sure = confirm("Are you sure?");
  if (sure){
    lives = 0;
  }
}

// make turrets

for (var i = 0; i < turretList.length; i++){
  var obj = window[turretList[i]];
  var info = '<span class="badge badge-default">£'+obj.price[0]+'</span><br><span class="badge badge-danger">Damage: '+obj.dmg[0]+'</span><br><span class="badge badge-info">Range: '+obj.range[0]+'</span><br><span class="badge badge-success">Fire rate: '+(1/(obj.fireRate[0]/FPS)).toFixed(1)+' / sec</span><br>'+obj.desc+'<hr>';
  $('.'+turretList[i]+"Turret").parent().find(".info").html(info);
  $('.'+turretList[i]+"Turret").css({
    border: "4px solid "+obj.outline,
    backgroundColor: obj.color,
  })
}

// enemy info
var enemyList = ["group","basic","fast","heavy","boss","healer","teleporter","fastBoss","shielder","disabler","runner","scout","engineer"];
for (var i = 0; i < enemyList.length; i++){
  var obj = window[enemyList[i]];
  var armor = "None";
  if (obj.armor > 0){
    armor = obj.armor;
  }
  var info = '<p>'+enemyList[i]+'</p><span class="badge badge-primary">Health '+obj.hpMax+'</span><br><span class="badge badge-default">'+obj.desc+'</span><br><span class="badge badge-info">Speed '+obj.speed+'</span><br><span class="badge badge-success">Size '+obj.size+'</span><br><span class="badge badge-danger">Reward £'+obj.reward+'</span><br><span class="badge badge-warning">Armor '+armor+'</span>';
  var image = '<div class=enemy style="background-color: '+obj.color+';"></div>';
  var element = '<div class="box">'+image+info+'</div><hr>';
  
  $('#enemyInfo').append(element);
  
}

// map selection

$('#mapSelection img').click(function(){
  $('#mapSelection img').removeClass("active");
  $(this).addClass("active");
})

$('#box').hide();

$('#toggleEnemyInfo').click(function(){
  $('#enemyInfo').slideToggle(1000);
})
$('#enemyInfo').slideToggle();

document.onmousemove = function(mouse){
  mouseX = mouse.clientX - document.getElementById('canvas').getBoundingClientRect().left;
  mouseY = mouse.clientY - document.getElementById('canvas').getBoundingClientRect().top;
};

document.oncontextmenu = function(){
  turretSelected = "";
  return false;
}

function box(header, html, e){
  var isVisible = document.getElementById("box").style.display == "";
  if (isVisible) return;
  $('#box').show(500);
  $('#box').css({
    left: mouseX,
    top: mouseY,
  })
  $('#boxHeader').html(header);
  $('#boxhtml').html(html);
}

document.getElementById('canvas').onclick = function(e) {
  if (turretSelected == ""){
    for (var key in turrets){
      var dx = turrets[key].x - mouseX;
      var dy = turrets[key].y - mouseY;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 13){
        turrets[key].selected = true;
        break;
      }
      if (distance > 13){
        for (var key in turrets){
          turrets[key].selected = false;
          $('#box').hide(500);
        }
      }
    }
  }
  for (var key in enemies){
    var dx = enemies[key].x - mouseX;
    var dy = enemies[key].y - mouseY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemies[key].size + 3){
      enemies[key].selected = true;
      break;
    }
    if (distance > 13){
      for (var key in enemies){
        enemies[key].selected = false;
      }
    }
  }
  if (turretSelected == "bomb"){
    if (money >= 10){
      money -= 10;
      newRocket(mouseX,mouseY,0,0,5);
      if (money < 10 || !keys[16]){
        turretSelected = "";
      }
    }
    return;
  }
  if (turretSelected !== ""){
    newTurret(turretSelected);
    var notEnoughMoney = false;
    if (money < window[turretSelected].price[0]) notEnoughMoney = true;
    if (!keys[16] || notEnoughMoney){
      turretSelected = "";
    }
  }
};

$('.turret').click(function(){
  $('.turret').css({opacity: 0.3})
  var type = $(this).attr('data-name');
  turretSelected = type;
  $('.'+turretSelected+"Turret").css({
    opacity: 1,
  })
})

function chooseSpeed(newSpeed,btn){
  $(btn).parent().find("button").each(function(){
    $(this).removeClass("btn-success").addClass("btn-default");
  })
  $(btn).removeClass("btn-default").addClass("btn-success");
  speed = newSpeed;
}

function drawMap(){
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.strokeStyle = "brown";
  ctx.lineWidth=20;
  ctx.lineJoin='round'; 
  var lastPoint = null;
  for(var i = 0; i < pathPoints.length; i++) {
    var curPoint = pathPoints[i];
    if (i == 0){
      ctx.moveTo(curPoint.x, curPoint.y);
    }
    if (lastPoint)
      ctx.lineTo(curPoint.x, curPoint.y);
      // ctx.moveTo(curPoint.x, curPoint.y);
      lastPoint = curPoint;
    }
  ctx.stroke();
  ctx.lineWidth = 2;
}


function engine(){
  var dif = document.getElementById("difficulty").selectedIndex;
  $('#money').html(difficulties[dif]+"<br>"+lives+"&#10084;<br>"+currentWave+"&#128128;<br><span class='badge badge-default'>£"+Math.floor(money*10)/10)+"</span>";
  ctx.fillStyle = "green";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  
  var xpShow = (Math.floor(xp*10)/10).toLocaleString();
  var xpNShow = (Math.floor(xpN*10)/10).toLocaleString();
  
  var perc = xp/xpN * 100;
  $('#levelbar').css({
    width: perc+"%",
  }).html("Lvl "+level+" XP "+xpShow+"/"+xpNShow+" ("+(Math.floor(perc*100)/100)+"%)")
  
  if (xp >= xpN){
    xp -= xpN;
    level++;
    spop("You have unlocked a new tower!<br>+£5 starting money!");
    for (var s = 0; s < turretList.length; s++){
      var levelNeeded = window[turretList[s]].fromLevel;
      var cost = window[turretList[s]].price[0];
      if (levelNeeded == level){
        spop("You have unlocked "+turretList[s]+" turret!<br>It costs: £"+cost);
      }
    }
  }
  
  xpN = Math.pow(level+level,2);
  
  // disable / enable buttons in shops
  
  $('#homingBtn').attr('disabled', money <= 10);
  $('#xpBtn').attr('disabled', money <= 1 || currentWave <= 10);
  $('#lifeBtn').attr('disabled', money <= 100);
  
  
  if (lives <= 0){
    mission = "";
    if (currentWave >= 50 && currentWave <= 74){
      spop("You have earned a bronze medal and gained extra +250xp!");
      xp += 250;
    }
    if (currentWave >= 75 && currentWave <= 99){
      spop("You have earned a silver medal and gained extra +2 500xp!");
      xp += 2500;
    }
    if (currentWave >= 100){
      spop("You have eraned a gold medal and gained extra +25 000xp!");
      xp += 25000;
    }
    resetGame();
    $('#mainMenu').show(500);
    $('#mainGame').hide(500);
  }
  
  drawMap();
  
  for (var i = 1; i <= 6; i++){
    var element = "map"+i+"Highscore";
    var score = window["map"+i+"Highscore"];
    
    var medal = "";
    if (score >= 50){
      medal = " (Bronze medal)";
    }
    if (score >= 75){
      medal = " (Silver medal)";
    }
    if (score >= 100){
      medal = " (Gold medal)";
    }
    
    $('#'+element).html("Highscore: "+window[element]+medal);
  }
  if (currentWave <= 0){
    $('#continueBtn').hide();
  }
  
  for (var key in bullets){
    bulletEngine(bullets[key]);
    if (bullets[key].remove){
      delete bullets[key];
    }
  }
  
  for (var key in rockets){
    rocketEngine(rockets[key]);
    if (rockets[key].remove){
      delete rockets[key];
    }
  }
  
  for (var key in particles){
    particleEngine(particles[key]);
    if (particles[key].life <= 0){
      delete particles[key];
    }
  }
  
  for (var key in turrets){
    turretEngine(turrets[key]);
    if (turrets[key].sold){
      delete turrets[key];
    }
  }
  
  for (var key in enemies){
    enemyEngine(enemies[key]);
    if (enemies[key].hp <= 0){
      if (mission == "mission2" && enemies[key].hpMax == boss.hpMax){
        mission2BossesKilled++;
      }
      if (mission == "mission3" && enemies[key].hpMax == finalBoss.hpMax){
        finalBossKilled = true;
      }
      money += enemies[key].reward;
      xp += enemies[key].reward * Math.pow(difficulty,2);
      delete enemies[key];
    }
  }
  
  for (var key in popups){
    popupEngine(popups[key]);
    if (popups[key].life <= 0){
      delete popups[key];
    }
  }
  
  
  if (turretSelected == ""){
    $('.turret').css({
      opacity: 0.3,
    })
  }
  
  $('.turret').each(function(){
    if ($(this).attr('data-name') == "bomb") return true;
    var price = window[$(this).attr('data-name')].price[0];
    var levelNeeded = window[$(this).attr('data-name')].fromLevel;
    
    if (money >= price && level >= levelNeeded){
      $(this).parent().show();
    }
    if (money < price || level < levelNeeded){
      $(this).parent().hide();
    }
    
    $('#topMenu button').each(function(){
      var fromLevel = parseInt($(this).attr('data-fromLevel'));
      if (!fromLevel) return true;
      $(this).hide();
      if (level >= fromLevel){
        $(this).show();
      }
    })
    
  })
  var searchInput = $('#searchInput').val();
  
  if (searchInput.length >= 1){
    $('.turretContainer:visible').each(function(){
      var searchWord = $('#searchInput').val();
      var html = $(this).find("p:first-child").html().split(" ")[0];
      if (html.match(searchWord) == null){
        $(this).hide();
      }
    })
  }
  
  
  if (turretSelected !== "" && turretSelected !== "bomb"){
    var tower = window[turretSelected];
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mouseX,mouseY,tower.range[0],0,Math.PI*2,true);
    ctx.stroke();
    
    ctx.fillStyle = tower.color;
    ctx.strokeStyle = tower.strokeColor;
    ctx.beginPath();
    ctx.arc(mouseX,mouseY,10,0,Math.PI*2,true);
    ctx.stroke();
    ctx.fill();
  }
  if (turretSelected == "bomb"){
    ctx.fillStyle = "LightSlateGray";
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'LightSlateGray';
    ctx.strokeStyle = "LightSlateGray";
    ctx.fill();
    ctx.stroke();
    
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, explosionRadius,0,Math.PI*2,true);
    ctx.stroke();
  }
  
  if (turretSelected !== ""){
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Hold left shift to build multiple turrets.",10,280);
  }
  
  if (mission == "mission1" && mission1Completed == false && currentWave >= 50){
    spop("You have completed mission 1! Congratulations!");
    xp += 500;
    mission1Completed = true;
    lives = 0;
  }
  
  if (mission1Completed){
    $('#mission1 p:first-child').html("Mission 1 (completed!)");
  }
  if (mission2Completed){
    $('#mission2 p:first-child').html("Mission 2 (completed!)");
  }
  if (mission3Completed){
    $('#mission3 p:first-child').html("Mission 3 (completed!)");
  }
  
  if (mission2BossesKilled >= 10 && mission2Completed == false){
    mission2Completed = true;
    xp += 5000;
    spop("You have completed mission 2 well done!");
    lives = 0;
  }
  if (finalBossKilled && mission == "mission3" && mission3Completed == false){
    spop("You have completed the hardest boss challenge!");
    xp += 25e3;
    lives = 0;
    mission3Completed = true;
  }
  
  
  
  setTimeout(engine,1000/FPS);
}
engine();

function newBullet(x,y,vx,vy, dmg, homing, parent){
  if (!homing) homing = false;
  var id = Math.random();
  var b = {
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    dmg: dmg,
    remove: false,
    homing: homing,
  }
  bullets[id] = b;
}
function newRocket(x,y,vx,vy,dmg){
  var id = Math.random();
  var r = {
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    explosionRadius: explosionRadius,
    dmg: dmg,
    size: 10,
    remove: false,
    life: 100,
  }
  rockets[id] = r;
}
function newParticle(color,x,y){
  var id = Math.random();
  var vx = Math.random()*2 - 1;
  var vy = Math.random()*2 - 1;
  var life = 100;
  var p = {
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    color: color,
    life: life,
  }
  particles[id] = p;
}
function newTurret(turretType,x,y){
  if (money < window[turretType].price[0]) return;
  money -= window[turretType].price[0];
  var tx, ty;
  var id = Math.random();
  var color = window[turretType].color,
      outline = window[turretType].outline,
      range = window[turretType].range,
      dmg = window[turretType].dmg,
      fireRate = window[turretType].fireRate,
      type = window[turretType].type,
      maxBullets = window[turretType].maxBullets,
      price = window[turretType].price,
      name = window[turretType].name;
  tx = x;
  ty = y;
  if (!x){tx = mouseX;}
  if (!y){ty = mouseY;}
  
  var t = {
    x: tx,
    y: ty,
    color: color,
    outline: outline,
    range: range,
    dmg: dmg,
    type: type,
    fire: 0,
    id: id,
    fireRate: fireRate,
    maxBullets: maxBullets,
    selected: false,
    price: price,
    kills: 0,
    name: name,
    level: 0,
    target: 'first',
    sold: false,
    sellPrice: price[0] * 0.85,
    disabled: 100,
  }
  turrets[id] = t;
}
function newEnemy(type,newX,newY,path){
  if (!type) type = "basic";
  var id = Math.random();
  var speed = window[type].speed;
  var hpMax = window[type].hpMax * difficulty;
  var color = window[type].color;
  var size = window[type].size;
  var reward = window[type].reward;
  var armorMax = window[type].armor;
  if (!armorMax){
    armorMax = 0;
  }
  var special = "";
  var pathNode = 0;
  var name = type;
  var x = pathPoints[0].x;
  var y = pathPoints[0].y
  if (window[type].special){
    special = window[type].special;
  }
  if (newX){x = newX;}
  if (newY){y = newY;}
  if (path){pathNode = path;}
  
  
  var e = {
    x: x,
    vx: speed,
    y: y,
    vy: 0,
    speed: speed,
    hp: hpMax,
    hpMax: hpMax,
    color: color,
    id: id,
    size: size,
    damageToReceive: hpMax,
    selected: false,
    pathNode: pathNode,
    reward: reward,
    special: special,
    offMap: false,
    name: name,
    armor: armorMax,
    armorMax: armorMax,
  }
  enemies[id] = e;
}
function newPopup(text,x,y){
  var id = Math.random();
  var life = 100;
  var p = {
    x: x,
    y: y,
    life: life,
    id: id,
    text: text,
  }
  popups[id] = p;
}

function bulletEngine(bullet){
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, 2, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'black';
  ctx.strokeStyle = "black";
  ctx.fill();
  ctx.stroke();
  
  
  if (bullet.homing){
    var smallestKey = "none";
    var distance = 1e99;
    for (var key in enemies){
      if (enemies[key].offMap) continue;
      var range = Math.sqrt(Math.pow(enemies[key].y - bullet.y,2) + Math.pow(enemies[key].x - bullet.x,2));
      if (distance > range){
        distance = range;
        smallestKey = key;
      }
    }
    if (smallestKey == "none"){
      var time = Math.floor(Date.now()/100) * 0.2;
      bullet.vx = Math.sin(time);
      bullet.vy = Math.cos(time);
    }
    if (smallestKey !== "none"){
      bullet.vx = ((enemies[smallestKey].x - bullet.x) / distance) * 3;
      bullet.vy = ((enemies[smallestKey].y - bullet.y) / distance) * 3;
    }
  }
  
  bullet.x += bullet.vx*speed;
  bullet.y += bullet.vy*speed;
  
  if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height){
    for (var i = 0; i < 10; i++){
      newParticle("black",bullet.x,bullet.y)
    }
    bullet.remove = true;
  }
  
}

function rocketEngine(rocket){
  ctx.fillStyle = "LightSlateGray";
  ctx.beginPath();
  ctx.arc(rocket.x, rocket.y, rocket.size/2, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'LightSlateGray';
  ctx.strokeStyle = "LightSlateGray";
  ctx.fill();
  ctx.stroke();
  
  newParticle("red",rocket.x+rocket.size/2,rocket.y+rocket.size/2);
  newParticle("orange",rocket.x+rocket.size/2,rocket.y+rocket.size/2);
  
  
  rocket.x += rocket.vx*speed;
  rocket.y += rocket.vy*speed;
  
  if (rocket.x < 0 || rocket.x > canvas.width || rocket.y < 0 || rocket.y > canvas.height){
    for (var i = 0; i < 10; i++){
      newParticle("red",rocket.x,rocket.y)
      newParticle("orange",rocket.x,rocket.y);
    }
    rocket.remove = true;
  }
  
  for (var key in enemies){
    if (enemies[key].x < rocket.x + rocket.size && enemies[key].x + enemies[key].size > rocket.x && enemies[key].y < rocket.y + enemies[key].size && enemies[key].size + enemies[key].y > rocket.y){
      for (var key in enemies){
        var range = Math.sqrt(Math.pow(enemies[key].y - rocket.y,2) + Math.pow(enemies[key].x - rocket.x,2));
        if (range <= rocket.explosionRadius){
          var dmg = rocket.dmg/Math.sqrt(range);
          for (var i = 0; i < 2; i++){
            newParticle("orange",rocket.x,rocket.y);
            newParticle("red",rocket.x,rocket.y);
          }
          enemies[key].hp -= dmg;
          rocket.remove = true;
        }
      }
    }
    
  }
  
  rocket.life--;
  if (rocket.life <= 0){
    rocket.remove = true;
  }
  
}

function particleEngine(particle){
  ctx.fillStyle = particle.color;
  ctx.fillRect(particle.x,particle.y,particle.life/40,particle.life/40);
  
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.life--;
}

function turretEngine(turret){
  if (turret.fire < turret.fireRate[turret.level] && turret.disabled <= 0 && turret.type !== "money"){
    turret.fire+=speed;
    if (turret.fire >= turret.fireRate[turret.level]){
      turret.fire = turret.fireRate[turret.level];
    }
  }
  if (turret.fire < turret.fireRate[turret.level] && turret.disabled <= 0 && turret.type == "money"){
    var enemiesAlive = 0;
    for (var key in enemies){
      if (enemies[key].offMap == false && enemies[key].hp > 0){
        enemiesAlive++;
      }
    }
    if (enemiesAlive > 0){
      turret.fire+=speed*enemiesAlive;
    }
  }
  
  ctx.beginPath();
  ctx.arc(turret.x, turret.y, 10, 0, 2 * Math.PI, false);
  ctx.fillStyle = turret.color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = turret.outline;
  ctx.stroke();
  
  if (turret.disabled > 0){
    turret.disabled -= 1 * speed;
    ctx.fillStyle = "black";
    ctx.fillRect(turret.x-10, turret.y+15, 20, 5);
    
    ctx.fillStyle = "red";
    ctx.fillRect(turret.x-10, turret.y+15, turret.disabled / 5, 5);
  }
  
  var perc = turret.fire / turret.fireRate[turret.level];
  
  ctx.fillStyle = "black";
  ctx.fillRect(turret.x-10, turret.y+10, 20, 5);

  ctx.fillStyle = "yellow";
  ctx.fillRect(turret.x-10, turret.y+10, 20 * perc, 5);
  
  var bulletsShot = 0;
  var inRange = 0;
  
  for (var key in enemies){
    var range = Math.sqrt(Math.pow(enemies[key].y - turret.y,2) + Math.pow(enemies[key].x - turret.x,2));
    if (range <= turret.range[turret.level]){
      inRange++;
    }
  }
  
  if (turret.fire >= turret.fireRate[turret.level]){
    
    if (turret.type == "money"){
      var text = "+£"+turret.dmg[turret.level];
      newPopup(text,turret.x,turret.y);
      money += turret.dmg[turret.level];
      turret.fire = 0;
    }
    
    for (var key in enemies){
      if (enemies[key].offMap) continue;
      var range = Math.sqrt(Math.pow(enemies[key].y - turret.y,2) + Math.pow(enemies[key].x - turret.x,2));
      if (range <= turret.range[turret.level] && turret.type == "laser" /*&& enemies[key].damageToReceive > 0*/){
        if (bulletsShot >= turret.maxBullets[turret.level]) break;
        turret.fire = 0;
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(turret.x,turret.y);
        ctx.lineTo(enemies[key].x+enemies[key].size/2,enemies[key].y+enemies[key].size/2);
        ctx.stroke();
        newParticle("red",enemies[key].x+enemies[key].size/2,enemies[key].y+enemies[key].size/2)
        sounds.shoot.play();
        if (enemies[key].armor > 0){
          enemies[key].armor -= turret.dmg[turret.level];
        } else {
          enemies[key].hp -= turret.dmg[turret.level];
        }
        bulletsShot++;
        enemies[key].damageToReceive -= turret.dmg[turret.level];
      }
      if (range <= turret.range[turret.level] && turret.type == "bullet" /*&& enemies[key].damageToReceive > 0*/){
        if (bulletsShot >= turret.maxBullets[turret.level]) break;
        turret.fire = 0;
        var speedX = ((enemies[key].x - turret.x) / range) * 4;
        var speedY = ((enemies[key].y - turret.y) / range) * 4;
        newBullet(turret.x,turret.y,speedX+enemies[key].vx,speedY+enemies[key].vy,turret.dmg[turret.level]);
        sounds.shoot.play();
        bulletsShot++;
        enemies[key].damageToReceive -= turret.dmg[turret.level];
      }
      
      if (range <= turret.range[turret.level] && turret.type == "rocket" /*&& enemies[key].damageToReceive > 0*/){
        if (bulletsShot >= turret.maxBullets[turret.level]) break;
        turret.fire = 0;
        var speedX = ((enemies[key].x - turret.x) / range) * 3;
        var speedY = ((enemies[key].y - turret.y) / range) * 3;
        newRocket(turret.x,turret.y,speedX+enemies[key].vx,speedY+enemies[key].vy,turret.dmg[turret.level]);
        sounds.shoot.play();
        bulletsShot++;
      }
      if (range <= turret.range[turret.level] && turret.type == "split" /*&& enemies[key].damageToReceive > 0*/){
        if (bulletsShot >= turret.maxBullets[turret.level]) break;
        if (inRange > turret.maxBullets[turret.level]) inRange = turret.maxBullets[turret.level];
        turret.fire = 0;
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.moveTo(turret.x,turret.y);
        ctx.lineTo(enemies[key].x+enemies[key].size/2,enemies[key].y+enemies[key].size/2);
        ctx.stroke();
        sounds.shoot.play();
        if (enemies[key].armor > 0){
          enemies[key].armor -= (turret.dmg[turret.level])/inRange;
        }
        else {
          enemies[key].hp -= (turret.dmg[turret.level])/inRange;
        }
        
        bulletsShot++;
        enemies[key].damageToReceive -= (turret.dmg[turret.level])/inRange;
      }
      if (range <= turret.range[turret.level] && turret.type == "ring" /*&& enemies[key].damageToReceive > 0*/){
        var maxBullets = turret.maxBullets[turret.level];
        var increment = (Math.PI*2)/maxBullets;
        turret.fire = 0;
        for (var i = 0; i < maxBullets; i++){
          var speedX = Math.sin(increment*i) * 2;
          var speedY = Math.cos(increment*i) * 2;
          newBullet(turret.x,turret.y,speedX,speedY,turret.dmg[turret.level]);
        }
        sounds.shoot.play();
        enemies[key].damageToReceive -= turret.dmg[turret.level];
        break;
      }
      if (range <= turret.range[turret.level] && turret.type == "chain" /*&& enemies[key].damageToReceive > 0*/){
        turret.fire = 0;
        srcPoint = [turret.x,turret.y];
        destPoint = [enemies[key].x+enemies[key].size / 2,enemies[key].y+enemies[key].size / 2];
        go();
        
        if (enemies[key].armor > 0){
          enemies[key].armor -= turret.dmg[turret.level];
        }
        if (enemies[key].armor <= 0){
          enemies[key].hp -= turret.dmg[turret.level];
        }
        
        for (var key2 in enemies){
          if (enemies[key].id == enemies[key2].id || enemies[key].offMap || enemies[key2].offMap) continue;
          if (bulletsShot >= turret.maxBullets[turret.level]) break;
          var range = Math.sqrt(Math.pow(enemies[key2].y - enemies[key].y,2) + Math.pow(enemies[key2].x - enemies[key].x,2));
          if (range <= 100){
            srcPoint = [enemies[key].x+enemies[key].size/2,enemies[key].y+enemies[key].size/2];
            destPoint = [enemies[key2].x+enemies[key2].size/2,enemies[key2].y+enemies[key2].size/2];
            go();
            bulletsShot++;
            if (enemies[key2].armor > 0){
              enemies[key2].armor -= turret.dmg[turret.level];
            }
            if (enemies[key2].armor <= 0){
              enemies[key2].hp -= turret.dmg[turret.level];
            }
          }
        }
        break;
      }
      if (range <= turret.range[turret.level] && turret.type == "homing" /*&& enemies[key].damageToReceive > 0*/){
        if (bulletsShot >= turret.maxBullets[turret.level]) break;
        turret.fire = 0;
        var speedX = ((enemies[key].x - turret.x) / range) * 4;
        var speedY = ((enemies[key].y - turret.y) / range) * 4;
        newBullet(turret.x,turret.y,speedX+enemies[key].vx,speedY+enemies[key].vy,turret.dmg[turret.level],true);
        sounds.shoot.play();
        bulletsShot++;
        enemies[key].damageToReceive -= turret.dmg[turret.level];
      }
      if (range <= turret.range[turret.level] && turret.type == "pusher" /*&& enemies[key].damageToReceive > 0*/){
        turret.fire = 0;
        enemies[key].x -= enemies[key].vx*10;
        enemies[key].y -= enemies[key].vy*10;
      }
    }
  }
  
  
  if (turret.selected){
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(turret.x,turret.y,turret.range[turret.level],0,Math.PI*2,true);
    ctx.stroke();
    ctx.font = "600 16px Arial bold";
    ctx.fillStyle = "black";
    
    var price = turret.price[turret.level];
    
    var sellPrice = Math.floor(turret.sellPrice);
    
    var target = "";
    
    $('#sellBtn').click(function(){
      sellTurret(turret);
    })
    
    if (turret.level+1 >= turret.range.length){
      $('#upgradeBtn').hide();
      var stats = '<span class="badge badge-danger">Damage: '+turret.dmg[turret.level]+'</span><br><span class="badge badge-info">Range: '+turret.range[turret.level]+'</span><br><span class="badge badge-success">Fire rate: '+(1/(turret.fireRate[turret.level]/FPS)).toFixed(1)+' / sec</span><br><span class="badge badge-warning">Max Level!</span><hr>Attacks '+turret.maxBullets[turret.level]+' target(s) at once.<hr>'+target+"<hr>"+'<button class="btn btn-danger" id=sellBtn>Sell for £'+sellPrice+'</button>';
      box(turret.name+"<br>Kills: "+turret.kills,stats);
      return;
    }
    
    var price = turret.price[turret.level+1];
    var newDmg = turret.dmg[turret.level+1];
    var newRange = turret.range[turret.level+1];
    var newFireRate = turret.fireRate[turret.level+1];
    
    
    var stats = '<span class="badge badge-danger">Damage: '+turret.dmg[turret.level]+'</span><br><span class="badge badge-info">Range: '+turret.range[turret.level]+'</span><br><span class="badge badge-success">Fire rate: '+(1/(turret.fireRate[turret.level]/FPS)).toFixed(1)+' / sec</span><br>Attacks '+turret.maxBullets[turret.level]+' target(s) at once.<hr>'+target+"<hr>";
    var btn = '<div class=btn-group><button class="btn btn-danger" id=sellBtn>Sell for £'+sellPrice+'</button><button class="btn btn-success" id=upgradeBtn>Upgrade for £'+price+'</button></div>';
    box(turret.name+"<br>Kills: "+turret.kills+"<br>Level: "+turret.level,stats+btn);
    
    
    $('#upgradeBtn').click(function(){
      upgrade(turret);
      clicked = true;
    })
    $('#upgradeBtn').mouseover(function(){
      var newStats = '<span class="badge badge-danger">Damage: '+newDmg+'</span><br><span class="badge badge-info">Range: '+newRange+'</span><br><span class="badge badge-success">Fire rate: '+(1/(newFireRate/FPS)).toFixed(1)+' / sec</span><br>Attacks '+turret.maxBullets[turret.level+1]+' target(s) at once.<hr>'+target+"<hr>";
      $('#boxhtml').html(newStats+btn);
    }).mouseout(function(){
      $('#boxhtml').html(stats+btn);
    })
  }
  
}

function enemyEngine(entity){
  if (entity.offMap) return;
  ctx.fillStyle = entity.color;
  ctx.fillRect(entity.x,entity.y,entity.size,entity.size);
  
  var amountOfBullets = 0;
  
  for (var key in bullets){
    amountOfBullets++;
    if (entity.x < bullets[key].x + 5 && entity.x + entity.size > bullets[key].x && entity.y < bullets[key].y + 5 && entity.size + entity.y > bullets[key].y){
      if (entity.armor > 0){
        entity.armor -= bullets[key].dmg;
      }
      else {
        entity.hp -= bullets[key].dmg;
      }
      newPopup("-"+(Math.floor(bullets[key].dmg*10)/10),entity.x,entity.y);
      for (var i = 0; i < 5; i++){
        newParticle("black",bullets[key].x,bullets[key].y);
      }
      delete bullets[key];
    }
  }
  
  if (amountOfBullets == 0){
    entity.damageToReceive = entity.hp;
  }
  
  
  var perc = entity.hp / entity.hpMax;
  
  if (perc > 1){
    perc = 1;
  }
  
  ctx.fillStyle = "black";
  ctx.fillRect(entity.x, entity.y-10, entity.size, 5);

  ctx.fillStyle = "red";
  ctx.fillRect(entity.x, entity.y-10, entity.size * perc, 5);
  // overheal bar
  if (entity.hp > entity.hpMax){
    perc = (entity.hp / entity.hpMax - 1) * 2;
    ctx.fillStyle = "lime";
    ctx.fillRect(entity.x, entity.y-10, entity.size * perc, 5);
  }
  // armour bar
  if (entity.armor > 0){
    perc = (entity.armor) / entity.armorMax;
    ctx.fillStyle = "black";
    ctx.fillRect(entity.x, entity.y-15, entity.size, 5);
    ctx.fillStyle = "SlateGray";
    ctx.fillRect(entity.x, entity.y-15, entity.size * perc, 5);
  }
  
  if (entity.selected){
    ctx.font = "600 14px Arial bold";
    ctx.fillStyle = "black";
    ctx.fillText(entity.name,entity.x-10,entity.y-20);
    ctx.fillText((Math.floor(entity.hp*10)/10).toLocaleString()+" hp",entity.x-10,entity.y-10);
  }
  
  var path = entity.pathNode;
  
//   if (entity.y > pathPoints[path].y){
//     entity.vy = -entity.speed;
//   }
//   if (entity.y < pathPoints[path].y){
//     entity.vy = entity.speed;
//   }
//   if (entity.x < pathPoints[path].x){
//     entity.vx = entity.speed;
//   }
//   if (entity.x > pathPoints[path].x){
//     entity.vx = -entity.speed;
//   }
//   if (entity.x == pathPoints[path].x){
//     entity.vx = 0;
//   }
//   if (entity.y == pathPoints[path].y){
//     entity.vy = 0;
//   }
  
  
  if (entity.x-entity.speed*2 <= pathPoints[path].x && entity.x+entity.speed*2 >= pathPoints[path].x && entity.y-entity.speed*2 <= pathPoints[path].y && entity.y+entity.speed*2 >= pathPoints[path].y){
    entity.pathNode++;
    if (entity.pathNode >= pathPoints.length){
      entity.offMap = true;
      lives--;
    }
  }
  
//   if (entity.vx !== 0){
//     entity.x += entity.vx*speed;
//   }
//   if (entity.vy !== 0){
//     entity.y += entity.vy*speed;
//   }
  
  if (entity.special == "straight" && entity.pathNode < pathPoints.length - 3){
    entity.pathNode = pathPoints.length - 3;
  }
  
  var dist = Math.sqrt(Math.pow(entity.y - pathPoints[path].y,2) + Math.pow(entity.x - pathPoints[path].x,2));
  
  entity.vx = ((pathPoints[path].x - entity.x) / dist) * entity.speed;
  entity.vy = ((pathPoints[path].y - entity.y) / dist) * entity.speed;
  
  
  
  if (isNaN(entity.vx) == false && isNaN(entity.vy) == false){
    entity.x += entity.vx * speed;
    entity.y += entity.vy * speed;
  }
  
  if (entity.special == "heal" && entity){
    for (var key in enemies){
      if (enemies[key].id == entity.id) continue;
      var range = Math.sqrt(Math.pow(enemies[key].y - entity.y,2) + Math.pow(enemies[key].x - entity.x,2));
      if (range <= 15 && enemies[key].hp < enemies[key].hpMax*1.5){
        enemies[key].hp += 0.1 * speed;
      }
    }
    if (entity.hp < entity.hpMax){
      entity.hp += (1/25)*speed;
    }
    
  }
  
  if (entity.special == "teleport"){
    for (var key in enemies){
      if (enemies[key].id == entity.id) continue;
      var range = Math.sqrt(Math.pow(enemies[key].y - entity.y,2) + Math.pow(enemies[key].x - entity.x,2));
      var rand = Math.random();
      var chance = 10; // chance in %
      if (range <= 15 && rand < chance/100){
        enemies[key].x += enemies[key].vx * 10;
        enemies[key].y += enemies[key].vy * 10;
      }
    }
    var rand = Math.random();
    if (rand < 0.05){
      entity.x += entity.vx * 10;
      entity.y += entity.vy * 10;
    }
  }
  
  if (entity.special.split(" ")[0] == "summon"){
    var what = entity.special.split(" ")[1];
    var rand = Math.random();
    if (rand < 0.025){ // 2.5%
      newEnemy(what, entity.x, entity.y, entity.pathNode);
    }
  }
  
  if (entity.special == "shield"){
    for (var key in bullets){
      var range = Math.sqrt(Math.pow(bullets[key].y - entity.y,2) + Math.pow(bullets[key].x - entity.x,2));
      var rand = Math.random();
      if (range <= 50 && rand < 0.25){
        for (var i = 0; i < 10; i++){
          newParticle("gold",bullets[key].x,bullets[key].y);
        }
        delete bullets[key];
      }
    }
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.arc(entity.x+entity.size/2, entity.y+entity.size/2, 50, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  if (entity.special == "disable"){
    for (var key in turrets){
      var range = Math.sqrt(Math.pow(turrets[key].y - entity.y,2) + Math.pow(turrets[key].x - entity.x,2));
      var disableTime = Math.random()*80 + 20; // 20 - 100
      var rand = Math.random();
      if (range <= 35 && rand < 0.05){ // 5%
        turrets[key].disabled = disableTime;
      }
    }
  }
  if (entity.special == "run"){
    if (entity.hp < entity.hpMax/2){
      entity.speed = 3;
    }
  }
  
  if (entity.special == "repair"){
    for (var key in enemies){
      if (enemies[key].id == entity.id) continue;
      var range = Math.sqrt(Math.pow(enemies[key].y - entity.y,2) + Math.pow(enemies[key].x - entity.x,2));
      if (range <= 25 && enemies[key].armor < enemies[key].armorMax){
        enemies[key].armor += 0.05 * speed;
      }
    }
    if (entity.armor < entity.armorMax){
      entity.armor += (1/25)*speed;
    }
  }
  
}

function popupEngine(popup){
    ctx.font = "12px Sans-serif";
    ctx.fillStyle = 'white';
    ctx.fillText(popup.text,popup.x,popup.y-(100 - popup.life)/4);
  popup.life-= 5;
}


function wave(type, amount, time, quick){
  if (!time) time = 1000;
  if (!quick) quick = false;
  var sent = 0;
  function newWave(){
    newEnemy(type);
    sent++;
    if (sent < amount && quick){
      setTimeout(newWave,time/(sent/2));
    }
    if (sent < amount && quick == false){
      setTimeout(newWave,time);
    }
  }
  newWave();
}

function nextWave(){
  /////////////////
  //// ENEMIES ////
  /////////////////
  /*
  
  group
  basic
  fast
  heavy
  boss
  healer
  teleporter
  fast boss
  shielder
  disabler
  
  */
  if (currentWave == -2) return;
  var enemiesLeft = 0;
  for (var key in enemies){
    if (enemies[key].offMap == false){
      enemiesLeft++;
    }
  }
  if (enemiesLeft > 10){
    $('#nextWaveBtn').html("Too many enemies!");
    setTimeout(function(){
      $('#nextWaveBtn').html("Next wave");
    },2000);
    return;
  }
  
  var highscore = window[selectedMap+"Highscore"];
  if (currentWave > highscore){
    window[selectedMap+"Highscore"]++;
  }
  
  currentWave++;
  if (currentWave == 1){
    wave("basic",2);
  }
  if (currentWave == 2){
    wave("basic",5);
  }
  if (currentWave == 3){
    wave("basic",8,1500);
  }
  if (currentWave == 4){
    wave("basic",4,500,true);
  }
  if (currentWave == 5){
    wave("runner",1,1000);
  }
  if (currentWave == 6){
    wave("group",5,100);
  }
  if (currentWave == 7){
    wave("basic",5,1000,true);
  }
  if (currentWave == 8){
    wave("group",10,1500,true);
  }
  if (currentWave == 9){
    wave("fast",2);
  }
  if (currentWave == 10){
    wave("basic",10,1);
  }
  if (currentWave == 11){
    wave("fast",5);
    wave("runner",1);
  }
  if (currentWave == 12){
    wave("basic",15,500,true);
  }
  if (currentWave == 13){
    wave("fast",5);
  }
  if (currentWave == 14){
    wave("basic",20,500,true);
  }
  if (currentWave == 15){
    wave("heavy",1);
    wave("runner",2);
  }
  if (currentWave == 16){
    wave("basic",20,500,true);
  }
  if (currentWave == 17){
    wave("group",20,100,true);
    wave("engineer",1);
  }
  if (currentWave == 18){
    wave("healer",1);
  }
  if (currentWave == 19){
    wave("basic",10);
    wave("fast",5);
    wave("group",5);
  }
  if (currentWave == 20){
    wave("heavy",2);
    wave("group",10);
    wave("runner",5);
    wave("scout",2);
  }
  if (currentWave == 21){
    wave("healer",3,1000,true);
    wave("basic",19,1000,true);
  }
  if (currentWave == 22){
    wave("basic",40,2000,true);
  }
  if (currentWave == 23){
    wave("group",40,1800,true);
  }
  if (currentWave == 24){
    wave("heavy",3);
    wave("healer",1);
    wave("scout",3);
  }
  if (currentWave == 25){
    wave("healer",5,500,true);
    wave("scout",2);
  }
  if (currentWave == 26){
    wave("basic",50,1000,true);
  }
  if (currentWave == 27){
    wave("basic",50,500,true);
  }
  if (currentWave == 28){
    wave("heavy",4);
    wave("scout",5);
  }
  if (currentWave == 29){
    wave("basic",20,5);
    wave("healer",2,5);
  }
  if (currentWave == 30){
    wave("boss",1);
    wave("engineer",1);
  }
  if (currentWave == 31){
    wave("teleporter",5);
  }
  if (currentWave == 32){
    wave("teleporter",5);
    wave("basic",20);
  }
  if (currentWave == 33){
    wave("group",30,1000,true);
    wave("teleporter",5);
  }
  if (currentWave == 34){
    wave("shielder",10);
    wave("teleporter",2);
  }
  if (currentWave == 35){
    wave("shielder",10);
    wave("teleporter",5);
    wave("basic",20);
  }
  if (currentWave == 36){
    wave("basic",50,2000,true);
    wave("group",50,2000,true);
    setTimeout(function(){
      wave("healer",3);
    },10000);
  }
  if (currentWave == 37){
    wave("teleporter",5);
    wave("fast",10);
    wave("healer",2);
    wave("shielder",4);
  }
  if (currentWave == 38){
    wave("disabler",10);
  }
  if (currentWave == 39){
    wave("heavy",20,1000,true);
  }
  if (currentWave == 40){
    wave("basic",100,1000,true);
  }
  if (currentWave == 41){
    wave("group",125,1000,true);
  }
  if (currentWave == 42){
    wave("basic",20,1000,true);
    wave("healer",3,1000,true);
    wave("healer",3,1000,true);
  }
  if (currentWave == 43){
    wave("heavy",20,500,true);
    wave("engineer",2);
  }
  if (currentWave == 44){
    wave("boss",3);
    wave("scout",3);
  }
  if (currentWave == 45){
    wave("healer",5);
    wave("basic",30);
    wave("heavy",3);
    wave("fast",25,1000,true);
    wave("teleporter",2);
    wave("shielder",5);
  }
  if (currentWave == 46){
    wave("disabler",10);
    wave("healer",5);
    wave("heavy",10);
    wave("fast",25);
    wave("basic",40);
    wave("group",10);
  }
  if (currentWave == 47){
    wave("disabler",20,1000,true);
  }
  if (currentWave == 48){
    wave("teleporter",20,1000,true);
  }
  if (currentWave == 49){
    wave("boss",4);
    wave("runner",10,250,true);
    wave("engineer",5);
  }
  if (currentWave == 50){
    wave("fastBoss",1);
  }
  if (currentWave >= 51){
    endless();
  }
  
  save();
  
}


function upgrade(turret){
  var price = turret.price[turret.level+1];
  if (clicked) return;
  if (money >= price){
    money -= price;
    turret.level++;
    var stats = '<span class="badge badge-default">£'+price+'</span><br><span class="badge badge-danger">Damage: '+turret.dmg[turret.level]+'</span><br><span class="badge badge-info">Range: '+turret.range[turret.level]+'</span><br><span class="badge badge-success">Fire rate: '+(1/(turret.fireRate[turret.level]/FPS)).toFixed(1)+' / sec</span><br>Attacks '+turret.maxBullets[turret.level]+' target(s) at once.<hr>';
    var btn = '<button class="btn btn-default" id=upgradeBtn>Upgrade</button>';
    box(turret.name+"<br>Kills: "+turret.kills,stats+btn);
    turret.sellPrice += price * 0.85;
    turret.disabled = 100;
    turret.fire = 0;
  }
  setTimeout(function(){
    clicked = false;
  },1000)
}

function sellTurret(turret){
  if (turret.sold) return;
  money += turret.sellPrice;
  turret.sold = true;
  $('#box').hide(500);
}

$('#box').draggable({
  containment: 'body',
});

function resetGame(){
  turrets = {};
  bullets = {};
  particles = {};
  rockets = {};
  lives = 20;
  money = 25 + level * 5;
  speed = 1;
  currentWave = 0;
  $('#box').hide();
  setTimeout(function(){
    enemies = {};
  },100);
}

function endless(){
  var points = Math.floor(Math.pow(1.13,currentWave)) + 0.5;
  
  if (currentWave == 100){
    wave("finalBoss",1);
    return;
  }
  
  function generateRandomWave(){
    enemySpawned = false;
    if (!enemySpawned && points >= 400) {
      wave("fastBoss",1);
      enemySpawned = true;
      points -= 400;
    }
    if (!enemySpawned && points >= 250) {
      wave("boss",1);
      enemySpawned = true;
      points -= 250;
    }
    if (!enemySpawned && points >= 75) {
      wave("healer",1);
      enemySpawned = true;
      points -= 75;
    }
    if (!enemySpawned && points >= 50) {
      wave("heavy",1);
      enemySpawned = true;
      points -= 50;
    }
    if (!enemySpawned && points >= 50) {
      wave("engineer",1);
      enemySpawned = true;
      points -= 50;
    }
    if (!enemySpawned && points >= 50) {
      wave("shielder",1);
      enemySpawned = true;
      points -= 50;
    }
    if (!enemySpawned && points >= 45) {
      wave("runner",1);
      enemySpawned = true;
      points -= 45;
    }
    if (!enemySpawned && points >= 35) {
      wave("teleporter",1);
      enemySpawned = true;
      points -= 35;
    }
    if (!enemySpawned && points >= 25) {
      wave("disabler",1);
      enemySpawned = true;
      points -= 25;
    }
    if (!enemySpawned && points >= 10) {
      wave("scout",1);
      enemySpawned = true;
      points -= 10;
    }
    if (!enemySpawned && points >= 1) {
      wave("fast",1);
      enemySpawned = true;
      points -= 5;
    }
    if (!enemySpawned && points >= 0.2) {
      wave("basic",1);
      enemySpawned = true;
      points -= 2;
    }
    if (!enemySpawned && points >= 0.1) {
      wave("group",1);
      enemySpawned = true;
      points -= 1;
    }
    
    if (points > 0){
      setTimeout(generateRandomWave,100);
    }
    
  }
  generateRandomWave();
}

var variables = ["level","xp","xpN","money","lives","difficulty","currentWave","map1Highscore","map2Highscore","map3Highscore","map4Highscore","map5Highscore","map6Highscore","selectedMap","mission1Completed","mission2Completed","mission3Completed","mission2BossesKilled"];

function save(){
  for (var i = 0; i < variables.length; i++){
    localStorage.setItem(variables[i], JSON.stringify(window[variables[i]]));
  }
  localStorage.setItem("enemies",JSON.stringify(enemies));
  localStorage.setItem("turrets",JSON.stringify(turrets));
  localStorage.setItem("bullets",JSON.stringify(bullets));
  localStorage.setItem("rockets",JSON.stringify(rockets));
}

function load(){
  spop("Loaded game successfully! Game has been paused, change speed when ready.");
  for (var i = 0; i < variables.length; i++){
    if (!JSON.parse(localStorage.getItem(variables[i]))) continue;
    window[variables[i]] = JSON.parse(localStorage.getItem(variables[i]));
  }
  speed = 0;
  enemies = JSON.parse(localStorage.getItem("enemies"));
  turrets = JSON.parse(localStorage.getItem("turrets"));
  bullets = JSON.parse(localStorage.getItem("bullets"));
  rockets = JSON.parse(localStorage.getItem("rockets"));
  pathPoints = window[selectedMap];
  $('#continueBtn').html("Continue on wave "+currentWave);
  if (currentWave > 0){
    $('#continueBtn').fadeIn();
  }
}


setTimeout(load,1000);

setInterval(save,2000);



var seed;
function random() {
    var x = Math.sin(seed+=1000) * 10000;
    return x - Math.floor(x);
}

function lightning(gameTime, start, end){
  gameTime = Math.round(gameTime/ 25);
  var variance = (Math.max(Math.abs(start[0]-end[0]), Math.abs(start[1]-end[1])));
  var points = [start];
  var pointCount = variance/10;
  seed = gameTime;
  for(let i=0;i<pointCount+1;i++){
    let nextPoint = [
      start[0] + (end[0]-start[0]) * (i/pointCount),
      start[1] + (end[1]-start[1]) * (i/pointCount),
    ];
    nextPoint[0] += random()*Math.sqrt(variance);
    nextPoint[1] += random()*Math.sqrt(variance);
    points.push(nextPoint);
  }
  return points;
}

function drawLightning(points, final, aura){
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  points.forEach(point=> ctx.lineTo(point[0],point[1]));
  
  if(aura){
    ctx.strokeStyle = 'rgba(39,0,255,0.3)';
    ctx.lineWidth = 14;
    ctx.stroke();
    return;
  }
  
  ctx.strokeStyle = 'rgba(158,0,255,0.2)';
  ctx.lineWidth=7;
  ctx.stroke();
  ctx.lineWidth=4;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.5)';
  ctx.lineWidth=2.5;
  ctx.stroke();
  if(final !== false){
  ctx.strokeStyle = 'white';
  ctx.lineWidth=0.5;
  ctx.stroke();
  }
}

var srcPoint;
var destPoint = [0,0];

function go(){
  // base hue
  var path = lightning(Date.now(), srcPoint, destPoint);
  drawLightning(path,null,true);
  // ghosts
  ctx.globalAlpha = 0.25;
  // drawLightning(lightning(Date.now()-25, srcPoint, destPoint), false);
  drawLightning(lightning(Date.now()+25, srcPoint, destPoint), false);
  // main lightning
  ctx.globalAlpha = 1;
  drawLightning(path);
// requestAnimationFrame(go);
}

go();

// let updateDest = (e) => {destPoint = [e.clientX,e.clientY];go()};
// canvas.addEventListener('mousemove', updateDest);
// canvas.addEventListener('touchmove', updateDest);

function buy(what){
  if (what == "homing"){
    if (money >= 10){
      money -= 10;
      for (var s = 0; s < 5; s++){
        for (var j = 0; j < 5; j++){
          var centerX = (canvas.width / 2 - 50) + 10*s;
          var centerY = canvas.height / 2 + 10 * j;
          newBullet(centerX,centerY,0,0,1,true);
        }
      }
    }
  }
  if (what == "xp"){
    if (money >= 1 && currentWave >= 10){
      money -= 1;
      xp++;
    }
  }
  if (what == "life"){
    var turretExists = false;
    for (var key in turrets){
      if (turrets[key].type !== "money"){
        turretExists = true;
        break;
      }
    }
    if (money >= 100 && turretExists){
      money -= 100;
      lives++;
    }
  }
}

function selectMission(missionClicked){
  mission = missionClicked;
  if (missionClicked == "mission1"){
    startGame();
    difficulty = 0;
    setTimeout(function(){
      selectedMap = "map7";
      pathPoints = window["map7"];
    },100);
    setTimeout(function(){
      newTurret("sniper",400,100);
      money += sniper.price[0];
    },3000);
  }
  if (missionClicked == "mission2"){
    startGame();
    difficulty = 0;
    setTimeout(function(){
      selectedMap = "map1";
      pathPoints = window["map1"];
      money = 1000;
      mission2BossesKilled = 0;
      wave("boss",10,10000);
      currentWave = -2;
    },100);
  }
  if (missionClicked == "mission3"){
    startGame();
    difficulty = 0;
    setTimeout(function(){
      selectedMap = "map1";
      pathPoints = window["map1"];
      money = 25e3;
      wave("finalBoss",1);
      currentWave = -2;
    },100);
  }
}