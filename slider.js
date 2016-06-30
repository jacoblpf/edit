(function($, window, document){

var Slider = function(container, animateType, speed, scale){
	
	this.$container = $(container);

	this.$item = this.$container.children();

	this.speed = speed || 300;

	this.animateType = animateType || 'normal';

	this.width = this.$container.parent().width();

	this.scale =scale || 2.5;

	this.now = 0;

	this.next;

	this.ctrlBar = $("<div style='position:absolute; bottom:20px; right:20px; background:#333;border-radius:5px; padding:0 10px'></div>");

	this.ctrlBtn = [];

	this.clock = null;
}

Slider.prototype = {

	init: function(){
		
		var width = this.width, height = width/this.scale;

		this.$container.width(this.width).height(height).css({'position':'relative','list-style':'none','margin':0, 'padding':0});

		this.$item.width(this.width).height(height).hide().css({'position':'absolute'}).eq(0).show();

		this.$item.find('img').hide().width(this.width).height(height).show();

		this.initCtrlBar();

		this.autoRun();
	},

	initCtrlBar:function(){
		
		var _self = this;

		this.$item.each(function(){

			var btn = $("<a href='javascript:void(0)' style='width:15px;height:15px;float:left;background:#fff;margin:5px 6px; border-radius:50%; outline:none'></a>").on('mouseover', function(){

				_self.next = $(this).index();

				_self.tab();

				_self.changeCtrlBtnStyle();

			});

			_self.ctrlBtn.push(btn);

			_self.ctrlBar.append(btn);

		});

		this.ctrlBar.appendTo(this.$container);

		this.changeCtrlBtnStyle();

		this.stopRun();
	},

	tab:function(){

		var _self = this;

		$.each(this.$item, function(i, v){

			$(v).stop(true, true);

		});

		switch(this.animateType){

			case 'normal':

			_self.$item.eq(_self.now).fadeOut(1000);

			_self.$item.eq(_self.next).fadeIn(1000);

			_self.now = _self.next;

			break;

			default:
			break;
		}


	},

	changeCtrlBtnStyle: function(){

		$.each(this.ctrlBtn, function(i, v){

			$(v).css({'background':'#fff'})

		});

		this.ctrlBtn[this.now].css({"background":'red'});

	},

	autoRun: function(){
		var _self = this;
		
		this.clock = setInterval(function(){
			
			_self.next = _self.now == _self.$item.length-1 ? 0 : _self.now+1;
			
			_self.tab();

			_self.changeCtrlBtnStyle();

		},3000);

	},

	stopRun: function(){

		var _self = this;

		this.$container.on('mouseover', function(){
			
			clearInterval(_self.clock);

		}).on('mouseleave', function(){

			_self.autoRun();

		});

	}

}


$.fn.slider = function(animateType, speed, scale){
	return new Slider(this, animateType, speed, scale).init();
}
	
})(jQuery, window, document);
