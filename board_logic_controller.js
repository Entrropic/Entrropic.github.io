import {drawBigBoard} from './super_tic_tac_toe.js';

export class BoardController {

    constructor(squares_amount, canvas, assets) {
        this.squares_amount = squares_amount;
        this.board_state = {};
        this.play_canvas = canvas;
        this.assets = assets;
        this.player_id = 2; //hardcoded but unlikely to change
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
            'diag2': [0,0],
            'filled' : 0
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

    update_big_board(board_id, player) {
        this.board_state[board_id]['full'] = true;
        this.board_state[board_id]['winner'] = player;
        drawBigBoard(this.play_canvas, this.assets[0], board_id, player);

        let row = Math.floor(board_id/3);
        let col = board_id % 3;
        this.board_state['filled']++;
        this.board_state['board'][row][col] = player;
        this.board_state['row'][row][player-1]++;
        this.board_state['col'][col][player-1]++;
        if (row == col)
            this.board_state['diag1'][player-1]++;
        if (Math.abs(row%3-col%3) == 2 || row%3 == 1 && col%3 == 1)
            this.board_state['diag2'][player-1]++;
        if (this.board_state['row'][row][player-1] == 3 || this.board_state['col'][col][player-1] == 3 || this.board_state['diag1'][player-1] == 3 || this.board_state['diag2'][player-1] == 3)
            this.board_state['winner'] = player;
        if (this.board_state['filled'] == this.squares_amount && this.board_state['winner'] == -1)
            this.board_state['winner'] = 3; //tie
    }

    easyAiMove() {
        //random move.
        let nodes_list = Array.from(this.avail_nodes).map((x) => {return x.split(' ').map((y) => {return parseInt(y);})});
        return nodes_list[Math.floor(Math.random()*nodes_list.length)];
    }

    hardAiMove () {
        //take scoring function from python script. For now - just random move.

        let nodes_list = Array.from(this.avail_nodes).map((x) => {return x.split(' ').map((y) => {return parseInt(y);})});
        for (const node of nodes_list)
            node.push(0);
        let temp_board = JSON.parse(JSON.stringify(this.board_state));

        for (const node of nodes_list) {
            console.log(`move: ${node}`);

            let cur_board = Math.floor(node[1]/3) * 3 + Math.floor(node[0]/3);
            let good_score = this.hardAiScoring(node, cur_board, this.player_id);
            node[2] = good_score;
            console.log(`good score: ${good_score}`);
            let bad_score = 0;
            if (this.board_state['winner'] == -1) {
                let next_nodes = this.onlyGetMoves(node[0], node[1]);
                let temp_board_2 = JSON.parse(JSON.stringify(this.board_state));

                for (const node2 of next_nodes) {

                    let this_board = Math.floor(node2[1]/3) * 3 + Math.floor(node2[0]/3);
                    bad_score = Math.max(bad_score, this.hardAiScoring(node2, this_board, 3-this.player_id));
                    this.board_state = JSON.parse(JSON.stringify(temp_board_2));
                }
            }
            node[2] -= bad_score;
            console.log(`bad score: ${bad_score}`);
            this.board_state = JSON.parse(JSON.stringify(temp_board));
        }

        nodes_list.sort((a,b) => {if (a[2] > b[2]) return -1; else return 1;});
        console.log(nodes_list);
        console.log('-0----');


        return nodes_list[0];
    }

    hardAiScoring (node, board, player) {

        let final_score = 0;
        if (board != 4 && node[1] % 3 == 1 && node[0] % 3 == 1)
            final_score -= 2;
        
        this.board_state[board]['board'][node[1] % 3][node[0] % 3] = player;
        this.board_state[board]['filled'] ++;
        this.board_state[board]['row'][node[1] % 3][player-1] ++;
        this.board_state[board]['col'][node[0] % 3][player-1] ++;
        if (this.board_state[board]['row'][node[1] % 3][player-1] == 2 && this.board_state[board]['row'][node[1] % 3][2-player] == 0)
            final_score += 2;
        if (this.board_state[board]['col'][node[0] % 3][player-1] == 2 && this.board_state[board]['col'][node[0] % 3][2-player] == 0)
            final_score += 2;
        if (node[0] % 3 == node[1] % 3) {
            this.board_state[board]['diag1'][player-1] ++;
            final_score ++;
            if (this.board_state[board]['diag1'][player-1] == 2 && this.board_state[board]['diag1'][2-player] == 0)
                final_score += 2;
        }
        if ((node[0] % 3 == 1 && node[1] % 3 == 1) || Math.abs(node[0] % 3 - node[1] % 3) == 2) {
            this.board_state[board]['diag2'][player-1] ++;
            final_score ++;
            if (this.board_state[board]['diag2'][player-1] == 2 && this.board_state[board]['diag2'][2-player] == 0)
                final_score += 2;
        }

        if (Math.max(this.board_state[board]['row'][node[1] % 3][player-1], this.board_state[board]['col'][node[0] % 3][player-1], this.board_state[board]['diag1'][player-1], this.board_state[board]['diag2'][player-1]) == 3) {
            final_score += 10;
            this.board_state[board]['full'] = true;
            this.board_state[board]['winner'] = player-1;

            let up_board = this.board_state[board]['square'];
            this.board_state['board'][up_board[0]][up_board[1]] = player;
            this.board_state['row'][up_board[0]][player-1] ++;
            this.board_state['col'][up_board[1]][player-1] ++;

            if (this.board_state['row'][up_board[0]][player-1] == 2 &&  this.board_state['row'][up_board[0]][2-player] == 0)
                final_score += 15;
            if (this.board_state['col'][up_board[1]][player-1] == 2 && this.board_state['col'][up_board[1]][2-player] == 0)
                final_score += 15;

            if (up_board[0] == up_board[1]) {
                this.board_state['diag1'][player-1] ++;
                if (this.board_state['diag1'][player-1] == 2 && this.board_state['diag1'][2-player] == 0)
                    final_score += 15;
            }
            if (Math.abs(up_board[0]-up_board[1]) == 2 || (up_board[0] == 1 && up_board[1] == 1)) {
                this.board_state['diag2'][player-1] ++;
                if (this.board_state['diag2'][player-1] == 2 && this.board_state['diag2'][2-player] == 0)
                    final_score += 15;
            }
            
            if (Math.max(this.board_state['row'][up_board[0]][player-1], this.board_state['col'][up_board[1]][player-1], this.board_state['diag1'][player-1], this.board_state['diag2'][player-1]) == 3) {
                final_score += 1337;
                this.board_state['winner'] = player-1;
            }
        }
        else if (this.board_state[board]['filled'] == 9)
            this.board_state[board]['full'] = true;
        
        return final_score;
    }

    onlyGetMoves(x, y) {
        let next_board = Math.floor(y%3)*3+Math.floor(x%3);

        let hypo_avail_nodes = [];

        if (!(this.board_state[next_board]['full'])) {
                    //if board is available
                    let avail_col = (next_board % 3) * 3;
                    let avail_row = Math.floor(next_board / 3) * 3;
                    for (let row = avail_row; row < avail_row + 3; row++)
                        for (let col = avail_col; col < avail_col + 3; col++)
                            if (this.board_state[next_board]['board'][row%3][col%3] == 0)
                                hypo_avail_nodes.push([col, row, 0]);
                }
                else {
                    for (let i = 0; i < this.squares_amount; i++) {
                            let avail_row = Math.floor(i / 3) * 3;
                            let avail_col = Math.floor(i % 3) * 3;
                            for (let row = avail_row; row < avail_row + 3; row++)
                                for (let col = avail_col; col < avail_col + 3; col++)
                                    if (!(this.board_state[i]['full']) && this.board_state[i]['board'][row%3][col%3] == 0)
                                        hypo_avail_nodes.push([col, row, 0]);

                        }
                
                    //all boards.
                }

        //console.log(hypo_avail_nodes);
        return hypo_avail_nodes;
    }
}