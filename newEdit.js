
var modules = [];

//组件初始化代码
var config = [    

	{
		html:"<div class='box'><h2>标题</h2></div>"
	},

	{
		html:"<div  class='box'><p>文本内容</p></div>"
	},
	{
		html:"<div class='box clear'><a class='link-img'><img /></a></div>"
	},
	{
		html:"<div class='box clear'><a class='link-img-2'><img /></a><a  class='link-img-2'><img /></a></div>"
	}, 
	{
		html:"<div class='box clear'><a class='link-img-3'><img /></a><a  class='link-img-3'><img /></a><a  class='link-img-3'><img /></a></div>"
	}, 
	{
		html:"<div class='box clear'><a class='link-img-4'><img /></a><a  class='link-img-4'><img /></a><a  class='link-img-4'><img /></a><a  class='link-img-4'><img /></a></div>"
	}, 
	{
		html:"<div class='box'><ul id='slider'><li><a  class='link-img'><img /></a></li><li><a  class='link-img'><img /></a></li><li><a class='link-img'><img /></a></li></ul></div>", 
		call:"new TouchSlider('slider',{duration:1000, direction:0, interval:3000,fullsize:true});"
	},
	{
		html:"<div class='box'><p class='box-l'></p><a class='box-r'><img /></a></div>"
	}
					

];

//组件内节点属性对应的文本
var _DIC = {
	'height'		: 	'高度',
	'color' 		: 	'字体颜色',
	'font-size' 	: 	'字体大小',
	'text'			: 	'文本内容',
	'href'			:  	'链接地址',
	'src'			: 	'图片地址'
}

//组件
var Module = function(index){
	
	this.index = index;

	// this.

	this.node;

	this.allNode = [];

	this.editBtn;

	this.delBtn;

	this.upBtn;

	this.downBtn;
}

