from flask import Flask, render_template, url_for

app = Flask(__name__)

# Brush definitions including description for view page
title = "Brush Strokes Digital Art"
brushes = [
    {"id": 1, "name": "HB Pencil",       "img": "hb_pencil.png",      "description": "The HB brush is ideal for sketching due to its natural, pressure-sensitive feel, like a traditional pencil."},
    {"id": 2, "name": "Oil Pastel",      "img": "oil.png",     "description": "Oil Pastel offers smooth blending and vibrant color transitions, mimicking traditional pastel textures."},
    {"id": 3, "name": "Procreate Pencil","img": "procreate_pencil.png","description": "Procreate Pencil delivers crisp, precise lines perfect for detailed work and fine shading."},
    {"id": 4, "name": "Narinder Pencil", "img": "narinder.png", "description": "Narinder Pencil excels at light construction lines and initial form blocking."},
    {"id": 5, "name": "6B Pencil",       "img": "6b.png",      "description": "6B Pencil provides dark, expressive strokes with rich graphite texture for dramatic shading."},
    {"id": 6, "name": "Peppermint",      "img": "peppermint.png",     "description": "Peppermint responds beautifully to tilt and pressure, perfect for fluid, expressive strokes."},
]

@app.context_processor
def inject_title():
    return { 'title': title }

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

@app.route('/view_question/<int:question_id>')
def view_question(question_id):
    return render_template('viewquestion.html')

@app.route('/procreate')
def procreate():
    return render_template('procreate.html')

if __name__ == '__main__':
    app.run(debug=True, port=5002)
