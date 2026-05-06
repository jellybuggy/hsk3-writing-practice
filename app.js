// HSK3 Writing Part 2 Practice App
console.log("app.js loaded");

// Get questions from window object
const questions = window.hsk3WritingPart2Questions;
console.log("questions loaded", questions?.length);

let currentDay = 1;
let currentIndex = 0;
let dayQuestions = [];
let correctCount = 0;

function startDay(day) {
  console.log("startDay called with day:", day);
  currentDay = day;
  currentIndex = 0;
  correctCount = 0;

  // Filter questions for this day
  dayQuestions = questions.filter(q => q.day === day);
  console.log("dayQuestions count:", dayQuestions.length);

  // Show practice view - hide home, hide score, show practice
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('scoreView').classList.add('hidden');
  document.getElementById('practiceView').classList.remove('hidden');

  // Update header
  document.getElementById('progressText').textContent = `1 / ${dayQuestions.length}`;

  // Show first question
  showQuestion();
}

function showQuestion() {
  const q = dayQuestions[currentIndex];
  console.log("showing question", currentIndex, q);

  // Update question number
  document.getElementById('questionNumber').textContent = `第 ${currentIndex + 1} 题`;

  // Update sentence - show pinyin hint
  document.getElementById('questionSentence').innerHTML = q.promptSentence;

  // Clear input and result
  document.getElementById('answerInput').value = '';
  document.getElementById('answerInput').disabled = false;
  document.getElementById('checkBtn').disabled = false;
  document.getElementById('resultArea').innerHTML = '';
  document.getElementById('nextBtn').classList.add('hidden');

  // Focus input
  document.getElementById('answerInput').focus();
}

function checkAnswer() {
  const input = document.getElementById('answerInput').value.trim();
  if (!input) return;

  const q = dayQuestions[currentIndex];
  const isCorrect = input === q.answer;
  console.log("checkAnswer:", input, "correct:", isCorrect, "expected:", q.answer);

  if (isCorrect) {
    correctCount++;
  }

  // Disable input and check button
  document.getElementById('answerInput').disabled = true;
  document.getElementById('checkBtn').disabled = true;

  // Show result
  const resultArea = document.getElementById('resultArea');
  if (isCorrect) {
    resultArea.innerHTML = `
      <div class="result correct">
        <div class="result-title">✓ 回答正确！</div>
        <div class="result-detail">${q.fullSentence}</div>
      </div>
    `;
  } else {
    resultArea.innerHTML = `
      <div class="result wrong">
        <div class="result-title">✗ 回答错误</div>
        <div class="result-detail">
          正确答案：<span class="correct-answer">${q.answer}</span><br>
          完整句子：${q.fullSentence}
        </div>
      </div>
    `;
  }

  // Show next button
  document.getElementById('nextBtn').classList.remove('hidden');
  document.getElementById('nextBtn').textContent = currentIndex < dayQuestions.length - 1 ? '下一题 →' : '查看成绩 →';
}

function nextQuestion() {
  currentIndex++;
  console.log("nextQuestion, currentIndex:", currentIndex, "total:", dayQuestions.length);

  if (currentIndex >= dayQuestions.length) {
    showScore();
  } else {
    // Update progress
    document.getElementById('progressText').textContent = `${currentIndex + 1} / ${dayQuestions.length}`;
    showQuestion();
  }
}

function showScore() {
  console.log("showScore, correctCount:", correctCount);
  document.getElementById('practiceView').classList.add('hidden');
  document.getElementById('scoreView').classList.remove('hidden');

  const total = dayQuestions.length;
  const percentage = Math.round((correctCount / total) * 100);

  document.getElementById('scoreTitle').textContent = `Day ${currentDay} 练习完成！`;
  document.getElementById('scoreNumber').textContent = `${correctCount}/${total}`;
  document.getElementById('scoreDetail').textContent = `正确率 ${percentage}%`;
}

function restartDay() {
  console.log("restartDay called");
  startDay(currentDay);
}

function goHome() {
  console.log("goHome called");
  document.getElementById('practiceView').classList.add('hidden');
  document.getElementById('scoreView').classList.add('hidden');
  document.getElementById('homeView').classList.remove('hidden');
}

// Wait for DOM to be ready, then bind all events
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded fired");

  // Bind Day buttons
  const dayBtns = document.querySelectorAll('.day-btn');
  console.log("Found", dayBtns.length, "day buttons");
  dayBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const day = parseInt(this.getAttribute('data-day'));
      console.log("Day button clicked, day:", day);
      startDay(day);
    });
  });

  // Bind check button
  document.getElementById('checkBtn').addEventListener('click', checkAnswer);

  // Bind next button
  document.getElementById('nextBtn').addEventListener('click', nextQuestion);

  // Bind back button
  document.getElementById('backBtn').addEventListener('click', goHome);

  // Bind restart button
  document.getElementById('restartBtn').addEventListener('click', restartDay);

  // Bind home button
  document.getElementById('homeBtn').addEventListener('click', goHome);

  // Handle Enter key in input
  document.getElementById('answerInput').addEventListener('keypress', function(e) {
    console.log("keypress:", e.key);
    if (e.key === 'Enter') {
      const btn = document.getElementById('checkBtn');
      if (!btn.disabled) {
        checkAnswer();
      }
    }
  });

  console.log("All events bound");
});