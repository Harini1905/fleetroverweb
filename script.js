const API_BASE = "https://fleetbots-production.up.railway.app";
let sessionId = "";
let rovers = ["Rover-1", "Rover-2", "Rover-3", "Rover-4", "Rover-5"];
let positions = {
    "Rover-1": [0, 0], "Rover-2": [1, 0], 
    "Rover-3": [2, 0], "Rover-4": [3, 0], "Rover-5": [4, 0]
}; // Default positions if API doesn't return data
let obstacles = [[2, 2], [3, 4], [1, 3]];

const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x <= canvas.width; x += 50) {
        for (let y = 0; y <= canvas.height; y += 50) {
            ctx.strokeStyle = "#ddd";
            ctx.strokeRect(x, y, 50, 50);
        }
    }
    drawObstacles();
    drawRovers();
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach(([x, y]) => {
        ctx.fillRect(x * 50, y * 50, 50, 50);
    });
}

function drawRovers() {
    ctx.fillStyle = "blue";
    Object.entries(positions).forEach(([rover, [x, y]]) => {
        ctx.fillRect(x * 50, y * 50, 50, 50);
    });
}

async function startSession() {
    const response = await fetch(`${API_BASE}/api/session/start`, { method: "POST" });
    const data = await response.json();
    sessionId = data.session_id;
    console.log("Session ID:", sessionId);
}

async function fetchFleetStatus() {
    try {
        const response = await fetch(`${API_BASE}/api/fleet/status?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data && data.fleet) {
            Object.keys(data.fleet).forEach(rover => {
                positions[rover] = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]; // Simulated random movement
            });
        }
        drawGrid();
    } catch (error) {
        console.error("Error fetching fleet status:", error);
    }
}

async function moveRover(direction) {
    const rover = document.getElementById("roverSelect").value;
    await fetch(`${API_BASE}/api/rover/${rover}/move?session_id=${sessionId}&direction=${direction}`, { method: "POST" });
    fetchFleetStatus();
}

function populateRoverSelect() {
    const select = document.getElementById("roverSelect");
    select.innerHTML = ""; // Clear previous options
    rovers.forEach(rover => {
        const option = document.createElement("option");
        option.value = rover;
        option.textContent = rover;
        select.appendChild(option);
    });
}

window.onload = async function() {
    await startSession();
    populateRoverSelect();
    drawGrid(); // Ensure grid and obstacles appear on load
    fetchFleetStatus();
    setInterval(fetchFleetStatus, 2000); // Keep updating the fleet status
};
