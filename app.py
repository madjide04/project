from datetime import datetime
from flask import Flask, flash, jsonify, render_template, redirect,request, session, url_for
from flask_login import AnonymousUserMixin, LoginManager, UserMixin, current_user, login_required, login_user, logout_user
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_wtf import FlaskForm
import numpy as np
from wtforms import StringField, PasswordField, SubmitField, TextAreaField
from wtforms.validators import Length, ValidationError, InputRequired,DataRequired,Email, Optional
from flask_bcrypt import Bcrypt
from chess_moves import get_first_available_move
from boot import ourai as bot
from Rodent_IV import rodenting as rodent
from stockfish import stockfishing as stockfish
import math
import re
import random
from string import ascii_uppercase

rooms = {}
queue = []

colors = {
    "w":"b",
    "b":"w"
    }

AVATAR_PATHS = {
    0: 'avatars/avatar.jpg',
    1: 'avatars/avatar1.jpg',
    2: 'avatars/avatar2.jpg',
    3: 'avatars/avatar3.jpg',
    4: 'avatars/avatar4.jpg',
    5: 'avatars/avatar5.jpg',
    # 6: 'avatars/avatar6.jpg',
    # Add paths for other avatars
}

bots = {
    'our ai': 1 ,
    'Stockfish' : 38 ,
    'RodentIV' : 15
}

new_game = True
if new_game:
    current_state = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    new_game=False

def f(x):
    """
    Piecewise function:
    f(x) = { 
        0 ≤ x ≤ 16   : (2*ceil(x) + 5)x + ceil(x)(1 - ceil(x))
        16 < x ≤ 31  : (5*ceil(x) - 43)x + (5/2)*ceil(x)(1 - ceil(x)) + 360
        31 < x       : (9*ceil(x) - 167)x + (9/2)*ceil(x)(1 - ceil(x)) + 2220
    }
    """
    ceil_x = np.ceil(x)
    if x<= 0 :
        return 0 
    if x <= 352:
        return math.sqrt(x+9)-3 
    elif x <= 1507:
        return (81 / 10) + math.sqrt((2 / 5) * (x - (7839 / 40)))
    else:
        return (325 / 18) + math.sqrt((2 / 9) * (x - (54215 / 72)))

def calculate_level(games_played, games_won):
    # Assuming the level is calculated based on games won and played
    # Adjust the formula as needed
    if games_played == 0:
        return 0  # Handle division by zero error if needed
    
    level = f((games_won * 10) + games_played)
    return math.floor(level)  # Optionally, round down to the nearest integer



"""
# Example usage:
# games_played = 100
# games_won = 30
# level = calculate_level(games_played, games_won)
# print("Level:", level)
"""

def generate_unique_code(length):
    while True:
        code = ''.join(random.choice(ascii_uppercase) for _ in range(length))
        if code not in rooms:
            break
    return code


app = Flask(__name__)
socketio = SocketIO(app,async_mode ="threading")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test01.db'
app.config['SECRET_KEY'] = 'meri2005'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return user.query.get(int(user_id))

class GuestUser(AnonymousUserMixin):
    @property
    def username(self):
        return "Guest"

login_manager.anonymous_user = GuestUser

class user(db.Model, UserMixin):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    gamesplayed = db.Column(db.Integer, default=0)  
    gameswon = db.Column(db.Integer, default=0)  
    gamesdrawn = db.Column(db.Integer, default=0)  
    gameslost = db.Column(db.Integer, default=0)  
    avatar_index = db.Column(db.Integer)   

    def set_avatar(self, index):
        self.avatar_index = index
        db.session.commit()
    
    def inc_gp(self):
        self.gamesplayed += 1
        db.session.commit()

    def inc_gw(self):
        self.gameswon += 1
        db.session.commit()

    def inc_gd(self):
        self.gamesdrawn += 1
        db.session.commit()

    def inc_gl(self):
        self.gameslost += 1
        db.session.commit()

    def inc(self, result):
        if result == 1:
            self.inc_gw()
        elif result == 2:
            self.inc_gd()
        elif result == 3:
            self.inc_gl()
        self.inc_gp()

