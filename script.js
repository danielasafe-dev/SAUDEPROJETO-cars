const questions = [
  {
    id: 1,
    name: "Relacionamento interpessoal",
    options: [
      { score: 1, text: "Adequado para a idade. O paciente demonstra comportamento social típico" },
      { score: 2, text: "Levemente anormal. Pode evitar contato visual ou ter timidez excessiva" },
      { score: 3, text: "Moderadamente anormal. Respostas escassas e raramente espontâneas" },
      { score: 4, text: "Extremamente anormal. Não responde ou não percebe a chegada de outras pessoas" }
    ]
  },
  {
    id: 2,
    name: "Imitação e criação",
    options: [
      { score: 1, text: "Adequado para a idade. Imita sons e gestos de forma normal" },
      { score: 2, text: "Levemente anormal. Imita tarefas simples como palmas" },
      { score: 3, text: "Moderadamente anormal. Imita apenas parte do tempo com apoio" },
      { score: 4, text: "Extremamente anormal. Não imita nada, nem mesmo sons simples" }
    ]
  },
  {
    id: 3,
    name: "Resposta emocional",
    options: [
      { score: 1, text: "Adequado para a idade. Reage emocionalmente com coerência" },
      { score: 2, text: "Levemente anormal. Reações levemente reduzidas ou inadequadas" },
      { score: 3, text: "Moderadamente anormal. Respostas limitadas, sem demonstração de emoções" },
      { score: 4, text: "Extremamente anormal. Reações extremas sem motivo aparente" }
    ]
  },
  {
    id: 4,
    name: "Uso do corpo",
    options: [
      { score: 1, text: "Adequado para a idade. Movimentos coordenados e normais" },
      { score: 2, text: "Levemente anormal. Postura ou movimentos corporais levemente incomuns" },
      { score: 3, text: "Moderadamente anormal. Comportamentos como balançar, estalar dedos" },
      { score: 4, text: "Extremamente anormal. Movimentos bizarros graves ou autoagressão" }
    ]
  },
  {
    id: 5,
    name: "Uso de objetos",
    options: [
      { score: 1, text: "Adequado para a idade. Usa brinquedos como esperado" },
      { score: 2, text: "Levemente anormal. Interesses limitados ou uso estereotipado" },
      { score: 3, text: "Moderadamente anormal. Prejuízo significativo com objetos" },
      { score: 4, text: "Extremamente anormal. Uso de partes do corpo no lugar de objetos" }
    ]
  },
  {
    id: 6,
    name: "Adaptação a mudanças",
    options: [
      { score: 1, text: "Adequado para a idade. Lida bem com transições" },
      { score: 2, text: "Levemente anormal. Dificuldade mínima, ajusta-se com apoio" },
      { score: 3, text: "Moderadamente anormal. Apego a rotina, resistência a mudanças" },
      { score: 4, text: "Extremamente anormal. Reação extrema a qualquer modificação" }
    ]
  },
  {
    id: 7,
    name: "Resposta visual",
    options: [
      { score: 1, text: "Adequado para a idade. Uso visual normal dos sentidos" },
      { score: 2, text: "Levemente anormal. Necessidade de verificar objetos visualmente" },
      { score: 3, text: "Moderadamente anormal. Fascínio por detalhes ou reflexos" },
      { score: 4, text: "Extremamente anormal. Olhar fixo prolongado ou evitar olhar" }
    ]
  },
  {
    id: 8,
    name: "Resposta auditiva",
    options: [
      { score: 1, text: "Adequado para a idade. Resposta normal a sons" },
      { score: 2, text: "Levemente anormal. Reação levemente reduzida aos sons" },
      { score: 3, text: "Moderadamente anormal. Reações extremas ou ausência de resposta" },
      { score: 4, text: "Extremamente anormal. Não responde a qualquer som forte" }
    ]
  },
  {
    id: 9,
    name: "Impressões e temores",
    options: [
      { score: 1, text: "Adequado para a idade. Sem medos incomuns" },
      { score: 2, text: "Levemente anormal. Medos ou ansiedades discretas" },
      { score: 3, text: "Moderadamente anormal. Medos excessivos com dificuldade de consolo" },
      { score: 4, text: "Extremamente anormal. Terror ou euforia sem causa aparente" }
    ]
  },
  {
    id: 10,
    name: "Comunicação verbal",
    options: [
      { score: 1, text: "Adequado para a idade. Fala compreensível e contextualizada" },
      { score: 2, text: "Levemente anormal. Sem conteúdo concreto ou ecolalia ocasional" },
      { score: 3, text: "Moderadamente anormal. Jargão, sons guturais ou ecolalia frequente" },
      { score: 4, text: "Extremamente anormal. Gritos estranhos ou sons bizarrros persistentes" }
    ]
  },
  {
    id: 11,
    name: "Comunicação não verbal",
    options: [
      { score: 1, text: "Adequado para a idade. Gestos e expressões normais" },
      { score: 2, text: "Levemente anormal. Uso reduzido de gestos" },
      { score: 3, text: "Moderadamente anormal. Comunicação não verbal limitada" },
      { score: 4, text: "Extremamente anormal. Sem comunicação não verbal funcional" }
    ]
  },
  {
    id: 12,
    name: "Nível de atividade",
    options: [
      { score: 1, text: "Adequado para a idade. Nível de atividade normal" },
      { score: 2, text: "Levemente anormal. Ligeiramente inquieto ou excessivamente calmo" },
      { score: 3, text: "Moderadamente anormal. Agitação ou passividade significativas" },
      { score: 4, text: "Extremamente anormal. Hiperatividade extrema ou imobilidade" }
    ]
  },
  {
    id: 13,
    name: "Nível e consistência de resposta intelectual",
    options: [
      { score: 1, text: "Adequado para a idade. Função intelectual normal" },
      { score: 2, text: "Levemente anormal. Desempenho levemente abaixo do esperado" },
      { score: 3, text: "Moderadamente anormal. Desempenho significativamente abaixo" },
      { score: 4, text: "Extremamente anormal. Nenhuma resposta funcional em áreas normais" }
    ]
  },
  {
    id: 14,
    name: "Impressões gerais",
    options: [
      { score: 1, text: "Dentro da normalidade para a idade" },
      { score: 2, text: "Levemente fora da normalidade para a idade" },
      { score: 3, text: "Moderadamente fora da normalidade para a idade" },
      { score: 4, text: "Extremamente fora da normalidade para a idade" }
    ]
  }
];

