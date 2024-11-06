var Redplayer = "R";
var Blackplayer = "B";
var board; 
var rows = 6;
var columns = 7;
var gameOver = false; 
var currentPlayer = Redplayer; 
var currColumns = [];
var socket = io(); // Intialize Socket.IO connection 


// The game board is intialized when the window is finished loading 
window.onload = function()
{
    setBoard(); 
    document.getElementById("resetButton").addEventListener("click", resetGame);
    // Informs the server to the reset the game 
    socket.emit('resetGame');
    resetGame();


}

// Handles moves coming from the server 
socket.on('moveMade',(move) => 
{
    console.log("Move received:", move);
    let { r, c, player } = move;
    board[r][c] = player;
    updateTileUI(r,c,player); // Update UI and local board based on the move made. 
   
 
} );
// Listen for events that reset the game from the server
socket.on('gameReset', resetGame);
// Listen for the turn for the next player from the server
socket.on('nextPlayer', (player) => {
    console.log(`Next player is: ${player}`);
    currentPlayer = player;
    console.log(`Current player updated to ${player} (was: ${currentPlayer})`);
    console.table(board);
});

/* Inspired by tutorial https://www.youtube.com/watch?v=4ARsthVnCTg&t=379s 

    Set up the game board with empty titles all which have click listers assign to them. 

*/

function setBoard ()
{
    board = []; 
    currColumns = [5,5,5,5,5,5,5];// Keep tracks of the current top empty row in each column.

    
    // Iterates through each row and column to create and add tiles to the board 
    for (let r = 0; r < rows; r++) 
    {
        let row = [];
        for (let c = 0; c < columns; c++) 
        {
          row.push('');
          let tile = document.createElement("div");
          tile.id = r.toString() + "-" + c.toString();// Assigns a unique ID for each tile.
          tile.classList.add("tile");
          tile.addEventListener("click", setPiece);// Adds click event in order to place the piece.
          document.getElementById("board").append(tile);
        }
        board.push(row)
    }    


}

/* Inspired by tutorial https://www.youtube.com/watch?v=4ARsthVnCTg&t=379s 
  
   Control placing a piece on the board and switching the current player. 
*/

function setPiece() {
    if (gameOver) return;

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    r = currColumns[c]; // Get the current top empty slot

    if (r < 0) return; // Column is full, do nothing

    if (board[currColumns[c]][c] !== '') return;
    r = currColumns[c];
    board[r][c] = currentPlayer; // Place the piece on the board
    
    // Emit the move before potentially switching players, so that the server knows who made the move.
   console.log(`Emitting move for player: ${currentPlayer}, Row: ${r}, Column: ${c}`);
   socket.emit('playerMove', { r, c, player: currentPlayer });

   // Update UI
   updateTileUI(r, c, currentPlayer);
   currColumns[c]--;
  
    checkWinner();
}
// Updates the title UI based on the player's move
function updateTileUI(r, c, player) {
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    
    tile.classList.remove("red-piece", "black-piece");
    
    if (player == Redplayer) {
        tile.classList.add("red-piece");
    } else if (player == Blackplayer) {
        tile.classList.add("black-piece");
    }
}

// Checks the whole board for a winning line
function checkWinner()
{
    // Iterates through each cell on the board.
    for (let r = 0; r < rows; r++)
    {
        for(let c =0; c < columns; c++)
        {
          // Only check cells that are not empty.
           if (board[r][c] != '' )
           {
             // Check all directions from the current cell for a winning line.
            if(checkDirection (r,c,0,1) || checkDirection (r,c,1,0) || checkDirection (r,c,1,1)||checkDirection (r,c,1,-1))
            {
                setWinner(r,c,)
                return; 
            }
           }
        }
    }
  
}
// Checks a specific direction from a cell for a winning line.
function checkDirection(r,c, rStep,cStep)
{
    // The player to check for a winning line.
   const player = board[r][c]; 
   // Check the next 3 cells in the specified  direction.
   for (let i = 1; i < 4;i++ )
   {
    const nextR= r + rStep * i; 
    const nextC = c + cStep * i ;
     // Returns false if out of bounds 
    if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= columns )
    {
     
     return false; 
    }
    //Returns false if the next cell doesnt match player
    if (board[nextR][nextC] != player)
  {
   return false;
  }
    
   }

    
  // There is a winner 
   return true; 
}
/* Inspired by tutorial https://www.youtube.com/watch?v=4ARsthVnCTg&t=379s 
  Updates the UI and set the winner of the game
*/
function setWinner(r, c) {
   let winner = document.getElementById("winner");
   if (board[r][c] == Redplayer) {
       winner.innerText = "Red Wins";             
   } else {
       winner.innerText = "Black Wins";
   }
   gameOver = true;
}
/*
 Reset the game without having to refresh the page 
 */

function resetGame() {
    // Clear the winner text
    document.getElementById("winner").innerText = "";
    
    // Reinitialize game variables
    gameOver = false;
    currentPlayer = Redplayer;
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    
    // Clear and regenerate the  array and UI of the board
    board = [];
    let boardElement = document.getElementById("board");
    boardElement.innerHTML = ''; // Clear the existing board UI
    
    // Regenerate the board
    for (let r = 0; r < rows; r++) {
        let row = []; 
        for (let c = 0; c < columns; c++) {
            row.push(''); 
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            boardElement.append(tile);
        }
        board.push(row); 
    }
}
