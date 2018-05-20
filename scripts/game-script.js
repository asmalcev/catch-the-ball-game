const canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

const c = canvas.getContext('2d');

let enemyArray, YourShip, countOfLifes = 5, scores = 0, heartArray, blockArray, text, TimeToBecomeHarderFirst, TimeToBecomeHarderSecond, TimeToBecomeHarderThird, AnimateFrame, isPause = false, isStarted = false, startCount = 0, timer, isPlayerWantToQuit = false, QorP = false;

let mouse = {
	x: undefined,
	y: innerHeight / 2
}

addEventListener('mousemove', event => {
	mouse.y = event.clientY;
})

addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	// alert('Please press F5');

	init();
})

// addEventListener("keydown", event => {
// 	if (event.which == 72) {
// 		countOfLifes = 5;
//   	heartArray.forEach(heart => {heart.color = heartColors[0];});
// 	}
// });

let colors = [
	'#FF3D00',
	'#FFFF00',
	'#4527A0'
];
let heartColors = [
	'#e53935',
	'#212121'
];

function randomIntegerFromRange(a,b) {
	return Math.floor(Math.random() * (b - a + 1) + a);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}


function Enemy(x, y, dx, EnScore, color, radius, delay) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.colorFill = colors[color];
	this.score = EnScore;
	this.radius = radius;
	this.delayTime = delay;

	this.draw = () =>  {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.colorFill;
		c.fill();
		c.closePath();
	};

	this.update = () => {
		this.x -= dx;
		if ((this.x < 66 && this.x > 20) && (this.y > YourShip.y - 33 && this.y < YourShip.y + 33)) {
			this.x = undefined;
			setTimeout( () => {
				this.delay();
			}, this.delayTime);
			scores += this.score;
		}
		else if (this.x < 0) {
			this.x = undefined;
			setTimeout( () => {
				this.delay();
			}, this.delayTime);
			countOfLifes -= 1;
		}

		this.draw();
	};

	this.delay = () => {
		this.y = Math.random() * (innerHeight - 180 * 2) + 180;
		this.x = innerWidth - 20;
	}
}

function Ship(x, y) {
	this.x = x;
	this.y = y;
	this.lastMouse = this.y;

	this.draw = () =>  {
		c.beginPath();
		c.moveTo(this.x, this.y - 80);
		c.lineTo(this.x + 25, this.y - 80);
		c.lineTo(this.x + 30, this.y - 50);
		c.lineTo(this.x + 10, this.y - 50);
		c.lineTo(this.x + 10, this.y + 50);
		c.lineTo(this.x + 30, this.y + 50);
		c.lineTo(this.x + 25, this.y + 80);
		c.lineTo(this.x, this.y + 80);
		c.fillStyle = '#212121';
		c.fill();
		c.closePath();
		c.beginPath();
		c.arc(this.x + 50, this.y, 30 , 0, Math.PI * 2, false);
		c.fillStyle = '#d32f2f';
		c.fill();
		c.closePath();
		c.beginPath();
		c.arc(this.x + 50, this.y, 24 , 0, Math.PI * 2, false);
		c.fillStyle = '#81C784';
		c.fill();
		c.closePath();
	};

	this.update = () => {
		if (mouse.y < 180) {
			mouse.y = 180;
		}
		else if (mouse.y > innerHeight - 180) {
			mouse.y = innerHeight - 180;
		}
		const lastPoint = this.y;
		this.lastMouse += (mouse.y - this.lastMouse) * 0.2;
		this.y = this.lastMouse;

		this.draw();
	};
}

function Heart(x, y, number) {
	this.x = x;
	this.y = y;
	this.color = heartColors[0];

	this.draw = () => {
		c.beginPath();
		c.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
	};

	this.update = () => {
		if (countOfLifes == number) {
			this.color = heartColors[1];
		}

		this.draw();
	};
}

function Block(x1, y1, x2, y2, color) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.color = color;

	this.draw = () => {
		c.beginPath();
		c.fillStyle = this.color;
		c.rect(this.x1, this.y1, this.x2, this.y2);
		c.fill();
	}

	this.update = () => {

		this.draw();
	}
}

function Text(x, y, text) {
	this.x = x;
	this.y = y;
	this.value = text;

	this.draw = () => {
		c.font = '30px Arial'
		c.fillStyle = '#eee'
		c.fillText(this.value, this.x, this.y);
	}

	this.update = valueOfText => {
		this.value = valueOfText;

		this.draw();
	}
}

