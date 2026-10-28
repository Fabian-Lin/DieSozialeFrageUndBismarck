(function () {
  const tabs = document.querySelectorAll('[role="tab"]');

  function show(i) {
    tabs.forEach(function (t, k) {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
      }
    });
  }

  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () {
      show(k);
    });

    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        const next = (k + 1) % tabs.length;
        show(next);
        tabs[next].focus();
      }
      if (e.key === 'ArrowLeft') {
        const prev = (k + tabs.length - 1) % tabs.length;
        show(prev);
        tabs[prev].focus();
      }
    });
  });
})();

const timelineItems = document.querySelectorAll('.timeline-static-item');
const timelineExplanation = document.getElementById('timeline-explanation');

const timelineContent = {
  'jahr-1878': {
    title: '1878: Sozialistengesetz',
    html: `
      <p>Das Sozialistengesetz von 1878 war ein Ausnahmegesetz, mit dem Bismarck die Sozialdemokratie bekämpfen wollte. Nach zwei gescheiterten Attentaten auf Kaiser Wilhelm I. im Jahr 1878 machte er die Sozialistische Arbeiterpartei dafür verantwortlich, obwohl es keine Beweise gab. Im Oktober 1878 beschloss der Reichstag das „Gesetz gegen die gemeingefährlichen Bestrebungen der Sozialdemokratie“. Es verbot sozialdemokratische Vereine, Versammlungen, Druckschriften und Gewerkschaften, und führende Mitglieder konnten aus ihren Wohnorten ausgewiesen werden. Nur die Teilnahme an Reichstagswahlen blieb erlaubt.</p>
      <p>Sein Ziel erreichte das Gesetz nicht: Die Partei arbeitete im Untergrund weiter, und die Verfolgung stärkte ihren Zusammenhalt, sodass sie bei Wahlen sogar dreimal so viele Stimmen gewann. Bismarck setzte deshalb zusätzlich auf „Zuckerbrot und Peitsche“. Neben der Unterdrückung (Peitsche) sollten die Sozialversicherungen (Zuckerbrot) die Arbeiter an den Staat binden und vom Sozialismus abbringen. Das Sozialistengesetz lief 1890 aus.</p>
    `
  },
  'jahr-1881': {
    title: '1881: Kaiserliche Botschaft',
    html: `

      <p>Im Herbst 1881 arbeitete Bismarck ein sozialpolitisches Programm aus, das Kaiser Wilhelm I. im Reichstag vortragen sollte. Der Kaiser weigerte sich, weil Bismarck zu dieser Zeit erwog, das 1878 erlassene Sozialistengesetz wieder aufzuheben. Deshalb hielt Bismarck die Rede am 17. November 1881 selbst. Er machte darin deutlich, dass man die sozialen Missstände nicht allein durch Verbote und Verfolgung der Sozialdemokraten beheben könne, sondern dass der Staat auch aktiv das Wohl der Arbeiter fördern müsse. Sein Konzept sah drei Arten von Sozialversicherung vor, dazu das Prinzip der Selbstverwaltung. Ein Gesetz war die Botschaft noch nicht, sie bildete aber die Grundlage für die Krankenversicherung (1883), die Unfallversicherung (1884) und die Invaliditäts- und Altersversicherung (1889).</p>
      <details class="timeline-quote">
        <summary>Zitat aus der Kaiserlichen Botschaft anzeigen</summary>
        <blockquote class="zitat">
          <p><b><span style="font-style: normal;">Rede des Reichskanzlers Otto Fürst von Bismarck zur Eröffnung des Deutschen Reichstags am 17. November 1881</span></b></p>
          <p>„[...] Wir halten es für Unsere Kaiserliche Pflicht, dem Reichstage die Förderung des Wohles der Arbeiter von neuem ans Herz zu legen, und würden Wir mit um so größerer Befriedigung auf alle Erfolge, mit denen Gott Unsere Regierung sichtlich gesegnet hat, zurückblicken, wenn es Uns gelänge, dereinst das Bewußtsein mitzunehmen, dem Vaterlande neue und dauernde Bürgschaften seines inneren Friedens und den Hilfsbedürftigen größere Sicherheit und Ergiebigkeit des Beistandes, auf den sie Anspruch haben, zu hinterlassen. In Unseren darauf gerichteten Bestrebungen sind Wir der Zustimmung aller verbündeten Regierungen gewiß und vertrauen auf die Unterstützung des Reichstages ohne Unterschied der Parteistellungen.</p>
          <p>In diesem Sinne wird zunächst der Entwurf eines Gesetzes über die Versicherung der Arbeiter gegen Betriebsunfälle vorbereitet. Ergänzend wird ihm eine Vorlage zur Seite treten, welche sich eine gleichmäßige Organisation des gewerblichen Krankenkassenwesens zur Aufgabe stellt. Aber auch diejenigen, welche durch Alter oder Invalidität erwerbsunfähig werden, haben der Gesammtheit gegenüber begründeten Anspruch auf ein höheres Maß staatlicher Fürsorge, als ihnen bisher hat zu Theil werden können.</p>
          <p>Für diese Fürsorge die rechten Mittel zu finden, ist eine schwierige, aber auch eine der höchsten Aufgaben jedes Gemeinwesens, welches auf den sittlichen Fundamenten des christlichen Volkslebens steht. Der engere Anschluß an die realen Kräfte dieses Volkslebens und das Zusammenfallen des letzteren in der Form korporativer Genossenschaften unter staatlichem Schutz und staatlicher Förderung werden, wie Wir hoffen, die Lösung auch von Ausgaben möglich machen, denen die Staatsgewalt allein in gleichem Umfang nicht gewachsen sein würde. [...]“</p> 
          <p class="quellen">Zitiert aus: <a href="https://www.quellen-sozialpolitik-kaiserreich.de/fileadmin/user_upload/PDFs_der_Baende/QuellensammlungAbt2Band2Teil1.pdf">Quellensammlung zur Geschichte der deutschen Sozialpolitik 1867 bis 1914 Abt. 2, Band 2, Teil 1, Seite 184f</a></p>
        </blockquote>
      </details>

      
    `
  },
  'jahr-1883': {
    title: '1883: Krankenversicherung',
    html: `
      <p>Als Otto von Bismarck 1883 die weltweit erste allgemeine Pflichtkrankenversicherung einführte, wurden erstmals in der Geschichte alle Arbeiter gegen Krankheiten versichert. Dadurch erhielten sie Anspruch auf bezahlten Krankenurlaub sowie uneingeschränkten Zugang zu Ärzten und medizinischer Versorgung. Ziel dieser Maßnahme war es, die Arbeiter im Krankheitsfall finanziell abzusichern und gleichzeitig ihre Bindung an den Staat zu stärken.</p>
      `
  },
  'jahr-1884': {
    title: '1884: Unfallversicherung',
    html: `
      <p>Als Otto von Bismarck 1884 die öffentlich-rechtliche Unfallversicherung einführte, wurden Arbeiter erstmals gegen die finanziellen Folgen von Arbeitsunfällen und Berufskrankheiten abgesichert. Unabhängig von der Verschuldungsfrage bot sie dem Betroffenen eine Entschädigung und sie erhielten dadurch Unterstützung, wenn sie bei der Arbeit verletzt wurden oder dauerhaft arbeitsunfähig waren. Ziel dieser Maßnahme war es, die Arbeiter vor den wirtschaftlichen Folgen von Arbeitsunfällen zu schützen, wobei die Kosten für die Versicherung allein nach Bismarcks Willen die Unternehmer und das Reich tragen. </p>
      `
  },
  'jahr-1889': {
    title: '1889: Invaliditäts- und Altersversicherung',
    html: `
      <p>Die gesetzliche Rentenversicherung wurde 1889 von Otto von Bismarck in Deutschland eingeführt. Es enthielt eine Invalidenrente im Falle einer Erwerbsunfähigkeit und eine Altersrente ab 70 (bei einer durchschnittlichen Lebenserwartung von etwa 40 Jahren ab Geburt), wobei die Beiträge 1,7 % des Lohns ausmachten und somit relativ niedrig waren. Die Beiträge wurden zu gleichen Teilen von Arbeitnehmern, Arbeitgebern und dem Staat bezahlt. Allerdings war die Rente sehr niedrig und reichte oft nicht aus, um alle Lebenshaltungskosten zu decken. Durch Kriege, Inflation und Währungsreformen verlor das angesparte Geld an Wert, wodurch der Aufbau eines ausreichenden Kapitalstocks erschwert wurde. </p>
      `
  },
  'jahr-1890': {
    title: '1890: Ende einer Ära',
    html: `
      <div class="timeline-era-layout">
        <div class="timeline-era-text">
          <div class="unfertig">
            Dieser Abschnitt ist noch nicht fertig.  Der Text muss noch geschrieben werden.
          </div>
          <p>Das Sozialistengesetz lief aus, und Bismarck verlor im politischen System schnell an Einfluss. Die Sozialpolitik blieb aber bestehen und war nun ein fester Bestandteil des modernen Staates.</p>
          <p>Weiterer historischer Kontext, wer übernahm die Macht, was ist mit den Sozialismus, ging die Sozialpolitik weiter oder wurde sie vernachlässigt?</p>
        </div>
        <figure class="timeline-era-figure">
          <div class="timeline-era-artwork">
            <h4>Karikatur: Der Lotse geht von Bord (1890)</h4>
            <img class="timeline-image" src="bilder/Bismarcks_Ruecktritt.jpg" alt="Karikatur: Der Lotse geht von Bord">
          </div>
          <figcaption class="quellen">
            <a href="https://commons.wikimedia.org/wiki/File:1890_Bismarcks_Ruecktritt.jpg">John Tenniel 1890, Public domain, via Wikimedia Commons</a>
          </figcaption>
        </figure>
      </div>
    `
  }
};

