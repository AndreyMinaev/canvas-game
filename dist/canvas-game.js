!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.canvasGame=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Shape = require('./shapes').Shape;

/**
 * 
 * @param {object} options
 * @property {number} tileSize.
 * @property {?(number[][])} tileSet.
 * @property {?object} tileMap.
 * @constructor
 * @augments Shape
 */
function Layout(options) {
	var that = this;

	Shape.apply(that, arguments);

	options = options || {};

	that.tileSize = options.tileSize || 10;
	that.tileSet = null;
	that.tileMap = null;
	that._cache = null;
}

Layout.prototype = Object.create(Shape.prototype, {

	loadTileSet: {

		/**
		 * 
		 * @function loadTileSet
		 * @param {number[][]} tileSet
		 * @memberof Layout#
		 */
		value: function (tileSet) {
			if (tileSet instanceof Array) {
				this.tileSet = tileSet.slice(0);

				this.height = tileSet.length;
				this.width = tileSet[0].length;
			}
		}
	},

	loadTileMap: {

		/**
		 * 
		 * @function loadTileMap
		 * @param {string} src
		 * @param {function} callback
		 * @memberof Layout#
		 */
		value: function (src, callback) {
			var that = this,
				image = new Image();
			
			image.onload = function () {
				that.tileMap = image;

				callback();
			};

			image.src = src;
		}
	},

	render: {

		/**
		 * Draw shape in context
		 * @function render
		 * @param {object} ctx - The context in which you need to draw
		 * @memberof Layout#
		 */
		value: function (ctx) {
			var that = this;

			if (!that._cache) {
				that._cache = document.createElement('canvas').getContext('2d');
				that._cache.canvas.width = that.width * that.tileSize;
				that._cache.canvas.height = that.height * that.tileSize;

				that.updateCache();
			}

			ctx.save();
			ctx.drawImage(that._cache.canvas, 0, 0);
			ctx.restore();
		}
	},

	updateCache: {

		/**
		 * 
		 * @function updateCache
		 * @param {number[][]} [tiles] - Set of changed tiles
		 * @memberof Layout#
		 */
		value: function (tiles) {
			var that = this;

			if (tiles instanceof Array) {
				tiles.forEach(function (coordinates) {
					that.clearTile(coordinates.x, coordinates.y);
					that.renderTile(coordinates.x, coordinates.y);
				});
			} else {
				that.tileSet.forEach(function (row, y) {
					row.forEach(function (tile, x) {
						that.renderTile(x, y);
					});
				});
			}
		}
	},

	clearTile: {

		/**
		 * 
		 * @function clearTile
		 * @param {number} x
		 * @param {number} y
		 * @memberof Layout#
		 */
		value: function (x, y) {
			var that = this;

			that._cache.save();
			that._cache.clearRect(
				x*that.tileSize,
				y*that.tileSize,
				that.tileSize,
				that.tileSize);
			that._cache.restore();
		}
	},

	renderTile: {

		/**
		 * 
		 * @function renderTile
		 * @param {number} x
		 * @param {number} y
		 * @memberof Layout#
		 */
		value: function (x, y) {
			var
				that = this,
				tile = that.tileSet[y][x];

			that._cache.save();
			that._cache.drawImage(
				that.tileMap,
				tile*that.tileSize,
				0,
				that.tileSize,
				that.tileSize,
				x*that.tileSize,
				y*that.tileSize,
				that.tileSize,
				that.tileSize);
			that._cache.restore();
		}
	},

	getTileNeighbors: {

		/**
		 * 
		 * @function getTileNeighbors
		 * @param {number} x
		 * @param {number} y
		 * @memberof Layout#
		 */
		value: function (x, y) {
			var that = this,
				result = [
					[x-1,	y-1],
					[x,		y-1],
					[x+1,	y-1],
					[x+1,	y],
					[x+1,	y+1],
					[x,		y+1],
					[x-1,	y+1],
					[x-1,	y]
				];

			return result.map(function (coord) {
				return that.getTile(coord[0], coord[1]);
			});
		}
	},

	getTile: {

		/**
		 * 
		 * @function getTile
		 * @param {number} x
		 * @param {number} y
		 * @memberof Layout#
		 */
		value: function (x, y) {
			var 
				x = (x + this.width) % this.width,
				y = (y + this.height) % this.height;

			return this.tileSet[y][x];
		}
	}
});

