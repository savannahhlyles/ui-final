from flask import Flask, render_template, request, abort

app = Flask(__name__)

# Application title
TITLE = "Brush Strokes Digital Art"

@app.context_processor
def inject_title():
    return {'title': TITLE}

# Brush definitions including description for view page
brushes = [
    {
        "id": 1,
        "name": "HB Pencil",
        "img": "hb_pencil.png",
        "description": "The HB brush is ideal for sketching due to its natural, pressure-sensitive feel, like a traditional pencil.",
        "slug": "hbpencilsketch.png",
        "messages": [
            "Light Pressure for Construction Line",
            "Hard Pressure for Definition and Proportion",
            "Use with Low Opacity for Natural Feel"
        ]
    },
    {
        "id": 2,
        "name": "Oil Pastel",
        "img": "oil.png",
        "description": "Oil Pastel offers smooth blending and vibrant color transitions, mimicking traditional pastel textures.",
        "slug": "oilpastelsketch.png",
        "messages": [
            "Use for Painterly Texture and Blending",
            "Build Up Color in Layers",
            "Try Smudging for a Blended Look"
        ]
    },
    {
        "id": 3,
        "name": "Procreate Pencil",
        "img": "procreate_pencil.png",
        "description": "Procreate Pencil delivers crisp, precise lines perfect for detailed work and fine shading.",
        "slug": "procreatepencilsketch.png",
        "messages": [
            "Used to Color or Paint your Sketch",
            "Change Opacity to Create Variety in the Precision of Lines",
            "Universal Brush for All Sketches"
        ]
    },
    {
        "id": 4,
        "name": "Narinder Pencil",
        "img": "narinder.png",
        "description": "Narinder Pencil excels at light construction lines and initial form blocking.",
        "slug": "narinderpencilsketch.png",
        "messages": [
            "Use for Final Sketch Pass or Line Refinement",
            "Perfect for Confident, Single-Stroke Lines",
            "Pair with a Light Sketch Underneath"
        ]
    },
    {
        "id": 5,
        "name": "6B Pencil",
        "img": "6b.png",
        "description": "6B Pencil provides dark, expressive strokes with rich graphite texture for dramatic shading.",
        "slug": "6Bpencilsketch.png",
        "messages": [
            "Create Loose Lines and Add Texture to Work",
            "Adds a Hand-Drawn Feel to Work",
            "Change Pressure Sensitivity for Small Details"
        ]
    },
    {
        "id": 6,
        "name": "Peppermint Pencil",
        "img": "peppermint.png",
        "description": "Peppermint responds beautifully to tilt and pressure, perfect for fluid, expressive strokes.",
        "slug": "peppermintpencilsketch.png",
        "messages": [
            "Use for Broad, Expressive Sketches",
            "Adjust Brush Size Mid-Sketch",
            "Play with Tilt for Shading"
        ]
    }
]

# Procreate Interface Structure

procreate_slides = [
        {"id": 1, "title": "Navigating the Procreate Interface","img": "/static/media/Procreate_interface/slide1.png","boxx": 66,"boxy": 30},
        {"id": 2, "title": "Click on the Plus & Select a Canvas","img": "/static/media/Procreate_interface/slide2.png","boxx": 73,"boxy": 12},
        {"id": 3, "title": "Explore Brushes & Click Sketching","img": "/static/media/Procreate_interface/slide3.png","boxx": 61,"boxy": 8},
        {"id": 4, "title": "Change Size","img": "/static/media/Procreate_interface/slide4.png","boxx":23 ,"boxy": 42},
        {"id": 5, "title": "Change Opacity","img": "/static/media/Procreate_interface/slide5.png","boxx":23 ,"boxy": 65},
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
            {"text": "While using the Peppermint brush, use <div id='blank2' class='drop-zone'></div> for shading.", "drop_id": "blank2"},
            {"text": "The Narinder Pencil is used for <div id='blank3' class='drop-zone'></div> lines.", "drop_id": "blank3"},
            {"text": "The Oil Pastel is used for <div id='blank4' class='drop-zone'></div> lines.", "drop_id": "blank4"}
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
        "answer": "HB Pencil",
        "img": "/static/media/quizimage.png"  # make sure this file exists

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
    # find index of current brush
    idx = next((i for i, b in enumerate(brushes) if b['id'] == brush_id), None)
    if idx is None:
        abort(404)
    # calculate next brush id if available
    next_brush_id = brushes[idx+1]['id'] if idx < len(brushes)-1 else None
    return render_template(
        'viewbrush.html',
        brush=brushes[idx],
        next_brush_id=next_brush_id
    )

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/questions/<int:question_id>')
def questions_page(question_id):
    q = next((q for q in questions if q['id'] == question_id), None)
    if not q:
        return "Question not found", 404
    return render_template('questions.html', question=q, total=len(questions))

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    data = request.get_json(force=True)
    user_answers = data.get('answers', {})
    total = len(questions)
    score = 0
    summary = []

    for q in questions:
        qid = str(q['id'])
        ua = user_answers.get(qid)

        if q['type'] == 'multiple_choice':
            correct = isinstance(ua, dict) and ua.get("selected") == q['answer']
            your_answer = ua.get("selected") if isinstance(ua, dict) else "None"
        else:
            correct = isinstance(ua, dict) and all(ua.get(k) == v for k, v in q['answer'].items())
            # Remove 'locked' key if present
            your_answer = {k: v for k, v in ua.items() if k != 'locked'} if isinstance(ua, dict) else "None"

        if correct:
            score += 1

        summary.append({
            'id': q['id'],
            'text': q['text'],
            'your_answer': your_answer,
            'correct_answer': q['answer'],
            'correct': correct
        })

    return render_template('quizresults.html', score=score, total=total, summary=summary)

@app.route('/procreate')
@app.route('/procreate/<int:slide_id>')
def procreate(slide_id = 1):
    slide = procreate_slides[slide_id-1]
    print(slide)
    return render_template('procreate.html', slide=slide)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
