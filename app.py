from flask import Flask , render_template,request,redirect
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from datetime import datetime
from chessBot.bot import main
from Entities import Player , Piece

#not used yet
app = Flask(__name__)
socketio = SocketIO(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
#not used
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    def __repr__(self):
        return '<Task %r>' % self.id

#set initial page as welcome later
@app.route('/')
def index():
        return render_template('update.html')





@app.route('/game',methods=['POST'])
def update_content():
    if request.method=='POST':
        return render_template("index.html")
    else:
        return redirect('/')


@socketio.on('move')
def handle_chess_event(message):
    data = message['data']
    # Handle the chess event data here
    print('Received chess event:', data)


@app.route('/websocket')
def websocket():
    return socketio.emit()

if __name__ == "__main__":
    # app.run(debug=True)
    socketio.run(app , debug=True)