if (timelineExplanation && timelineItems.length) {
  const firstItem = timelineItems[0];
  const firstContent = timelineContent[firstItem.dataset.target];

  if (firstContent) {
    timelineExplanation.innerHTML = `
      <h3>${firstContent.title}</h3>
      ${firstContent.html}
    `;
  }

  timelineItems.forEach(function (entry) {
    entry.classList.remove('is-active');
  });
  firstItem.classList.add('is-active');

  timelineItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const target = item.dataset.target;
      const content = timelineContent[target];
      if (!content) return;

      timelineExplanation.innerHTML = `
        <h3>${content.title}</h3>
        ${content.html}
      `;

      timelineItems.forEach(function (entry) {
        entry.classList.remove('is-active');
      });
      item.classList.add('is-active');
    });
  });
}

const quizQuestions = Array.from(document.querySelectorAll('.quiz-question'));
const quizProgress = document.getElementById('quiz-progress');
const quizPreviousButton = document.getElementById('quiz-previous');
const quizNextButton = document.getElementById('quiz-next');
const quizResetButton = document.getElementById('quiz-reset');
const quizFeedback = document.getElementById('quiz-feedback');
const quizResult = document.getElementById('quiz-result');
let currentQuizQuestion = 0;
let quizCompleted = false;
const checkedQuizQuestions = quizQuestions.map(() => false);

