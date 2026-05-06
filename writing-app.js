// HSK3 Writing Combined Practice App
console.log("writing-app.js loaded");

// Get questions from window object
var part1Questions = window.hsk3WritingPart1Questions;
var part2Questions = window.hsk3WritingPart2Questions;
console.log("Part1 questions:", part1Questions?.length);
console.log("Part2 questions:", part2Questions?.length);

// State
var currentDay = 1;
var currentPart = 1; // 1 or 2
var currentPart1Index = 0;
var currentPart2Index = 0;
var part1DayQuestions = [];
var part2DayQuestions = [];
var part1CorrectCount = 0;
var part2CorrectCount = 0;

// Part1 specific state
var selectedWords = [];
var shuffledWords = [];

// Helper functions
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
  return str.replace(/[\s，。！？，、；：""''（）【】《》.!?,\s]/g, '');
}

function getPart1QuestionCount(day) {
  return part1Questions.filter(function(q) { return q.day === day; }).length;
}

function getPart2QuestionCount(day) {
  return part2Questions.filter(function(q) { return q.day === day; }).length;
}

// Start Day
function startDay(day) {
  currentDay = day;
  currentPart = 1;
  currentPart1Index = 0;
  currentPart2Index = 0;
  part1CorrectCount = 0;
  part2CorrectCount = 0;

  part1DayQuestions = part1Questions.filter(function(q) { return q.day === day; });
  part2DayQuestions = part2Questions.filter(function(q) { return q.day === day; });

  console.log("Day", day, "Part1:", part1DayQuestions.length, "Part2:", part2DayQuestions.length);

  // Show practice view
  document.getElementById('homeView').classList.add('hidden');
  document.getElementById('scoreView').classList.add('hidden');
  document.getElementById('practiceView').classList.remove('hidden');

  // Update progress
  updateProgress();

  // Show Part1 by default
  showPart1();
}

// Update progress text
function updateProgress() {
  var text = 'Day ' + currentDay + ' - ';
  if (currentPart === 1) {
    text += 'Part1 ' + (currentPart1Index + 1) + '/' + part1DayQuestions.length;
  } else {
    text += 'Part2 ' + (currentPart2Index + 1) + '/' + part2DayQuestions.length;
  }
  document.getElementById('progressText').textContent = text;
}

// Switch between Part1 and Part2
function switchPart(part) {
  currentPart = part;

  // Update button states
  document.getElementById('part1Btn').classList.toggle('active', part === 1);
  document.getElementById('part2Btn').classList.toggle('active', part === 2);

  // Show/hide areas
  document.getElementById('part1Area').classList.toggle('hidden', part !== 1);
  document.getElementById('part2Area').classList.toggle('hidden', part !== 2);

  updateProgress();

  if (part === 1) {
    showPart1Question();
  } else {
    showPart2Question();
  }
}

// Show Part1 question
function showPart1Question() {
  if (currentPart1Index >= part1DayQuestions.length) {
    // Part1 done, check if Part2 done too
    if (currentPart2Index >= part2DayQuestions.length) {
      showScore();
    } else {
      switchPart(2);
    }
    return;
  }

  var q = part1DayQuestions[currentPart1Index];
  selectedWords = [];
  shuffledWords = shuffleArray(q.words);

  document.getElementById('part1QuestionNumber').textContent = '第 ' + (currentPart1Index + 1) + ' 题';
  document.getElementById('resultArea').innerHTML = '';
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('checkBtn').disabled = false;
  document.getElementById('undoBtn').disabled = false;
  document.getElementById('clearBtn').disabled = false;

  renderWords();
  updateProgress();
}

// Show Part2 question
function showPart2Question() {
  if (currentPart2Index >= part2DayQuestions.length) {
    showScore();
    return;
  }

  var q = part2DayQuestions[currentPart2Index];
  document.getElementById('part2QuestionNumber').textContent = '第 ' + (currentPart2Index + 1) + ' 题';
  document.getElementById('part2QuestionSentence').innerHTML = q.promptSentence;
  document.getElementById('part2AnswerInput').value = '';
  document.getElementById('part2AnswerInput').disabled = false;
  document.getElementById('part2CheckBtn').disabled = false;
  document.getElementById('part2ResultArea').innerHTML = '';
  document.getElementById('part2NextBtn').disabled = true;
  document.getElementById('part2AnswerInput').focus();
  updateProgress();
}

