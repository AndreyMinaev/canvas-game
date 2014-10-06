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