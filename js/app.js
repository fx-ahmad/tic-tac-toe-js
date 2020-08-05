var Xpos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var Opos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var Xwin = 0;
var Owin = 0;
var count = 0;
var isEnd = false;
var winCondition = {}
var countModalDisplay = 0;

/*---------- Win Condition ----------*/
winCondition["win_x0"] = [ 
                            1, 1, 1, 
                            0, 0, 0, 
                            0, 0, 0
                          ];
winCondition["win_x1"] = [ 
                            0, 0, 0, 
                            1, 1, 1, 
                            0, 0, 0
                          ];
winCondition["win_x2"] = [ 
                            0, 0, 0, 
                            0, 0, 0, 
                            1, 1, 1
                         ];
winCondition["win_y0"] = [ 
                            1, 0, 0, 
                            1, 0, 0, 
                            1, 0, 0
                          ];
winCondition["win_dl"] = [ 
                            0, 0, 1, 
                            0, 1, 0, 
                            1, 0, 0
                          ];
winCondition["win_y2"] = [ 
                            0, 0, 1, 
                            0, 0, 1, 
                            0, 0, 1
                        ];
winCondition["win_dr"] = [ 
                            1, 0, 0, 
                            0, 1, 0, 
                            0, 0, 1
                        ];
winCondition["win_y1"] =  [ 
                            0, 1, 0, 
                            0, 1, 0, 
                            0, 1, 0
                          ];
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
                checkOwin(Opos);
            } else {
                document.getElementById(point[i].id).className += " disable x btn-info";
                document.getElementById(point[i].id).innerHTML = 'X';
                Xpos[point[i].id] = 1;
                checkXwin(Xpos);
            }
        }
    })
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
function checkOwin(arrCurrentPos) {
    for (var k in winCondition) {
        if(arraysEqual(arrCurrentPos, winCondition[k])){
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
function checkXwin(arrCurrentPos){
    for(var k in winCondition){
        if(arraysEqual(arrCurrentPos, winCondition[k])){
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