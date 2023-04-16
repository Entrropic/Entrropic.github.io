//initializing board and other useful functions.
const square_size = Math.min(Math.floor(window.screen.width/15), Math.floor(window.screen.height/15));
const top_margin = Math.floor(window.screen.height/10);
const left_margin = Math.floor(window.screen.width/4);
const squares_amount = 9;

export function initField(canvas_id, upper_canvas_id, body_id, assets) {
    const field = document.getElementById(canvas_id);
    const ctx = field.getContext("2d");

    const upper = document.getElementById(upper_canvas_id);
    const upctx = upper.getContext("2d");
    
    for (let i = 0, c = 0; c < squares_amount; i += square_size, c++) {
        if (c > 0 && c%3==0) i += Math.floor(square_size/2);
        for (let j = 0, d = 0; d < squares_amount; j += square_size, d++) {
            if (d > 0 && d%3==0) j += Math.floor(square_size/2);
            ctx.drawImage(assets, 0, 0, 100, 100, left_margin+i, top_margin+j, square_size, square_size);
        }
    }

    for (let j = 0; j < square_size*4; j += square_size*3+Math.floor(square_size/2)) {
        upctx.drawImage(assets, 100, 200, 100, 100, left_margin+j+3*square_size-Math.floor(square_size/4), top_margin-square_size, square_size, square_size);
        for (let i = 0, c = 0; c < squares_amount; i += square_size, c++) {
            if (c > 0 && c%3==0) i += Math.floor(square_size/2);
            upctx.drawImage(assets, 100, 100, 100, 100, left_margin+j+3*square_size-Math.floor(square_size/4), top_margin+i, square_size, square_size);

        }
        upctx.drawImage(assets, 100, 300, 100, 100, left_margin+j+3*square_size-Math.floor(square_size/4), top_margin+square_size*(squares_amount+1), square_size, square_size);
    }

    for (let j = 0; j < square_size*4; j += square_size*3+Math.floor(square_size/2)) {
            upctx.drawImage(assets, 0, 200, 100, 100, left_margin-square_size, top_margin+j+3*square_size-Math.floor(square_size/4), square_size, square_size);
            for (let i = 0, c = 0; c < squares_amount; i += square_size, c++) {
                if (c > 0 && c%3==0) i += Math.floor(square_size/2);
                upctx.drawImage(assets, 0, 100, 100, 100, left_margin+i, top_margin+j+3*square_size-Math.floor(square_size/4), square_size, square_size);
    
            }
            upctx.drawImage(assets, 0, 300, 100, 100, left_margin+square_size*(squares_amount+1), top_margin+j+3*square_size-Math.floor(square_size/4), square_size, square_size);
        }
    
    for (let i = 0; i < square_size*4; i += square_size*3+Math.floor(square_size/2))
        for (let j = 0; j < square_size*4; j += square_size*3+Math.floor(square_size/2))
            upctx.drawImage(assets, 0, 500, 100, 100, left_margin+i+3*square_size-Math.floor(square_size/4), top_margin+j+3*square_size-Math.floor(square_size/4), square_size, square_size);
    //for testing
    //ctx.drawImage(assets, 0, 400, 100, 100, left_margin+Math.floor(square_size/2)+square_size*4, top_margin+8*square_size+Math.floor(square_size), square_size, square_size);
    //ctx.drawImage(assets, 100, 400, 100, 100, left_margin+7*square_size+Math.floor(square_size), top_margin+2*square_size, square_size, square_size);
    //document.getElementById(body_id).appendChild(field);
}

