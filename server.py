from flask import Flask, render_template, request, jsonify, Response, url_for

app = Flask(__name__)

# Brush data for the Learn page
brushes = [
    {"id": 1, "name": "HB Pencil", "img": "hb_pencil.png"},
    {"id": 2, "name": "Oil Pastel", "img": "oil.png"},
    {"id": 3, "name": "Procreate Pencil", "img": "procreate_pencil.png"},
    {"id": 4, "name": "Narinder Pencil", "img": "narinder.png"},
    {"id": 5, "name": "6B Pencil", "img": "6b.png"},
    {"id": 6, "name": "Peppermint", "img": "peppermint.png"},
]

# Quiz questions
questions = [
    {"id": 1, "text": "Which brush is used in the shown clip?", "options": ["Narinder Pencil", "Peppermint", "6B Pencil", "Oil Pastel"], "answer": "Oil Pastel"},
    {"id": 2, "text": "Fill in the blanks using the word bank to complete the statements.", "options": [], "answer": ""},
    {"id": 3, "text": "Which brush is best for light, initial construction lines before adding detail?", "options": ["Narinder Pencil", "6B Pencil", "HB Pencil", "Procreate Pencil"], "answer": "HB Pencil"},
    {"id": 4, "text": "Match each scenario to the most suitable brush for the task.", "options": [], "answer": ""},
    {"id": 5, "text": "You’re sketching a rough pose and want the brush to respond well to tilt for expressive lines. Which brush do you choose?", "options": ["HB Pencil", "Oil Pastel", "Narinder Pencil", "Peppermint"], "answer": "Peppermint"},
    {"id": 6, "text": "Identify the brush used for this sketch.", "options": ["HB Pencil", "Procreate Pencil", "Oil Pastel", "6B Pencil"], "answer": "HB Pencil"},
]

# ROUTES
@app.route('/')
def default():
    return render_template('home.html')

@app.route('/learn')
def learn():
    # Build brush entries with full static URLs and link endpoints
    brush_data = []
    for b in brushes:
        b_copy = b.copy()
        # static media folder path
        b_copy['src'] = url_for('static', filename=f"media/{b['img']}")
        # link to view page
        b_copy['link'] = url_for('view_brush', brush_id=b['id'])
        brush_data.append(b_copy)
    return render_template('learn.html', brushes=brush_data)

@app.route('/view_brush/<int:brush_id>')
def view_brush(brush_id):
    brush = next((b for b in brushes if b['id'] == brush_id), None)
    return render_template('viewbrush.html', brush=brush)

@app.route('/quiz')
def quiz():
    return render_template('quiz.html', questions=questions)

@app.route('/view_question/<int:question_id>')
def view_question(question_id):
    question = next((q for q in questions if q['id'] == question_id), None)
    return render_template('viewquestion.html', question=question)

@app.route('/procreate')
def procreate():
    return render_template('procreate.html')

if __name__ == "__main__":
    app.run(debug=True, port=5001)
