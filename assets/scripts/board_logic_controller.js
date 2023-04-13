import {drawBigBoard} from './super_tic_tac_toe.js';

export class BoardController {

    constructor(squares_amount, canvas, assets) {
        this.squares_amount = squares_amount;
        this.board_state = {};
        this.play_canvas = canvas;
        this.assets = assets;
        for (let i = 0; i < squares_amount; i++) { //technically this is boards_amount but unlikely that this will be cuztomized so whatever
            this.board_state[i] = {
                'board': new Array(3).fill(undefined).map(() => {return new Array(3).fill(0);}), //new Array(3).fill(new Array(3).fill(0))//this actually creates clones of array.
                'winner' : -1,
                'row': new Array(3).fill(undefined).map(() => {return new Array(2).fill(0);}),
                'col': new Array(3).fill(undefined).map(() => {return new Array(2).fill(0);}),
                'diag1': [0,0],
                'diag2': [0,0],
                'square' : [Math.floor(i/3), i % 3],  //to simplify changing state of big board. Grab square and change big board square with these coords
                'full': false, //True if winner != -1 or if literally full
                'filled' : 0 //easier to determine if full
                };
        }
        Object.assign(this.board_state, {
            'board': new Array(3).fill(undefined).map(() => {return new Array(3).fill(0);}), //new Array(3).fill(new Array(3).fill(0)), is bad and creates clonse of array
            'winner': -1, //may be used during prediction
            'row': new Array(3).fill(undefined).map(() => {return new Array(2).fill(0);}),
            'col': new Array(3).fill(undefined).map(() => {return new Array(2).fill(0);}),
            'diag1': [0,0],
            'diag2': [0,0]
            });
        this.avail_nodes = new Set(); //stores available moves. Initially all moves are avialable.
        for (let i = 0; i < squares_amount; i++)
            for (let j = 0; j < squares_amount; j++)
                this.avail_nodes.add(i+" "+j);
        this.move = true; //true = player, false = AI move
    }

    update_board(x, y, fill_sound, player) {
        let cur_board = Math.floor(y/3) * 3 + Math.floor(x/3);
        let next_board = Math.floor(y%3)*3+Math.floor(x%3);
        this.avail_nodes.clear();

        this.board_state[cur_board]['board'][y%3][x%3] = player; //1 or 2
        this.board_state[cur_board]['row'][y%3][player-1]++;
        this.board_state[cur_board]['col'][x%3][player-1]++;
        if (y%3 == x%3)
            this.board_state[cur_board]['diag1'][player-1]++;
        if (Math.abs(y%3-x%3) == 2 || y%3 == 1 && x%3 == 1)
            this.board_state[cur_board]['diag2'][player-1]++;
        this.board_state[cur_board]['filled']++;

        if (this.board_state[cur_board]['row'][y%3][player-1] == 3 || this.board_state[cur_board]['col'][x%3][player-1] == 3 || this.board_state[cur_board]['diag1'][player-1] == 3 || this.board_state[cur_board]['diag2'][player-1] == 3 ) {
            this.update_big_board(cur_board, player);
            fill_sound.play();
        }

        if (this.board_state[cur_board]['filled'] == 9)
            this.board_state[cur_board]['full'] = true;
        
        console.log(this.board_state[cur_board]);

        if (!(this.board_state[next_board]['full'])) {
                    //if board is available
                    let avail_col = (next_board % 3) * 3;
                    let avail_row = Math.floor(next_board / 3) * 3;
                    for (let row = avail_row; row < avail_row + 3; row++)
                        for (let col = avail_col; col < avail_col + 3; col++)
                            if (this.board_state[next_board]['board'][row%3][col%3] == 0)
                                this.avail_nodes.add(col+" "+row);
                }
                else {
                    for (let i = 0; i < this.squares_amount; i++) {
                            let avail_row = Math.floor(i / 3) * 3;
                            let avail_col = Math.floor(i % 3) * 3;
                            for (let row = avail_row; row < avail_row + 3; row++)
                                for (let col = avail_col; col < avail_col + 3; col++)
                                    if (!(this.board_state[i]['full']) && this.board_state[i]['board'][row%3][col%3] == 0)
                                        this.avail_nodes.add(col+" "+row);

                        }
                
                    //all boards.
                }
            
                console.log(this.avail_nodes);
    }

    update_big_board(board_id, player) { //should mark specific board as filled, draw a big X or O on the field, also calculate if game is over.
        console.log('call me?');
        this.board_state[board_id]['full'] = true;
        this.board_state[board_id]['winner'] = player;
        drawBigBoard(this.play_canvas, this.assets[0], board_id, player);

        let row = Math.floor(board_id/3);
        let col = board_id % 3;
        this.board_state['board'][row][col] = player;
        this.board_state['row'][row][player-1]++;
        this.board_state['col'][col][player-1]++;
        if (row == col)
            this.board_state['diag1'][player-1]++;
        if (Math.abs(row%3-col%3) == 2 || row%3 == 1 && col%3 == 1)
            this.board_state['diag2'][player-1]++;
        if (this.board_state['row'][row][player-1] == 3 || this.board_state['col'][col][player-1] == 3 || this.board_state['diag1'][player-1] == 3 || this.board_state['diag2'][player-1] == 3)
            this.board_state['winner'] = player;
    }

    aiMove() {
        //take scoring function from python script. For now - just random move.
        console.log('ai logic placeholder');
        let nodes_list = Array.from(this.avail_nodes).map((x) => {return x.split(' ').map((y) => {return parseInt(y);})});
        return nodes_list[Math.floor(Math.random()*nodes_list.length)];
    }

    getAvailMoves() {
        return this.avail_nodes;
    }
}