export function player_move(event, canvas_id, sprite, sound, player_id, valid_actions) {

    let illegal = false;


    let square_x = event.x - left_margin;
    if ((3*square_size <= square_x && square_x <= 3*square_size+Math.floor(3*square_size/4)) || (6*square_size + Math.floor(square_size/2) <= square_x && square_x <= 7*square_size + Math.floor(square_size/4)))
        square_x = -1;
    else 
        {
            square_x -= (square_x/square_size >= 3? Math.floor(square_size/2) : 0) + (square_x/square_size >= 6? Math.floor(square_size/2) : 0);
            square_x = Math.floor(square_x/square_size);
        }
    let square_y = event.y - top_margin;
    if ((3*square_size <= square_y && square_y <= 3*square_size + Math.floor(square_size/2)) || (6*square_size + Math.floor(square_size/2) <= square_y && square_y <= 7*square_size))
        square_y = -1;
    else 
        {
            square_y -= (square_y/square_size >= 3? Math.floor(square_size/2) : 0) + (square_y/square_size >= 6? Math.floor(square_size/2) : 0);
            square_y = Math.floor(square_y/square_size);
        }
    //console.log(`${event.x - left_margin} ${event.y - top_margin}`);
    console.log(`${square_x} ${square_y}`);
    if (square_x < 0 || square_x > 8 ||square_y < 0 || square_y > 8 || !(valid_actions.has(square_x+' '+square_y))) {
        console.log('illegal move');
        illegal = true;
    }

    if (!illegal) {
        drawMove (canvas_id, sprite, sound, square_x, square_y, player_id);
        return [square_x, square_y];
    }
    else return false;
}

export function drawMove (canvas_id, img_asset, sound, x, y, player_id) {
    const field = document.getElementById(canvas_id);
    const ctx = field.getContext("2d");
    const sprite = player_id*100;
    let actual_x = x*square_size + (x >= 3? Math.floor(square_size/2) : 0) + (x >= 6? Math.floor(square_size/2) : 0);
    let actual_y = y*square_size + (y >= 3? Math.floor(square_size/2) : 0) + (y >= 6? Math.floor(square_size/2) : 0);

    ctx.drawImage(img_asset, sprite-100, 400, 100, 100, left_margin+actual_x, top_margin+actual_y, square_size, square_size);
    sound.play();
    //need to update board_skeleton here too. But this is after integration with boardAIcontroller.
    
}

export function drawAvailNodes(canvas_id, assets, nodes) {
    let nodes_list = Array.from(nodes).map((x) => {return x.split(' ').map((y) => {return parseInt(y);})});
    const field = document.getElementById(canvas_id);
    const ctx = field.getContext("2d");

    for (let i = 0, c = 0; c < squares_amount; i += square_size, c++) {
        if (c > 0 && c%3==0) i += Math.floor(square_size/2);
        for (let j = 0, d = 0; d < squares_amount; j += square_size, d++) {
            if (d > 0 && d%3==0) j += Math.floor(square_size/2);
            ctx.drawImage(assets, 0, 0, 100, 100, left_margin+i, top_margin+j, square_size, square_size);
        }
    }

    for (const node of nodes_list) {
        let x = node[0];
        let y = node[1];
        let actual_x = x*square_size + (x >= 3? Math.floor(square_size/2) : 0) + (x >= 6? Math.floor(square_size/2) : 0);
        let actual_y = y*square_size + (y >= 3? Math.floor(square_size/2) : 0) + (y >= 6? Math.floor(square_size/2) : 0);
        ctx.drawImage(assets, 100, 0, 100, 100, left_margin+actual_x, top_margin+actual_y, square_size, square_size);
    }

}

export function drawBigBoard(canvas_id, assets, board_id, player_id) {
    const field = document.getElementById(canvas_id);
    const ctx = field.getContext("2d");
    const sprite = player_id*100;

    let x = board_id % 3;
    let y = Math.floor(board_id / 3);
    let actual_x = x*3*square_size + (x >= 1? Math.floor(square_size/2) : 0) + (x >= 2? Math.floor(square_size/2) : 0);
    let actual_y = y*3*square_size + (y >= 1? Math.floor(square_size/2) : 0) + (y >= 2? Math.floor(square_size/2) : 0);
    ctx.clearRect(left_margin+actual_x, top_margin+actual_y, square_size*3, square_size*3);
    ctx.drawImage(assets, sprite-100, 400, 100, 100, left_margin+actual_x, top_margin+actual_y, square_size*3, square_size*3);

}