var Xpos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var Opos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var Xwin = 0;
var Owin = 0;
var turn = 0;
var isEnd = false;
var winCondition = {}

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
    point[i].addEventListener('click', function (e) {
        if (isEnd) {
          showModal({ message : 'End of Game, Please Restart'});
        } else {
            turn++
            if (turn % 2 == 0) {
                if(e.target.classList.contains("disable")) return false;
                document.getElementById(point[i].id).classList.add("disable", "o", "btn-primary");
                document.getElementById(point[i].id).innerHTML = 'O';
                Opos[point[i].id] = 1;
                checkOwin(Opos);
            } else {
                if(e.target.classList.contains("disable")) return false;
                document.getElementById(point[i].id).classList.add("disable", "x", "btn-info");
                document.getElementById(point[i].id).innerHTML = 'X';
                Xpos[point[i].id] = 1;
                checkXwin(Xpos);
            }
            checkDraw();
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
            showModal({ message : 'O win The Game'});
            Owin += 1;
            document.getElementById('o_win').innerHTML = Owin
        }
    }
}
function checkXwin(arrCurrentPos){
    for(var k in winCondition){
        if(arraysEqual(arrCurrentPos, winCondition[k])){
            isEnd = true;
            showModal({ message : 'X win The Game' });
            Xwin += 1;
            document.getElementById('x_win').innerHTML = Xwin;
        }
    }
}

function checkDraw () {
    var disabledBtn = document.getElementsByClassName("disable");
    if (disabledBtn.length == Xpos.length || disabledBtn.length == Opos.length) {
      isEnd = true;
      showModal({ message : 'End of Game, Please Restart'});
    }
}

function reset() {
    Opos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    Xpos = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    turn = 0;
    for (let i = 0; i < 9; i++) {
        point[i].classList.remove("btn-primary", "btn-info", "o", "x", "disable");
        point[i].innerHTML = '+';
    }
    clearModal();
}

function showModal(o){
  var ml = '<div class="alert alert-success">' + 
              '<strong>Tic-tac-toe  </strong>' + o.message + 
            '</div>'
    document.getElementById('alert').innerHTML = ml;
}

function clearModal(){
  var modal = document.getElementById('alert').firstElementChild;
  if (modal) modal.remove();
}