const labelMap = ["Normal", "Leve", "Moderado", "Grave"];

let answers = {};
let currentScreen = 1;

function showScreen(n) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${n}`).classList.add('active');
  currentScreen = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToResultados() {
  const nome = document.getElementById('paciente-nome').value.trim();
  if (!nome) {
    alert('Por favor, informe o nome do paciente.');
    return;
  }
  renderQuestions();
  showScreen(2);
}

function renderQuestions() {
  const container = document.getElementById('questions-container');
  container.innerHTML = '';

  questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `q-card-${q.id}`;

    let optionsHtml = '';
    q.options.forEach((opt, oi) => {
      const checked = answers[q.id] === opt.score ? 'checked' : '';
      optionsHtml += `
        <label class="option">
          <input type="radio" name="q${q.id}" value="${opt.score}" ${checked} onchange="onAnswer(${q.id}, ${opt.score})">
          <span class="radio-visual"></span>
          <span class="option-text">${opt.text}</span>
          <span class="option-score">${opt.score}</span>
        </label>
      `;
    });

    card.innerHTML = `
      <div class="question-header">
        <span class="question-number">${q.id}</span>
        <h3>${q.name}</h3>
      </div>
      <div class="options">${optionsHtml}</div>
    `;
    container.appendChild(card);
  });
}

function onAnswer(id, score) {
  answers[id] = score;
  document.getElementById(`q-card-${id}`).classList.add('answered');
  updateProgress();
}

function updateProgress() {
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const pct = (answered / total) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${answered} de ${total} respondidas`;
}

function calcScore() {
  return Object.values(answers).reduce((a, b) => a + b, 0);
}

function getClassification(score) {
  if (score <= 29.5) return { label: 'Sem indicativo de TEA', cls: 'not-tea', color: '#16a34a' };
  if (score < 37) return { label: 'TEA Leve a Moderado', cls: 'tea-leve', color: '#ca8a04' };
  return { label: 'TEA Grave', cls: 'tea-grave', color: '#dc2626' };
}

function goToResultado() {
  const unanswered = questions.filter(q => !answers[q.id]);
  if (unanswered.length > 0) {
    alert(`Faltam ${unanswered.length} questão(ões) para responder.`);
    document.getElementById(`q-card-${unanswered[0].id}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const score = calcScore();
  const info = getClassification(score);

  const nome = document.getElementById('paciente-nome').value;
  const idade = document.getElementById('paciente-idade').value;
  const avaliador = document.getElementById('avaliador').value;
  const data = document.getElementById('data-avaliacao').value;

  document.getElementById('res-paciente').innerHTML = `
    <p><strong>Paciente:</strong> ${nome}</p>
    <p><strong>Idade:</strong> ${idade || '—'} anos</p>
    <p><strong>Avaliador:</strong> ${avaliador || '—'}</p>
    <p><strong>Data:</strong> ${data || '—'}</p>
  `;

  document.getElementById('res-score').textContent = score;
  document.getElementById('res-score').style.color = info.color;

  const clsEl = document.getElementById('res-class');
  clsEl.textContent = `${score}/60 — ${info.label}`;
  clsEl.className = `result-classification ${info.cls}`;

  // Score breakdown dots
  const dotsContainer = document.getElementById('score-dots');
  dotsContainer.innerHTML = '';
  questions.forEach(q => {
    const v = answers[q.id] || 0;
    dotsContainer.innerHTML += `
      <div class="score-dot" title="${q.name}: ${v}">
        <div class="dot s${v}">${v}</div>
        <div>${q.id}</div>
      </div>
    `;
  });

  showScreen(3);
}

function voltar() {
  showScreen(2);
}

function novaAvaliacao() {
  answers = {};
  document.getElementById('paciente-nome').value = '';
  document.getElementById('paciente-idade').value = '';
  document.getElementById('avaliador').value = '';
  document.getElementById('data-avaliacao').value = '';
  updateProgress();
  showScreen(1);
}

function gerarPDF() {
  window.print();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('data-avaliacao').value = new Date().toISOString().split('T')[0];
});
