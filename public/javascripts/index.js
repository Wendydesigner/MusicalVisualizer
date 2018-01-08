//jquery demand
// function $(s){
//     return document.querySelectorAll(s);
// }

var size = 32;
var mv = new MusicalVisualizer({
    size: size,
    visualizer: draw
});
// choose songs
var lis = $("#list li");

for(var i = 0; i < lis.length; i++){
    lis[i].onclick = function (){
        for(var j = 0; j < lis.length; j++){
            lis[j].className = "";
        }
        this.className = "selected";
        mv.play("/media/" + this.title);
    }
}

//choose type
var types = $("#type li");

var dataType = "column";

for(var i = 0; i < types.length; i++){
    types[i].onclick = function (){
        for(var j = 0; j < types.length; j++){
            types[j].className = "";
        }
        this.className = "selected";
        dataType = this.getAttribute("data-type");
    }
}

var add = $("#add")[0];
var upload = $("#upload")[0];

add.onclick = function (){
    upload.click();
}

upload.onchange = function (){
    var file = this.files[0];
    var fr = new FileReader();

    fr.onload = function (e){
        mv.play(e.target.result);
    }
    fr.readAsArrayBuffer(file);
}

$(document).ready(function(){
  lis[0].onclick();
});
//canvas draw
var $canvas = $("#canvas")[0];
var canvas= document.createElement("canvas");
$canvas.appendChild(canvas);
var ctx = canvas.getContext("2d");
var width,height;
var line;

//draw dots
var dots = [];

function random(m, n){
    return Math.round(Math.random()*(n - m) + m);
}
function getDots(){
    dots = [];
    for(var i = 0; i < size; i++){
        var x = random(0, width);
        var y = random(0, height);
        var color = "rgba("+random(0, 255)+","+random(0, 255)+","+random(0, 255)+",0)";
        dots.push({
            x: x,
            y: y,
            color: color,
            dx : random (1,3),
            cap : 0
        });
    }
}

//draw column and dots
function draw(arr){
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = line;  
    for(var i = 0; i < size; i++){
        var o = dots[i];
        if(dataType == "column"){
            var w = width/size;
            var h = arr[i]*height/256;
            var cw = w * 0.6;
            var ch = cw < 10 ? cw : 10;
            ctx.fillRect(i * w, height - (o.cap + ch) ,cw, ch);
            ctx.fillRect(i * w, height-h, cw, h);
            o.cap --;
            if(o.cap < 0 ){
                o.cap = 0;
            }
            if(h > 0 && o.cap < h + 40 ){
                o.cap = h + 40  > height - ch ? height - ch : h + 40;
            }
        }else if(dataType == "dot"){
            ctx.beginPath();
            var r = 10 + arr[i]/256 * (height > width ? width : height)/ 10 ;
            ctx.arc(o.x, o.y, r, 0, Math.PI*2, true);
            var g =ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
            g.addColorStop(0,"white");
            g.addColorStop(1, o.color); 
            ctx.fillStyle = g;
            ctx.fill();
            o.x +=o.dx;
            o.x = o.x < width ? o.x : 0; 
        }
    }
}

//windows's  size changes when the process start
function resize(){
    width = document.body.clientWidth;
    height = document.body.clientHeight;
    canvas.width = width;
    canvas.height = height;
    //colume gradient
    line = ctx.createLinearGradient(0,0,0,height);
    line.addColorStop(0,"red");
    line.addColorStop(0.5,"yellow");
    line.addColorStop(1,"green");  
    ctx.fillStyle = line;  
    //require dots
    getDots();
}
resize();
window.onresize = resize;

$("#volume")[0].onchange = function (){
    mv.changeVolume(this.value/this.max);
}
$("#volume")[0].onchange();