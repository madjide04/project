from flask import Flask , render_template,request,redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

#not used yet
app = Flask(__name__)
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

#set reroute to classic chess later
@app.route('/game',methods=['POST'])
def update_content():
    if request.method=='POST':
        return render_template("index.html")
    else:
        return redirect('/')

if __name__ == "__main__":
    app.run(debug=True)


