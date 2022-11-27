export default class Enemy {
    constructor(x,y,lifespan,behaviourid) {
     this.x = x;
     this.y = y;
     this.behaviour = behaviourid;
     this.lifespan = lifespan;
     if (this.behaviour == 3)
         {
         this.phases = ['move_random', 'chase_apple', 'chase_player'];	
         this.cur_phase = this.phases[0];
         this.chase_player_time = 0;
          }
     return;	
    }

    randomGen(board, new_x, new_y) {
     let enemy_x = 0;
     let enemy_y = 0;
     do
        {		 
         enemy_x = Math.floor(Math.random()*(23-1)+1);
         enemy_y = Math.floor(Math.random()*(15-1)+1);
        } while (board[enemy_y][enemy_x] != 0 || enemy_x == new_x && enemy_y == new_y);	
     this.x = enemy_x;
     this.y = enemy_y;
     return;
    }

    getSprite(tx, ty, myx, myy) { //idk, either it should return required sprite, or just draw it
      if (this.behaviour == 1)
        return [0,0];
      else if (this.behaviour == 2) {
        let ox = 0;
        let oy = 0;
        if (tx > myx) ox += 50;
        if (ty > myy) oy += 50;
        return [ox, oy];
      }
      else if (this.behaviour == 3) {
        let ox = 0;
        let oy = 0;
        if (tx > myx) ox += 50;
        if (tx == myx) ox += 100;
        if (ty > myy) oy += 50;
        if (ty == myy) oy += 100;
        if (this.chase_player_time > 0) ox += 150;
        return [ox, oy];
      }
      else {
          console.log("unknown behaviour "+this.behaviour);
          return [-1,-1];
      }
     }

     enrage() {
        if (this.behaviour == 3) {
            this.chase_player_time = 10;
            let enrage = new Audio(sounddir+'/pig_enrage.wav');
            enrage.volume = 0.6;
            enrage.play();
        }
        else
           console.log('invalid/unexpected call of enrage');
        return;
     }

    behaviourPattern(ctx, img, board_info_array, px, py)
    {
     if (this.behaviour == 1)
        return; //no behaviour, apple just stays put
     if (this.behaviour == 2)
     {
      if (this.lifespan % 2 != 0) //make them move every 2nd move
        return;
      let new_x = -1;
      let new_y = -1;	 
      if (this.x < px)
      {
       if (this.y < py) { //pref move SE
         if (board_info_array[this.y+1][this.x+1] == 0)
         {
          new_x = this.x+1;
          new_y = this.y+1;
         }
         else if (py - this.y >= 2+px-this.x && this.x > 1 && board_info_array[this.y+1][this.x-1] == 0) { //SW
          new_x = this.x-1;
          new_y = this.y+1;	
         }
         else if (py - this.y+2 <= px - this.x && this.y > 1 && board_info_array[this.y-1][this.x+1] == 0) { //NE
          new_x = this.x+1;
          new_y = this.y-1;	
         }
       }
       else if (this.y > py) { //pref move NE
        if (board_info_array[this.y-1][this.x+1] == 0)
         {
          new_x = this.x+1;
          new_y = this.y-1;
         }
         else if (this.y - py >= 2+px-this.x && this.x > 1 && board_info_array[this.y-1][this.x-1] == 0) { //NW
          new_x = this.x-1;
          new_y = this.y-1;	
         }
         else if (this.y - py + 2 <= px-this.x && this.y < board_info_array.length-2 && board_info_array[this.y+1][this.x+1] == 0) { //SE
          new_x = this.x+1;
          new_y = this.y+1;	
         }
       }
        else { //this.y == py
         if (this.y > 1 && board_info_array[this.y-1][this.x+1] == 0) { //NE
          new_x = this.x+1;
          new_y = this.y-1;	
         }
         else if (this.y < board_info_array.length - 2 && board_info_array[this.y+1][this.x+1] == 0) { //SE
          new_x = this.x+1;
          new_y = this.y+1;	
        }
       }
      }
      else if (this.x > px)
      {
       if (this.y < py) { //pref move SW
         if (board_info_array[this.y+1][this.x-1] == 0)
         {
          new_x = this.x-1;
          new_y = this.y+1;
         }
         else if (py - this.y >= 2 + this.x - px && this.x < board_info_array[0].length - 2 && board_info_array[this.y+1][this.x+1] == 0) { //SE
          new_x = this.x+1;
          new_y = this.y+1;	
         }
         else if (py - this.y + 2 <= this.x - px && this.y > 1 && board_info_array[this.y-1][this.x-1] == 0) { //NW
          new_x = this.x-1;
          new_y = this.y-1;	
         }
       }
       else if (this.y > py) { //pref move NW
        if (board_info_array[this.y-1][this.x-1] == 0)
         {
          new_x = this.x-1;
          new_y = this.y-1;
         }
         else if (this.y - py >= 2 + this.x - px && this.x < board_info_array[0].length - 2 && board_info_array[this.y-1][this.x+1] == 0) { //NE
          new_x = this.x+1;
          new_y = this.y-1;	
         }
         else if (this.y - py + 2 <= this.x - px && this.y < board_info_array.length-2 && board_info_array[this.y+1][this.x-1] == 0) { //SW
          new_x = this.x-1;
          new_y = this.y+1;	
         }
       }
       else { //this.y == py
         if (this.y > 1 && board_info_array[this.y-1][this.x-1] == 0) { //NW
          new_x = this.x-1;
          new_y = this.y-1;	
         }
         else if (this.y < board_info_array.length - 2 && board_info_array[this.y+1][this.x-1] == 0) { //SW
          new_x = this.x-1;
          new_y = this.y+1;	
        }
       }
      }
      else { //this.x==px
        if (this.y < py) { //SW or SE
         if (this.x > 1 && board_info_array[this.y+1][this.x-1] == 0) {
          new_x = this.x-1;
          new_y = this.y+1;		 
         }
         else if (this.x < board_info_array[0].length - 2 && board_info_array[this.y+1][this.x+1] == 0) {
          new_x = this.x + 1;
          new_y = this.y + 1;	 
         }
        }
        else if (this.y > py) { //NW or NE. Also note if this.y == py then game over
         if (this.x > 1 && board_info_array[this.y-1][this.x-1] == 0) {
          new_x = this.x-1;
          new_y = this.y-1;		 
         }
         else if (this.x < board_info_array[0].length - 2 && board_info_array[this.y-1][this.x+1] == 0) {
          new_x = this.x + 1;
          new_y = this.y - 1;	 
         }

        }
      }

      if (new_x == -1)
          return;
      let redraw = this.getSprite(new_x, new_y, this.x, this.y);
      ctx.clearRect(this.x*50, this.y*50, 50, 50);
      ctx.drawImage(img, redraw[0], redraw[1], 50, 50, new_x*50, new_y*50, 50, 50);
      board_info_array[this.y][this.x] = 0;
      board_info_array[new_y][new_x] = 3;
      this.x = new_x;
      this.y = new_y;
      return;	 
     }		

     if (this.behaviour == 3)
     {
      if (this.lifespan % 2 != 0 && this.cur_phase != 'chase_player') //only move each turn when chasing player
        return;	
      //calculate available moves
      let avail_moves = [];

      for (let i = this.x - 1; i < this.x + 2; i++)
        for (let j = this.y - 1; j < this.y + 2; j++)
          if ((this.x != i || this.y != j) && i > 0 && i < board_info_array[0].length - 1 && j > 0 && j < board_info_array.length - 1 && (board_info_array[j][i] == 0 || board_info_array[j][i] == 2 || j == py && i == px))
              avail_moves.push([i, j]);

      if (this.cur_phase == 'chase_player' && this.chase_player_time == 0)
            this.cur_phase = this.phases[0];
      if (this.chase_player_time > 0 && this.cur_phase != 'chase_player')
            this.cur_phase = this.phases[2];
      //check apple coords and distance
      let dx = 0;
      let dy = 0;
      let tx = -10;
      let ty = -10;

      if (this.cur_phase != 'chase_player') {
      
      for (let i = 0; i < board_info_array[0].length; i++)
        for (let j = 0; j < board_info_array.length; j++)
            if (board_info_array[j][i] == 2) {
                tx = i;
                ty = j;
                break;
            }
      dx = Math.abs(this.x - tx);
      dy = Math.abs(this.y - ty);

      if (Math.max(dx, dy) < 6) {
            if (this.cur_phase == 'move_random')
            {
                let piggy_apple = new Audio(sounddir+'/pig_apple.wav');
                piggy_apple.volume = 0.6;
                piggy_apple.play();	
            }
            this.cur_phase = this.phases[1];
        }
      else
            this.cur_phase = this.phases[0];
      }

      let selected_move = [];
    
      if (this.cur_phase == 'move_random')
      {
       selected_move = avail_moves[Math.floor(Math.random()*avail_moves.length)];
      }
      else if (this.cur_phase == 'chase_apple')
      {
       let range = Math.max(dx, dy);	
       for (const element of avail_moves)
        if (Math.max(Math.abs(element[0] - tx), Math.abs(element[1] - ty)) <= range)
        {
         range = Math.max(Math.abs(element[0] - tx), Math.abs(element[1] - ty));
         selected_move = element;
        }
      }	
      else if (this.cur_phase == 'chase_player')
      {
        let range = Math.max(Math.abs(this.x - px), Math.abs(this.y - py));
        for (const element of avail_moves)
         if (Math.max(Math.abs(element[0] - px), Math.abs(element[1] - py)) <= range) {
            range = Math.max(Math.abs(element[0] - px), Math.abs(element[1] - py));
            selected_move = element;
        }
        this.chase_player_time -= 1;
      }	
      else
         console.log('invalid phase.');
      
      //make a move
      if (selected_move.length > 0) {
        let redraw = this.getSprite(selected_move[0], selected_move[1], this.x, this.y);
        ctx.clearRect(this.x*50, this.y*50, 50, 50);
        if (board_info_array[selected_move[1]][selected_move[0]] == 2 && (selected_move[0] != px || selected_move[1] != py)) {
         let piggy_eat = new Audio(sounddir+'/pig_eat.wav');
         piggy_eat.volume = 0.6;
         piggy_eat.play();
         ctx.clearRect(selected_move[0]*50, selected_move[1]*50, 50, 50);
         apple_counter = 40;
         this.lifespan += 60;
        }
        ctx.drawImage(img, redraw[0], redraw[1], 50, 50, selected_move[0]*50, selected_move[1]*50, 50, 50);
        board_info_array[this.y][this.x] = 0;
        board_info_array[selected_move[1]][selected_move[0]] = 3;
          this.x = selected_move[0];
        this.y = selected_move[1];
      }
      return; 
     }
    }

}