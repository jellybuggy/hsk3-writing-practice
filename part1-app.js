// HSK3 Writing Part 1 - Word Ordering App
console.log("part1-app.js loaded");

var questions = window.hsk3WritingPart1Questions;
console.log("Part1 questions loaded:", questions?.length);

var currentDay = 1;
var currentIndex = 0;
var dayQuestions = [];
var correctCount = 0;
var selectedWords = [];  // Words in answer area
var shuffledWords = [];  // Available words (shuffled)

function shuffleArray(array) {
  var arr = array.slice();
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function normalizeAnswer(str) {
  // Remove spaces, Chinese punctuation, English punctuation
  return str.replace(/[\s，。！？，、；：""''（）【】《》]/g, '');
}

function startDay(day) {
  currentDay = day;
  currentIndex = 0;
  correctCount = 0;
  dayQuestions = questions.filter(function(q) { return q.day === day; });
  console.log("Day", day, "questions:", dayQuestions.length);

  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('scoreView').classList.add('hidden');
  document.getElementById('practiceView').classList.remove('hidden');
  document.getElementById('progressText').textContent = '1 / ' + dayQuestions.length;

  showQuestion();
}

function showQuestion() {
  var q = dayQuestions[currentIndex];
  console.log("Showing question", currentIndex + 1, q.id);

  selectedWords = [];
  shuffledWords = shuffleArray(q.words);

  document.getElementById('questionNumber').textContent = '第 ' + (currentIndex + 1) + ' 题';
  document.getElementById('resultArea').innerHTML = '';
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('checkBtn').disabled = false;
  document.getElementById('undoBtn').disabled = false;
  document.getElementById('clearBtn').disabled = false;

  renderWords();
}

function renderWords() {
  var wordsArea = document.getElementById('wordsArea');
  var answerArea = document.getElementById('answerArea');

  // Available words (not selected)
  wordsArea.innerHTML = '';
  shuffledWords.forEach(function(word, idx) {
    if (selectedWords.indexOf(word) === -1) {
      var btn = document.createElement('button');
      btn.className = 'word-btn';
      btn.textContent = word;
      btn.addEventListener('click', function() { selectWord(word); });
      wordsArea.appendChild(btn);
    }
  });

  // Selected words (in answer)
  answerArea.innerHTML = '';
  selectedWords.forEach(function(word, idx) {
    var btn = document.createElement('button');
    btn.className = 'answer-word';
    btn.textContent = word;
    btn.addEventListener('click', function() { removeWord(idx); });
    answerArea.appendChild(btn);
  });
}

function selectWord(word) {
  selectedWords.push(word);
  renderWords();
}

function removeWord(index) {
  selectedWords.splice(index, 1);
  renderWords();
}

function undoWord() {
  if (selectedWords.length > 0) {
    selectedWords.pop();
    renderWords();
  }
}

function clearAnswer() {
  selectedWords = [];
  renderWords();
}

function checkAnswer() {
  var q = dayQuestions[currentIndex];
  var userAnswer = selectedWords.join('').trim();
  var correctAnswer = q.answer;
  var isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

  console.log("Check answer:", userAnswer, "correct:", isCorrect);

  if (isCorrect) {
    correctCount++;
  }

  document.getElementById('checkBtn').disabled = true;
  document.getElementById('undoBtn').disabled = true;
  document.getElementById('clearBtn').disabled = true;
  document.getElementById('nextBtn').disabled = false;

  var resultArea = document.getElementById('resultArea');
  if (isCorrect) {
    resultArea.innerHTML = '<div class="result correct"><div class="result-title">✓ 回答正确！</div><div class="result-detail">' + correctAnswer + '</div><div class="grammar">语法点：' + q.grammarPoint + '</div></div>';
  } else {
    resultArea.innerHTML = '<div class="result wrong"><div class="result-title">✗ 回答错误</div><div class="result-detail">正确答案：<span class="correct-answer">' + correctAnswer + '</span><br>你的答案：' + userAnswer + '</div><div class="grammar">语法点：' + q.grammarPoint + '</div></div>';
  }
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= dayQuestions.length) {
    showScore();
  } else {
    document.getElementById('progressText').textContent = (currentIndex + 1) + ' / ' + dayQuestions.length;
    showQuestion();
  }
}

function showScore() {
  document.getElementById('practiceView').classList.add('hidden');
  document.getElementById('scoreView').classList.remove('hidden');

  var total = dayQuestions.length;
  var percentage = Math.round((correctCount / total) * 100);
  document.getElementById('scoreTitle').textContent = 'Day ' + currentDay + ' 练习完成！';
  document.getElementById('scoreNumber').textContent = correctCount + '/' + total;
  document.getElementById('scoreDetail').textContent = '正确率 ' + percentage + '%';
}

function restartDay() {
  startDay(currentDay);
}

function goHome() {
  document.getElementById('practiceView').classList.add('hidden');
  document.getElementById('scoreView').classList.add('hidden');
  document.getElementById('homeView').classList.remove('hidden');
}

// Bind events
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded");

  // Day buttons
  document.querySelectorAll('.day-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      startDay(parseInt(this.getAttribute('data-day')));
    });
  });

  // Control buttons
  document.getElementById('undoBtn').addEventListener('click', undoWord);
  document.getElementById('clearBtn').addEventListener('click', clearAnswer);
  document.getElementById('checkBtn').addEventListener('click', checkAnswer);
  document.getElementById('nextBtn').addEventListener('click', nextQuestion);

  // Navigation
  document.getElementById('backToDayBtn').addEventListener('click', goHome);
  document.getElementById('backHomeBtn').addEventListener('click', goHome);
  document.getElementById('restartBtn').addEventListener('click', restartDay);
  document.getElementById('homeBtn').addEventListener('click', goHome);

  console.log("All events bound");
});