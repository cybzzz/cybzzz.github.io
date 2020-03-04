var board = new Array();
var score = 0;
var hasConflicted = new Array();//判断单元此次是否相加
//formobile var
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    //在页面宽时也有合适尺寸
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    //自适应
    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
    
}

function newgame(){
    //初始化网格
    init();
    //随机两格生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i = 0 ; i < 4 ; i ++)
        for(var j = 0 ; j < 4 ; j ++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }

    for(var i = 0 ; i < 4 ; i ++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0 ; j < 4 ; j ++)
            board[i][j] = 0;
            hasConflicted[i][j] = false;
    }

    updataBoardView();

    score = 0;
}

function updataBoardView(){
    $(".number-cell").remove();
    for(var i = 0 ; i < 4 ; i ++)
        for(var j = 0 ; j < 4 ; j ++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
            var theNumberCell = $("#number-cell-"+i+"-"+j);
            if(board[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(celltext(board[i][j]));
            }
            hasConflicted[i][j] = false;
        }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
    if (nospace(board))
        return false;
    //随机一个数字
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while(times < 50){
        if(board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times ++;
    }
    if(times == 50){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            } 
    }
    //随机一个位置
    var randNumber = Math.random() < 0.5 ? 2 : 4 ;
    //在位置显示数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37://left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38://up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39://right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40://down
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:
            break;
    }
});

document.addEventListener('touchstart',function(event){
    //touches[]数组 多点触控
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    deltax = endx - startx;
    deltay = endy - starty;
    if(Math.abs(deltax) < 0.1 * documentWidth && Math.abs(deltay) < 0.1 * documentWidth)
        return;
    if(Math.abs(deltax) >= Math.abs(deltay)){
        if(deltax > 0){
            //right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
    else{
        if(deltay > 0){
            //down
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
        else{
            //up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
        }
    }
});

function isgameover(){
    if(!canMoveLeft(board)&&!canMoveUp(board)&&!canMoveRight(board)&&!canMoveDown(board)){
        alert("gameover");
    }    
}

function moveLeft(){
    if(!canMoveLeft(board))
        return false;
    
    for(var i = 0 ; i < 4 ; i ++)
        for(var j = 0 ; j < 4 ; j ++){
            if(board[i][j] != 0){
                for(var k = 0 ; k < j ; k ++){
                    if( board[i][k] == 0 && noBlockHorizontal(i,k,j,board) ){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updataScore(score);
                        hasConflicted[i][k] = true;
                    }
                }
            }
        }

    setTimeout("updataBoardView()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board))
        return false;
    
    for(var j = 0 ; j < 4 ; j ++)
        for(var i = 0 ; i < 4 ; i ++){
            if(board[i][j] != 0){
                for(var k = 0 ; k < i ; k ++){
                    if( board[k][j] == 0 && noBlockVertically(k,i,j,board) ){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertically(k,i,j,board) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updataScore(score);
                        hasConflicted[k][j] = true;
                    }
                }
            }
        }

    setTimeout("updataBoardView()",200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board))
        return false;
    
    for(var i = 0 ; i < 4 ; i ++)
        for(var j = 2 ; j >= 0 ; j --){
            if(board[i][j] != 0){
                for(var k = 3 ; k > j ; k --){
                    if( board[i][k] == 0 && noBlockHorizontal(i,j,k,board) ){
                        //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updataScore(score);
                        hasConflicted[i][k] = true;
                    }
                }
            }
        }

    setTimeout("updataBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board))
        return false;
    
    for(var j = 0 ; j < 4 ; j ++)
        for(var i = 2 ; i >= 0 ; i --){
            if(board[i][j] != 0){
                for(var k = 3 ; k > i ; k --){
                    if( board[k][j] == 0 && noBlockVertically(i,k,j,board) ){
                        //move
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertically(i,k,j,board) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updataScore(score);
                        hasConflicted[k][j] = true;
                    }
                }
            }
        }

    setTimeout("updataBoardView()",200);
    return true;
}