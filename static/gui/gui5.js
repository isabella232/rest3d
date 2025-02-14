/*
 GUI.js 

The MIT License (MIT)

Copyright (c) 2013 Rémi Arnaud - Advanced Micro Devices, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 GUI.js needs jquery, jqueryUI and jqueryUI layout
*/

if (window.$ === undefined) {
	//themes - start, base, black-tie, blitzer, cupertino, dark-hive, dot-luv, eggplant, excite-bike, flick, hot-sneaks, humanity
	//  le-frog, mint-choc, overcast, pepper-grinder, redmond, smoothness, south-street, sunny, swanky-purse, trontastic
	//  ui-darkness, ui-lightness, vader

    //document.write('<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/vader/jquery-ui.css" />');
    //document.write('<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"><\/' + 'script>');
    //document.write('<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"><\/' + 'script>');

    document.write('<link rel="stylesheet" href="/gui/themes/vader/jquery-ui.css" />');

    document.write('<script src="/deps/jquery.js"><\/' + 'script>');
    document.write('<script src="/deps/jquery-ui.js"><\/' + 'script>');
    document.write('<script src="/deps/jquery.layout.min.js"><\/' + 'script>');

    document.write('<script type="text/javascript" src="/deps/jquery.cookie.js"><\/' + 'script>');
    document.write('<script type="text/javascript" src="/deps/jquery.hotkeys.js"><\/' + 'script>');
    document.write('<script type="text/javascript" src="/deps/jquery.jstree.js"><\/' + 'script>');
    //document.write('<link href="/gui/themes/vader/ui.dynatree.css" rel="stylesheet" type="text/css" />');

    document.write('<link rel="stylesheet" href="/gui/gui5.css" />');
}


