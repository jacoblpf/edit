(function($, window, document, undefined) {
    var layer = 1;
    var nownode = null;

    var module_code = [

        { html: "<div class='hot-img module'><a href='' class='m_link'><img src='https://cdn2.myhloli.com/images/2016/07/01/bb25bc4354e9eca66fcd6bd2dcf3f2e4.jpg' class='m_img'/></a></div>" },

        { html: "<div class='hot-text module'><a href='' class='m_link_text'>文本内容</a></div>" },

        { html: "<div class='img module'><img src='https://cdn2.myhloli.com/images/2016/07/01/b1ccc6e695fc0a52f3c08cf851501332.jpg' class='m_img'/></div>" },

        {
            html: "<div class='slider_box module'><ul class='slider'><li class='add'><a  class='m_link'><img src='https://cdn2.myhloli.com/images/2016/07/01/bd17caa695ccbf1c1647e79bda372264.md.jpg' class='m_img'/></a></li></ul></div>"
        }
    ];

    var box_attr = { 'width': '宽度/px', 'height': '高度/px', 'left': '左边距/px', 'top': '上边距/px' };

    var element_config = {

        ".m_img": { attr: { 'src': '图片地址' } },

        ".m_text": { text: { 'text': '文本内容' }, css: { 'font-size': '字体大小/px', 'text-indent': '首行缩进', 'color': '字体颜色', 'padding': '内边距' } },

        ".m_link": { attr: { 'href': '跳转地址'} },

        ".m_link_text": { attr: { 'href': '跳转地址', 'target': '跳转方式'  }, text: { 'text': '文本类容' }, css: { 'font-size': '字体大小/px', 'text-indent': '首行缩进', 'color': '字体颜色', 'padding': '内边距' } },

    }



    var Module = function(index) {

        this.index = index;

        this.node;

        this.allNode = [];

        this.editBtn;

        this.delBtn;

        this.upBtn;

        this.downBtn;

        this.container = $('.wrap');

        this.editNode = null;

        this.mid = "组件" + layer;

        this.box_pos = {};

        this.box_pos_in = {};
    }

    Module.prototype = {

        getMaxH: function() {

            var child = this.container.children();

            if (child.length > 0) {

                var H = [];

                child.each(function(i, v) {

                    H.push(parseInt($(v).css('top')) + $(v).height());

                });

                return Math.max.apply({}, H);

            } else {

                return 0;

            }

        },

        add: function() {
            if (this.getCode()) {

                var maxH = this.getMaxH();

                this.node = $(this.getCode().html).css({ 'z-index': layer, 'top': maxH });

                layer++;

                this.container.append(this.node);

                this.move(this.node, true);

                this.changeCursor(this.node);

                this.init_pos();

            }

        },

        getCode: function() {

            if (module_code[this.index]) {

                return module_code[this.index];

            } else {

                return false;

            }

        },

        move: function(node, type) {

            var _self = this;

            node.on('mousedown', function(e) {

                var m_left1 = e.screenX;

                var m_top1 = e.screenY;

                if (e.offsetX < $(this).width() - 2 && e.offsetX > 2 && e.offsetY < $(this).height() - 2 && e.offsetY > 2) {
                  
                    $('body').on('mousemove', function(evt) {

                        var left = parseInt(node.css('left')) || 0;

                        var top = parseInt(node.css('top')) || 0;

                        var m_left2 = evt.screenX;

                        var m_top2 = evt.screenY;

                        left += m_left2 - m_left1;

                        top += m_top2 - m_top1;

                        if (evt.preventDefault) {

                            evt.preventDefault();

                        } else {

                            window.event.returnValue = false;

                        }

                        node.css({ 'left': left, 'top': top });

                        m_left1 = m_left2;

                        m_top1 = m_top2;

                        _self.refush_pos();

                    })

                } else if (type) {

                    if (Math.abs(e.offsetX - $(this).width()) < Math.abs(e.offsetY - $(this).height())) {
                        
                        $('body').on('mousemove', function(evt) {
                            var m_left2 = evt.screenX;

                            var left = m_left2 - m_left1;

                            if (evt.preventDefault) {

                                evt.preventDefault();

                            } else {

                                window.event.returnValue = false;

                            }

                            node.css({ 'width': node.width() + left });

                            m_left1 = m_left2;

                            _self.refush_pos();

                        })
                    } else {
                        $('body').on('mousemove', function(evt) {

                            var m_top2 = evt.screenY;

                            var top = m_top2 - m_top1;

                            if (evt.preventDefault) {

                                evt.preventDefault();

                            } else {

                                window.event.returnValue = false;

                            }

                            node.css({ 'height': node.height() + top });

                            m_top1 = m_top2;

                            _self.refush_pos();

                        })

                    }

                } else {

                    return false;

                }

                $('body').on('mouseup', function() {

                    $(this).unbind('mousemove');

                });

            })

        },

        edit: function() {

            var _self = this;

            this.node.on('dblclick', function() {

                if ($('.edit').length > 0) {

                    $('.edit').hide();

                }

                if (_self.editNode != null) {

                    _self.editNode.show();

                } else {

                   _self.showEditpanel();
                

                }

            });

        },

        showEditpanel: function(){

        	var _self = this;

        	_self.editNode = $("<div class='panel edit'><div class='panel-title'><div class='close'></div><h3>" + _self.mid + "</h3></div></div>");
                   
            _self.editModule();
           
            _self.editElement();
           
            $('body').append(_self.editNode);
           
            _self.move(_self.editNode, false);

            _self.editAdd();

        },

        editModule: function() {

            var _self = this;

            this.init_pos_in();

            $.each(box_attr, function(i, v) {

                var pos = $("<input type='text' placeholder='" + v + "' title='" + v + "' value='" + _self.box_pos[i] + "'/>").on('input', function() {
                    
                    _self.node.get(0).style[i] = parseInt(this.value) + "px";
               
                });
               
                // var pos = $("<div class='form-group'><div class='input-group'><div class='input-group-addon'>"+v+"</div><input type='text' class='form-control' placeholder='"+v+"' value='"+_self.box_pos[i]+"'/></div></div>").on('input', function(){
                // 	_self.node.get(0).style[i] = parseInt(this.value)+"px";
                // });

                _self.editNode.append(pos);

                _self.box_pos_in[i] = pos;

            });

        },

        editElement: function() {

            var _self = this;

            $.each(element_config, function(i, v) { //遍历可编辑元素的配置

                var eles = _self.node.find(i); //筛选出可编辑的元素

                if (eles.length > 0) {

                    $.each(eles, function(i1, v1) { //遍历筛选出元素

                        $.each(v, function(i2, v2) { //遍历对应元素可编辑的属性类别

                            switch (i2) {

                                case 'attr':

                                    $.each(v2, function(i3, v3) { //遍历对应属性类别中的所有属性

                                        _self.editNode.append($("<input type='text' placeholder='" + v3 + "' title='" + v3 + "'/>").on('input', function() {
                                           
                                            v1.setAttribute(i3, this.value);

                                        }))

                                    });

                                    break;

                                case 'css':

                                    $.each(v2, function(i3, v3) {

                                        _self.editNode.append($("<input type='text' placeholder='" + v3 + "' title='" + v3 + "'/>").on('input', function() {
                                            
                                            v1.style[i3] = this.value;

                                        }));

                                    });

                                    break;

                                case 'text':

                                    $.each(v2, function(i3, v3) {

                                        _self.editNode.append($("<input type='text' placeholder='" + v3 + "' title='" + v3 + "'/>").on('input', function() {
                                            
                                            $(v1).html(this.value);

                                        }))

                                    });

                                    break;

                                default:

                                    break;

                            }

                        });

                    });

                }

            });

        },

        editAdd: function(){

        	var _self = this;

        	if (this.node.find('.add').length > 0){

        		var add = $("<div class='btn btn-primary'>增加</div>").on('click', function(){

        			var newItem = _self.node.find('.add').clone().removeClass('add');

        			_self.node.find('.add').parent().append(newItem);

        			_self.editNode.remove();

        			_self.showEditpanel();

        		});

        		_self.editNode.append(add);

        	}


        },

        changeCursor: function(node) {

            node.on('mousemove', function(e) {

                if (e.offsetX < $(this).width() - 2 && e.offsetX > 2 && e.offsetY < $(this).height() - 2 && e.offsetY > 2) {
                    
                    $(this).children().addClass('move').removeClass('change_W change_H');
                    
                    $(this).addClass('move').removeClass('change_W change_H');

                } else {

                    if (Math.abs(e.offsetX - $(this).width()) < Math.abs(e.offsetY - $(this).height())) {
                        
                        $(this).children().addClass('change_W').removeClass('move change_H');
                       
                        $(this).addClass('change_W').removeClass('move change_H');;

                    } else {
                        
                        $(this).children().addClass('change_H').removeClass('change_W move');;

                        $(this).addClass('change_H').removeClass('change_W move');;

                    }

                }

            });

        },

        deleteModule: function() {

            var _self = this;

            this.node.on('mouseenter', function() {

                _self.node.append($("<b class='close'></b>").on('click', function() {

                    _self.node.remove();

                }));
            });

            this.node.on('mouseleave', function() {

                _self.node.find('.close').remove();

            });

        },

        init: function() {

            this.add();

            this.edit();

            this.deleteModule();

        },

        init_pos: function() {

            for (var i in box_attr) {

                this.box_pos[i] = this.node.css(i);
            }

            // console.log(this.box_pos);

        },
        init_pos_in: function() {

            for (var i in box_attr) {

                this.box_pos_in[i] = null;

            }

        },

        refush_pos: function() {

            var _self = this;

            this.init_pos();

            if (this.box_pos_in != null) {

                for (var i in this.box_pos_in) {

                    this.box_pos_in[i].val(this.box_pos[i]);

                }

            }

        },

        toArray: function(obj) {

            if (typeof obj === 'object') {

                var arr = [];

                for (var i in obj) {

                    arr.push(obj[i]);

                }

                return arr;

            }

            return false;
        }

    }




    $(function() {

        var w = $(window).width();

        var h = $(window).height();

        var px = $('#mx').width(w);

        var py = $('#my').height(h);

        $(".wrap").on('mousemove', function(e) {

            // console.log(e);
            var wrapW = this.offsetLeft;

            var wrapH = this.offsetTop;

            px.css({ 'top': e.clientY - 2 });

            py.css({ 'left': e.clientX - 2 });

            $('#pos').show().text((e.pageX - wrapW) + ", " + (e.pageY - wrapH)).css({ 'left': e.clientX + 20, 'top': e.clientY + 20 });
       
        });

        $(".wrap").on('mouseleave', function(e) {

            $('#pos').hide();

        });

        $('#pxy').click(function() {

            px.toggle();

            py.toggle();

        });

        $('.add-m').on('click', function() {

            new Module($(this).index()).init();

        });

        $('.wrap').on('click', 'a', function() {

            return false;

        });

        $('#wrap_w').on('input', function() {

            $('.wrap').width(this.value);

        });

        $('#wrap_h').on('input', function() {

            $('.wrap').height(this.value);

        });

        $('#wrap_bg').on('input', function() {

            $('.wrap').style.background = this.value;

        });

        $('body').on('click', '.panel-title .close', function() {

            $(this).parent().parent().hide();

        });

        // $('.main').on('click','.module .close',function(e){
        // 	$(this).parent().remove();
        // });

        $('#getCode').click(function() {

            $('#codeModal textarea').val($(".main").html());

        });

        $('#preview').click(function() {

            localStorage.setItem('code', $(".main").html());

            window.open('./preview.html');
        });

    });







})(jQuery, window, undefined);
