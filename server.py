from flask import Flask, render_template, request, jsonify, Response, url_for

app = Flask(__name__)

# Application title
title = "Brush Strokes Digital Art"

@app.context_processor

def inject_title():
    return {'title': title}

# Brush definitions including description for view page
title = "Brush Strokes Digital Art"
brushes = [
    {"id": 1, "name": "HB Pencil",              "img": "hb_pencil.png",      "description": "The HB brush is ideal for sketching due to its natural, pressure-sensitive feel, like a traditional pencil."},
    {"id": 2, "name": "Oil Pastel",            "img": "oil.png",     "description": "Oil Pastel offers smooth blending and vibrant color transitions, mimicking traditional pastel textures."},
    {"id": 3, "name": "Procreate Pencil","img": "procreate_pencil.png","description": "Procreate Pencil delivers crisp, precise lines perfect for detailed work and fine shading."},
    {"id": 4, "name": "Narinder Pencil",  "img": "narinder.png", "description": "Narinder Pencil excels at light construction lines and initial form blocking."},
    {"id": 5, "name": "6B Pencil",              "img": "6b.png",      "description": "6B Pencil provides dark, expressive strokes with rich graphite texture for dramatic shading."},
    {"id": 6, "name": "Peppermint",            "img": "peppermint.png",     "description": "Peppermint responds beautifully to tilt and pressure, perfect for fluid, expressive strokes."},
]

# Quiz questions
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
            {"text": "The Peppermint brush offers <div id='blank1' class='drop-zone'></div> making it great for rougher-style sketching.", "drop_id": "blank1"},
            {"text": "While using the Peppermint brush, use <div id='blank2' class='drop-zone'></div> for shading.",            "drop_id": "blank2"},
            {"text": "The Narinder Pencil is used for <div id='blank3' class='drop-zone'></div> lines.",                     "drop_id": "blank3"},
            {"text": "The Oil Pastel is used for <div id='blank4' class='drop-zone'></div> lines.",                       "drop_id": "blank4"}
        ],
        "options": ["clean", "texture", "smudgy", "tilt"],
        "answer": {"blank1": "texture", "blank2": "tilt", "blank3": "clean", "blank4": "smudgy"}
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
            {"text": "Expressive, rougher sketch styles",    "drop_id": "match1"},
            {"text": "Basic sketching",                       "drop_id": "match2"},
            {"text": "Bold, painterly sketches",              "drop_id": "match3"},
            {"text": "Confident sketching or clean linework", "drop_id": "match4"}
        ],
        "options": ["Peppermint", "HB Pencil", "Oil Pastel", "Narinder Pencil"],
        "answer": {"match1": "Peppermint", "match2": "HB Pencil", "match3": "Oil Pastel", "match4": "Narinder Pencil"}
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
    return render_template('learn.html', brushes=brushes)

@app.route('/view_brush/<int:brush_id>')
def view_brush(brush_id):
    brush = next((b for b in brushes if b['id'] == brush_id), None)
    return render_template('viewbrush.html', brush=brush)

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/questions/<int:question_id>')
def questions_page(question_id):
    q = next((q for q in questions if q['id'] == question_id), None)
    if not q:
        return "Question not found", 404
    return render_template(
        'questions.html',
        question=q,
        total=len(questions)
    )

@app.route('/procreate')
def procreate():
    return render_template('procreate.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)