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
		// check type of object
		getType = function(obj){
			return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
		},
		// quick test if array
		isArray = function(item){
			return (getType(item) === 'array');
		},
		// quick test if undefined
		isUndefined = function(item){
			return (getType(item) === 'undefined');
		},
		// check if old IE
		isMSIE = /*@cc_on!@*/false,
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
				switch(getType(index)){
					case 'number':
						replace ? add.call(this,index) : remove.call(this,index);
						
						break;
					case 'array':
						for(var i = index.length; i--;){
							if(getType(i) === 'number'){
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
			switch(getType(id)){
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
			switch(getType(id)){
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
			elements = document.querySelectorAll(selector),
			// placeholder for fallback
			fallback;
		
		if(!videoNodes.video.canPlayType){
			videoNodes.video.style.display = 'block';
		}
		
		videoNodes.video.setAttribute('preload',(passed.preload || defaultAttributes.preload));
		videoNodes.video.setAttribute('controls',(passed.controls || defaultAttributes.controls));
		
		videoNodes.video.className = 'VideoPlease';
		
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
				tempFSParam = videoNodes.fullscreenParam.cloneNode(false);
				tempSAParam = videoNodes.scriptAccessParam.cloneNode(false);
				tempFVParam = videoNodes.flashVarsParam.cloneNode(false);
				
			if(options){
				// set index and class to denote unique instance
				tempVid.setAttribute('data-index',i);
				tempVid.className += (' VideoPlease' + i);
				
				// video container attributes			
				if(passed.id){
					if(isArray(passed.id)){
						if(!isUndefined(passed.id[i])){
							tempVid.setAttribute('id',passed.id[i]);
						}
					} else {
						tempVid.setAttribute('id',passed.id);
					}
				}
				
				if(passed.width){
					if(isArray(passed.width)){
						if(!isUndefined(passed.width[i])){
							tempVid.setAttribute('width',passed.width[i]);
						}
					} else {
						tempVid.setAttribute('width',passed.width);
					}
				}
				
				if(passed.height){
					if(isArray(passed.height)){
						if(!isUndefined(passed.height[i])){
							tempVid.setAttribute('height',passed.height[i]);
						}
					} else {
						tempVid.setAttribute('height',passed.height);
					}
				}
				
				if(passed.className){
					if(isArray(passed.className)){
						if(!isUndefined(passed.className[i])){
							tempVid.className += passed.className[i];
						}
					} else {
						tempVid.className += passed.className;
					}
				}
				
				if(passed.poster){
					if(isArray(passed.poster)){
						if(!isUndefined(passed.poster[i])){
							tempVid.setAttribute('poster',passed.poster[i]);
						}
					} else {
						tempVid.setAttribute('poster',passed.poster);
					}
				}
			
				// source attributes
				if(passed.mp4){
					var addMp4 = true;
					
					if(isArray(passed.mp4)){
						if(!isUndefined(passed.mp4[i])){
							tempMp4.setAttribute('src',passed.mp4[i]);
						} else {
							addMp4 = false;
						}
					} else {
						tempMp4.setAttribute('src',passed.mp4);
					}
					
					if(addMp4){
						tempMp4.type = 'video/mp4';
						tempVid.appendChild(tempMp4);
					}
				}
				
				if(passed.webm){
					var addWebm = true;
					
					if(isArray(passed.webm)){
						if(!isUndefined(passed.webm[i])){
							tempWebm.setAttribute('src',passed.webm[i]);
						} else {
							addWebm = false;
						}
					} else {
						tempWebm.setAttribute('src',passed.webm);
					}
					
					if(addWebm){
						tempWebm.type = 'video/webm';
						tempVid.appendChild(tempWebm);
					}
				}
				
				if(passed.ogg){
					var addOgg = true;
					
					if(isArray(passed.ogg)){
						if(!isUndefined(passed.ogg[i])){
							tempWebm.setAttribute('src',passed.ogg[i]);
						} else {
							addOgg = false;
						}
					} else {
						tempWebm.setAttribute('src',passed.ogg);
					}
					
					if(addOgg){
						tempVid.appendChild(tempOgg);
						tempOgg.type = 'video/ogg';
					}
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
					var addFV = true;
					
					// set fullscreen param names and values
					tempFSParam.setAttribute('name','allowfullscreen');
					tempFSParam.setAttribute('value',true);
					
					// set scriptaccess param names and values
					tempSAParam.setAttribute('name','allowscriptaccess');
					tempSAParam.setAttribute('value','always');
					
					// set flashvars param names and values
					tempFVParam.setAttribute('name','flashvars');
					
					if(passed.mp4){
						if(isArray(passed.mp4)){
							if(!isUndefined(passed.mp4[i])){
								tempFVParam.setAttribute('value',('file=' + passed.mp4[i]));
							} else {
								addFV = false;
							}
						} else {
							tempFVParam.setAttribute('value',('file=' + passed.mp4));
						}
					}
					
					if(passed.swf){
						var swfArray = isArray(passed.swf);
						
						// add movie param if old IE
						if(isMSIE){
							if(swfArray){
								if(!isUndefined(passed.swf[i])){
									tempObj = ieObject(passed.swf[i]);
								}
							} else {
								tempObj = ieObject(passed.swf);
							}
						} else {
							if(swfArray){
								if(!isUndefined(passed.swf[i])){
									tempObj.setAttribute('data',passed.swf[i]);
								}
							} else {
								tempObj.setAttribute('data',passed.swf);
							}
						}
					}
				
					if(passed.width){
						if(getType(passed.width) === 'array'){
							tempObj.setAttribute('width',passed.width[i]);
						} else {
							tempObj.setAttribute('width',passed.width);
						}
					}
					
					if(passed.height){
						if(getType(passed.height) === 'array'){
							tempObj.setAttribute('height',passed.height[i]);
						} else {
							tempObj.setAttribute('height',passed.height);
						}
					}
					
					// add <object> to <video>
					tempVid.appendChild(tempObj);
					
					// set type for object
					tempObj.setAttribute('type','application/x-shockwave-flash');				
					
					// add <param> objects to <object>
					tempObj.appendChild(tempFSParam);
					tempObj.appendChild(tempSAParam);
					
					if(addFV){
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
	
	window.VideoPlease = VideoPlease;		
})(window,document);
