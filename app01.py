from flask import Flask , render_template , request , redirect , json 
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from datetime import datetime
from chessBot.bot import main
#from Entities import Player , Piece
from chess_moves import get_first_available_move as bot
import random

############################### ignore ##################################################
def namepick():
    # List of first names and last names
    first_names = ['John', 'Emma', 'Michael', 'Emily', 'James', 'Olivia', 'William', 'Sophia', 'Alexander', 'Ava']
    
    return random.choice(first_names)


#########################################################################################
#not used yet
# print("hello world !!!!!!!!!!!!!!!!!!!")
app = Flask(__name__)

socketio = SocketIO(app,debug=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

new_game = True
if new_game:
    current_state = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    new_game=False

#not used
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    def __repr__(self):
        return '<Task %r>' % self.id

@socketio.on('my event') # reply to a message from js
def test_message(message):
    print("a client is connected !!!")
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect') #if connected console log Connected
def test_connect():
    emit('my response', {'data': 'Connected'})
    emit('test event')

@socketio.on('refresh') 
def move(message):
    print("new fen is :",message['fen'])
    emit('refresh', {'fen': str(message['fen'])},broadcast=True,include_self=True)
    # emit('test event')

@socketio.on('moving') 
def move(message):
    print("tried to move :",str(bot(message['fen'])))
    emit('moving', {'move': str(bot(message['fen']))},broadcast=True,include_self=True)
    # emit('test event')

@socketio.on('disconnect') #if disctonnected console log disconnected 
def test_disconnect():
    print('Client disconnected')
    emit('my response', {'data': 'Disconnected'})

##################################################################################################

#set initial page as welcome later
@app.route('/')
def index():
        return render_template('update.html',name=namepick())


@app.route("/game")
def current_game():
    
    return render_template("index.html",init_state =current_state)


@app.route('/game',methods=['POST'])
def update_content():
    selected_value = request.form['selected_value']
    opponent =  "bot" if(selected_value=="chess_bot") else "player"
    if request.method=='POST':
        return render_template("index.html",opponent= opponent,init_state =current_state)
    else:
        return redirect('/')



if __name__ == "__main__":
    socketio.run(app  ,host='0.0.0.0',port=5000,debug=True)



"""
first things first 
you have to enter our website 
the link redirects you to our welcome page 
welcome page has rules profile play against an ai play against a player 
1st howa play against an ai ofc 
to do that you need to press on play a normal chess game 
then play against an ai or a bot 
if against a bot you  change the page
and choose color/opponent/ i create a room add you and let you play by yourself
if against a player you change the page 
and chose color/enter code and or join /generate code and  

then play against a player 
then profile and rules
then play in a tournament













"""
