from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)



# ROUTES

@app.route('/')
def default():
   return render_template('home.html')   

@app.route('/learn')
def learn():
   return render_template('learn.html')   

@app.route('/quiz')
def quiz():
   return render_template('quiz.html')   

@app.route('/procreate')
def procreate():
   return render_template('procreate.html')   



if __name__ == '__main__':
   app.run(debug = True, port=5001)