module.exports = Layout;
},{"./shapes":3}],2:[function(require,module,exports){
var
	shapes = require('./shapes'),
	Shape = shapes.Shape,
	Rectangle = shapes.Rectangle,
	Layout = require('./layout');

Game.Shape = Shape;
Game.Rectangle = Rectangle;
Game.Layout = Layout;

function Game(options) {
	var that = this;

	options = options || {};

	if (!options.context instanceof CanvasRenderingContext2D) {
		throw Error('Game: You must specify context for rendering');
	}
	that.ctx = options.context;

	that.ctx.canvas.width = that.width = options.width || that.ctx.canvas.width;
	that.ctx.canvas.height = that.height = options.height || that.ctx.canvas.height;

	that.actions = [];
	that.objects = [];
}

Game.prototype.start = function () {
	var that = this,
		rAF = requestAnimationFrame;

	animationStep();

	function animationStep(time) {
		time = time || 0;

		that.actions.forEach(function (action) {
			if (time - action.lastTime >= action.delay) {
				action.action(time);
			
				action.lastTime = Math.floor(time / action.delay)*action.delay;	
			}
		});

		that.clearContext();

		that.objects.forEach(function (object) {
			object.render(that.ctx);
		});

		that.loop = rAF(animationStep);
	}
	
};

Game.prototype.clearContext = function () {
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
};

Game.prototype.stop = function () {
	if (this.loop) {
		cancelAnimationFrame(this.loop);
	}
};

Game.prototype.addObject = function (obj) {
	if (obj instanceof Shape) {
		this.objects.push(obj);
	}
};

Game.prototype.removeObject = function (obj) {
	var index = this.objects.indexOf(obj);

	if (obj instanceof Shape && index > -1) {
		this.objects.splice(index, 1);
	}
};

Game.prototype.addAction = function (name, action, delay) {
	if (typeof name === "string" && typeof action === "function") {
		this.actions.push({
			name: name,
			action: action,
			delay: delay || 50,
			lastTime: 0
		});
	}
};

Game.prototype.removeAction = function (name) {
	var action = _(this.actions).find({
			name: name
		}),
		index = this.actions.indexOf(action);

	if (index > -1) {
		this.actions.splice(index, 1);
	}
};

module.exports = Game;
},{"./layout":1,"./shapes":3}],3:[function(require,module,exports){
function getDecimal(number) {
	return +(number % 1).toFixed(9);
}


/**
 * Basic shape with coordinates and sizes.
 * @param {object} options
 * @property {number} x.
 * @property {number} y.
 * @property {number} width.
 * @property {number} height.
 * @constructor
 */
function Shape(options) {
	options = options || {};

	this.x = options.x || 0;
	this.y = options.y || 0;
	this.width = options.width || 0;
	this.height = options.height || 0;
}

/** Draw shape in context(abstract method) */
Shape.prototype.render = function () {
	throw Error('Method must be overridden');
};

/**
 * Shape with method for drawing as a rectangle.
 * @param {object} options
 * @property {string} fillStyle.
 * @property {string} strokeStyle.
 * @property {number} lineWidth.
 * @constructor
 * @augments Shape
 */
function Rectangle(options) {
	Shape.apply(this, arguments);

	options = options || {};

	this.fillStyle = options.fillStyle || 'transparent';
	this.strokeStyle = options.strokeStyle || '#000';
	this.lineWidth = options.lineWidth || 1.0;
}

Rectangle.prototype = Object.create(Shape.prototype, {
	render: {

		/**
		 * Draw shape in context
		 * @function render
		 * @param {object} ctx - The context in which you need to draw
		 * @memberof Rectangle#
		 */
		value: function (ctx) {
			var lineOffset = getDecimal(this.lineWidth/2);

			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = this.fillStyle;
			ctx.strokeStyle = this.strokeStyle;
			ctx.lineWidth = this.lineWidth;
			ctx.rect( this.x + lineOffset,  this.y + lineOffset, this.width, this.height);
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		}
	}
});

module.exports = {
	Shape: Shape,
	Rectangle: Rectangle
}
},{}]},{},[2])(2)
});