class Message(db.Model):
    __tablename__ = 'messages'  # Optional: specify a custom table name

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(80), nullable=False, index=True)
    mobile = db.Column(db.String(15), nullable=True)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Message {self.id} from {self.email}>'
    
    @staticmethod
    def validate_email(email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return re.match(email_regex, email) is not None
    
    @staticmethod
    def validate_mobile(mobile):
        # Pattern to support "+213657808505" and "0657808505"
        mobile_regex = r'^(\+?\d{1,3})?\d{9,10}$'
        return re.match(mobile_regex, mobile) is not None

    def save(self):
        if not self.validate_email(self.email):
            raise ValueError("Invalid email address")
        if self.mobile and not self.validate_mobile(self.mobile):
            raise ValueError("Invalid mobile number")
        db.session.add(self)
        db.session.commit()
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'mobile': self.mobile,
            'message': self.message,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class ContactForm(FlaskForm):
    firstName = StringField(validators=[InputRequired(), Length(min=4,max=20)])
    lastName = StringField(validators=[InputRequired(), Length(max=20)], render_kw={"placeholder": "LastName"})
    email = StringField(validators=[InputRequired(), Email(), Length(max=80)], render_kw={"placeholder": "Username"})
    mobile = StringField(validators=[Length(max=15)], render_kw={"placeholder": "Mobile"})  # Optional for mobile
    message = TextAreaField(validators=[InputRequired(), Length(max=500)], render_kw={"placeholder": "Message"})

class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
    email = StringField(validators=[InputRequired(), Email(), Length(max=50)], render_kw={"placeholder": "Email"})
    password = PasswordField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Password"})
    # submit = SubmitField("Register")

    def validate_username(self, username):
        existing_user = user.query.filter_by(username=username.data).first()
        if existing_user:
            raise ValidationError("Username already exists. Choose a new one.")
        
class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
    password = PasswordField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Password"})

''' ''' '''             ''' ''' '''

@app.route('/increment-counter', methods=['POST'])
def increment_counter():
    counter = 0
    game_state = request.json.get('gameState')
    if(current_user.is_authenticated):
        current_user.inc(game_state)
        counter = [current_user.gameswon,current_user.gamesdrawn,current_user.gameslost,current_user.gamesplayed]
    
    return jsonify({'counter': counter})

@app.route("/registrate", methods=["GET", "POST"])
def registrate():
    if request.method == 'POST':
        # Call the register function passing the request object
        return register()
    else:
        # Render the registration form
        return render_template('register.html')



@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('profile'))
    form = LoginForm(request.form)

    if form.validate_on_submit(): 
        
        user_obj = user.query.filter_by(username=form.username.data).first()
        if user_obj and bcrypt.check_password_hash(user_obj.password, form.password.data):
            login_user(user_obj) 
            # (f"tried to redirect to :{url_for('dashboard')} by :{redirect(url_for('dashboard'))}")
            return redirect(url_for("profile"))
    return render_template("login.html", form=form)

@app.route("/logout", methods=["post", "get"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))
#######################################################################

def del_room(room):
    """
    i wait for 3 secs and check if the client is connected if yes pass if not return 
    """
    socketio.sleep(7)
    if rooms[room]['members'] <= 0:
        del rooms[room]
        remove_room(room)
    
    pass

@socketio.on('my event')
def handle_my_event(message):
    """Handle custom event."""
    print("A client is connected: ", message['data'])
    emit('my response', {'data': message['data']})

