        //references so functions from this file work, also menu display
        window.onload = () => {
            document.getElementById("menu").style.display = 'block';
            window.GameTransition = GameTransition;
            window.LevelSelect = LevelSelect;
            window.Highscores = Highscores;
            window.Rules = Rules;
            window.ChangeLevel = ChangeLevel;
            window.BackToMenu = BackToMenu;
        }

        import Assets from './assetmapping.js';
        import Enemy from './EnemyClass.js';

        let getdirs = Assets();
        
		var sounddir = getdirs[1];
		var spritedir = getdirs[2];
		
		var btnclick = new Audio(sounddir+'/btn_click.mp3'); //I reuse it a lot
		
		var currentdir = 'up';
		var cycle = -1;
		var board_info_array = [];
		var snake_body = [];
		var score = 0;
		var speed = 200;
		var frame = true;
		var apple_counter = 0;
		
		//countdown until next enemy spawns
		var enemy_countdown = 0;
		
		var start = false;
		
		var cur_x = 10;
		var cur_y = 10;
		
		var level = 1;
		var opponentList = []; //need to cycle at the end of each turn. Expected behaviour: poisonous apples get deleted after a few turns, some other enemies do something else?
		//opponents are objects. They have coordinates, lifespan and maybe something else.
		//const opponent = {'x': 'x', 'y': 'y', 'lifespan': n}
		
		const blocksize = 50; //i dont really use it but whatever.

		class Level {
			constructor(floor, walls,)
			{

			}

		}

		function ChangeLevel(idstr)
		{
		 btnclick.play();
		 level = parseInt(idstr[idstr.length-1]);
		 createCustomAlert('Level selected', 'Selected level: '+level, 'OK', false);
		 return;
		}
		
		function BackToMenu(context, transformation) //context = name of element, transformation, its transform
		{
		 btnclick.play();
		 document.getElementById('main_menu_btns').style.transform = 'translateX(0%)';
		 document.getElementById(context).style.transform = transformation;//'translate(400%, -50%)';
		 //transition of menu buttons back on screen
		 return;
		}
		
		function LevelSelect()
		{
		 btnclick.play();
		 document.getElementById('main_menu_btns').style.transform = 'translateX(-400%)';
		 document.getElementById('level_select_btns').style.transform = 'translate(0%, -50%)';
		 return;
		}
		
		function Highscores()
		{
		 btnclick.play();
		 let scores = document.cookie;
		 console.log(scores);
		 if (scores == '')
		  createCustomAlert('Error', 'It seems you have no scores higher than 0, or nothing was saved.', 'Close', false);
		 else
		 {
		  let score_table = {};
		  try {
		   score_table = JSON.parse(scores);
		  }
		  catch (error) {
				console.log(error);
				console.log('text of scores: '+scores);
				console.log('clearing score cookies. Next time scores should work.');
				document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
				createCustomAlert('Error', 'It seems you have no scores higher than 0, or nothing was saved.', 'Close', false);
				return
			}

		   document.getElementById('main_menu_btns').style.transform = 'translateX(-400%)';
		   document.getElementById('score_table').style.transform = 'translateY(-200%)';
		   //"top: 50%; text-align: center; color: #000; -webkit-text-fill-color: #CDC; -webkit-text-stroke: 2px; font-size: 200px; user-select: none;"
		   let super_header = document.getElementById('score_table').appendChild(document.createElement('h1'));
		   super_header.className = 'scoreText';
		   super_header.style.left = '40%';
		   super_header.style['margin-left'] = -10*('Your highscores: '.length)/2+'px';
		   super_header.style.top = '-250%';
		   super_header.style['font-size'] = '100px';
		   super_header.innerHTML = 'Your highscores: ';
		   let counter = 0;
		   for (const key in score_table) {
			let sub_table = document.createElement('div');
			sub_table.id = key;
			let header = sub_table.appendChild(document.createElement('h2'));
			header.innerHTML = key+':';
			header.className = 'scoreText';
			header.style.left = '40%';
			header.style['margin-left'] = -10*('Level  :'.length)/2+'px';
			header.style.top = '-150%';
			header.style.left = 15+counter*30+'%';
			//header.style.top = -250+counter*50+'%';
			header.style['font-size'] = '60px';
			let sorted_scores = score_table[key];
			sorted_scores.sort(function (a,b) {return parseInt(a) < parseInt(b) ? 1 : -1;});
			sorted_scores = sorted_scores.slice(0, Math.min(8, sorted_scores.length));
			for (let score_unit = 0; score_unit < sorted_scores.length; score_unit++) {
				let scoreinfo = sub_table.appendChild(document.createElement('p'));
				scoreinfo.className = 'scoreText';
				scoreinfo.innerHTML = sorted_scores[score_unit];
				scoreinfo.style.top = -100+score_unit*30+'%';
				scoreinfo.style.left = 15+counter*30+'%';
				scoreinfo.style['font-size'] = '50px';
			}
			document.getElementById('score_table').appendChild(sub_table);
			counter += 1;
		}

			let backbtn = document.createElement('button');
			backbtn.className='btn';
			backbtn.id='backscoretable';
			backbtn.innerHTML='Back';
			//backbtn.style.position = 'absolute';
			backbtn.style.left = '15%';
			backbtn.style.top = '300px';
			document.getElementById('score_table').appendChild(backbtn);
			backbtn.onclick = function() {
				BackToMenu('score_table', 'translateY(800%)'); 
				setTimeout(function(){for (const key in score_table) document.getElementById(key).remove(); 
					document.getElementById('backscoretable').remove(); 
					super_header.remove();
				}, 1500);};
		 }
		}
		
		function Rules()
		{
		 btnclick.play();
		 createCustomAlert('Info', 'You are snek. You control your movement with WASD or arrow keys. Your primary goal is to eat apples. Your other primary goal is to not eat anything else and not to hit your head against a wall.', 'Close', false);
		}
		
		function InitMenu(e)
		{
		 document.getElementById('intro').style.transition = 'transform 3.0s ease';
		 document.getElementById('intro').style.transform = 'translateY(400%)';
		 document.getElementById('main_menu_btns').style.transition = 'transform 3.0s ease';
		 document.getElementById('main_menu_btns').style.transform = 'translateX(0%)';
		 document.getElementById('level_select_btns').style.transform = 'translate(400%, -50%)';
		 document.getElementById('score_table').style.transform = 'translateY(400%)';
		 document.getElementById('score_table').style.transition = 'transform 3.0s ease';
		 
		 document.removeEventListener('keydown', InitMenu);
		 document.removeEventListener('click', InitMenu);

		 setTimeout(function() {document.getElementById('intro').style.display = 'none';}, 1500);
		}
		
		function GameTransition()
		{
		 if (start)
			return;
		 //start = true;	
		 //document.getElementById('board').style.transition = 'transform 2.0s ease';
		 document.getElementById("board").style.transform = 'translate(1000px, 1000px)';
		 document.getElementById('main_menu_btns').style.transform = 'translateX(-400%)';
		 btnclick.play();
		 setTimeout(function(){InitBoard(level);}, 2000);
		}
		
		function InitBoard(levelid)
		{
	     let levelprop = new Level();	
		 let board_info_array = [];

		 enemy_countdown = 0;
		 
		 
	     //background board elements
		 var board_bg = document.createElement("canvas");
		 board_bg.id = 'board_bg';
		 board_bg.width = 1200;
		 board_bg.height = 800;
		 board_bg.style.top = 0+'px';
		 board_bg.style.left = 0+'px';
		 board_bg.style.position='absolute';
		 board_bg.style['z-index'] = 3;
		 document.getElementById("board").appendChild(board_bg);
		 
		 //foreground board elements (walls, doors(?), etc)
		 var board_fg = document.createElement("canvas");
		 board_fg.id = 'board_fg';
		 board_fg.width = 1200;
		 board_fg.height = 800;
		 board_fg.style.top = 0+'px';
		 board_fg.style.left = 0+'px';
		 board_fg.style.position='absolute';
		 board_fg.style['z-index'] = 6;
		 document.getElementById("board").appendChild(board_fg);
		 
		 const floor = new Image();
		 floor.src = spritedir+'/floor'+levelid+'.png';
		 floor.onload = function(e)
		 {
		  const context = document.getElementById('board_bg').getContext('2d');
		  const ptrn = context.createPattern(this, 'repeat');
		  context.fillStyle = ptrn;
		  context.fillRect(0, 0, document.getElementById('board_bg').width, document.getElementById('board_bg').height);
		 }
		 
		 //draw walls
		 const walls = new Image();
		 walls.src = spritedir+'/wall'+levelid+'.png';
		 walls.onload = function(e)
		 {
		  const context = document.getElementById('board_fg').getContext('2d');
		  const ptrn = context.createPattern(this, 'repeat');
		  context.fillStyle = ptrn;
		  context.shadowColor = "black";
		  context.shadowBlur = 10;
		  context.shadowOffsetX = 0;
		  context.shadowOffsetY = 0;	
		  context.fillRect(0, 0, blocksize, document.getElementById('board_bg').height);
		  context.fillRect(0, 0, document.getElementById('board_bg').width, blocksize);
		  context.fillRect(document.getElementById('board_bg').width-blocksize, 0, document.getElementById('board_bg').width, document.getElementById('board_bg').height);
		  context.fillRect(0, document.getElementById('board_bg').height-blocksize, document.getElementById('board_bg').width, document.getElementById('board_bg').height);
		 }
		 
		 var element = document.createElement("canvas");
		 element.id = 'snake_canvas';
		 element.width = 1200;
		 element.height = 800;
		 element.style.top = 0+'px';
		 element.style.left = 0+'px';
		 element.style.position='absolute';
		 element.style['z-index'] = 4;
		 document.getElementById("board").appendChild(element);
		
		 const snake = new Image();
		 const enemies = new Image();
		 snake.src = spritedir+'/snakesprite.png';//'https://i.ibb.co/TwnNwXx/hmhm.png';

		 const loadImage = src =>
			new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = reject;
				img.src = src;
			});

		 const load_list = [spritedir+'/snakesprite.png',
		 			  spritedir+'/enemy'+levelid+'.png'];
		
		 Promise.all(load_list.map(loadImage)).then(imgs => {
		  console.log('why');
		  const ctx = document.getElementById('snake_canvas').getContext('2d');
		  //ctx.scale(50,50);
		  ctx.imageSmoothingEnabled = true;
		  ctx.imageSmoothingQuality = 'high';
		  //ctx.drawImage(this, 0, 0);
		  const directions = ['up', 'down', 'left', 'right'];
		  currentdir = directions[Math.floor(Math.random()*4)];
		  //cur_x = Math.floor(Math.random()*(18-6)+6);
		  //cur_y = Math.floor(Math.random()*(10-6)+6);//from 300, 300 to 600x500
		  for (let i = 0; i<16; i++)
			{
				var temp = []; 
				for (let j = 0; j<24; j++) temp.push(0); 
				board_info_array.push(temp);
			}
		 //i really need to change the way levels are filled.
		  if (level == 1) {
		  const ctx = document.getElementById('board_fg').getContext('2d');
		  const ptrn = ctx.createPattern(walls, 'repeat');
		  ctx.fillStyle = ptrn;
		  ctx.shadowColor = "black";
		  ctx.shadowBlur = 10;
		  ctx.shadowOffsetX = 0;
		  ctx.shadowOffsetY = 0;
		  ctx.fillRect(650, 100, 9*blocksize, blocksize);
		  ctx.fillRect(100, 650, 9*blocksize, blocksize);
		  
			 /*for (let i = 0; i < 2; i++)
			 {
				 var element = document.createElement("div");
				 element.id = 'outline'+(i+5);
				 element.className = "outline";
				 if (i == 0){
				 element.style.left = 100+'px';
				 element.style.top = 650+'px';}
				 else {
				 element.style.left = 650+'px';
				 element.style.top = 100+'px';}
				 element.style.width = 50*9+'px';
				 element.style['box-shadow'] = '5px 0px 5px black, -5px 0px 5px black, 0px 5px 5px black, 0px -5px 5px black';
				 element.style.height = 50+'px';
				 document.getElementById("board").appendChild(element);
			 }*/
          for (let i = 0; i < 9; i++)
			{
				board_info_array[13][2+i] = 3; 
				board_info_array[2][13+i] = 3;
			} //3 is wall
		 }
		  else if (level == 2) {
		  const ctx = document.getElementById('board_fg').getContext('2d');
		  const ptrn = ctx.createPattern(walls, 'repeat');
		  ctx.fillStyle = ptrn;	 
		  ctx.shadowColor = "black";
		  ctx.shadowBlur = 10;
		  ctx.shadowOffsetX = 0;
		  ctx.shadowOffsetY = 0;		 
	      ctx.fillRect(50*3, 50*3, 100, 100);
		  ctx.fillRect(50*19, 50*11, 100, 100);	
		  ctx.fillRect(50*3, 50*11, 100, 100);
		  ctx.fillRect(50*19, 50*3, 100, 100);	
		  ctx.fillRect(50*11, 50*7, 100, 100);
		  
		  for (let i =0; i<2; i++) 
		   for (let j = 0; j<2; j++) {
			board_info_array[3+i][3+j] = 3;
			board_info_array[3+i][19+j] = 3;
			board_info_array[11+i][3+j] = 3;
			board_info_array[11+i][19+j] = 3;
			board_info_array[7+i][11+j] = 3;
		  }

		 }
		 else if (level == 3) {
		  const ctx = document.getElementById('board_fg').getContext('2d');
		  const ptrn = ctx.createPattern(walls, 'repeat');
		  ctx.fillStyle = ptrn;	 
		  ctx.shadowColor = "black";
		  ctx.shadowBlur = 10;
		  ctx.shadowOffsetX = 0;
		  ctx.shadowOffsetY = 0;
		  
		  for (let j = 2; j <= 4; j+=2)
			for (let i = 2; i <= 10; i+=2)
			{
			 board_info_array[j][i] = 3;
			 board_info_array[board_info_array.length-1-j][board_info_array[0].length-1-i] = 3;
			 ctx.fillRect(50*i, 50*j, 50, 50);
			 ctx.fillRect(50*(board_info_array[0].length-1-i), 50*(board_info_array.length-1-j), 50, 50);
			}

		  for (let j = 6; j <= 10; j+=2)
		  for (let i = 2; i <= 4; i+=2)
			{
			 board_info_array[j][i] = 3;
			 board_info_array[board_info_array.length-1-j][board_info_array[0].length-1-i] = 3;
			 ctx.fillRect(50*i, 50*j, 50, 50);
			 ctx.fillRect(50*(board_info_array[0].length-1-i), 50*(board_info_array.length-1-j), 50, 50);
			}



		 }
		 
		 do {
		 	cur_x = Math.floor(Math.random()*(18-6)+6);
		 	cur_y = Math.floor(Math.random()*(10-6)+6);
		 } while (board_info_array[cur_y][cur_x] != 0 || board_info_array[cur_y-1][cur_x] != 0 || board_info_array[cur_y+1][cur_x] != 0 || board_info_array[cur_y][cur_x+1] != 0 || board_info_array[cur_y][cur_x-1] != 0 );

		 document.getElementById("board").style.display = "block";
		 //specific to 1st level
		  
		  PlaceSnek(ctx, imgs[0], currentdir, cur_x, cur_y, board_info_array);
		  console.log(board_info_array);
		  
		  document.addEventListener("keydown", function(event) {
		  
		  start = true;
		  console.log(start);
		  
		  var temp_dir = currentdir;
		  const left = new Set([65, 97, 37]);
		  const up = new Set([87, 119, 38]);
		  const right = new Set([68, 100, 39]);
		  const down = new Set([83, 115, 40]);	  
		  if (left.has(event.keyCode) && currentdir != 'right' && frame) currentdir = 'left';
		  else if (up.has(event.keyCode) && currentdir != 'down' && frame) currentdir = 'up';
		  else if (right.has(event.keyCode) && currentdir != 'left' && frame) currentdir = 'right';
		  else if (down.has(event.keyCode) && currentdir != 'up' && frame) currentdir = 'down';
		  
		  if ((left.has(event.keyCode) || up.has(event.keyCode) || right.has(event.keyCode) || down.has(event.keyCode)) && frame && temp_dir != currentdir)
			 frame = false;
		  });

		  let start_game = new Promise( function (resolve, reject) {document.addEventListener("keydown", () => {resolve();});} );
		  start_game.then(() => {console.log(start); cycle = setInterval(SnekMoves, speed, cur_x, cur_y, ctx, imgs, board_info_array, [], levelid);});
		  }
		 );
		}
		//board_info_array = [16][24]
		//0th row/column and 16th/20th row/column are no-no
		function PlaceSnek(ctx, img, dir, x, y, snakearr)
		{
		 console.log(y); console.log(x);
		 snakearr[y][x] = 1; //1 is snek
		 if (dir == 'up') //moving up means tail is down. etc
			{var tail_x = x; var tail_y = y+1; var head_sprite_x = 150; var head_sprite_y = 0; var tail_sprite_x = 150; var tail_sprite_y = 100;}
		 if (dir == 'down') 
			{var tail_x = x; var tail_y = y-1; var head_sprite_x = 200; var head_sprite_y = 50; var tail_sprite_x = 200; var tail_sprite_y = 150;}
		 if (dir == 'left') 
			{var tail_x = x+1; var tail_y = y; var head_sprite_x = 150; var head_sprite_y = 50; var tail_sprite_x = 150; var tail_sprite_y = 150;}
		 if (dir == 'right') 
			{var tail_x = x-1; var tail_y = y; var head_sprite_x = 200; var head_sprite_y = 0; var tail_sprite_x = 200; var tail_sprite_y = 100;}
		 snakearr[tail_y][tail_x] = 1;
		 do
		 {
		 var apple_x = Math.floor(Math.random()*(23-1)+1);
		 var apple_y = Math.floor(Math.random()*(15-1)+1);
		 } while (snakearr[apple_y][apple_x] != 0);
		 snakearr[apple_y][apple_x] = 2;
		 ctx.drawImage(img, head_sprite_x, head_sprite_y, 50, 50, 50*x, 50*y, 50, 50);
		 ctx.drawImage(img, tail_sprite_x, tail_sprite_y, 50, 50, tail_x*50, tail_y*50, 50, 50);
		 ctx.drawImage(img, 0, 150, 50, 50, apple_x*50, apple_y*50, 50, 50);
		 
		 snake_body = [[x,y],[tail_x,tail_y]]; //contains 2 pieces of snek body
		}
		
		function SnekMoves(x, y, ctx, imgs, board_info_array, opp_list,levelid)
		{
		 //console.log(cycle);
		 //console.log(board_info_array);
		 //console.log(snake_body);
		 if (currentdir == 'up')
			{var new_x = cur_x;
			var new_y = cur_y-1;
			var head_sprite_x = 150;
			var head_sprite_y = 0;}
		 else if (currentdir == 'down')
			{var new_x = cur_x;
			var new_y = cur_y+1;
			var head_sprite_x = 200;
			var head_sprite_y = 50;}
		 else if (currentdir == 'left')
			{var new_x = cur_x-1;
			var new_y = cur_y;
			var head_sprite_x = 150;
			var head_sprite_y = 50;}
		 else if (currentdir == 'right')
			{var new_x = cur_x+1;
			var new_y = cur_y;
			var head_sprite_x = 200;
			var head_sprite_y = 0;}
		 
		 console.log(new_x, new_y);
		 apple_counter += 1;
		 if (level == 1) enemy_countdown += 2;
		 if (level > 1) enemy_countdown += 1;

		 ctx.clearRect(new_x*50, new_y*50, 50, 50);

		 //enemy move
		 for (let i = opp_list.length-1; i >= 0; i--)
		 {
		  opp_list[i].lifespan -= 1;
		  console.log(opp_list[i]);
		  if (opp_list[i].lifespan == 0)
			{
			 ctx.clearRect(opp_list[i].x*50, opp_list[i].y*50, 50, 50);
			 board_info_array[opp_list[i].y][opp_list[i].x] = 0;
			 opp_list.splice(i,1);
			}
		  else
		    {
             let behave = opp_list[i].behaviourPattern(ctx, imgs[1], board_info_array, new_x, new_y); //used for redrawing
             if (behave == 37) //pig eats apple
                apple_counter = 40;
		    }
		 }
		 
		 if (board_info_array[new_y][new_x] == 2) //eaten apple
		    {
			 score += 1;
			 apple_counter = 0;
			 let eat = new Audio(sounddir+'/eat.wav');
			 eat.volume = 0.6;
			 eat.play();
			 document.getElementById('scor').innerHTML = ''+score;
			do
			 {
			 var apple_x = Math.floor(Math.random()*(23-1)+1);
			 var apple_y = Math.floor(Math.random()*(15-1)+1);
			 } while (board_info_array[apple_y][apple_x] != 0 || apple_x == new_x && apple_y == new_y);
			 
			 if (levelid == 3)
				for (const enemy of opp_list) {
					if (enemy.cur_phase == 'chase_apple')
						enemy.enrage();
				}
			 
			 ctx.drawImage(imgs[0], 0, 150, 50, 50, apple_x*50, apple_y*50, 50, 50);
			 board_info_array[apple_y][apple_x] = 2;
			 clearInterval(cycle);
			 speed -= 2;
			 cycle = setInterval(SnekMoves, Math.max(speed,100), new_x, new_y, ctx, imgs, board_info_array, opp_list,levelid);
			}		 
		 else
			{
			 ctx.clearRect(snake_body[snake_body.length-1][0]*50, snake_body[snake_body.length-1][1]*50, 50, 50); 
			 board_info_array[snake_body[snake_body.length-1][1]][snake_body[snake_body.length-1][0]] = 0; 
			 snake_body.splice(snake_body.length-1, 1);
			 
			  ctx.clearRect(snake_body[snake_body.length-1][0]*50, snake_body[snake_body.length-1][1]*50, 50, 50); //redraw tail 
			  if (snake_body.length == 1)
			   {var compare_x = new_x; var compare_y = new_y;} //compare with new vars since its not in array yet
			  else
			   {var compare_x = snake_body[snake_body.length-2][0]; var compare_y = snake_body[snake_body.length-2][1];}
			   
			  if (snake_body[snake_body.length-1][0] < compare_x)
				 {var tail_sprite_x = 200; var tail_sprite_y = 100;}
			  else if (snake_body[snake_body.length-1][0] > compare_x)
				 {var tail_sprite_x = 150; var tail_sprite_y = 150;}
			  else if (snake_body[snake_body.length-1][1] < compare_y)
				{var tail_sprite_x = 200; var tail_sprite_y = 150;}
			  else
				{var tail_sprite_x = 150; var tail_sprite_y = 100;}
			  ctx.drawImage(imgs[0], tail_sprite_x, tail_sprite_y, 50, 50, 50*snake_body[snake_body.length-1][0], 50*snake_body[snake_body.length-1][1], 50, 50);
			 }
			 
		 if (enemy_countdown > Math.max(Math.floor(speed/5),10))
		 {
		  enemy_countdown = 0;
		  let life = 0;
		  if (levelid == 1 || levelid == 2)
		     life = 50;
		  if (levelid == 3)
		     life = 60;
		  let enemy = new Enemy(0,0,life,levelid);
		  enemy.randomGen(board_info_array, new_x, new_y);
		  let drawSprite = enemy.getSprite(new_x, new_y, enemy.x, enemy.y); //getSprite should return coords of required pic
		  ctx.drawImage(imgs[1], drawSprite[0], drawSprite[1], 50, 50, enemy.x*50, enemy.y*50, 50, 50);
		  board_info_array[enemy.y][enemy.x] = 3; //maybe add separate value. for now its basically obstacle
		  opp_list.push(enemy);
		 }
		 
		 if (apple_counter > 40)
		 {
		  let appleo_x = -1;
		  let appleo_y = -1;
		  for (let i = 0; i < board_info_array.length; i++)
		    for (let j = 0; j < board_info_array[i].length; j++)
			   if (board_info_array[i][j] == 2)
			   {
			    appleo_x = j;
				appleo_y = i;
			   }
		  if (appleo_x != -1)
		  	ctx.clearRect(appleo_x*50, appleo_y*50, 50, 50);
		  do
			 {
			 var apple_x = Math.floor(Math.random()*(23-1)+1);
			 var apple_y = Math.floor(Math.random()*(15-1)+1);
			 } while (board_info_array[apple_y][apple_x] != 0 || apple_x == new_x && apple_y == new_y);
		  ctx.drawImage(imgs[0], 0, 150, 50, 50, apple_x*50, apple_y*50, 50, 50);
		  board_info_array[apple_y][apple_x] = 2;
		  if (appleo_x != -1)
		  	board_info_array[appleo_y][appleo_x] = 0;
		  apple_counter = 0;
		 }	 
			
		 snake_body.splice(0,0, [new_x, new_y]);
		 //ctx.clearRect(new_x*50, new_y*50, 50, 50);
		 ctx.drawImage(imgs[0], head_sprite_x, head_sprite_y, 50, 50, 50*new_x, 50*new_y, 50, 50);
		 
		 if (snake_body.length > 2) //dont redraw for 2 since tail should be already redrawn
		 {
		  var u_x = snake_body[0][0]; var u_y = snake_body[0][1];
		  var c_x = snake_body[1][0]; var c_y = snake_body[1][1];
		  var n_x = snake_body[2][0]; var n_y = snake_body[2][1];
		  
		  ctx.clearRect(c_x*50, c_y*50, 50, 50);
		  
		  var body_sprite_x = 0; var body_sprite_y = 0;
		  
		  if (c_x < u_x)
		  {
		   if (c_x > n_x)
		   {
		    body_sprite_x = 50; body_sprite_y = 0;
		   }
		   else if (c_y < n_y)
		   {
		    body_sprite_x = 0; body_sprite_y = 0;
		   }
		   else
		   {
		    body_sprite_x = 0; body_sprite_y = 50;
		   }
		  }
		  else if (c_x > u_x)
		  {
		   if (c_x < n_x)
		   {
		    body_sprite_x = 50; body_sprite_y = 0;
		   }
		   else if (c_y < n_y)
		   {
		    body_sprite_x = 100; body_sprite_y = 0;
		   }
		   else
		   {
		    body_sprite_x = 100; body_sprite_y = 100;
		   }
		  }
		  else if (c_y < u_y)
		  {
		   if (c_x > n_x)
		   {
		    body_sprite_x = 100; body_sprite_y = 0;
		   }
		   else if (c_x < n_x)
		   {
		    body_sprite_x = 0; body_sprite_y = 0;
		   }
		   else
		   {
		    body_sprite_x = 100; body_sprite_y = 50;
		   }
		  }
		  else //c_y > u_y
		  {
		   if (c_x > n_x)
		   {
		    body_sprite_x = 100; body_sprite_y = 100;
		   }
		   else if (c_x < n_x)
		   {
		    body_sprite_x = 0; body_sprite_y = 50;
		   }
		   else
		   {
		    body_sprite_x = 100; body_sprite_y = 50;
		   }
		  }
		  
		  ctx.drawImage(imgs[0], body_sprite_x, body_sprite_y, 50, 50, 50*c_x, 50*c_y, 50, 50);
		 }

		 /*//here do end-of turn stuff like moving enemies or deleting them.
		 for (let i = opp_list.length-1; i >= 0; i--)
		 {
		  opp_list[i].lifespan -= 1;
		  console.log(opp_list[i]);
		  if (opp_list[i].lifespan == 0)
			{
			 ctx.clearRect(opp_list[i].x*50, opp_list[i].y*50, 50, 50);
			 board_info_array[opp_list[i].y][opp_list[i].x] = 0;
			 opp_list.splice(i,1);
			}
		  else
		    {
             opp_list[i].behaviourPattern(ctx, imgs[1], board_info_array, new_x, new_y); //used for redrawing
		    }
		 }*/
		 
		 //fail
		 if (new_x == 0 || new_x == board_info_array[0].length-1 || new_y == 0 || new_y == board_info_array.length-1 || (board_info_array[new_y][new_x] != 0 && board_info_array[new_y][new_x] != 2))
		   {let fail = new Audio(sounddir+'/fail.wav');
		    if (score > 0)
			{
				let previous = document.cookie;
				console.log(previous);
				let score_table = {};
				if (previous != '')
				{
				 try {
			     score_table = JSON.parse(previous);
				 }
				 catch (error) {
					console.log(error);
					console.log('using empty object.')
					document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
				 }
				}
				if ("level "+levelid in score_table)
                 score_table["level "+levelid].push(score);
				else
				  score_table["level "+levelid] = [score];
				//if (previous != '')
				//	previous = previous.substring('score='.length, previous.length)+'|';
				document.cookie = JSON.stringify(score_table)+';expires=Tue, 19 Jan 2038 03:14:07 GMT';
				var dedtext = 'You tried so hard and got so far, but in the end your final score is: ' + score;
			}
			else
				var dedtext = 'Clearly, you were not even trying! Your score is 0! Disgusting.';
			createCustomAlert('You died!', dedtext, 'Main menu', true);
			fail.volume = '0.5';
			fail.play();
			ctx.fillStyle = 'rgb(255, 0, 0, 0.5)';
			ctx.fillRect(new_x*50, new_y*50, 50, 50);
			clearInterval(cycle);
			}
		 else if (board_info_array[new_y][new_x] != 2)
		 {
		  let move = new Audio(sounddir+'/move.wav');
		  move.volume = 0.2;
		  move.play();
		 }
			
		 board_info_array[new_y][new_x] = 1;
		 cur_x = new_x;
		 cur_y = new_y;
		 frame = true;
		 
		 /*//here do end-of turn stuff like moving enemies or deleting them.
		 for (let i = opp_list.length-1; i >= 0; i--)
		 {
		  opp_list[i].lifespan -= 1;
		  console.log(opp_list[i]);
		  if (opp_list[i].lifespan == 0)
			{
			 ctx.clearRect(opp_list[i].x*50, opp_list[i].y*50, 50, 50);
			 board_info_array[opp_list[i].y][opp_list[i].x] = 0;
			 opp_list.splice(i,1);
			}
		  else
		    {
             opp_list[i].behaviourPattern(ctx, imgs[1], board_info_array, new_x, new_y); //used for redrawing
		    }
		 }*/
		}
		
		  function createCustomAlert(title, txt, btntxt, isGame) {
		  let d = document;

		  if(d.getElementById("modalContainer")) return;

		  let mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
		  mObj.id = "modalContainer";
		  mObj.style.height = d.documentElement.scrollHeight + "px";
		  
		  let alertObj = mObj.appendChild(d.createElement("div"));
		  alertObj.id = "alertBox";
		  if(d.all && !window.opera) alertObj.style.top = '50%';//document.documentElement.scrollTop + "px";
		  alertObj.style.left = '50%';//(d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
		  alertObj.style['margin-left'] = -alertObj.offsetWidth/2+'px';
		  alertObj.style['margin-top'] = -alertObj.offsetHeight/3+'px';
		  //alertObj.style.margin-left = -alertObj.offsetHeight)/2;
		  alertObj.style.visiblity="visible";

		  let h1 = alertObj.appendChild(d.createElement("h1"));
		  h1.appendChild(d.createTextNode(title));

		  let msg = alertObj.appendChild(d.createElement("p"));
		  //msg.appendChild(d.createTextNode(txt));
		  msg.innerHTML = txt;

		  let btn = alertObj.appendChild(d.createElement("a"));
		  btn.id = "closeBtn";
		  btn.appendChild(d.createTextNode(btntxt));
		  btn.href = "#";
		  btn.focus();
		  btn.onclick = function() { removeCustomAlert(isGame);return false; }

		  alertObj.style.display = "block";
		  
		}

		function removeCustomAlert(delGame) {
		  btnclick.play();
		  document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
		  
		  //document.getElementById("board").style.transform = 'translate(0px, 0px)';
		  //document.getElementById('main_menu_btns').style.transform = 'translateX(0%)';
			
			if (delGame){
				document.getElementById("board").style.transform = 'translate(0px, 0px)';
		        document.getElementById('main_menu_btns').style.transform = 'translateX(0%)';
			setTimeout(function(){
			currentdir = 'up';
			cycle = -1;
			board_info_array = [];
			snake_body = [];
			score = 0;
			speed = 200;
			frame = true;
			apple_counter = 0;
			opponentList = [];
			
			start = false;
			
			cur_x = 10;
			cur_y = 10;
			
			document.getElementById('scor').innerHTML = ''+0;
			
			document.getElementById('board_bg').remove();
			document.getElementById('board_fg').remove();
			document.getElementById('snake_canvas').remove();
			//for (let i = 1; i < 7; i++)
			//	document.getElementById('outline'+i).remove();
			document.getElementById("board").style.display = "none";}, 3000);
			}
		}
		function ful(){
		alert('Alert this pages');
		}
		
		//document.getElementById("desc").style.display = "none";
		//document.getElementById("board").style.display = "none";
		
		document.addEventListener('keydown', InitMenu);
		document.addEventListener('click', InitMenu);
		document.getElementById("board").style.display = "none";
		document.getElementById('main_menu_btns').style.transform = 'translateX(-400%)';
		document.getElementById('level_select_btns').style.transform = 'translateX(400%)';
		document.getElementById('board').style.transition = 'transform 2.0s ease';
		//InitBoard();