//Variables for Screen Layout
var grid_canvas;
var grid;
var piece_canvas;
var piece;

//Variables for Difficulty
var mainInterval;
var gameInterval;
var gameStarted = false;
var easy = 70;
var normal = 40;
var hard = 30;
var difficulty = normal;

//Variables for Food
var score = 0;
var food_x;
var food_y;
var food_count;
var food_present = false;

//Variables for Snake Length
var snake_length = 0; //Minus the head and tail

//Variables for Snake Direction
var UP = 1;
var RIGHT = 2;
var DOWN = 3;
var LEFT = 4;
var direction = DOWN;

//Variables for Snake Coordinates
var WIDTH =  300;
var HEIGHT = 500;
var prev_x = new Array();
var prev_y = new Array();
var head_x = 0;
var head_y = 50;
var tail_x = 0;
var tail_y = 40;
var blank_x = 0;
var blank_y = 0;
var deltax = 0;
var deltay = 0;
var dx = 10;
var dy = 10;
window.onload = init;
//Variables for External Image Files
var snake_body = new Image();
snake_body.src = "images/snakebody.png";
var snake_food = new Image();
snake_food.src = "images/snakefood.png";
var game_over_img = new Image();
game_over_img.src = "images/game_over.png";

//Initialize the Game
function init(){
	grid_canvas = document.getElementById("background_grid");
	grid = grid_canvas.getContext("2d");
	piece_canvas = document.getElementById("movable_area");
	piece = piece_canvas.getContext("2d");
	draw_rectangle(head_x, head_y);
	draw_rectangle(tail_x, tail_y);
	mainInterval = setInterval(start_game, 50);
}

//Draw the Background Grid (Not Used Anymore)
function draw_grid(){
	for(i = 0; i < WIDTH; i = i + dx){
		grid.moveTo(i, 0);
		grid.lineTo(i, HEIGHT);
		grid.strokeStyle = "#000000";
		grid.stroke();
	}
	for(i = 0; i < HEIGHT; i = i + dy){
		grid.moveTo(0, i);
		grid.lineTo(WIDTH, i);
		grid.strokeStyle = "#000000";
		grid.stroke();
	}
}

//Start the Game (Choose Difficulty)
function start_game(){
	if(gameStarted){
		clearInterval(mainInterval);
		mainInterval = setInterval(play_game, difficulty);
	}
}

//Play the Game (Make the Snake start moving)
function play_game(){
	if(!food_present){
		generate_food();
	}
	draw_piece();
}

//Reset Game (Change all necessary values to inital state)
function reset_game(){
	piece.clearRect(0, 0, WIDTH, HEIGHT);
	direction = DOWN;
	gameStarted = false;
	food_present = false;
	prev_x = new Array();
	prev_y = new Array();
	head_x = 0;
	head_y = 50;
	tail_x = 0;
	tail_y = 40;
	blank_x = 0;
	blank_y = 0;
	snake_length = 0;
	score = 0;
	document.getElementById("score").innerHTML = score;
	clearInterval(mainInterval);
	init();
}

//Show Game Over to the Player
function game_over(){
	document.getElementById("game_over_clip").play();
	clearInterval(mainInterval);
	//piece.clearRect(0,0, WIDTH, HEIGHT);
	piece.drawImage(game_over_img, 5, HEIGHT/2 - 20);
	piece.restore();
}

//Update the Score after Player grabs the food
function update_score(){
	score += 10;
	document.getElementById("score").innerHTML = score;
}

//Set Speed to "Easy" Speed
function set_easy(){
	if(!gameStarted){
		difficulty = easy;
		gameStarted = true;
		clearInterval(mainInterval);
		mainInterval = setInterval(start_game, 50);
	}
}

//Set Speed to "Normal" Speed
function set_normal(){
	if(!gameStarted){
		difficulty = normal;
		gameStarted = true;
		clearInterval(mainInterval);
		mainInterval = setInterval(start_game, 50);
	}
}

//Set Speed to "Hard" Speed
function set_hard(){
	if(!gameStarted){
		difficulty = hard;
		gameStarted = true;
		clearInterval(mainInterval);
		mainInterval = setInterval(start_game, 50);
	}
}

//Randomly generate Coordinates for the location of the food draw it on the Scrren
function generate_food(){
	food_present = true;
	food_count++;
	do{
		food_x  = (Math.floor(Math.random()*10)) * dx;
		food_y  = (Math.floor(Math.random()*20)) * dy;
	}while(check_food_collision());
	draw_food(food_x, food_y);
}