function showQuizQuestion(index) {
  currentQuizQuestion = index;
  quizQuestions.forEach((question, questionIndex) => {
    question.hidden = questionIndex !== currentQuizQuestion;
  });

  if (quizProgress) {
    quizProgress.textContent = `Frage ${currentQuizQuestion + 1} von ${quizQuestions.length}`;
  }
  if (quizPreviousButton) {
    quizPreviousButton.disabled = currentQuizQuestion === 0 || quizCompleted;
  }
  if (quizNextButton) {
    quizNextButton.hidden = quizCompleted;
    quizNextButton.textContent = checkedQuizQuestions[currentQuizQuestion]
      ? currentQuizQuestion === quizQuestions.length - 1 ? 'Auswertung anzeigen' : 'Weiter'
      : 'Überprüfen';
  }
  if (quizFeedback) {
    quizFeedback.hidden = !checkedQuizQuestions[currentQuizQuestion];
    if (checkedQuizQuestions[currentQuizQuestion]) {
      const question = quizQuestions[currentQuizQuestion];
      const selected = question.querySelector('input[type="radio"]:checked');
      quizFeedback.textContent = selected?.value === question.dataset.correct
        ? 'Richtig!'
        : `Leider falsch. Richtig ist: ${question.querySelector(`input[value="${question.dataset.correct}"]`)?.closest('label')?.textContent.trim()}`;
      quizFeedback.classList.toggle('is-correct', selected?.value === question.dataset.correct);
      quizFeedback.classList.toggle('is-incorrect', selected?.value !== question.dataset.correct);
    }
  }
}

