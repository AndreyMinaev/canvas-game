function getDecimal(number) {
	return +(number % 1).toFixed(9);
}

function Shape(options) {
	options = options || {};

	this.x = options.x || 0;
	this.y = options.y || 0;
	this.width = options.width || 0;
	this.height = options.height || 0;
}

Shape.prototype.render = function () {
	throw Error('Method must be overridden');
};

function Restangle(options) {
	Shape.apply(this, arguments);

	options = options || {};

	this.fillStyle = options.fillStyle || 'transparent';
	this.strokeStyle = options.strokeStyle || '#000';
	this.lineWidth = options.lineWidth || 1.0;
}

Restangle.prototype = Object.create(Shape.prototype, {
	render: {
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
	Restangle: Restangle
}