Module.prototype = {
	
	//调用入口
	init : function(){
		var configData = this.getConfig(this.index);
		this.moduleView(configData);
	},

	//初始化组件
	moduleView : function(configData){

		var _self = this;

		if (configData.html){

			this.node = $(configData.html);

			//编辑按钮
			this.editBtn  = $("<div class='eid icon'>&#xe609;</div>");

			//删除按钮
			this.delBtn  = $("<div class='del icon'>&#xe60a;</div>");

			//上移按钮
			this.upBtn  = $("<div class='up icon'>&#xe60c;</div>");

			//下移按钮
			this.downBtn  = $("<div class='down icon'>&#xe60b;</div>");

			//移入组件效果和绑定按钮事件
			this.node.on('mouseenter', function(){

				$(this).append(_self.editBtn, _self.delBtn, _self.upBtn, _self.downBtn);

				$(this).addClass('bg');

				//调用编辑面板初始化
				_self.editBtn.on('click', function(){

				_self.controllerView();

				});

				//删除
				_self.delBtn.on('click', function(){

					_self.node.remove();

				});

				//上移
				_self.upBtn.on('click', function(){

					if (_self.node.prev().length > 0){

						_self.node.prev().before(_self.node);

					}

				});

				//下移
				_self.downBtn.on('click', function(){

					if (_self.node.next().length > 0){

						_self.node.next().after(_self.node);

					}

				});

			});

			this.node.on('mouseleave', function(){

				_self.editBtn.remove();

				_self.delBtn.remove();_self.upBtn.remove();_self.downBtn.remove();

				$(this).removeClass('bg');

			});

			_self.editBtn.on('mouseleave', function(){

				$(this).removeClass('bg');

			});

			_self.delBtn.on('mouseleave', function(){

				$(this).removeClass('bg');

			});

			//添加组件
			$(".p-container").append(this.node);

			//阻止组件内的a标签跳转
			this.node.find("a").on('click', function(){

				return false;

			});

			//如果组件需要运行js
			if (configData.call){

				$(".p-container").append($("<script>"+configData.call+"</script>"));

			}

			//遍历组件内的所有节点，将每个节点可以改变的属性组成一个对象添加到allNode数组中，方便后面查询
			var allNode = this.node.find("*");
			
			allNode.each(function(i,v){
				var nowData = {

					node:{},

					css: {},

					attr:{},

					inner:{}
				}

				switch(v.nodeName){

					case 'IMG':

					$.extend(nowData.attr, {'src':''});

					$.extend(nowData.node, {'node':v});

					_self.allNode.push(nowData);

					break;

					case 'A':

					$.extend(nowData.attr, {'href':''});

					$.extend(nowData.inner, {'text':''});

					$.extend(nowData.css, {'font-size':'','color':'','height':''});

					$.extend(nowData.node, {'node':v});

					_self.allNode.push(nowData);

					break;

					case 'H2':

					$.extend(nowData.css, {'font-size':'','color':'','height':''});

					$.extend(nowData.inner, {'text':''});

					$.extend(nowData.node, {'node':v});

					_self.allNode.push(nowData);

					break;	

					case 'P':

					$.extend(nowData.css, {'font-size':'','color':'','height':''});

					$.extend(nowData.inner, {'text':''});

					$.extend(nowData.node, {'node':v});

					_self.allNode.push(nowData);

					break;

					default:

					break;

				}

				
			});

		}
		
	},

	//编辑(控制)面板初始化
	controllerView : function(){

		var _self = this;

		$('#control').remove();

		var controllerPanel = $("<div id='control'></div>").appendTo($('.w-right'));

		//遍历组件内所有可编辑的节点，每个属性对应一个输入框，便于编辑
		$(this.allNode).each(function(i, v){

			if (v.attr != null){

				$.each(v.attr, function(i1, v1){

					$("<input type='text' placeholder='"+_DIC[i1]+"' value='"+_self.allNode[i].node.node[i1]+"'>").appendTo(controllerPanel).on('input', function(){
						
						_self.allNode[i].attr[i1] = $(this).val();

						
						_self.allNode[i].node.node.setAttribute(i1, $(this).val());
					});

				});
			}
			if (v.css != null){

				$.each(v.css, function(i1, v1){

					$("<input type='text' placeholder='"+_DIC[i1]+"' value='"+_self.allNode[i].node.node.style[i1]+"'/>").appendTo(controllerPanel).on('input', function(){
						
						var nowNode = $(this);

						_self.allNode[i].css[i1] = nowNode.val();

						_self.allNode[i].node.node.style[i1] = nowNode.val();

					});
					
				});
			}
			if (v.inner != null){

				$.each(v.inner, function(i1, v1){

					$("<input type='text' placeholder='"+_DIC[i1]+"' value='"+$(_self.allNode[i].node.node).text()+"'>").appendTo(controllerPanel).on('input', function(){
						
						var nowNode = $(this);

						_self.allNode[i].inner[i1] = nowNode.val();

						_self.allNode[i].node.node.innerHTML = nowNode.val() || '请输入内容...';

					});
					
				});
			}

			controllerPanel.append("<div class='hr'></div>");

		});

	},

	//获取组件初始化html代码
	getConfig: function(){

		return config[this.index];

	}
}

$(function(){
	
	//点击组件按钮，创建组件对象
	$('.modules li').on('click',function(){

		new Module($(this).index()).init();

	});

	//显示代码面板
	$('#getCode').on('click', function(){

		$('#code').text($('#container').html());

		$("#cover, #codePanel").fadeIn();

	});

	//隐藏代码面板
	$('.close').on('click', function(){

		$("#cover, #codePanel, #updata").fadeOut();

	});

	//跳转到预览页面
	$('#preview').on('click', function(){

		localStorage.setItem('code',$('#container').html());

		window.open('./test.html');

	});

	//弹出输入文件名面板
	$('#create').on('click', function(){

		$('#tip').empty();

		if ($(".p-container").html() != ""){
			var html = $(".p-container").html();
			$("#cover, #updata").fadeIn();
		}

	});

	//上传数据
	$('#upload').on('click', function(){

		if($('#fileName').val() != ""){
			$(this).attr({'disabled':true});
			$.ajax({
				url:'./create.php',
				type:'post',
				data:{
					name:$('#fileName').val(),
					context:$("#container").html()
				},
				success: function(msg){
					$('#tip').html("文件创建成功");
					setTimeout(function(){
						$("#cover, #codePanel, #updata").fadeOut();
					},500);
					
				}
			})
		}
	});

});



