function getDecimal(number) {
	return +(number % 1).toFixed(9);
}


/**
 * 
 * @param {number} x
 * @param {number} y
 * @property {number} x
 * @property {number} y
 * @constructor
 */
function Point(x, y) {
	this.x = x;
	this.y = y;
}


/**
 * Basic shape with coordinates and sizes.
 * @param {object} options
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
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
 * @property {string} fillStyle
 * @property {string} strokeStyle
 * @property {number} lineWidth
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

/**
 * 
 * Note: x and y property is a origin for points of path
 * @param {object} options
 * @property {Point[]} path
 * @property {string} fillStyle
 * @property {string} strokeStyle
 * @property {number} lineWidth
 * @constructor
 * @augments Shape
 */
function Polygon(options) {
	Shape.apply(this, arguments);

	options = options || {};

	this.path = options.path || [];
	this.fillStyle = options.fillStyle || 'transparent';
	this.strokeStyle = options.strokeStyle || '#000';
	this.lineWidth = options.lineWidth || 1.0;
}

Polygon.prototype = Object.create(Shape.prototype, {
	render: {

		/**
		 * Draw shape in context
		 * @function render
		 * @param {object} ctx - The context in which you need to draw
		 * @memberof Polygon#
		 */
		value: function (ctx) {

			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = this.fillStyle;
			ctx.strokeStyle = this.strokeStyle;
			ctx.lineWidth = this.lineWidth;

			ctx.translate(this.x, this.y);

			this.path.forEach(function (point, index) {
				
				// if this first point(index is zero) then use moveTo method
				// in other case use lineTo method
				ctx[index && 'lineTo' || 'moveTo'](point.x, point.y);
			});

			ctx.closePath();
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		}
	},

	addPoint: {

		/**
		 * Add a point to the polygon path
		 * @function addPoint
		 * @param {Point} point
		 * @param {number} [index=path.length]
		 * @memberof Polygon#
		 */
		value: function (point, index) {
			index = typeof index === 'undefined' ? this.length : index;

			if (point instanceof Point) {
				this.path.splice(index, 0, point);
			}
		}
	},

	removePoint: {

		/**
		 * remove a point from the polygon path
		 * @function removePoint
		 * @param {number} point
		 * @memberof Polygon#
		 */
		value: function (point) {
			this.path.splice(point, 1);
		}
	}
});

module.exports = {
	Point: Point,

	Shape: Shape,
	Rectangle: Rectangle,
	Polygon: Polygon
}