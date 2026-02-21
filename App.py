from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'quiz-secret-key'

# Хранилище пользователей (в памяти)
users_db = {}

sample_quizzes = [
    {
        'id': 1,
        'title': 'Какой ты аниме-персонаж?',
        'description': 'Узнай, на кого из аниме-персонажей ты похож',
        'questions': [
            {
                'text': 'Твой любимый цвет?',
                'answers': [
                    {'text': 'Красный', 'character': 'Наруто'},
                    {'text': 'Синий', 'character': 'Саске'},
                    {'text': 'Розовый', 'character': 'Хината'}
                ]
            },
            {
                'text': 'Что любишь делать на выходных?',
                'answers': [
                    {'text': 'Заниматься спортом', 'character': 'Наруто'},
                    {'text': 'Читать книги', 'character': 'Саске'},
                    {'text': 'Готовить', 'character': 'Хината'}
                ]
            }
        ]
    },
    {
        'id': 2,
        'title': 'Твой стиль в играх',
        'description': 'Какой ты игрок?',
        'questions': [
            {
                'text': 'Какую роль выбираешь?',
                'answers': [
                    {'text': 'Танк', 'character': 'Воин'},
                    {'text': 'ДД', 'character': 'Маг'},
                    {'text': 'Хилер', 'character': 'Лекарь'}
                ]
            }
        ]
    }
]

# 1. ГЛАВНАЯ СТРАНИЦА - все квизы
@app.route('/')
def index():
    return render_template('index.html', quizzes=sample_quizzes)

# 2. ПРОХОЖДЕНИЕ КВИЗА
@app.route('/quiz/<int:quiz_id>', methods=['GET', 'POST'])
def take_quiz(quiz_id):
    quiz = next((q for q in sample_quizzes if q['id'] == quiz_id), None)
    if not quiz:
        flash('Квиз не найден!', 'error')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        
        answers = []
        for i, question in enumerate(quiz['questions']):
            answer_index = request.form.get(f'q{i}', type=int)
            if answer_index is not None and 0 <= answer_index < len(question['answers']):
                answers.append(question['answers'][answer_index]['character'])
        
        # самый частый персонаж
        if answers:
            result = max(set(answers), key=answers.count)
        else:
            result = 'Не определен'
        
        
        username = session.get('username')
        if username and username in users_db:
            users_db[username]['last_quiz'] = quiz['title']
            users_db[username]['last_result'] = result
        
        flash(f'Результат: {result}!', 'success')
        return redirect(url_for('profile'))
    
    return render_template('quiz.html', quiz=quiz)

# 3. ФОРМА СОЗДАНИЯ ПРОФИЛЯ
@app.route('/form', methods=['GET', 'POST'])
def create_profile():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        
        if not username:
            flash('Введите имя пользователя!', 'error')
            return render_template('form.html')
        
        users_db[username] = {
            'username': username,
            'email': email,
            'last_quiz': None,
            'last_result': None
        }
        session['username'] = username
        
        flash(f'Профиль {username} создан!', 'success')
        return redirect(url_for('profile'))
    
    return render_template('form.html')

# 4. ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
@app.route('/profile')
def profile():
    username = session.get('username')
    
    if not username or username not in users_db:
        flash('Сначала создайте профиль!', 'warning')
        return redirect(url_for('create_profile'))
    
    user_data = users_db[username]
    return render_template('profile.html', user=user_data)

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('Вы вышли из профиля', 'info')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)