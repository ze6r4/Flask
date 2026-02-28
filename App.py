from flask import Flask, render_template, request

app = Flask(__name__)

user_data = {}

characters = [
    {
        "id": "nick",
        "name": "Ник Кинг",
        "description": "Студент, 26 лет, любит спокойствие и тишину, но не против иногда повеселиться с друзьями"
    },
    {
        "id": "kris",
        "name": "Крис Робинсон",
        "description": "Очень активная веселая девушка 25 лет. Постоянно устраивает вечеринки"
    },
    {
        "id": "night",
        "name": "Найт Форсберг",
        "description": "Тату-мастер из богатой семьи, 27 лет. До сих пор выглядит как подросток"
    },
    {
        "id": "nightmare",
        "name": "Найтмер Кинг",
        "description": "Преподаватель литературы и истории, ему очень много лет.. Вредный и ранимый"
    }
]



@app.route('/')
def index():
    return render_template('index.html', characters=characters)


@app.route('/profile', methods=['GET', 'POST'])
def profile():
    global user_data

    # "Изменить данные"
    if request.method == 'GET' and request.args.get('edit') == '1':
        user_data.clear()

    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')

        user_data['name'] = name
        user_data['email'] = email

    return render_template('profile.html', user=user_data)


if __name__ == '__main__':
    app.run(debug=True)