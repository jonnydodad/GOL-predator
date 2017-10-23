var App = function(targetElementId, viewWidth, viewHeight){
	var me = this;
	// Grab the canvas
	me.canvas = document.getElementById(targetElementId);
	me.ctx = me.canvas.getContext("2d");

	viewWidth = me.canvas.width = viewHeight = me.canvas.height = 600;
  	
  	var generations = 0;
  	var win = false;
  	var lose = false;
	var level = 0;
	var squaresX = gameTemp(level).size;
  	var squaresY = gameTemp(level).size;
	var _startSim = false;
  	var grid = new Grid(squaresX, squaresY, gridTemp(0), gameTemp(0));
  	var click = true;
  	var _squareWidth = me.canvas.width/squaresX;
  	var _squareHeight = _squareWidth;

  	// Handle Click events
	var _mouseDown = false;
	var handleClick = function(event){
		if (click){
			click = !click;
			var x = event.pageX - me.canvas.offsetLeft;
			var y = event.pageY - me.canvas.offsetTop;
			var i = Math.floor(x/_squareWidth);
			var j = Math.floor(y/_squareHeight);
			if (event.which === 3){
				grid.getCell(i, j).isInert = true;
				grid.getCell(i, j).isAlive = false;
			return;
			}
			if (event.which === 2){
				grid.getCell(i,j).isFood = true;	
			}
			grid.getCell(i, j).isAlive = true;
			return;
		}	
	};
	
	window.onkeydown = function(ev){
		_startSim = !_startSim;
	};

	me.canvas.addEventListener('contextmenu', function(event) {
    	event.preventDefault();
	}, false)

	me.canvas.addEventListener('mousedown', function(event){
		_mouseDown = true;
		handleClick(event);
		me.canvas.addEventListener('mousemove', handleClick);
	});

	me.canvas.addEventListener('mouseup', function(event){
		_mouseDown = false;
		me.canvas.removeEventListener('mousemove', handleClick);
	});

	me.start = function(){
		setInterval(function(){
			me.update();
			me.draw();
		 	win = me.checkFood();
		 	lose = me.checkLoser();
		 	if (_startSim){
		 		generations++;
		 		console.log(generations);
		 	}
		 	if (lose){
		 		_startSim = !_startSim;
				click = !click;
				squaresX = gameTemp(level).size;
  				squaresY = gameTemp(level).size;
				grid = new Grid( squaresX, squaresY, gridTemp(level), gameTemp(level));
				generations = 0;
		 	}
			if (win){
				_startSim = !_startSim;
				click = !click;
				level++;
				squaresX = gameTemp(level).size;
  				squaresY = gameTemp(level).size;
  				_squareWidth = me.canvas.width/squaresX;
  				_squareHeight = _squareWidth;
				grid = new Grid( squaresX, squaresY, gridTemp(level), gameTemp(level));
				generations = 0;	
			}

		}, 60);

	};

	me.update = function(){
		if(_startSim){
			grid.updateLiving();	
		}
	};

	me.draw = function(){
		// Erase previous draw
		me.ctx.fillStyle = gameTemp(level).land;
	 	me.ctx.fillRect(0,0,me.canvas.width,me.canvas.height);

	 	// Draw living and inert squares
	 	grid.filter(function(cell){
	 		return cell.isAlive || cell.isInert;
	 	}).forEach(function(cell){
	 		if (cell.isInert){
	 			me.ctx.fillStyle = gameTemp(level).bar;
	 		}else if(cell.isFood){
	 			me.ctx.fillStyle = 'red';
	 		}else
	 			me.ctx.fillStyle = 'lime';

	 		me.ctx.fillRect(cell.x * _squareWidth, cell.y * _squareHeight, _squareWidth, _squareHeight);
	 	});

	 me.checkLoser = function(){
	 	var alive = grid.filter(function(cell){
	 		return cell.isAlive && !cell.isFood;
	 	}).length;
	 	var food = grid.filter(function(cell){
	 		return cell.isFood;
	 	}).length;
	 	if (generations > gameTemp(level).gens || (alive===0 && food!== 0)){
	 		console.log("FAIL");
	 		return true
	 	}else
	 		return false;
	 }

	 me.checkFood = function(){
	 	var food = grid.filter(function(cell){
	 		return cell.isFood;
	 	});
	 	if (food.length===0){
	 		console.log("FEED!");
	 		return true;
	 	}else
	 		return false;
	 }
	 	// Draw grid
	 	for(var x = 0; x <= viewWidth; x+=_squareWidth){
	 		me.ctx.beginPath();
	 		me.ctx.moveTo(x, 0);
	 		me.ctx.lineTo(x, viewHeight);
	 		me.ctx.stroke();
	 	};

	 	for(var y = 0; y <= viewHeight; y+= _squareHeight){
	 		me.ctx.beginPath();
	 		me.ctx.moveTo(0, y);
	 		me.ctx.lineTo(viewWidth, y);
	 		me.ctx.stroke();	
	 	};
	};
	
	return me;
};

var app = new App("game", 1000, 1000);
app.start();