// Render Part1 words
function renderWords() {
  var wordsArea = document.getElementById('wordsArea');
  var answerArea = document.getElementById('answerArea');

  wordsArea.innerHTML = '';
  shuffledWords.forEach(function(word) {
    if (selectedWords.indexOf(word) === -1) {
      var btn = document.createElement('button');
      btn.className = 'word-btn';
      btn.textContent = word;
      btn.addEventListener('click', function() { selectWord(word); });
      wordsArea.appendChild(btn);
    }
  });

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

// Part1 actions
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

function checkPart1Answer() {
  var q = part1DayQuestions[currentPart1Index];
  var userAnswer = selectedWords.join('');
  var isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(q.answer);

  console.log("Part1 check:", userAnswer, "correct:", isCorrect);

  if (isCorrect) {
    part1CorrectCount++;
  }

  document.getElementById('checkBtn').disabled = true;
  document.getElementById('undoBtn').disabled = true;
  document.getElementById('clearBtn').disabled = true;
  document.getElementById('nextBtn').disabled = false;

  var resultArea = document.getElementById('resultArea');
  if (isCorrect) {
    resultArea.innerHTML = '<div class="result correct"><div class="result-title">✓ 回答正确！</div><div class="result-detail">' + q.answer + '</div><div class="grammar">语法点：' + q.grammarPoint + '</div></div>';
  } else {
    resultArea.innerHTML = '<div class="result wrong"><div class="result-title">✗ 回答错误</div><div class="result-detail">正确答案：<span class="correct-answer">' + q.answer + '</span><br>你的答案：' + userAnswer + '</div><div class="grammar">语法点：' + q.grammarPoint + '</div></div>';
  }
}

function nextPart1Question() {
  currentPart1Index++;
  if (currentPart1Index >= part1DayQuestions.length) {
    // Switch to Part2
    currentPart2Index = 0;
    switchPart(2);
  } else {
    showPart1Question();
  }
}

// Part2 actions
function checkPart2Answer() {
  var q = part2DayQuestions[currentPart2Index];
  var input = document.getElementById('part2AnswerInput').value.trim();
  if (!input) return;

  var isCorrect = input === q.answer;
  console.log("Part2 check:", input, "correct:", isCorrect, "expected:", q.answer);

  if (isCorrect) {
    part2CorrectCount++;
  }

  document.getElementById('part2AnswerInput').disabled = true;
  document.getElementById('part2CheckBtn').disabled = true;
  document.getElementById('part2NextBtn').disabled = false;

  var resultArea = document.getElementById('part2ResultArea');
  if (isCorrect) {
    resultArea.innerHTML = '<div class="result correct"><div class="result-title">✓ 回答正确！</div><div class="result-detail">' + q.fullSentence + '</div></div>';
  } else {
    resultArea.innerHTML = '<div class="result wrong"><div class="result-title">✗ 回答错误</div><div class="result-detail">正确答案：<span class="correct-answer">' + q.answer + '</span><br>完整句子：' + q.fullSentence + '</div></div>';
  }
}

function nextPart2Question() {
  currentPart2Index++;
  if (currentPart2Index >= part2DayQuestions.length) {
    showScore();
  } else {
    showPart2Question();
  }
}

// Show score
function showScore() {
  document.getElementById('practiceView').classList.add('hidden');
  document.getElementById('scoreView').classList.remove('hidden');

  var part1Total = part1DayQuestions.length;
  var part2Total = part2DayQuestions.length;
  var part1Percent = Math.round((part1CorrectCount / part1Total) * 100);
  var part2Percent = Math.round((part2CorrectCount / part2Total) * 100);

  document.getElementById('scoreTitle').textContent = 'Day ' + currentDay + ' 练习完成！';
  document.getElementById('scoreNumber').innerHTML =
    '<div>Part1: ' + part1CorrectCount + '/' + part1Total + ' (' + part1Percent + '%)</div>' +
    '<div style="margin-top:8px;">Part2: ' + part2CorrectCount + '/' + part2Total + ' (' + part2Percent + '%)</div>';
  document.getElementById('scoreDetail').textContent = '正确率';
}

function restartDay() {
  startDay(currentDay);
}

function goHome() {
  document.getElementById('practiceView').classList.add('hidden');
  document.getElementById('scoreView').classList.add('hidden');
  document.getElementById('homeView').classList.remove('hidden');
}

function showPart1() {
  switchPart(1);
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

  // Module switch buttons
  document.getElementById('part1Btn').addEventListener('click', function() { switchPart(1); });
  document.getElementById('part2Btn').addEventListener('click', function() { switchPart(2); });

  // Part1 control buttons
  document.getElementById('undoBtn').addEventListener('click', undoWord);
  document.getElementById('clearBtn').addEventListener('click', clearAnswer);
  document.getElementById('checkBtn').addEventListener('click', checkPart1Answer);
  document.getElementById('nextBtn').addEventListener('click', nextPart1Question);

  // Part2 control buttons
  document.getElementById('part2CheckBtn').addEventListener('click', checkPart2Answer);
  document.getElementById('part2NextBtn').addEventListener('click', nextPart2Question);

  // Navigation buttons
  document.getElementById('backToDayBtn').addEventListener('click', goHome);
  document.getElementById('backHomeBtn').addEventListener('click', goHome);
  document.getElementById('restartBtn').addEventListener('click', restartDay);
  document.getElementById('homeBtn').addEventListener('click', goHome);

  // Enter key for Part2 input
  document.getElementById('part2AnswerInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      var btn = document.getElementById('part2CheckBtn');
      if (!btn.disabled) {
        checkPart2Answer();
      }
    }
  });

  console.log("All events bound");
});