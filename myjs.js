// 基础 的一些 操作
var menu = $("#menu");
var accountList = $("#accountList");
var addAccountPart = $("#addAccountPart");

var accountListUl = $("#accountListUl")

var menuAdd = $("#menuAdd");
var sureAccountAdd = $("#sureAdd");
var menuLeftBack = $("#menuLeftBack")

menu.on("touchend",function(){// 点击了 menuAdd按钮的时候，就可以考虑隐藏这个菜单栏 ，调出二级菜单栏
		
	//console.log(menu.style)
	menu.css("display","none") ;
	secondMenu.style.display = "block" ;
	//secondMenu.css("display","block");

	accountList.css("display","none");
	addAccountPart.css("display","block")

});

menuLeftBack.on("touchend",function(){
	menu.css("display","block") ;
	secondMenu.style.display = "none" ;
	//secondMenu.css("display","block");

	accountList.css("display","block");
	addAccountPart.css("display","none")
})



// draw

(function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
   	var i=0,x=0.3;
   	var color = ["red","green","black","yellow","blue"]
      for (var j=0;j<6;j++){
      	console.log(i);
      	ctx.lineWidth = 3*j;
      	console.log(color[j]);
        ctx.strokeStyle = color[j];
        ctx.beginPath();
        ctx.arc(100,100,40,i*Math.PI,x*Math.PI);
       	//ctx.rotate(0.3*Math.PI);
        i =i + 0.3;
        x =x + 0.3;
        ctx.stroke();

      }
    
 })()

draw()