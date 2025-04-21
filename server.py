from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
app = Flask(__name__)

questions = [
    {
        "id": 1,
        "type": "multiple_choice",
        "text": "Which brush is used in the shown clip?",
        "options": ["Narinder Pencil", "Peppermint", "6B Pencil", "Oil Pastel"],
        "answer": "Oil Pastel"
    },
    {
        "id": 2,
        "type": "fill_in_the_blanks",
        "text": "Fill in the blanks using the word bank to complete the statements.",
        "sentences": [
            {
                "text": "The Peppermint brush offers <div id='blank1' class='drop-zone'></div> making it great for rougher-style sketching.",
                "drop_id": "blank1"
            },
            {
                "text": "While using the Peppermint brush, use <div id='blank2' class='drop-zone'></div> for shading.",
                "drop_id": "blank2"
            },
            {
                "text": "The Narinder Pencil is used for <div id='blank3' class='drop-zone'></div> lines.",
                "drop_id": "blank3"
            },
            {
                "text": "The Oil Pastel is used for <div id='blank4' class='drop-zone'></div> lines.",
                "drop_id": "blank4"
            }
        ],
        "options": ["clean", "texture", "smudgy", "tilt"],
        "answer": {
            "blank1": "texture",
            "blank2": "tilt",
            "blank3": "clean",
            "blank4": "smudgy"
        }
    },
    {
        "id": 3,
        "type": "multiple_choice",
        "text": "Which brush is best for light, initial construction lines before adding detail?",
        "options": ["Narinder Pencil", "6B Pencil", "HB Pencil", "Procreate Pencil"],
        "answer": "HB Pencil"
    },
    {
        "id": 4,
        "type": "matching",
        "text": "Match each scenario to the most suitable brush for the task.",
        "prompts": [
            {
                "text": "Expressive, rougher sketch styles",
                "drop_id": "match1"
            },
            {
                "text": "Basic sketching",
                "drop_id": "match2"
            },
            {
                "text": "Bold, painterly sketches",
                "drop_id": "match3"
            },
            {
                "text": "Confident sketching or clean linework",
                "drop_id": "match4"
            }
        ],
        "options": ["Peppermint", "HB Pencil", "Oil Pastel", "Narinder Pencil"],
        "answer": {
            "match1": "Peppermint",
            "match2": "HB Pencil",
            "match3": "Oil Pastel",
            "match4": "Narinder Pencil"
        }
    },
    {
        "id": 5,
        "type": "multiple_choice",
        "text": "You’re sketching a rough pose and want the brush to respond well to tilt for expressive lines. Which brush do you choose?",
        "options": ["HB Pencil", "Oil Pastel", "Narinder Pencil", "Peppermint"],
        "answer": "Peppermint"
    },
    {
        "id": 6,
        "type": "multiple_choice",
        "text": "Identify the brush used for this sketch.",
        "options": ["HB Pencil", "Procreate Pencil", "Oil Pastel", "6B Pencil"],
        "answer": "HB Pencil"
    }
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