// 这个 里面先主要 放一些 Backbone的 东西
(function(){
	// 11/16_debug日志 ，newAccountType是咋回事，现在虽然能跑，但是解决不了问题，一个必须游离于全局的变量
	// 11/17_debug ,基本上是 这玩意儿没有按照我的规划前进，卧槽

	//先贼一个模型，用于 单个account视图的 渲染和处理 
	var accountLiModel = Backbone.Model.extend({
		defaults:{
			num:0, // 表示 的单个account 的 账目 数量
			typeCode:"", // 存储 model 的 字符串 的 内容 ，用来 对应 iconfont的调用值 
			type:"",// 用来 存储 model 的 类型（add、trans、trip、food......）
			date:""// 用来存储model的 日期数据 
		},
		/*toggle: function(numV,typeCodeV,typeV,dateV) {  // 一旦说 前面有编辑 那么 到这里就可以修改了
      		this.save({num:numV,typeCode:typeCodeV,type:typeV,date:dateV});
    	}*/
    })

	// 先 写个啥呢,这个是 collection 集合,这个集合,就是捆绑所有的model，到后面做char视图的时候方便
	var accountLiCollections = Backbone.Collection.extend({
		model : accountLiModel,
		localStorage:new Backbone.LocalStorage("todos-backbone"),
		get: function() {
		  return this.where({type: "get"});
		},
	});

	var accountLis = new accountLiCollections; 
	//console.log("collection's add = " + accountLis.add.length)// cearte a really One
	//console.log(accountLis);

	// 这个是 是 view,单个account项目的view 主要负责渲染模板以当前的数据，负责触发视图上的 删除和编辑功能
	var accountLiView = Backbone.View.extend({
		tagName: "li",
		template: _.template( $("#itemAccountTemplate").html() ),
		render: function(account){
			this.$el.html(this.template( this.model.toJSON() ) ); 
			 // 快 宝宝 告诉我，这个toJSON()，为啥这么好使，一用上，bug立刻消失
			return this;
		},
		editRender: function(){
			console.log("i am working hard in rendering HTML");
			console.log(this.editTemplate( this.model.toJSON() ))
			this.$el.html(this.editTemplate( this.model.toJSON() ) )
		},
		events:{
			"touchend #deleteAccount":"clear",
			"touchend #editAccount":"edit"
		},
		edit:function(){
			$("#aIdHeader").css("display","none");
			$("#accountList").css("display","none");

			editAccountView.prepareToEdit(this.model);
		},

		clear:function(){
			this.model.destroy();
			this.remove();
		} // delete
	});


	var editAccount = Backbone.View.extend({
		el :$("#aId"),
		tagName:"div",
	 	editTemplate:_.template( $("#editAccountTemplate").html() ),
	 	//editTemplate:_.template( $("#testTemplate").html() ),
		prepareToEdit:function(amodel){
			//console.log("start refresh UI ");
			$("#aId").append("<h1>cnm</h1>");
			//console.log(this.editTemplate(amodel))
			//$("#aId").append(this.$el.html(this.editTemplate.el )  )
			$("#aId").append( this.editTemplate({type:amodel.type,num:amodel.num}) );
		}
	}); 
	var editAccountView = new editAccount;


	// 这个 视图 主要 负责 负责啥呢 ，就是 负责 建立 新的 accountLiView
	var secondmenuView = Backbone.View.extend({

		el:$("#aId"),

		initialize:function(){
			this.listenTo(accountLis,'add',this.addOneView); // bind 用来搞定 给collection一旦添加了model，就是触发增加一个view的事件
			//this.listenTo(accountLis,'add',this.test);



			this.number = $("#addnumber").val();
			this.newAccountTypeCode = "";
			this.newAccountType = "";
			this.date = (function(){
				var date = (function(){
					var dateObj = new Date();
					var year = dateObj.getFullYear();
					var month = dateObj.getMonth() + 1;
					var day = dateObj.getDay();
					return year +"/"+ month +"/"+ day
				})()

				return date;
			})()
		},

		events:{
			"touchend #sureToAdd":"addOneModelToCollection", //用来触发“
			"touchend #shooseType":"makeSureNewAccountTypeCode", //用来点击 icon的捕获;
			"touchend .deleteAccount":"deleteAccount" ,

			"touchend #testIcon" : "fxxk"
			// 删除
		},



		//删除该 view 以及 model
		deleteAccount:function(){

			// 
			var e = window.event || arguments[0];
			var eTarget = e.target || e.srcElemnt;

			if(eTarget.getAttribute("id").toLowerCase() == "deleteAccount"){
				alert("1");
				// dom结构里删除
				eTarget.parentNode.removeChild(eTarget);
				// localStorage里删除
				// model删除
				// view视图也 得 删除 一个吧 
			} 
		},


		makeSureNewAccountTypeCode:function(){
			console.log("i am in firse step ,to choose a type")
			var event = document.event || arguments[0];
			var eTarget = event.target || event.srcElemnt;
			//num = this.number ;
			//date=this.date;
			
			if (eTarget.nodeName = "i"){   // 一般 情况下 都会有 点击 触发 ，触发啥呢，就是
				    newAccountType = eTarget.getAttribute("title").toLowerCase();
				    console.log(newAccountType);
					switch( eTarget.getAttribute("title").toLowerCase() ){
						case "get": 
							newAccountTypeCode = "&#xe60b;";
							//newAccountType = "add";
							//console.log("i get add")
							break;
						case "trans":
							newAccountTypeCode = "&#xe609;";
							//newAccountType = "trans";
							//console.log("i get trans")
							break;
						case "trip": 
							newAccountTypeCode = "&#xe60a;";
							//newAccountType = "trip";
							//console.log("i get trip")
							break;
						case "food":
							newAccountTypeCode = "&#xe607;";
							//newAccountType = "food";
							//console.log("i get life")
							break;
						case "life": 
							newAccountTypeCode = "&#xe601";
							//newAccountType = "life";
							//console.log("i get life")
							break;
						case "else":
							newAccountTypeCode = "&#xe603;";
							//newAccountType = "else";
							//console.log("i get add")
							break;							
					}
				//  接下来 在 表现层 做点 什么 告诉 大家 ，这玩意儿 确实 有所改变
				if( $("#addAccountPart .testClassClicked").length ){
					 $("#addAccountPart .testClassClicked")[0].setAttribute("class","testClass")
				}
				eTarget.parentNode.setAttribute("class","testClassClicked")	
				//type= newAccountType;
			};

			this.newAccountTypeCode = newAccountTypeCode;
			this.newAccountType = newAccountType;
			//newAccountType = newType;
			//num="";
			//date="";
			console.log( "i am choosed "+this.newAccountTypeCode  +  "  " + this.newAccountType );
			//console.log(this.newAccountType)
		},


		addOneModelToCollection:function(e){
			console.log("i am in second setp,to crate a model and add it to collection")
			var newAccountObj =  {num:1,type:this.newAccountType,typeCode:this.newAccountTypeCode,date:this.date}
			console.log(newAccountObj );

			var newAccount = accountLis.create({num:1,type:this.newAccountType,typeCode:this.newAccountTypeCode,date:this.date});  // 草 这个是不接受参数？
			//console.log("i added :" );
			//console.log(accountLis.create)
			console.log(newAccount);
			console.log(accountLis.length);
			console.log(accountLis)
			this.number = ""; // error in this ,this.num.val("") 

			// 负责ui的变化,肯定出不了错
			(function(){
				$("#menu").css("display","block") ;
				$("#secondMenu").css("display","none");
				//secondMenu.css("display","block");
				$("#accountList").css("display","block");
				$("#addAccountPart").css("display","none");
				$("#addAccountPart .testClassClicked")[0].setAttribute("class","testClass");
			})()
		},

		addOneView:function(account){


			alert("i will add a AddoneView")
			console.log("i am in step three,to render a view and added")
			var view = new accountLiView({model:account}); // 草草草 这里的格式 有问题 
			console.log("i render view as HTML:")
			console.log(view);
			//console.log(view.render(account).el);
			$("#accountListUl").append(view.render(account).el);

			//$("#accountListUl").append("<h1>fxxk</h1>");
			console.log($("#accountListUl"));
		}





	})

	var newTest = new secondmenuView;

})(jQuery);


/*依次删除 localstorage里面的东西 ，毕竟自己写掉了太多的空间
for (var key in localStorage){
	localStorage.removeItem(localStorage.key)
}*/