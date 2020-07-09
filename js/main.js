//----------------------------------------------------variable---------------------------------------------------
var myGamePiece;//var de canvas et element
var myObstacles = [];
var temp;
var gameover;
var myBackground;
var scor = 0;
var son = new Audio();
son.src = "assets/02 Simian Segue.mp3"
var bom = new Audio();
bom.src = "assets/videoplayback.m4a"
var fly = new Audio();
fly.src = "assets/jump.wav"
var sonscore = new Audio();
sonscore.src = "assets/fly.mp3"
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1400;
        this.canvas.height =800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);//ajouter element enfant au parent
//Créez une nouvelle méthode dans le constructeur du composant,
 //qui vérifie si le composant se bloque avec un autre composant.
 //Cette méthode doit être appelée à chaque mise à jour des trames, 50 fois par seconde.
//Ajoutez également une stop()méthode à l' myGameAreaobjet, qui efface l'intervalle de 20 millisecondes.
        this.frameNo = 0; //a property for counting frames
        //verif setInterval(updateGameArea, 6)
        this.interval = setInterval(updateGameArea, 6);//run this function every 20th millisecond
        // pour clavier
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGamePiece.image.src = "img/ir2.png";
            fly.play();
            jump();// pour posser
            accelerate(0.05);
        })
        window.addEventListener('keyup', function (e) {
            myGamePiece.image.src = "img/ir1.png";
            fly.play();
            accelerate(0.05);
        })
        //pour la sourie
        window.addEventListener('mousedown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGamePiece.image.src = "img/ir2.png";
            fly.play();
            jump();
            accelerate(0.05);
        })
        window.addEventListener('mouseup', function (e) {
            myGamePiece.image.src = "img/ir1.png";
            fly.play();
            accelerate(0.05);
        })
    },
    clear : function() {
        son.play();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);// pour afficher l apage  (context.clearRect(x,y,width,height);)
    },
    stop: function(){
        clearInterval(this.interval);// arrêter l'exécution du tem de setintervale
    }
}
//--------------------------------------------------functions-------------------------------------------------
function startGame() {
    myGamePiece = new component(70, 70, "img/ir1.png", 700, 245, "image");
    temp= new component("30px", "Consolas", "black", 30, 50, "text");
    score = new component("30px", "Consolas", "black", 30, 100, "text");
    myBackground = new component(1400, 660, "img/back1.jpg", 0, 0, "background");
    gameover = new component(300, 300, "img/gameover3.png", 500, 100, "image");

    myGameArea.start();
}


function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.type = type;
    if (type == "image" || type == "background") { //set image
        this.image = new Image();
        this.image.src = color;
    }
    this.speedX = 0;//horizontal speed ( les images de back)
    this.speedY = 0;//vertical speed
    this.gravity = 0.01;   //gravity(tomber vite vers le bas )
    this.gravitySpeed = 0;
    //set new position
    this.newPos = function(){
        if(this.type == "image"){
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitTop();
            this.hitBottom();
        }else if ((this.type == "background")){
            this.x += this.speedX;
            this.y += this.speedY;
            if(this.x == -(this.width)){
                this.x = 0;
            }
        }else{
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }
    //draw image and fill text
    this.update = function(){
        ctx = myGameArea.context;
        if(type == 'text'){
            ctx.font =  " 30px serif" ;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }else if (type == 'image'){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }else if(type == 'background'){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width*2, this.y, this.width, this.height);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    //pour afficher les autres objet en cliquant sure dif position
    this.crashWith = function(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
         if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
    this.hitTop = function(){
        var rocktop = 0;
        if (this.y < rocktop) {
            this.y = rocktop;
        }
    }

    this.hitBottom = function(){
      this.bounce = 0.5;
        var rockbottom = myGameArea.canvas.height - this.height - 220;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }
}
// collision
function updateGameArea() {
    var x, y;
    for(i = 0; i < myObstacles.length; i += 1){
        if(myGamePiece.crashWith(myObstacles[i]) ){
            bom.play();
            gameover.update();
            myGameArea.stop();
            return;
        }
       if (  myObstacles[i].x==700) {
            sonscore.play();
             scor++;
        }
    }
    myGameArea.clear();
    //moving background
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    //adding obstacles
    if ( everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 40;
        maxHeight = 300;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight); //random obstacle height
        minGap = 250;
        gap = Math.floor(Math.random()*(5)+minGap); //random gap in between
        y = myGameArea.canvas.height;
        myObstacles.push(new component(60, height, "img/pp1.png", x, 0, "image"));
        myObstacles.push(new component(70, 25, "img/head.png", x-5, height, "image"));
        myObstacles.push(new component(70, 25, "img/head.png", x-5, height + gap, "image"));
        myObstacles.push(new component(60, y - height - gap , "img/pp1.png", x, height + gap +25,"image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    //pour que la tortue reste a la méme position
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

        temp.text="temps: " + Math.floor(myGameArea.frameNo/20)+"ms";
        temp.update();
        score.text="SCORE: "+(scor/4);
        score.update();
    //moving tortue
    myGamePiece.newPos();
    myGamePiece.update();
}
//La fonction everyinterval renvoie true si le nombre de cadres actuel correspond à l'intervalle donné.
function everyinterval(n){//this function returns true if the current framenumber corresponds with the given interval.
    if((myGameArea.frameNo / n) % 1 == 0){return true;}
    return false;
}
function accelerate(n){
    myGamePiece.gravity = n;
}
//pour que la torute saute vite vers le haut
function jump(){
    myGamePiece.gravitySpeed = -2;
}