if (quizQuestions.length) {
  showQuizQuestion(0);
}

if (quizPreviousButton) {
  quizPreviousButton.addEventListener('click', function () {
    if (currentQuizQuestion > 0) {
      showQuizQuestion(currentQuizQuestion - 1);
    }
  });
}

if (quizNextButton) {
  quizNextButton.addEventListener('click', function () {
    if (!checkedQuizQuestions[currentQuizQuestion]) {
      const question = quizQuestions[currentQuizQuestion];
      const selected = question.querySelector('input[type="radio"]:checked');
      if (!selected) {
        if (quizFeedback) {
          quizFeedback.textContent = 'Bitte wähle zuerst eine Antwort aus.';
          quizFeedback.classList.remove('is-correct', 'is-incorrect');
          quizFeedback.hidden = false;
        }
        return;
      }

      const correct = selected.value === question.dataset.correct;
      selected.closest('label')?.classList.add(correct ? 'correct-answer' : 'wrong-selection');
      if (!correct) {
        question.querySelector(`input[value="${question.dataset.correct}"]`)
          ?.closest('label')
          ?.classList.add('correct-answer');
      }
      checkedQuizQuestions[currentQuizQuestion] = true;
      if (quizFeedback) {
        quizFeedback.textContent = correct
          ? 'Richtig!'
          : `Leider falsch. Richtig ist: ${question.querySelector(`input[value="${question.dataset.correct}"]`)?.closest('label')?.textContent.trim()}`;
        quizFeedback.classList.toggle('is-correct', correct);
        quizFeedback.classList.toggle('is-incorrect', !correct);
        quizFeedback.hidden = false;
      }
      showQuizQuestion(currentQuizQuestion);
      return;
    }

    if (currentQuizQuestion === quizQuestions.length - 1) {
      const score = quizQuestions.reduce((total, question) => {
        const selected = question.querySelector('input[type="radio"]:checked');
        return total + Number(selected?.value === question.dataset.correct);
      }, 0);

      if (quizResult) {
        quizResult.classList.remove('hidden');
        quizResult.classList.toggle('is-correct', score === quizQuestions.length);
        quizResult.classList.toggle('is-incorrect', score !== quizQuestions.length);
        quizResult.textContent = score === quizQuestions.length
          ? 'Perfekt! Du hast alle Fragen richtig beantwortet.'
          : `Du hast ${score}/${quizQuestions.length} Fragen richtig beantwortet.`;
      }

      quizCompleted = true;
      if (quizResetButton) {
        quizResetButton.classList.remove('hidden');
      }
      showQuizQuestion(currentQuizQuestion);
    } else {
      showQuizQuestion(currentQuizQuestion + 1);
    }
  });
}

