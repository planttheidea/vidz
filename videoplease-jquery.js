(function(window,document){
		// create nodes with ease
	var newNode = function(nodeName){
			return document.createElement(nodeName);
		},
		// unique to old IE
		ieObject = function(url){
			var div = newNode('div');
			
			div.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param name="movie" value="' +url + '"></object>';
			
			return div.firstChild;
		},
		// quick test if array
		isArray = function(item){
			return ($.type(item) === 'array');
		},
		// quick test if undefined
		isUndefined = function(item){
			return ($.type(item) === 'undefined');
		},
		// check if old IE
		isMSIE = /*@cc_on!@*/false,
		// set attribute method
		setAttribute = function(attrObj){
			var addMe = true;
			
			if(!isUndefined(attrObj.value)){
				if(isArray(attrObj.value)){
					if(!isUndefined(attrObj.value[attrObj.index])){
						attrObj.target.setAttribute(attrObj.name,((attrObj.prefix || '') + attrObj.value[attrObj.index]));
					} else {
						addMe = false;
					}
				} else {
					attrObj.target.setAttribute(attrObj.name,attrObj.value);
				}
			} else {
				addMe = false;
			}
			
			return addMe;
		},
		// default nodes used for all video creation
		defaultNodes = {
			video:newNode('video'),
			source:newNode('source'),
			object:newNode('object'),
			param:newNode('param')
		},
		// default attributes (can be overridden)
		defaultAttributes = {
			preload:'auto',
			controls:'controls',
			flashFallback:true
		},
		// revert replaced node to original node
		remove = function(i){
			if(this.isActive[i]){
				this.players[i].parentNode.replaceChild(this.elements[i],this.players[i]);
				this.isActive[i] = false;
			}
			
			return this;
		},
		// replace node with video
		add = function(i){
			if(!this.isActive[i]){
				this.elements[i].parentNode.replaceChild(this.players[i],this.elements[i]);
				this.isActive[i] = true;
			}
			
			return this;
		},
		// either adds or removes based on action requested
		activity = function(index,replace){
			if(index){
				switch($.type(index)){
					case 'number':
						replace ? add.call(this,index) : remove.call(this,index);
						
						break;
					case 'array':
						for(var i = index.length; i--;){
							if($.type(i) === 'number'){
								replace ? add.call(this,i) : remove.call(this,i);
							} else {
								throw new Error('Value passed in is not of valid type, must be an array of indexes.');
							}
						}
						
						break;
					default:
						throw new Error('Value passed in is not of valid type, must be an index.');
						
						break;
						
				}
			} else {
				for(var i = this.length; i--;){
					replace ? add.call(this,i) : remove.call(this,i);
				}
			}
			
			// returned for chaining
			return this;
		},
		// return a node or array of nodes, either players or elements (based on method used)
		retrieve = function(id,els){
			switch($.type(id)){
				case 'number':
					return (els ? this.elements[id] : this.players[id]);
					
					break;
				case 'string':
					var node;
					
					for(var i = this.length; i--;){
						if(this.players[i].getAttribute('id') === id){
							node = (els ? this.elements[i] : this.players[i]);
							break;
						}
					}
					
					return node;
					
					break;
				case 'array':
					var nodeArray = [];
					
					for(var i = 0, len = id.length; i < len; i++){
						els ? nodeArray.push(retrieve.call(this,id[i])) : nodeArray.push(retrieve.call(this,id[i],true));
					}
					
					return nodeArray;
					
					break;
				case 'undefined':
					return (els ? this.elements : this.players);
					
					break;
				default:
					throw new Error('Invalid parameter passed. Can be either the index (integer), id (string), or an array of either indices of ids').
					
					break;
			}
		},
		// return a node or array of nodes, either players or elements (based on method used)
		isActive = function(id){
			switch($.type(id)){
				case 'number':
					return this.isActive[id];
					
					break;
				case 'string':
					var active;
					
					for(var i = this.length; i--;){
						if(this.players[i].getAttribute('id') === id){
							active = this.isActive[i];
							break;
						}
					}
					
					return active;
					
					break;
				case 'array':
					var activeArray = [];
					
					for(var i = 0, len = id.length; i < len; i++){
						activeArray.push(isActive.call(this,id[i]));
					}
					
					return activeArray;
					
					break;
				case 'htmldivelement':
					var active;
					
					for(var i = this.length; i--;){
						if(this.players[i] === id){
							active = this.isActive[i];
							break;
						}
					}
					
					return active;
					
					break;
				case 'undefined':
					return this.isActive;
					
					break;
				default:
					throw new Error('Invalid parameter passed. Can be either the index (integer), id (string), or an array of either indices of ids').
					
					break;
			}
		};
	
	function VideoPlease(selector,options){
			// coalesce options passed into empty object, for easy key checking
		var passed = (options || {}),
			// create each node instance possibly used in any video
			videoNodes = {
				video:defaultNodes.video.cloneNode(false),
				mp4Source:defaultNodes.source.cloneNode(false),
				webmSource:defaultNodes.source.cloneNode(false),
				oggSource:defaultNodes.source.cloneNode(false),
				object:defaultNodes.object.cloneNode(false),
				fullscreenParam:defaultNodes.param.cloneNode(false),
				scriptAccessParam:defaultNodes.param.cloneNode(false),
				flashVarsParam:defaultNodes.param.cloneNode(false),
				movieParam:defaultNodes.param.cloneNode(false)
			},
			// get all elements based on selector
			elements = (isArray(selector) ? selector : document.querySelectorAll(selector));
		
		// give node a style for IE8
		if(!videoNodes.video.canPlayType){
			videoNodes.video.style.display = 'block';
		}
		
		// all videos will have the class of VideoPlease
		videoNodes.video.className = 'VideoPlease';
		
		// set initial class values
		this.length = 0;
		this.elements = [];
		this.players = [];
		this.isActive = [];
		
		for(var i = 0; i < elements.length; i++){
			// create clone for all nodes
			var tempVid = videoNodes.video.cloneNode(true),
				tempMp4 = videoNodes.mp4Source.cloneNode(false),
				tempWebm = videoNodes.webmSource.cloneNode(false),
				tempOgg = videoNodes.oggSource.cloneNode(false),
				tempObj = videoNodes.object.cloneNode(false),
				tempFSParam = videoNodes.fullscreenParam.cloneNode(false),
				tempSAParam = videoNodes.scriptAccessParam.cloneNode(false),
				tempFVParam = videoNodes.flashVarsParam.cloneNode(false),
				fallback;
				
			if(options){
				// set index and class to denote unique instance
				tempVid.setAttribute('data-index',i);
				tempVid.className += (' VideoPlease' + i);
				
				tempVid.setAttribute('preload',(passed.preload || defaultAttributes.preload));
				tempVid.setAttribute('controls',(passed.controls || defaultAttributes.controls));
				
				// video container attributes
				setAttribute({
					target:tempVid,
					name:'preload',
					value:passed.preload,
					index:i
				});
				
				setAttribute({
					target:tempVid,
					name:'id',
					value:passed.id,
					index:i
				});
				
				setAttribute({
					target:tempVid,
					name:'width',
					value:passed.width,
					index:i
				});
				
				setAttribute({
					target:tempVid,
					name:'height',
					value:passed.height,
					index:i
				});
				
				if(passed.className){
					if(isArray(passed.className)){
						if(!isUndefined(passed.className[i])){
							tempVid.className += passed.className[i];
						}
					} else {
						tempVid.className += passed.className;
					}
				}
				
				setAttribute({
					target:tempVid,
					name:'poster',
					value:passed.poster,
					index:i
				});
			
				// source attributes
				if(setAttribute({
					target:tempMp4,
					name:'src',
					value:passed.mp4,
					index:i
				})){
					tempMp4.type = 'video/mp4';
					tempVid.appendChild(tempMp4);
				}
				
				if(setAttribute({
					target:tempWebm,
					name:'src',
					value:passed.webm,
					index:i
				})){
					tempWebm.type = 'video/webm';
					tempVid.appendChild(tempWebm);
				}
				
				if(setAttribute({
					target:tempOgg,
					name:'src',
					value:passed.ogg,
					index:i
				})){
					tempOgg.type = 'video/ogg';
					tempVid.appendChild(tempOgg);
				}
				
				// detect fallback for item
				if(!isUndefined(passed.flashFallback)){
					if(isArray(passed.flashFallback)){
						if(!isUndefined(passed.flashFallback[i])){
							fallback = passed.flashFallback[i];
						} else {
							fallback = defaultAttributes.flashFallback;
						}
					} else {
						fallback = passed.flashFallback;
					}
				} else {
					fallback = defaultAttributes.flashFallback;
				}
				
				if(fallback){
					// set fullscreen param names and values
					tempFSParam.setAttribute('name','allowfullscreen');
					tempFSParam.setAttribute('value',true);
					
					// set scriptaccess param names and values
					tempSAParam.setAttribute('name','allowscriptaccess');
					tempSAParam.setAttribute('value','always');
					
					// set flashvars param names and values
					tempFVParam.setAttribute('name','flashvars');
					
					if(!isUndefined(passed.swf)){
						// add movie param if old IE
						if(isMSIE){
							if(isArray(passed.swf)){
								if(!isUndefined(passed.swf[i])){
									tempObj = ieObject(passed.swf[i]);
								}
							} else {
								tempObj = ieObject(passed.swf);
							}
						} else {
							setAttribute({
								target:tempObj,
								name:'data',
								value:passed.swf,
								index:i
							});
						}
					}
					
					setAttribute({
						target:tempObj,
						name:'width',
						value:passed.width,
						index:i
					});
					
					setAttribute({
						target:tempObj,
						name:'height',
						value:passed.height,
						index:i
					});
					
					// add <object> to <video>
					tempVid.appendChild(tempObj);
					
					// set type for object
					tempObj.setAttribute('type','application/x-shockwave-flash');				
					
					// add <param> objects to <object>
					tempObj.appendChild(tempFSParam);
					tempObj.appendChild(tempSAParam);
					
					if(setAttribute({
						target:tempFVParam,
						name:'value',
						value:passed.mp4,
						prefix:'file=',
						index:i
					})){
						tempObj.appendChild(tempFVParam);
					}
				}
				
				// push player, element, and active state to array (only if options were passed)
				this.players.push(tempVid);
				this.elements.push(elements[i]);
				this.isActive.push(false);
				
				// and grow the length
				this.length++;
			} else {
				throw new Error('Must pass in parameters to create video element.');
			}
		}
		
		return this;
	}
	
	VideoPlease.prototype = {
		// check whether a player is active, called in the same way as the other methods (index, id, or an array of either)
		active:function(id){
			return isActive.call(this,id);
		},
		/*
		 * the add and remove functions are identical, save for whether you add or remove, so each call
		 * a standard function, passing in a parameter
		 */
		add:function(index){
			return activity.call(this,index,true);
		},
		/*
		 * the element and player functions are identical, save for whether you add or remove, so each call
		 * a standard function, passing in a parameter
		 */
		element:function(id){
			return retrieve.call(this,id,true);
		},
		player:function(id){
			return retrieve.call(this,id);
		},	
		remove:function(index){
			return activity.call(this,index,false);
		}
	};
	
	$.fn.extend({
		videoPlease:function(options){
			var els = [];
			
			for(var i = 0; i < this.length; i++){
				els.push(this[i]);
			}
			
			return new VideoPlease(els,options);
		}
	});		
})(window,document);