/***
  Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore')._;
***/
// UI library
(function () {


    // Initial Setup
    // -------------
    // Save a reference to the global object (`window` in the browser, `exports`
    // on the server).
    var root = this;
    // The top-level namespace. All public GUI classes and modules will
    // be attached to this. Exported for both CommonJS and the browser.
    var GUI;
    if (typeof exports !== 'undefined') GUI = exports;
    else { GUI = root.GUI = {}; };
    // Current version of the library. Keep in sync with `package.json`.
    GUI.VERSION = '0.0.1';

    GUI.button = function (_txt, _parent, _callback, _x1, _y1, _x2, _y2) {
        var $button = $('<button></button>');
        var callback = _callback;

        $button.button().click(function (event) {
            if (callback) callback.call(this);
            event.preventDefault();
        });
        // create unique ID
        $button.button().uniqueId();
        var id=$button.attr('id');
        if (_txt !== undefined && _txt !== null)
        	$button.button({ label: _txt });
        if (_x1 !== undefined && _y1 !== undefined) {    	
        	$button.css('position','absolute');
    		$button.css('left',_x1);
    		$button.css('top',_y1);
    		if (_y2 !== undefined && _y1 !== undefined) {
    			_y2 -= _y1;
    			_x2 -= _x1;
    		}
    	}
    	if (_y2 !== undefined && _y1 !== undefined) {
   			$button.css('height', _y2);
    		$button.css('width', _x2);
    	}

		if (!_parent)
			$('body').append($button);
		else 
			$(_parent).append($button);
        return $button
    };
    GUI.label = function(_txt, _parent, _id) {
        var label = '<p';
        if (_id) label += ' id='+_id;
        label += '>'+_txt+'</p>';
    	var $label = $(label);
    	//$label.button().uniqueId();
		if (!_parent)
			$('body').append($label);
		else 
			$(_parent).append($label);
        return $label;
    };
    GUI.tree = function(_tree, _parent, _callback, _id) {
        var cb = _callback;
        var tree = '<div';
        if (_id) tree += ' id='+_id;
        tree += '> </div>';
        var $tree = $(tree);
        if (!_parent)
            $('body').append($tree);
        else 
            $(_parent).append($tree);


        $tree.jstree({
          plugins : [ "dnd" , "ui", "themeroller", "json_data", "crrm", "types"],
          animation : 0,
          /* ONLY FOR FOREIGN NODES
          dnd : {
            drag_target : ".jstree-draggable",
            drop_target : ".jstree-drop",
            drag_check : function (data) {
               if(data.r.attr("id") == "phtml_1") {
                  return false;
               }
               return {
                after : false,
                before : false,
                inside : true
               };
            },
            drop_check : function (data) {
                return false;
            },
            drop_finish : function () {
               alert("DROP");
            },
            drag_finish : function (data) {
                alert("DRAG OK");
            },
          },
            */
           crrm : {
                move : {
                    default_position : "inside",
                    always_copy: "multitree",
                    check_move : function (m) { 
                        var ret = false;
                        // we can put a model in a scene
                        if (m.r.attr('rel') === 'scene' && 
                           (m.o.attr('rel') === 'model'))
                            ret = true;
                        return ret;  

                    }
                }
          },

          types : {
            max_depth : -2,
            max_children : -2,
            valid_children: ["root","scene"],
            types : {
                root : {
                    icon : { 
                        image : "/gui/img/drive.png" 
                    },
                    valid_children: [ "collection" ],

                    hover_node : false,
                    //select_node : function () {return false;}
                },
                scene : {
                    icon : {
                        image : "/gui/img/scene-root22.png"
                    },
                    valid_children: ["model"],
                    //select_node : function () {return false;}
                },
                collection: {
                    icon : {
                        image : "/gui/img/folder.png"
                    },
                    valid_children:["image","shader","model"],

                    hover_node : true,
                    //select_node : function () {return false;}
                },
                image: {
                    icon: {
                        image: "/gui/img/media-image.png"
                    },
                    valid_children: "none",
                },
                shader : {
                    icon: {
                        image: "/gui/img/GLSLStudioIcon22.png"
                    },
                    valid_children: "none",
                },
                model : {
                    icon: {
                        image: "/gui/img/bunny22.png"
                    },
                    valid_children: "none",
                },
                default : {
                    valid_children : [ "default" ]
                }
            }
          },
          json_data:  { data: [_tree] }
        }).bind("select_node.jstree", function (e, data) {  // requires ui plugin
           // `data.rslt.obj` is the jquery extended node that was clicked
           if (cb) cb.call(data.inst,e,data.rslt);
           data.inst.deselect_node(data.rslt.obj);
        }).bind("move_node.jstree", function (e, data) { // requires crrm plugin
            if (cb) cb.call(data.inst,e,data.rslt);
        }).bind("dblclick.jstree", function (e, data) {
            //var node = $(e.target).closest("li");
            //var id = node[0].id; //id of the selected node
            if (cb) cb.call(data.inst,e,data.rslt);
        }).bind("create_node.jstree", function (e, data) {
            if (cb) cb.call(data.inst,e,data.rslt);
        }).bind("open_node.jstree", function (e, data) {
            if (cb) cb.call(data.inst,e,data.rslt);
        });
      
        return $tree;
    };

    GUI.canvas = function(_parent) {
    	$canvas = $(
    		'<canvas class="ui-resize-me" style="padding: 0; margin: 0;" ></canvas>');

		resize=function(event) {
 			$(this).height($(this).parent().parent().height()-2);
	        $(this).width($(this).parent().parent().width());
	        if (this.width != this.clientWidth ||
      		 this.height != this.clientHeight) {
	     		// Change the size of the canvas to match the size it's being displayed
	    		 this.width = this.clientWidth;
	    		 this.height = this.clientHeight;
    		}
		};

    	//$canvas.button().uniqueId();
    	if (!_parent)
			$('body').append($canvas);
		else {
		
			$parent=$(_parent);
			$parent.append($canvas);
			resize.call($canvas[0],null);
		}

		$canvas.bind('resize', resize );

        return $canvas[0];
    };
    GUI.window = function(_txt, _pane, _float) {

    	if (_pane)
    		$parent = $(".ui-layout-"+_pane);

    	// TODO - rename fragment-1 to something more useful
    	var code=
        	'<ul>'+
        	'	<li><a href="#tabs-'+_pane+'-1" >'+_txt+'</a></li>'+
        	'</ul>'+
        	
        	'<div class="ui-layout-content ui-widget-content" >'+
        	'	<div id="tabs-'+_pane+'-1" class=" ui-widget-content" ></div>'+
        	'</div>';
    	var $window;

    	if (!_pane || _float){
    		code = '<div class="ui-tabs ui-widget">'+code+'</div>';

    	    $window = $(code);
    		$window.tabs();
			$('body').append($window);

    	
	    	if (_float)
	    	  $window.resizable({helper: "ui-resizable-helper"})
    	  		 .draggable();
		}
		else {
			$window = $(code);
			$parent.append($window);
    		$parent.tabs()
	    	   // allow tabs to be moved left/right
	    	   .find(".ui-tabs-nav").sortable({ axis: 'x', zIndex: 2 });

		}
		
    	//$window.uniqueId();
		//var id=$window.attr('id');

        return $window.find('.ui-widget-content');
    };
    GUI.layout = function (){
    	var that=this;
    	var $layout = $(
            '<div class="ui-layout-north ui-widget-header" >Simple webGL Viewer</div>'+
            '<div class="ui-layout-west ui-widget-header" >'+
            '</div>'+
            '<div class="ui-layout-center ui-widget-header" >'+
            '</div>'+
            '<div class="ui-layout-south ui-widget-header">&copy; R&eacute;mi Arnaud - Advanced Micro Devices, Inc. 2013</div>'
    	);

    	$('body').append($layout);

        // CREATE THE LAYOUT
        myLayout = $('body').layout({
        	togglerLength_open: 0,		// HIDE the toggler button

        	north: {
        		closable: false,
        		resizable: false,
        		slidable: false,
        		spacing_open: 0,
            	spacing_closed: 0,
        	},
        	south: {
        		resizable: false,
        		closable: false,
        		slidable: false,
        		spacing_open: 0,
            	spacing_closed: 0,
        	},
        	west: {
        		size: "70%",
        		resizerCursor:"move",
        		onresize: GUI.resize,
        	},
        	center: {
        		onresize: GUI.resize,
        	}
        });

      

        myLayout.options.west.minSize='10%';
        myLayout.options.west.maxSize='90%';


        return myLayout;
    };
    // does not work without this
    GUI.resize = function(pane, $pane, paneState, paneOptions){ 
    	$pane.find('.ui-resize-me').resize();
    };

}).call(this);