//Check to see if the Food is not drawn in the Body of the Snake
function check_food_collision(){
	
	if (head_x == food_x && head_y == food_y){
		return true;
	}
	for(i = 0; i < snake_length; i++){
		if (prev_x[i] == food_x && prev_y[i] == food_y){
		return true;
		}
	}
	if (tail_x == food_x && tail_y == food_y){
		return true;
	}else{
		return false;
	}
	
}

//Check to see if the Player ate the Food, if so then tell program to generate another
//Check to see if the Player ate itself, if so then tell program to go to GAME OVER
function check_food_present(){
	if (head_x == food_x && head_y == food_y){
		food_present = false;
		document.getElementById("snake_eat").play();
		update_score();
		addBody();
	}
	for(i = 0; i < snake_length; i++){
		if (prev_x[i] == head_x && prev_y[i] == head_y){
		game_over();
		}
	}
}

//Draw the Snake Coordinate by Coordinate
function draw_piece(){
	check_food_present();
	draw_rectangle(head_x, head_y);
	for(i = 0; i < snake_length; i++){
		draw_rectangle(prev_x[i], prev_y[i]);
	}
	draw_rectangle(tail_x, tail_y);
	piece.clearRect(blank_x, blank_y, dx, dy);
	blank_x = tail_x;
	blank_y = tail_y;
	if(snake_length == 0){
		tail_x = head_x;
		tail_y = head_y;
	}else{
		tail_x = prev_x[snake_length - 1];
		tail_y = prev_y[snake_length - 1];
	}
	for(i = snake_length - 1; i > 0; i--){
		prev_x[i] = prev_x[i-1];
		prev_y[i] = prev_y[i-1];
	}
	if(snake_length != 0){
		prev_x[0] = head_x;
		prev_y[0] = head_y;
	}
	switch(direction){
	case UP:
		if(head_y - dy < 0){
			game_over();
		}else{
			head_y -= dy;
		}
		break;
	case RIGHT:
		if(head_x + dx > WIDTH){
			game_over();
		}else{
			head_x += dx;
		}
		break;
	case DOWN:
		if(head_y + dy > HEIGHT){
			game_over();
		}else{
			head_y += dy;
		}
		break;
	case LEFT:
		if(head_x - dx < 0){
			game_over();
		}else{
			head_x -= dx;
		}
		break;
	default:
		break;
	}
	//window.setTimeout("HELLO", 100);
}

//Drawing Head Function (Use for custom images)
function draw_head(x, y){
	piece.drawImage(head_img, x, y);
	piece.restore
}

//Function to draw rectangles in the designated Coordinates
function draw_rectangle(x, y){
	piece.drawImage(snake_body, x, y);
	//piece.fillStyle = "#00bff3";
	//piece.fillRect(x,y,dx,dy); 
	piece.restore();
}

//Function to draw the food in the designated Coordinates
function draw_food(x, y){
	piece.drawImage(snake_food, x, y);
	//piece.fillStyle = "rgb(0,255,255)";
	//piece.fillRect(x,y,dx,dy); 
	piece.restore();
}

//Use to add length to the end of the Snake
function addBody(){
	piece.clearRect(blank_x, blank_y, dx, dy);
	x = prev_x[snake_length - 1] - tail_x;
	y = prev_y[snake_length - 1] - tail_y;
	snake_length++;
	prev_x[snake_length - 1] = tail_x;
	prev_y[snake_length - 1] = tail_y;
	if (x == 0 || snake_length - 1 == 0){
		deltax = 0;
	}else if(x > 0){
		deltax = - 10;
	}else{
		deltax = 10;
	}
	if (y == 0 || snake_length - 1 == 0){
		deltay = 0;
	}else if(y > 0){
		deltay = - 10;
	}else{
		deltaxy= 10;
	}
	tail_x = tail_x + deltax;
	tail_y = tail_y + deltay;
	blank_x = tail_x  + deltax;
	blank_y = tail_y + deltay;
}

//Handler for KeyPress Events
function keyPressed(evt){
	switch(evt.keyCode){
		case 38: //ARROW UP
		{
		direction = UP; 
		break;
		}
		case 40://ARROW DOWN
		{
		direction = DOWN; 
		break;
		}
		case 37://ARROW LEFT
		{
		direction = LEFT;
		break;
		}
		case 39: //ARROW RIGHT
		{
		direction = RIGHT;
		break;
		}
		case 32: //SPACEBAR
		{
		addBody();
		break;
		}
		
	}
}
window.addEventListener("keydown", keyPressed, true);