quizQuestions.forEach((question, questionIndex) => {
  question.addEventListener('change', function (event) {
    if (!event.target.matches('input[type="radio"]')) return;

    question.querySelectorAll('label').forEach(label => {
      label.classList.remove('correct-answer', 'wrong-selection');
    });
    checkedQuizQuestions[questionIndex] = false;
    quizCompleted = false;
    if (quizResult) {
      quizResult.classList.add('hidden');
      quizResult.classList.remove('is-correct', 'is-incorrect');
      quizResult.textContent = '';
    }
    quizResetButton?.classList.add('hidden');
    if (quizFeedback) {
      quizFeedback.hidden = true;
      quizFeedback.classList.remove('is-correct', 'is-incorrect');
    }
    if (questionIndex === currentQuizQuestion) {
      showQuizQuestion(currentQuizQuestion);
    }
  });
});

if (quizResetButton) {
  quizResetButton.addEventListener('click', function () {
    quizQuestions.forEach(question => {
      question.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
      });
      question.querySelectorAll('label').forEach(label => {
        label.classList.remove('correct-answer', 'wrong-selection');
      });
    });
    checkedQuizQuestions.fill(false);

    if (quizResult) {
      quizResult.classList.add('hidden');
      quizResult.classList.remove('is-correct', 'is-incorrect');
      quizResult.textContent = '';
    }
    if (quizFeedback) {
      quizFeedback.hidden = true;
      quizFeedback.classList.remove('is-correct', 'is-incorrect');
    }

    quizCompleted = false;
    quizResetButton.classList.add('hidden');
    showQuizQuestion(0);
    quizQuestions[0]?.querySelector('input[type="radio"]')?.focus();
  });
}

(function () {
  const launcher = document.getElementById('chat-launcher');
  const panel = document.getElementById('chat-panel');
  const closeButton = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const sendButton = document.getElementById('chat-send');
  const messageList = document.getElementById('chat-messages');

  if (!launcher || !panel || !closeButton || !form || !input || !sendButton || !messageList) return;

  const conversation = [];
  let isSending = false;

  function addMessage(text, sender) {
    const message = document.createElement('p');
    message.className = `chat-message chat-message-${sender}`;
    message.textContent = text;
    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
    return message;
  }

  function setOpen(isOpen) {
    panel.hidden = !isOpen;
    launcher.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) input.focus();
    else launcher.focus();
  }

  launcher.addEventListener('click', function () {
    setOpen(panel.hidden);
  });

  closeButton.addEventListener('click', function () {
    setOpen(false);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || isSending) return;

    addMessage(question, 'user');
    input.value = '';
    isSending = true;
    sendButton.disabled = true;
    const loadingMessage = addMessage('Bismarck überlegt …', 'assistant');

    try {
      if (window.location.protocol === 'file:') {
        throw new Error('Starte node server.js und öffne http://localhost:3000.');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, { role: 'user', content: question }]
        })
      });
      let result;
      try {
        result = JSON.parse(await response.text());
      } catch {
        throw new Error('Der Chatdienst ist gerade nicht erreichbar. Bitte versuche es später erneut.');
      }

      if (!response.ok) {
        throw new Error(result.error || 'Die Antwort konnte nicht geladen werden.');
      }
      if (typeof result.reply !== 'string' || !result.reply.trim()) {
        throw new Error('Es wurde keine Antwort zurückgegeben. Bitte versuche es erneut.');
      }

      loadingMessage.textContent = result.reply;
      conversation.push({ role: 'user', content: question });
      conversation.push({ role: 'assistant', content: result.reply });
      if (conversation.length > 10) conversation.splice(0, conversation.length - 10);
    } catch (error) {
      loadingMessage.textContent = error instanceof TypeError
        ? 'Der Chatdienst ist gerade nicht erreichbar. Bitte versuche es später erneut.'
        : error.message || 'Es gab ein Problem. Bitte versuche es erneut.';
      loadingMessage.classList.add('chat-message-error');
    } finally {
      isSending = false;
      sendButton.disabled = false;
      input.focus();
      messageList.scrollTop = messageList.scrollHeight;
    }
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
})();
