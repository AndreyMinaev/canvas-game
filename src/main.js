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