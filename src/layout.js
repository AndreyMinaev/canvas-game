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

	that.x = options.x || 0;
	that.y = options.y || 0;
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