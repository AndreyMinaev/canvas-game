;(function (document, Game) {
	var
		CONTEXT = document.getElementById('canvas').getContext('2d'),
		TILE_SIZE = 10,
		GAME_WIDTH = 60,
		GAME_HEIGHT = 45,

		fillButton = document.getElementById('fill-button'),
		startButton = document.getElementById('start-button'),
		stopButton = document.getElementById('stop-button'),

		life = new Game({
			context: CONTEXT,
			width: GAME_WIDTH * TILE_SIZE,
			height: GAME_HEIGHT * TILE_SIZE
		}),
		cursor = new Game.Rectangle({
			width: TILE_SIZE,
			height: TILE_SIZE,
			lineWidth: 2,
			strokeStyle: '#999'
		}),
		layout = new Game.Layout({ tileSize: TILE_SIZE });

	layout.loadTileMap(drawTileMap(), function () {
		var tileSet = initTiles(GAME_WIDTH, GAME_HEIGHT);

		layout.loadTileSet(tileSet);
		life.addObject(layout);
		life.start();
	});

	CONTEXT.canvas.addEventListener('mouseover', canvasMouseoverHandler, false);
	CONTEXT.canvas.addEventListener('mousemove', canvasMousemoveHandler, false);
	CONTEXT.canvas.addEventListener('mouseout', canvasMouseoutHandler, false);
	CONTEXT.canvas.addEventListener('click', canvasClickHandler, false);

	fillButton.addEventListener('click', fillClickHandler, false);
	startButton.addEventListener('click', startClickHandler, false);
	stopButton.addEventListener('click', stopClickHandler, false);



	function canvasMouseoverHandler(e) {
		var 
			x = ((e.clientX - CONTEXT.canvas.offsetLeft)/TILE_SIZE|0)*TILE_SIZE,
			y = ((e.clientY - CONTEXT.canvas.offsetTop + window.scrollY)/TILE_SIZE|0)*TILE_SIZE;

		cursor.x = x;
		cursor.y = y;
		life.addObject(cursor);
	}

	function canvasMousemoveHandler(e) {
		var 
			x = ((e.clientX - CONTEXT.canvas.offsetLeft)/TILE_SIZE|0)*TILE_SIZE,
			y = ((e.clientY - CONTEXT.canvas.offsetTop + window.scrollY)/TILE_SIZE|0)*TILE_SIZE;

		cursor.x = x;
		cursor.y = y;
	}

	function canvasMouseoutHandler() {
		life.removeObject(cursor);
	}

	function canvasClickHandler(e) {
		var 
			x = cursor.x/TILE_SIZE|0,
			y = cursor.y/TILE_SIZE|0;

		layout.tileSet[y][x] = +!layout.tileSet[y][x];
		layout.updateCache([{ x: x, y: y }]);
	}

	function fillClickHandler(e) {
		life.removeAction('updateTiles');

		fillTiles(layout);
		layout.updateCache();
	}

	function startClickHandler(e) {
		life.addAction('updateTiles', animationStep);
	}

	function stopClickHandler(e) {
		life.removeAction('updateTiles');
	}

	function animationStep() {
		layout.updateCache(recalculateTiles(layout));
	}


	function initTiles(width, height) {
		var result = [];

		for (var y = 0; y < height; y++) {
			result.push([]);

			for (var x = 0; x < width; x++) {
				result[y].push(
					0
				);
			}
		}

		return result;
	}

	function fillTiles(layout, number) {
		var that = layout,
			i = 0,
			x = 0,
			y = 0,
			tileIndex = 0,
			length = that.width * that.height,
			number = number || length/2;

		killAllTiles(layout);

		for ( ; i < number; i++) {
			tileIndex = (Math.random()*(length - 1))|0;
			x = tileIndex % that.width;
			y = (tileIndex / that.width)|0;

			if (!that.tileSet[y][x]) {
				that.tileSet[y][x] = 1;
			}
		}
	};

	function killAllTiles(layout) {
		layout.tileSet = layout.tileSet.map(function (row) {
			return row.map(function () {
				return 0;
			});
		});
	};

	function recalculateTiles(layout) {
		var changedTiles = [];

		layout.tileSet = layout.tileSet.map(function (row, y) {
			return row.map(function (tile, x) {
				var
					neighbors = layout.getTileNeighbors(x, y),
					numberLiveNeighbors = neighbors.reduce(function (number, neighbor) {
						return number + neighbor;
					}, 0),
					newTile = tile;

				if (tile) {
					if (numberLiveNeighbors < 2 || numberLiveNeighbors > 3) {
						newTile = 0;
						changedTiles.push({ x: x, y: y });
					}
				} else if (numberLiveNeighbors === 3) {
					newTile = 1;
					changedTiles.push({ x: x, y: y });
				}
				return newTile;
			});
		});

		return changedTiles;
	}

	function drawTileMap() {
		var liveColor = '#fff';
			deadColor = '#000',

			ctx = document.createElement('canvas').getContext('2d');

		ctx.canvas.width = 2*TILE_SIZE;
		ctx.canvas.height = TILE_SIZE;

		ctx.fillStyle = deadColor;
		ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

		ctx.fillStyle = liveColor;
		ctx.fillRect(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);

		return ctx.canvas.toDataURL();
	}

}(document, canvasGame));