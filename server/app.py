from flask import Flask, session
from flask_socketio import SocketIO, emit, disconnect
from flask_cors import CORS
import json
import leds

app = Flask(__name__, static_folder='../client/build', static_url_path='/')
CORS(app)

app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return app.send_static_file('index.html')

@socketio.on('light_leds')
def handle_light_leds(message):
    leds.clearStrip()
    leds.setColors(message['from_led'], message['to_led'], message['color'])

    emit('led_response', {'success': True})

@socketio.on('clear_leds')
def handle_clear_leds(message):
    leds.clearStrip()

    emit('led_response', {'success': True})

@socketio.event
def disconnect_request():
    disconnect()
    print('Client disconnected from websocket server.')

@socketio.on('connect')
def connect():
    print('Client connected to websocket server.')


if __name__ == '__main__':
    socketio.run(app)