// Audio elements
const audioContext = new AudioContext();

// Progress bar
const progressStatus = document.querySelector('.progress');

// Time options buttons
const allOptionBtns = document.querySelectorAll('.pomodoro-options button');
const btnPomodoroOption = document.querySelector('.btn-pomodoro');
const btnShortBreakOption = document.querySelector('.btn-short-break');
const btnLongBreakOption = document.querySelector('.btn-long-break');

// Time option timer
const timer = document.querySelector('.pomodoro-time');
const btnStartTimer = document.querySelector('.btn-start');

// Modal variables
const settingsModal = document.querySelector('.modal-settings');
const pomodoroField = document.querySelector('input#pomodoro');
const shortBreakField = document.querySelector('input#short-break');
const longBreakField = document.querySelector('input#long-break');
const btnOpenSettingsModal = document.querySelector('.btn-settings');
const btnCloseSettingsModal = document.querySelector('.btn-close');
const btnOkSettingsModal = document.querySelector('.btn-ok');

// Control variables
const controls = [
  { class: 'pomodoro-color', time: 25, },
  { class: 'short-break-color', time: 5, },
  { class: 'long-break-color', time: 15, },
];

const currentTime = {
  minutes: 0,
  seconds: 0,
};

let currentIndex;
let currentInterval;
let timerRunning = false;

// Functions
function closeSettingsModal() {
  settingsModal.classList.remove('active');
}

function openSettingsModal() {
  settingsModal.classList.add('active');
}

function playTimerSoundWhenStartAndFinish() {
  const oscillator = audioContext.createOscillator();
  const contextGain = audioContext.createGain();  
  oscillator.type = 'sine';
  oscillator.connect(contextGain);
  contextGain.connect(audioContext.destination);
  oscillator.start(0);
  contextGain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
}

function createTimePreview() {
  const { minutes, seconds } = currentTime;
  const preview = `${('0' + minutes).substr(-2)}:${('0' + seconds).substr(-2)}`;
  timer.textContent = preview;
}

function resetCurrentTime() {
  currentTime.minutes = controls[currentIndex].time;
  currentTime.seconds = 0;
}

function clearTimer() {
  btnStartTimer.classList.remove('active');
  btnStartTimer.textContent = 'Start';
  progressStatus.style.width = `0%`;
  clearInterval(currentInterval);
  timerRunning = false;
}

function finishTimer() {
  playTimerSoundWhenStartAndFinish();
  clearTimer();
  resetCurrentTime();  
  createTimePreview();
}

function executeTimerCountdown() {
  if (currentTime.seconds === 0) {
    --currentTime.minutes;
    currentTime.seconds = 60; 
  }
  --currentTime.seconds;
}

function updateProgressBarPercentage() {
  const totalTimeInSeconds = controls[currentIndex].time * 60;
  const currentTimeInSeconds = currentTime.minutes * 60 + currentTime.seconds;
  const progressPercentage = (totalTimeInSeconds - currentTimeInSeconds) 
    / totalTimeInSeconds * 100;
  progressStatus.style.width = `${progressPercentage}%`;
}

function runTimer() {
  updateProgressBarPercentage();
  executeTimerCountdown();
  
  const { minutes, seconds } = currentTime;
  const isTimeFinished = minutes === 0 && seconds === 0;
  if (isTimeFinished) finishTimer();

  createTimePreview();
}

function startTimer() {
  playTimerSoundWhenStartAndFinish();

  btnStartTimer.classList.add('active');
  btnStartTimer.textContent = 'Stop';

  currentInterval = setInterval(runTimer, 1000);
  timerRunning = true;
}

function activeTimerCountdown() {
  timerRunning ? finishTimer() : startTimer();
}

function updateControlOptionTime(e) {
  if (currentInterval) clearTimer();

  const indexToChange = Number(e.target.dataset.option);
  let newTimeValue = Number(e.target.value);

  if (newTimeValue === '' || newTimeValue === null || newTimeValue <= 0) 
    newTimeValue = 1;
  
  controls[indexToChange].time = newTimeValue;
  resetCurrentTime();
  createTimePreview();
}

function populateModalSettings() {
  pomodoroField.value = controls[0].time;
  shortBreakField.value = controls[1].time;
  longBreakField.value = controls[2].time;
}

function changeTimeValue() {
  resetCurrentTime();
  createTimePreview();
}

function changeBodyBackgroundColor() {
  const allClasses = document.body.classList.values();
  for (const eachClass of allClasses) 
    document.body.classList.remove(eachClass);
    
  document.body.classList.add(controls[currentIndex].class);
}

function changeTimeOptionEvent(e) {
  allOptionBtns.forEach((optionBtn) => optionBtn.classList.remove('active'));
  e.target.classList.add('active');

  if (currentInterval) clearTimer();

  currentIndex = Number(e.target.dataset.option);
  changeBodyBackgroundColor();
  changeTimeValue();
  createTimePreview();
}

function init() {
  currentIndex = 0;
  changeBodyBackgroundColor();
  changeTimeValue();
  populateModalSettings();
  btnPomodoroOption.classList.add('active');
}

// Modal event listeners
btnOpenSettingsModal.addEventListener('click', openSettingsModal);
btnCloseSettingsModal.addEventListener('click', closeSettingsModal);
btnOkSettingsModal.addEventListener('click', closeSettingsModal);

pomodoroField.addEventListener('input', updateControlOptionTime);
shortBreakField.addEventListener('input', updateControlOptionTime);
longBreakField.addEventListener('input', updateControlOptionTime);

// Time options event listeners
btnPomodoroOption.addEventListener('click', changeTimeOptionEvent);
btnShortBreakOption.addEventListener('click', changeTimeOptionEvent);
btnLongBreakOption.addEventListener('click', changeTimeOptionEvent);

// Timer event listener
btnStartTimer.addEventListener('click', activeTimerCountdown);

// Init timer configurations
init();
