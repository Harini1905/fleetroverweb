from flask import Flask, render_template, request, jsonify
import requests
import random

app = Flask(__name__)

API_BASE = "https://fleetbots-production.up.railway.app"
SESSION_START = f"{API_BASE}/api/session/start"
ROVERS = ["Rover-1", "Rover-2", "Rover-3", "Rover-4", "Rover-5"]
DIRECTIONS = ["forward", "backward", "left", "right"]

# Start a session
session_response = requests.post(SESSION_START)
session_data = session_response.json()
session_id = session_data.get("session_id")
if not session_id:
    raise Exception("Failed to start session. Check API response.")
print(f"Session Started: {session_id}")

# Simulated positions for rovers and obstacles
positions = {rover: [random.randint(0, 5), random.randint(0, 5)] for rover in ROVERS}
obstacles = [[2, 2], [3, 4], [1, 3]]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def move_rover():
    data = request.json
    rover_id = data['rover_id']
    direction = data['direction']
    
    if rover_id not in positions:
        return jsonify({"error": "Invalid rover ID"})
    
    x, y = positions[rover_id]
    if direction == "forward":
        y += 1
    elif direction == "backward":
        y -= 1
    elif direction == "left":
        x -= 1
    elif direction == "right":
        x += 1
    
    if [x, y] in obstacles or any(pos == [x, y] for pos in positions.values() if pos != positions[rover_id]):
        return jsonify({"warning": "Collision detected! Resetting rover."})
    
    positions[rover_id] = [x, y]
    return jsonify({"success": True, "new_position": positions[rover_id]})

@app.route('/status', methods=['GET'])
def get_fleet_status():
    return jsonify({"positions": positions, "obstacles": obstacles})

if __name__ == '__main__':
    app.run(debug=True)
