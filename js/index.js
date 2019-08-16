var Xpos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var Opos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var Xwin = 0;
var Owin = 0;
var count = 0;
var isEnd = false;
var winCondition = {}
var countModalDisplay = 0;

/*---------- Win Condition ----------*/
winCondition["win_1"] = [1, 1, 1, 0, 0, 0, 0, 0, 0];
winCondition["win_2"] = [0, 0, 0, 1, 1, 1, 0, 0, 0];
winCondition["win_3"] = [0, 0, 0, 0, 0, 0, 1, 1, 1];
winCondition["win_4"] = [1, 0, 0, 1, 0, 0, 1, 0, 0];
winCondition["win_5"] = [0, 0, 1, 0, 1, 0, 1, 0, 0];
winCondition["win_6"] = [0, 0, 1, 0, 0, 1, 0, 0, 1];
winCondition["win_7"] = [1, 0, 0, 0, 1, 0, 0, 0, 1];
winCondition["win_8"] = [0, 0, 1, 0, 1, 0, 1, 0, 1];
/*-----------------------------------*/
document.getElementById('reset').addEventListener('click', function(){
    reset();
    isEnd = false;
})

var point = document.getElementsByTagName('li');
for (let i = 0; i < 9; i++) {
    point[i].addEventListener('click', function () {
        if (isEnd) {
          render(modal({
            display : 'block',
            color : 'info',
            message : 'End of Game, Please Restart'
          }));
          countModalDisplay += 1  ;
          if(countModalDisplay > 0){
            clearModal();
          }
        } else {
            count++;
            if (count % 2 == 0) {
                document.getElementById(point[i].id).className += " disable o btn-primary";
                document.getElementById(point[i].id).innerHTML = 'O';
                Opos[point[i].id] = 1;
                isOwin(Opos);
            } else {
                document.getElementById(point[i].id).className += " disable x btn-info";
                document.getElementById(point[i].id).innerHTML = 'X';
                Xpos[point[i].id] = 1;
                isXwin(Xpos);
            }
        }
    })
}

function isOwin(inGame) {
    for(let k = 1; k < 9; k++){
        if(inGame.every((value, index) => value === winCondition["win_"+k][index])){
            isEnd = true;
            render(modal({
              display : 'block',
              color : 'success',
              message : 'O win The Game'
            }));
            Owin += 1;
            document.getElementById('o_win').innerHTML = Owin
        }
    }
}
function isXwin(inGame){
    for(let x = 1; x < 9; x++){
        if(inGame.every((value, index) => value === winCondition["win_"+x][index])){
            isEnd = true;
            render(modal({
              display : 'block',
              color : 'success',
              message : 'X win The Game'
            }));
            Xwin += 1;
            document.getElementById('x_win').innerHTML = Xwin;
        }
    }
}

function reset() {
    Opos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    Xpos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    count = 0;
    for (let i = 0; i < 9; i++) {
        point[i].classList.remove("btn-primary");
        point[i].classList.remove("btn-info");
        point[i].classList.remove("o");
        point[i].classList.remove("x");
        point[i].classList.remove("disable");
        point[i].innerHTML = '+';
    }
    clearModal();
}

function modal(prop){
  return(
    `<div class="alert alert-${prop.color}" style="display: ${prop.display};">
        <strong>Tic-tac-toe</strong> ${prop.message}.
    </div>`
  )
}
function render(that){
    document.getElementById('alert').innerHTML += that;
}

function clearModal(){
  var modal = document.getElementById('alert').firstElementChild;
  modal.remove();
}
