document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('anxietyTestForm');
  const resultBtn = document.getElementById('showResultBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorText = document.getElementById('errorText');
  const resultBox = document.getElementById('resultBox');
  const resultScore = document.getElementById('resultScore');
  const resultTitle = document.getElementById('resultTitle');
  const resultDescription = document.getElementById('resultDescription');

  const getAnswers = () => {
    const values = [];
    for (let i = 1; i <= 10; i += 1) {
      const selected = form.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) return null;
      values.push(Number(selected.value));
    }
    return values;
  };

  const getInterpretation = (score) => {
    if (score < 20) return ['Вероятно, низкий уровень психологического дистресса', 'Ответы указывают на относительно низкий уровень выраженного напряжения.'];
    if (score <= 24) return ['Лёгкий уровень выраженности симптомов', 'Полезно обратить внимание на режим отдыха, уровень стресса и общее самочувствие.'];
    if (score <= 29) return ['Умеренный уровень выраженности симптомов', 'Если состояние мешает работе, сну или отношениям, лучше обратиться за профессиональной поддержкой.'];
    return ['Высокий уровень выраженности симптомов', 'Это не диагноз, но такой показатель — серьёзный повод обратиться к психологу или врачу.'];
  };

  resultBtn.addEventListener('click', () => {
    const answers = getAnswers();
    if (!answers) {
      errorText.style.display = 'block';
      resultBox.classList.remove('visible');
      return;
    }

    const total = answers.reduce((sum, value) => sum + value, 0);
    const [title, description] = getInterpretation(total);
    errorText.style.display = 'none';
    resultScore.textContent = `${total} баллов`;
    resultTitle.textContent = title;
    resultDescription.textContent = description;
    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  resetBtn.addEventListener('click', () => {
    errorText.style.display = 'none';
    resultBox.classList.remove('visible');
  });
});