function HarderFunc () {
	TimeToBecomeHarderFirst = setInterval( () => {
			if (!(isPause)) {
				enemyArray.push(new Enemy(innerWidth - 20, Math.random() * (innerHeight - 180 * 2) + 180, Math.random() * 1, 100, 0, 16, 3000));
			} 
		}, 10000);
		TimeToBecomeHarderSecond = setInterval( () => {
			if (!(isPause)) {
				enemyArray.push(new Enemy(innerWidth - 20, Math.random() * (innerHeight - 180 * 2) + 180, Math.random() * 2 + 1, 500, 1, 10, 5000));
			} 
		}, 20000);
		TimeToBecomeHarderThird = setInterval( () => {
			if (!(isPause)) {
				enemyArray.push(new Enemy(innerWidth - 20, Math.random() * (innerHeight - 180 * 2) + 180, Math.random() * 1 + 3, 1500, 2, 8, 10000));
			} 
		}, 30000);
}

function GeneratorFunc () {
	timer = setInterval( () => {
		if (!(isPause)) {
			enemyArray.push(new Enemy(innerWidth - 20, Math.random() * (innerHeight - 180 * 2) + 180, Math.random() * 1 + 1, 100, 0, 16, 3000));
			startCount++;
			if (startCount == 10) {
				clearInterval(timer);
			}
		}
	}, 3000);
	
}

function theEnd () {
	enemyArray = [];
	countOfLifes = 5;
  heartArray.forEach(heart => {heart.color = heartColors[0];});
  clearInterval(TimeToBecomeHarderFirst);
  clearInterval(TimeToBecomeHarderSecond);
  clearInterval(TimeToBecomeHarderThird);
  scores = 0;
  startCount = 0;

 	GeneratorFunc();
	setTimeout(HarderFunc(), 20000);
}

function isTheEnd() {
	if (isPlayerWantToQuit) {
		AnimateFrame = requestAnimationFrame(animate);
		isPause = false;
		document.querySelector('#question-block').style.display = 'none';
		isPlayerWantToQuit = false;
	}
	else {
		document.querySelector('#question-block').style.display = 'flex';
		cancelAnimationFrame(AnimateFrame);
		isPause = true;
		isPlayerWantToQuit = true;
	}
		
}

function animate() {
	AnimateFrame = requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);

	blockArray.forEach(block => {block.update();});
	YourShip.update();
	text[0].update(`Score: ${scores}`);
	text[1].update('Lifes:');
	enemyArray.forEach(enemy => {enemy.update();});
	heartArray.forEach(heart => {heart.update();});

	if (countOfLifes == 0) {
		theEnd();
	}
}

function init() {
	isStarted = true;
	enemyArray = [];
	heartArray = [];
	text = [];
	blockArray = [];

	blockArray.push( new Block(0, 0, innerWidth, 100, '#424242'));
	blockArray.push( new Block(0, innerHeight - 100, innerWidth, innerHeight, '#424242'));

	text.push( new Text(innerWidth / 2 - 40, 58, `Score: ${scores}`));
	text.push( new Text(110, 58, 'Lifes:'));

	YourShip = new Ship(0, mouse.y);

	let rx = 0;
	for (let i = 0; i < 5; i++, rx += 30) {
		heartArray.push(new Heart(200 + rx, 48, i));
	}

	GeneratorFunc();

	setTimeout(HarderFunc(), 20000);
}

let startButton = document.querySelector('#start');
let resetButton = document.querySelector('#Yes');
let restartButton = document.querySelector('#mbStartButton');
startButton.onclick =  () => {
	let backGr = document.querySelector('.container-flex');
	backGr.style.opacity = 1;
	startButton.onclick = () => {};

	let timeInterval = setInterval( () => {
		backGr.style.opacity -= 0.05;
		if (backGr.style.opacity == 0) {
			clearInterval(timeInterval);
			backGr.style.display = 'none';
		} 
	}, 10);

	init();
	animate();
};

resetButton.onclick = () => {
	document.querySelector('#question-block').style.display = 'none';
	document.querySelector('#repeat-block').style.display = 'flex';
};

restartButton.onclick = () => {
	document.querySelector('#repeat-block').style.display = 'none';
	isPause = false;
	isPlayerWantToQuit = false;
	theEnd();

	AnimateFrame = requestAnimationFrame(animate);
};

addEventListener("keydown", event => {
	if (isStarted) {
		if (!(isPlayerWantToQuit)) {
			if (event.which == 32 && isPause) {
				AnimateFrame = requestAnimationFrame(animate);
				document.querySelector('#pause-block').style.display = 'none';
				isPause = false;
				QorP = false;
			}
			else if (event.which == 32 && !(isPause)) {
				cancelAnimationFrame(AnimateFrame);
				document.querySelector('#pause-block').style.display = 'flex';
				isPause = true;
				QorP = true;
			}
		}
		

		if (event.which == 27) {
			if (!(QorP)) {
				isTheEnd();
			}
		}
	}
});