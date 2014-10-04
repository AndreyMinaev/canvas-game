describe('Layout', function() {
	var
	  	tileSet = [
	  		['00', '01', '02', '03', '04'],
	  		['10', '11', '12', '13', '14'],
	  		['20', '21', '22', '23', '24'],
	  		['30', '31', '32', '33', '34'],
	  		['40', '41', '42', '43', '44'],
	  		['50', '51', '52', '53', '54']
	  	]
		layout = new canvasGame.Layout({
			x: 5,
			y: 10,
			tileSize: 20
		});
		
	layout.loadTileSet(tileSet);

	it('load tile set', function () {
		expect(layout.tileSet).toEqual(tileSet);
	});

	it('correct initial x position', function () {
		expect(layout.x).toBe(5);
	});

	it('correct initial y position', function () {
		expect(layout.y).toBe(10);
	});

	it('correct initial tile size', function () {
		expect(layout.tileSize).toBe(20);
	});

	it('correct initial layout size', function () {
		expect(layout.width).toBe(5);
		expect(layout.height).toBe(6);
	});

	it('find tiles by coordinates', function () {
		expect(layout.getTile(2,2)).toBe(layout.tileSet[2][2]);

		expect(layout.getTile(-1,-1)).toBe(layout.tileSet[5][4]);
		expect(layout.getTile(2,-1)).toBe(layout.tileSet[5][2]);
		expect(layout.getTile(5,-1)).toBe(layout.tileSet[5][0]);
		expect(layout.getTile(5,2)).toBe(layout.tileSet[2][0]);
		expect(layout.getTile(5,6)).toBe(layout.tileSet[0][0]);
		expect(layout.getTile(2,6)).toBe(layout.tileSet[0][2]);
		expect(layout.getTile(-1,6)).toBe(layout.tileSet[0][4]);
		expect(layout.getTile(-1,2)).toBe(layout.tileSet[2][4]);
	});
});