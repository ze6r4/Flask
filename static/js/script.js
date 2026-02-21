// Динамическое добавление полей в форму создания квиза
document.addEventListener('DOMContentLoaded', function() {
    // Для формы создания квиза
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        // Добавление вопроса
        window.addQuestion = function() {
            const questionsContainer = document.getElementById('questions-container');
            const questionCount = questionsContainer.children.length;
            
            const questionHTML = `
            <div class="question-block" style="margin-bottom: 30px; padding: 20px; border: 3px solid #222; background: #FFEAA7;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0;">Вопрос #${questionCount + 1}</h3>
                    <button type="button" class="btn" onclick="removeQuestion(this)" 
                            style="background: #FFB6C1; padding: 5px 10px; font-size: 0.9rem;">
                        ✕ Удалить
                    </button>
                </div>
                <div class="form-group">
                    <label>Текст вопроса:</label>
                    <input type="text" name="question_${questionCount}" 
                           placeholder="Например: Твой любимый цвет?" 
                           class="form-control" required>
                </div>
                
                <div class="answers-container" id="answers_${questionCount}">
                    <h4>Ответы:</h4>
                    <!-- Ответы будут добавляться здесь -->
                </div>
                
                <button type="button" class="btn" onclick="addAnswer(${questionCount})" 
                        style="background: #A8D8EA;">
                    + Добавить вариант ответа
                </button>
            </div>
            `;
            
            questionsContainer.insertAdjacentHTML('beforeend', questionHTML);
        };
        
        // Добавление ответа
        window.addAnswer = function(questionIndex) {
            const answersContainer = document.getElementById(`answers_${questionIndex}`);
            const answerCount = answersContainer.children.length - 1; // -1 для заголовка
            
            const answerHTML = `
            <div class="answer-option" style="margin-bottom: 10px;">
                <div style="flex-grow: 1;">
                    <input type="text" 
                           name="answer_${questionIndex}_${answerCount}" 
                           placeholder="Текст ответа" 
                           class="form-control"
                           style="margin-bottom: 10px;"
                           required>
                    <div class="answer-characters" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <div class="character-point">
                            <label>Персонаж А:</label>
                            <input type="number" name="points_${questionIndex}_${answerCount}_Персонаж А" 
                                   value="0" min="0" max="10" style="width: 60px;">
                        </div>
                        <div class="character-point">
                            <label>Персонаж Б:</label>
                            <input type="number" name="points_${questionIndex}_${answerCount}_Персонаж Б" 
                                   value="0" min="0" max="10" style="width: 60px;">
                        </div>
                        <div class="character-point">
                            <label>Персонаж В:</label>
                            <input type="number" name="points_${questionIndex}_${answerCount}_Персонаж В" 
                                   value="0" min="0" max="10" style="width: 60px;">
                        </div>
                    </div>
                </div>
                <button type="button" class="btn" onclick="removeAnswer(this)" 
                        style="background: #FFB6C1; padding: 5px 10px;">
                    ✕
                </button>
            </div>
            `;
            
            answersContainer.insertAdjacentHTML('beforeend', answerHTML);
        };
        
        // Удаление вопроса
        window.removeQuestion = function(button) {
            button.closest('.question-block').remove();
            // Обновляем номера вопросов
            updateQuestionNumbers();
        };
        
        // Удаление ответа
        window.removeAnswer = function(button) {
            button.closest('.answer-option').remove();
        };
        
        // Обновление номеров вопросов
        function updateQuestionNumbers() {
            const questions = document.querySelectorAll('.question-block');
            questions.forEach((block, index) => {
                const title = block.querySelector('h3');
                if (title) {
                    title.textContent = `Вопрос #${index + 1}`;
                }
                
                // Обновляем индексы в полях ввода
                const inputs = block.querySelectorAll('input[name^="question_"]');
                inputs.forEach(input => {
                    input.name = input.name.replace(/question_\d+/, `question_${index}`);
                });
            });
        }
        
        // Добавление персонажа
        window.addCharacter = function() {
            const charactersContainer = document.getElementById('characters-container');
            const charCount = charactersContainer.children.length;
            
            const charHTML = `
            <div class="character-block" style="margin-bottom: 15px; padding: 15px; border: 2px solid #222; background: #A8D8EA;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <h4 style="margin: 0;">Персонаж #${charCount + 1}</h4>
                    <button type="button" class="btn" onclick="removeCharacter(this)" 
                            style="background: #FFB6C1; padding: 5px 10px; font-size: 0.9rem;">
                        ✕
                    </button>
                </div>
                <div class="form-group">
                    <label>Имя персонажа:</label>
                    <input type="text" name="char_name_${charCount}" 
                           placeholder="Например: Наруто" 
                           class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Эмодзи (иконка):</label>
                    <input type="text" name="char_image_${charCount}" 
                           placeholder="🍜" 
                           class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Описание:</label>
                    <textarea name="char_desc_${charCount}" 
                              placeholder="Описание этого персонажа" 
                              class="form-control" 
                              rows="2"></textarea>
                </div>
            </div>
            `;
            
            charactersContainer.insertAdjacentHTML('beforeend', charHTML);
        };
        
        // Удаление персонажа
        window.removeCharacter = function(button) {
            button.closest('.character-block').remove();
            // Обновляем номера персонажей
            updateCharacterNumbers();
        };
        
        // Обновление номеров персонажей
        function updateCharacterNumbers() {
            const characters = document.querySelectorAll('.character-block');
            characters.forEach((block, index) => {
                const title = block.querySelector('h4');
                if (title) {
                    title.textContent = `Персонаж #${index + 1}`;
                }
            });
        }
    }
    
    // Анимация для кнопок ответов в квизе
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем выделение со всех кнопок
            answerButtons.forEach(b => b.style.backgroundColor = 'white');
            // Выделяем выбранную
            this.style.backgroundColor = '#FFEAA7';
            this.style.transform = 'translate(-2px, -2px)';
        });
    });
    
    // Автоматическое скрытие сообщений
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
    }, 5000);
});