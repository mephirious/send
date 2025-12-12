const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const response = document.getElementById('response');

yesBtn.addEventListener('click', () => {
    response.innerHTML = 'Yay! I\'m so excited!';
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
});

noBtn.addEventListener('click', () => {
    response.innerHTML = 'Maybe another time?';
});

