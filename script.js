function move(direction) {
    const rover_id = document.getElementById("rover").value;
    fetch('/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rover_id, direction })
    })
    .then(response => response.json())
    .then(data => {
        if (data.warning) {
            document.getElementById("message").innerText = data.warning;
        }
        updateGrid();
    });
}

function updateGrid() {
    fetch('/status')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById("grid");
            grid.innerHTML = "";
            let positions = data.positions;
            let obstacles = data.obstacles;

            for (let y = 5; y >= 0; y--) {
                for (let x = 0; x <= 5; x++) {
                    let cell = document.createElement("div");
                    cell.classList.add("cell");

                    let roverHere = Object.keys(positions).find(r => positions[r][0] === x && positions[r][1] === y);
                    if (roverHere) {
                        cell.classList.add("rover");
                        cell.innerText = roverHere;
                    }

                    if (obstacles.some(o => o[0] === x && o[1] === y)) {
                        cell.classList.add("obstacle");
                    }

                    grid.appendChild(cell);
                }
            }
        });
}

updateGrid();
setInterval(updateGrid, 2000);
