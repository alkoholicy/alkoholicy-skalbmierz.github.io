document.addEventListener('DOMContentLoaded', async () => {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            alert(`${item.querySelector('h2').textContent}`);
        });
        
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.5s ease-in-out';
        }, Math.random() * 1000); // Dodanie losowego opóźnienia do animacji
    });

    // Obsługa komentarzy
    let commentAdded = false; // Flag to track if a comment is already added
    const comments = [];
    
    window.addComment = async function() {
        if (!commentAdded) {
            const commentText = document.getElementById('commentText').value;
            const signature = document.getElementById('signature').value;

            if (commentText.trim() !== '') {
                const comment = `${signature}: ${commentText}`;
                await addDoc(collection(db, 'comments'), { text: comment });
                comments.push(comment);
                document.getElementById('commentText').value = '';
                document.getElementById('signature').value = '';
                displayComments();
                commentAdded = true;
            }
        } else {
            alert('Możesz dodać tylko jeden komentarz.');
        }
    }

    async function fetchComments() {
        const querySnapshot = await getDocs(collection(db, 'comments'));
        querySnapshot.forEach(doc => {
            comments.push(doc.data().text);
        });
        displayComments();
    }

    function displayComments() {
        const commentList = document.querySelector('.comment-list');
        commentList.innerHTML = comments.map(comment => `<div class="comment">${comment}</div>`).join('');
    }

    fetchComments();

    // Obsługa quizu
    window.submitQuiz = function() {
        const correctAnswers = {
            question1: 'Komornik',
            question2: 'Kobyłka',
            question3: 'Ajgor'
        };

        let score = 0;
        let totalQuestions = 3;

        for (const [question, correctAnswer] of Object.entries(correctAnswers)) {
            const selectedAnswer = document.querySelector(`input[name="${question}"]:checked`);
            if (selectedAnswer && selectedAnswer.value === correctAnswer) {
                score++;
            }
        }

        const resultElement = document.getElementById('quiz-result');
        resultElement.textContent = `Twój wynik: ${score} z ${totalQuestions}`;
    }
});
