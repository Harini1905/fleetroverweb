/* script.js */
const API_BASE = "https://fleetbots-production.up.railway.app";
let sessionId = "";
let rovers = ["Rover-1", "Rover-2", "Rover-3", "Rover-4", "Rover-5"];
let positions = {};
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
}

async function fetchFleetStatus() {
    const response = await fetch(`${API_BASE}/api/fleet/status?session_id=${sessionId}`);
    const data = await response.json();
    positions = data.positions;
    drawGrid();
}

async function moveRover(direction) {
    const rover = document.getElementById("roverSelect").value;
    await fetch(`${API_BASE}/api/rover/${rover}/move?session_id=${sessionId}&direction=${direction}`, { method: "POST" });
    fetchFleetStatus();
}

function populateRoverSelect() {
    const select = document.getElementById("roverSelect");
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
    fetchFleetStatus();
    setInterval(fetchFleetStatus, 2000);
};