@socketio.on('disconnect')
def disconnect():
    room = session.get('room')
    name = session.get('name')
    
    leave_room(room)
    
    if room in rooms:
        rooms[room]['members'] -= 1
        # if rooms[room]['members'] == 1:
        pick_room(room,colors[session["color"]])
        socketio.start_background_task(del_room,room)
        # if rooms[room]['members'] <= 0:
        #     del rooms[room]
    
    socketio.send({'name': name, 'message': 'has left the room'}, to=room)
    print(f'{name} left the room {room}')

@socketio.on('connect')
def connect():
    room = session.get('room')
    name = session.get('name')
    if not room or not name or room not in rooms:
        print(' there is no room ')
        return redirect(url_for("index"))
    
    join_room(room)
    # send({'name': name, 'message': 'has entered the room'}, to=room)
    socketio.emit("my response",{'data': f'{name} has entered the room:{room}'}, to=room)
    rooms[room]['members'] += 0
    # if rooms[room]['members'] == 1:
    #     remove_room(room)
    #     pick_room(room,session["color"])
    print(f'{name} joined the room {room}')
    socketio.emit("name", to=room)

@socketio.on('refresh') 
def move(message):
    room = message["room"]
    to = message['to']
    fromm = message['from']
    print("new fen is :",message['fen'])
    emit('refresh', {'fen': str(message['fen']),'to':str(to),'from':str(fromm)},to=room)

@socketio.on('captured') 
def move(message):
    room = message["room"]
    color = message['color']
    emit('captured', {'piece': str(message['piece']),'color':str(color)},include_self=False,to=room)

@socketio.on('reset') 
def move(message):
    room = message["room"]
    emit('reset',include_self=False,to=room)


@socketio.on('moving') 
def move(message):
    room = message["room"]
    diff= message["hardness"]
    name= message["opponent"]
    
    print(f"the bot is being called with {diff} //  {name} \n")
    if name=="our ai":
        move=str(bot(message['fen']))
        print("our bot moved!")
    if name=="RodentIV":
        move=str(rodent(message['fen'],diff))
        print("rodent moved!")
    if name=="Stockfish":
        move=str(stockfish(message['fen'],diff))
        print("stockfish moved!")
        
        
    print(f"the bot is being called with {diff} //  {name} \n")
    print("tried to move :",move)
    emit('moving', {'move': move},include_self=True,to=room)
    # emit('test event')

@socketio.on('name') 
def move(message):
    room = message["room"]
    name = message['name']
    color = message['color']
    emit('name',{'room':room,'name':name,"color":color},include_self=True,to=room)

def namer(message):
    room = message["room"]
    name = message['name']
    color = message['color']
    emit('name',{'room':room,'name':name,"color":color},include_self=True,to=room)

@socketio.on('namer') 
def counternamer(message):
    room = message["room"]
    name = message['name']
    color = message['color']
    emit('namer',{'room':room,'name':name,"color":color},include_self=True,to=room)

"""
broadcast the name of the second player once he is in 
"""
######################################################################

'''
@socketio.on('join')
def on_join(data):
    name = session['name']
    room = data['room']
    join_room(room)
    send(name + ' has entered the room.', to=room)

#######################################################################
'''

@app.route('/')
def index():
    """Render the welcome page."""
    if (current_user.is_authenticated):
        user = current_user.username
    else:
        user = 'guest'
    return render_template('welcome.html',user=user)

@app.route('/rules')
def rules():
    """Render the welcome page."""
    return render_template('rules.html')


@app.route('/contact_us',methods=["post","get"])
def contactus():
        
    form = ContactForm(request.form)

    if request.method == 'POST' :
        if form.validate_on_submit():

            # Create a new Message object with form data              
            new_message = Message(
                first_name=form.firstName.data,
                last_name=form.lastName.data,
                email=form.email.data,
                mobile=form.mobile.data,
                message=form.message.data
            )
            
            # Save the new message to the database
            try:
                new_message.save()
                # print("message saved")
                flash('Your message has been sent successfully!', 'success')
            except Exception as e:
                flash(f'An error occurred: {str(e)}', 'error')
                # print("message not saved")

            # For example, save the data to the database or send an email
            # ...

            return render_template('contactus.html',form=form)


    return render_template('contactus.html',form=form)


