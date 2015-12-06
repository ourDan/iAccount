// 代码重构 在 重构 的过程中 ，解决把写个鸡毛问题

// 我是不是 把每个函数的颗粒放的太小了 ，这样也不好
(function(){

	// 创建一个 model 
	var accountModel = Backbone.Model.extend({
		initialize:function(){
			this.num="";
			this.type="";
			this.typeCode="";
			this.date=""
		},
		toggle: function(xNum,xType,xTypeCode) {
			console.log(xNum );
			console.log(xType);
			console.log(xTypeCode)
		    this.save({num:xNum,type:xType,typeCode:xTypeCode});
		    console.log(this.attributes)
		}
	});


	// 创建 管理这些个model的collection
	var accountModleCollection = Backbone.Collection.extend({
		model:accountModel , // 这个 collection 管理的都是accountModel
		localStorage:new Backbone.LocalStorage("todos-backbone"), // 
		events:{
		},

		initialize:function(){
			this.charNumArr = [];
		},

		get: function() { 
		  var e = window.event || arguments[0];
		  var eTarget = e.target || e.srcElement;
		  console.log(eTarget);

		  if(eTarget.getAttribute("id") == "accountChart" ){
		  	this.getNumArr   = this.where({type:"get"});
		  	this.transNumArr = this.where({type:"trans"});
		  	this.tripNumArr  = this.where({type:"trip"});
		  	this.foodNumArr  = this.where({type:"food"});
		  	this.lifeNumArr  = this.where({type:"life"});
		  	this.elseNumArr  = this.where({type:"else"});

		  	var nnn = [];

		  	this.getNum = this.getNumArr.length;
		  	nnn.push(this.getNum);
		  	this.transNum = this.transNumArr.length;
		  	nnn.push(this.transNum);
		  	this.tripNum = this.tripNumArr.length;
		  	nnn.push(this.tripNum);
		  	this.foodNum = this.foodNumArr.length;
		  	nnn.push(this.foodNum);
		  	this.lifeNum = this.lifeNumArr.length;
		  	nnn.push(this.lifeNum);
		  	this.elseNum = this.elseNumArr.length;
		  	nnn.push(this.elseNum);

		  	
		  	function ss(arr) {

		  		alert("nvnvnvn");

		  		var draw = document.getElementById("canvasPic")
		  	    var ctx = draw.getContext('2d');
		  	   	var i=0,x;

		  	   	var color = ["red","green","black","yellow","blue","orange"];
		  	   	var big = arr[0] + arr[1] + arr[2] + arr[3] + arr[4] + arr[5];
		  	    
		  	    for (var j=0,len = arr.length;j<len;j++){
		  	      	x = arr[j] / big;
		  	        ctx.lineWidth = arr[j]*10;
		  	        ctx.strokeStyle = color[j];
		  	        ctx.beginPath();
		  	        ctx.arc(80,80,60,i*Math.PI,x*Math.PI);
		  	        ctx.stroke();
		  	        i = i + x;
		  	    };
		  	}

		  	ss(nnn);
		  	console.log("cnm");
		  	drawLinePic();

		  	function drawLinePic(){
		  	  	alert("i am drawing");

		  	  	var ctx = document.getElementById("canvasTwo").getContext('2d');
		  	  	var img = new Image();
		  	  	img.onload = function(){
		  	  	    ctx.drawImage(img,0,0);
		  	  	    ctx.beginPath();
		  	  	    ctx.moveTo(30,96);
		  	  	    ctx.lineTo(70,66);
		  	  	    ctx.lineTo(103,76);
		  	  		ctx.lineTo(170,15);
		  	  		ctx.stroke();
		  	  	}
		  	  	img.src = "./backdrop.png";	
		  	}
		  }



		}


	});  
	var accountList = new accountModleCollection;


	// 创建 入口级别的 view
	var appView = Backbone.View.extend({
		el:$("#aId"),

		events:{
			"touchend #accountListUl":"moveToLeft"
		},

		moveToLeft:function(){
			var e = window.event || arguments[0];
			var eTarget = e.target || e.srcElement;
			if(eTarget.nodeName.toLowerCase() == "li"){
				//alert("move to left");
				eTarget.style.marginLeft="-300px";
				//console.log($(".makeSome").css)
				$(".makeSome").css("visibility","visible")	
			}
			// 
		},

		showChartWith:function(){
			accountList.get();
			alert(accountList.getNum)
		},
	})
	console.log(typeof appView)
	var appControl = new appView;

	// 要不然也用个 view来控制char图表显示
	var charView = Backbone.View.extend({
		el:$("#charShowPart"),
		tagName:"div",
		template: _.template( $("#charShowTemplate").html() ),

		render:function(){
			this.$el.html( this.template() ) ;
			return this;


			
		}


	}) ;
	console.log(typeof charView)
	var charShowView = new charView;


	// 创建 每个model  对应的view
	var accountLiView = Backbone.View.extend({
		tagName:"li",
		template:_.template( $("#itemAccountTemplate").html() ), //
		events:{
			"touchend #deleteAccount" : "clear", // 删除
			"touchend #editAccount" : "edit"  // 点击进入编辑
		}, 
		initialize:function(){
			this.listenTo(this.model,'change',this.reRender);
		},
		edit:function(){
			//alert("i will edit ");
			//console.log(this.model.attributes.num)
			editAccountPart.prepareToEdit(this.model);
		},
		clear: function() { // 删除该model 一级相应的view
		  //alert("i will destory");
		  this.model.destroy();
		  this.remove();
		},
		reRender:function(){
			this.$el.html("");
			this.$el.html(this.template( this.model.toJSON()) );
		},
		render: function(account){
			this.$el.html(this.template( this.model.toJSON()) ); 
			return this;
		},
	}) ;





	// 创建 header 控制 的view
	var headerMenuView = Backbone.View.extend({
		el:$("#headerMenu"),
		events:{
			"touchend #menuAdd" : "addAccount" , //触发 添加事件
			"touchend #menuLeft" : "showSecond" , // 触发 secondMenu的弹出
			"touchend #accountModel" : "showList",
			"touchend #accountChart" : "showChart" 
		},
		showList:function(){
			alert("i will change")
			$("#accountList").css("display","block");
			$("#charShowPart").css("display","none");


			},
		showChart:function(){  // 先搞那个调用展示图表的东西 再调用绘图函数

			//console.log($("#accountList").style);

			$("#accountList").css("display","none");
			$("#charShowPart").css("display","block");

			$("aId").append(charShowView.render().el);
			appControl.showChartWith();
		},

		addAccount:function(e){
			//console.log(e.target.outerHTML)
			this.disappear();
			addAccountPart.prepareToAdd();
		},
		showSecond:function(){ // 显示二级菜单
			//alert("cnmb")
			this.$("#nav").css('display','block'); // not correct ,i will correct it soon 
		},
		disappear:function(){ // 一级菜单消失 
			this.$el.css("display","none");
			$("#accountList").css("display","none")
		}
	}) 
	var firstHeaderMenu = new headerMenuView;


	// 创建 用来 添加的 view
	var addAppView = Backbone.View.extend({
		el:$("#cnmb"),
		template : _.template( $("#addAccountTemplate").html() ),
		initialize:function(){
			//this.render();  // 先把模板渲染出来再说，到时候直接用 .css() 来控制显示
			this.listenTo(accountList,"add",this.addAccountView); // 一旦collectioon 多了一个model，就调用addAccountView

			this.number = $("#addnumber");
			console.log(this.number)
			this.newAccountTypeCode = "";
			this.newAccountType = "";
			this.date = (function(){
				var date = (function(){ // 直接得到我想要的格式:2015/11/24
					var dateObj = new Date();
					var year = dateObj.getFullYear();
					var month = dateObj.getMonth() + 1;
					var day = dateObj.getDay();
					return year +"/"+ month +"/"+ day
				})();
				return date;
			})()
		},

		events:{
			"touchend #sureToAdd" : "sureToAddFunc",  // 点击，触发“增加一个account”
			"touchend #menuLeftBack": "backToFirstMenu", // 点击，触发“返回一级菜单”
			"touchend #shooseType":"makeSureNewAccountTypeCode", // 利用event冒泡，直接去找包含icon组的parntNode
		},

		backToFirstMenu:function(){
			alert("nm");
			$("#headerMenu").css("display","block");
			$("#accountList").css("display","block");
			this.$el.html("");
		},

		addAccountView:function(account){
			alert("i will add a ")
			var view = new accountLiView({model:account}); // 草草草 这里的格式搞混了，new 可以接受{model：myModel这样的参数} 
			$("#accountListUl").append(view.render(account).el); // .el 是必不可少的，用来 将dom节点可以在浏览器里渲染出来
			//$("#accountListUl").append("<h1>fxxk</h1>");
			console.log($("#accountListUl"));
		},
		makeSureNewAccountTypeCode:function(){  // 用来 确定到底选择了哪个icon，

			var event = document.event || arguments[0];
			var eTarget = event.target || event.srcElemnt;
			if (eTarget.nodeName = "i"){   // 一般 情况下 都会有 点击 触发 ，触发啥呢，就是
				    var newAccountType = eTarget.getAttribute("title").toLowerCase();
				    var newAccountTypeCode;
				    //console.log(newAccountType);
					switch( eTarget.getAttribute("title").toLowerCase() ){
						case "get": 
							newAccountTypeCode = "&#xe60b;";
							break;
						case "trans":
							newAccountTypeCode = "&#xe609;";
							break;
						case "trip": 
							newAccountTypeCode = "&#xe60a;";
							break;
						case "food":
							newAccountTypeCode = "&#xe607;";
							break;
						case "life": 
							newAccountTypeCode = "&#xe601";
							break;
						case "else":
							newAccountTypeCode = "&#xe603;";
							break;							
					}
				//  接下来 在 表现层 做点 什么 告诉 大家 ，这玩意儿 确实 有所改变
				if( $("#addAccountPart .testClassClicked").length ){
					 $("#addAccountPart .testClassClicked")[0].setAttribute("class","testClass")
				}
				eTarget.parentNode.setAttribute("class","testClassClicked")	

			};

			this.newAccountTypeCode = newAccountTypeCode;
			this.newAccountType = newAccountType;

		},

		render:function(){  // 渲染 将添加模板渲染出来
			this.$el.append( this.template()  );
			this.delegateEvents();
			return this; 
		},

		sureToAddFunc:function(e){  // 点击了

			var newAccount = accountList.create({num:$("#addnumber").val(),type:this.newAccountType,typeCode:this.newAccountTypeCode,date:this.date});  // 草 这个是不接受参数 {model:myModel}这样的格式，必须使用？

			console.log({num:$("#addnumber").val(),type:this.newAccountType,typeCode:this.newAccountTypeCode,date:this.date})
			console.log(newAccount);
			$("#addnumber").val(""); // error in this ,this.num.val("") 
			(function(){ // 负责ui的变化
				//$("#cnmb").css("display","none");
				$("#headerMenu").css("display","block");
				$("#accountList").css("display","block");
				$("#cnmb").html("");
			})()
		},

		prepareToAdd:function(){
			this.render(); 
			$("#cnmb").css("display","block") ;
			//this.$el.css("display","block") 为啥这样就没有这个效果？为啥为啥？
		},
	})
	var addAccountPart = new addAppView;


	// 创建 编辑 用的view 
	var editAppView = Backbone.View.extend({
		el :$("#editAccountPart"),
		tagName:"div",
		editTemplate:_.template( $("#editAccountTemplate").html() ),
		events:{
			"touchend #sureToEdit":"sureToEdit",
			"touchend #shooseType":"changeOldAccountTypeCode",
			"touchend #menuLeftBack" :"backToFirstMenu"
		},

		initialize:function(){  // 设置一些 容器，用来暂时存储数据格式 
			this.modelBox={};  
			this.num = 0;
			this.type = ""; // type又不是保留字符，为啥会在编译器里 蓝色高亮？？？why?
			this.typeCode = "";		
		},

		backToFirstMenu:function(){
			alert("nm");
			$("#headerMenu").css("display","block");
			$("#accountList").css("display","block");
			this.$el.html("");
		},

		sureToEdit:function(){
			alert("i will edit it");
			
			$("#headerMenu").css("display","block");
			$("#accountList").css("display","block");

			this.$el.css("display","none");
			//console.log( $("#addnumber") );
			console.log($("#addnumber") );
			console.log(this.typeCode);
			console.log(this.type);

			console.log({num:$("#addnumber").val(),type:this.type,typeCode:this.typeCode});
			console.log(this.modelBox);
			this.modelBox.toggle($("#addnumber").val(),this.type,this.typeCode);

			this.$el.html("");
		},
		prepareToEdit:function(amodel){
			alert("cnm")
			//$("#aId").append("<h1>cnm</h1>");
			this.modelBox = amodel;
			this.type = amodel.attributes.type;
			this.typeCode = amodel.attributes.typeCode;


			alert("i will show som");
			$("#editAccountPart").css("display","block");

			firstHeaderMenu.disappear();
			this.$el.append( this.editTemplate({num:amodel.attributes.num,type:amodel.attributes.type} ));
			this.delegateEvents();
			return this;
			
		},
		changeOldAccountTypeCode:function(){  // 用来 确定到底选择了哪个icon，
			//console.log("i am in firse step ,to choose a type")
			console.log(this.typeCode);
			console.log(this.type);
			
			var event = document.event || arguments[0];
			var eTarget = event.target || event.srcElemnt;
			if (eTarget.nodeName = "i"){   // 一般 情况下 都会有 点击 触发 ，触发啥呢，就是
				    var newAccountType = eTarget.getAttribute("title").toLowerCase();
				    var newAccountTypeCode;
				    //console.log(newAccountType);
					switch( eTarget.getAttribute("title").toLowerCase() ){
						case "get": 
							newAccountTypeCode = "&#xe60b;";
							break;
						case "trans":
							newAccountTypeCode = "&#xe609;";
							break;
						case "trip": 
							newAccountTypeCode = "&#xe60a;";
							break;
						case "food":
							newAccountTypeCode = "&#xe607;";
							break;
						case "life": 
							newAccountTypeCode = "&#xe601";
							break;
						case "else":
							newAccountTypeCode = "&#xe603;";
							break;							
					}
				//  接下来 在 表现层 做点 什么 告诉 大家 ，这玩意儿 确实 有所改变
				if( $("#addAccountPart .testClassClicked").length ){
					 $("#addAccountPart .testClassClicked")[0].setAttribute("class","testClass")
				}
				eTarget.parentNode.setAttribute("class","testClassClicked");
			};

			//console.log( "i am choosed "+this.newAccountTypeCode  +  "  " + this.newAccountType );
			//console.log(this.newAccountType)
			console.log(newAccountTypeCode);
			console.log(newAccountType);


			this.typeCode = newAccountTypeCode;
			this.type = newAccountType;

			console.log(this.TypeCode);
			console.log(this.Type);

		},
	})
	var editAccountPart = new editAppView;

})(jQuery)
