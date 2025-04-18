from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

questions = [
    {"id": 1, "text": "Which brush is used in the shown clip?", "options": ["Narinder Pencil", "Peppermint", "6B Pencil", "Oil Pastel"], "answer": "Oil Pastel"},
    {"id": 2, "text": "Fill in the blanks using the word bank to complete the statements.", "options": [], "answer": ""},
    {"id": 3, "text": "Which brush is best for light, initial construction lines before adding detail?", "options": [], "answer": ""},
    {"id": 4, "text": "Match each scenario to the most suitable brush for the task.", "options": [], "answer": ""},
    {"id": 5, "text": "You’re sketching a rough pose and want the brush to respond well to tilt for expressive lines. Which brush do you choose?", "options": [], "answer": ""},
    {"id": 6, "text": "Identify the brush used for this sketch.", "options": [], "answer": ""},
]



# ROUTES

@app.route('/')
def default():
   return render_template('home.html')   

@app.route('/learn')
def learn():
   return render_template('learn.html')   

@app.route('/view_brush/<int:brush_id>')
def view_brush(brush_id):
   return render_template('viewbrush.html')

@app.route('/quiz')
def quiz():
   return render_template('quiz.html')   

@app.route('/view_question/<int:question_id>')
def view_question(question_id):
   return render_template('viewquestion.html')   

@app.route('/procreate')
def procreate():
   return render_template('procreate.html')   



if __name__ == '__main__':
   app.run(debug = True, port=5001)