@app.route("/profile",methods=["POST","GET"])
def profile():
    if current_user.is_authenticated:
        avatar_path = AVATAR_PATHS.get(current_user.avatar_index)
        id = current_user.id
        username = current_user.username
        gamesplayed = current_user.gamesplayed
        gameswon = current_user.gameswon
        gameslost = current_user.gameslost
        level = calculate_level(gamesplayed,gameswon)
        print(f"\n\nhere is the level of the current user : \n {level} \n\n")
        return render_template("profile.html", avatar_path=avatar_path, id=id, level=level, username=username, gamesplayed=gamesplayed, gameswon=gameswon, gameslost=gameslost)
    else:
        return redirect(url_for("login"))

@app.route('/game_bot',methods=["POST"])
def game_bot():
    """get color from a form"""
    color = request.form.get("color")
    name = request.form.get("name")
    hardness = request.form.get("hardness",1)
    return handle_bot_post_request(color,name,hardness)
    # return render_template('gameboard.html')



@app.route('/game_player', methods=['POST'])
def game_player():
    """Handle creating or joining a room to play against a friend."""
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = GuestUser().username

    if not name:
        name = "guest"

    opponent = "player"
    action = request.form.get('action')

    
    if action == "create":
        color = request.form.get('color', 'w')
        print("color of the creator is:" , color)
        room_code = generate_unique_code(4)
        [room_code, color] = pick_room(room_code, color)# you shouldn't flip rooms when creating instead if this happens you throw an error
        session['room'] = room_code # or you add one more member 
        session['name'] = name
        session['opponent'] = opponent
        session['hardness'] = 1
        session['color'] = color
        rooms[room_code] = {'members': 1 , 'color': color , 'creator': name }
        return redirect(url_for('gameboard'))
    if action == "join":
        room_code = request.form.get('room-code')
        if room_code in rooms:
            room = rooms[room_code]
            if room['members'] < 2:
             creator_color =rooms[room_code]['color']
             print("color of the creator is:" , creator_color) # Default to white if color is not set
        
             session['room'] = room_code
             session['name'] = name
             session['opponent'] = room.get('creator', 'player')
             session['opponent'] = opponent
             session['hardness'] = 1
             session['color'] ='b' if creator_color == 'w' else 'w'
             return redirect(url_for('gameboard'))
            else:
                # Room is full
             error_message = 'Room is full now . Please try again.'
             return render_template('game.html', error_message=error_message, bots=bots)
        else:
            # Room code doesn't exist
            error_message = 'Room code does not exist. Please try again.'
            return render_template('game.html', error_message=error_message, bots=bots)
    return redirect(url_for('index'))  


'''
# @app.route('/game', methods=['POST'])
# def game():
#     """Handle the game route."""
#     socketio.emit('my response', {'data': 'Entered a game'})
#     return redirect("/")
'''

@app.route('/game', methods=['GET', 'POST'])
def game():
    '''
    print("\n\n choose a game \n\n")
    session.clear()
    if request.method == 'POST':
        handle_get_request()
        #return handle_post_request()

    else:
        handle_get_request()'''
    if request.form:
        game_type = request.form
        selected_value = game_type.get('selected_value')

        returning = handle_bot_post_request("w","our ai",1) if selected_value == "chess_bot" else handle_player_post_request('w') 
    else:
        returning = render_template('game.html', bots=bots)
    return returning

@app.route('/gameboard', methods=['GET', 'POST'])
def gameboard():
    room = session["room"]
    name = session["name"]
    opponent = session["opponent"]
    hardness = session['hardness']
    color = session['color']
    
    

    if not room or not name or room not in rooms:
        print(' there is no room ')
        return redirect(url_for("game"))
    
    if rooms[room]["members"]>1 and opponent != "bot":
        print(' room is full ')
        return redirect(url_for("game"))
    
    if rooms[room]["members"]>0 and opponent == "bot":
        print(' room is full ')
        return redirect(url_for("game"))
    
    print("the session is : ",room,"name",name,"opponent",opponent,"hardness",hardness)
    return render_template('gameboard.html',room=room,name=name,opponent=opponent,hardness=hardness,color=color)

"""
@app.route('/game_bot',methods=['POST'])
def update_content():
    # selected_value = request.form['selected_value']
    opponent =  "bot" 
    if request.method=='POST':
        return render_template("index.html",opponent= opponent,init_state =current_state)
    else:
        return redirect('/')

@app.route('/game_bot',methods=['GET'])
def gamebot():
    return 


@app.route('/game_player',methods=['POST'])
def update_content():
    # selected_value = request.form['selected_value']
    opponent =  "player"
    if request.method=='POST':
        return render_template("index.html",opponent= opponent,init_state =current_state)
    else:
        return redirect('/')

@app.route('/room',methods=['GET'])
def room():
    room = session['room']
    return render_template('room.html', code=room)# board here
"""

def handle_bot_post_request(color,opponent,hardness):
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = GuestUser().username    
    
    # opponent = "bot"
    # code = request.form.get('code')
    # join = request.form.get('join')
    # create = request.form.get('create')
    
    if not name:
        name = "guest"
    
    room =  generate_unique_code(4)
    
    session['room'] = room
    session['name'] = name
    session['opponent'] = opponent
    session['hardness'] = hardness
    session['color'] = color

    rooms[room] = {'members': 0}
    return redirect(url_for('gameboard'))

def handle_player_post_request(color):
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = GuestUser().username   

    if not name:
        name = "guest"

    opponent = "player"

    room =  generate_unique_code(4)
    
    
    [room,color] = pick_room(room,color)
    
    # if room in rooms:
    #     [room,color] = pick_room(room,color)
    #     rooms[room] = {'members': 2 , 'color': color ,}
    # else :
    #     rooms[room] = {'members': 1 , 'color': color , 'creator': name }
    
    
    
    # rooms[room] = {'members': 1 , 'color': color , 'creator': name }

    
    session['room'] = room
    session['name'] = name
    session['opponent'] = opponent
    session['hardness'] = 1
    session['color'] = color

    rooms[room] = {'members': 0, 'color': color , 'creator': name }
    return redirect(url_for('gameboard'))

def handle_get_request():
    pass  # No specific handling for GET requests, just proceed to rendering the template


#while opponent is player you check if there is a room already in the queue? if yes pop(0) as the new room and continue normally with the color left on the room 
def pick_room(room,color,Force_add=False):
    if not queue or Force_add :
        queue.append([room,color])
        return [room,color]
    else :
        [room,color] = queue.pop(0)
        return [room,colors[color]]
    

"""
remove room when player is disconnected by this else regular
"""

def remove_room(roomtoremove):
    if [roomtoremove,"w"] in queue:
        queue.remove([roomtoremove,"w"])
        return
    elif[roomtoremove,"b"] in queue:
        queue.remove([roomtoremove,"b"])
        return

def register():
    form = RegisterForm(request.form)
    print(form.username.data)
    if request.method == 'POST' and form.validate_on_submit():
        avatar_index = random.randint(1, 5)
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_user = user(username=form.username.data, password=hashed_password, avatar_index=avatar_index)
        db.session.add(new_user)
        db.session.commit()
        ''''''
        user_obj = user.query.filter_by(username=form.username.data).first()
        if user_obj and bcrypt.check_password_hash(user_obj.password, form.password.data):
            login_user(user_obj) 
            # (f"tried to redirect to :{url_for('dashboard')} by :{redirect(url_for('dashboard'))}")
            return redirect(url_for("profile"))
        ''''''
        return redirect(url_for('login'))
    
    return render_template("login.html", form=form,register=True)       
########################################################################






if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
