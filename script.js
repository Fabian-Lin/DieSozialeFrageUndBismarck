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
      <h4>Das Sozialistengesetz in Originalfassung:</h4>
      <audio class="timeline-audio" controls preload="none" aria-label="Audiobeitrag zum Sozialistengesetz">
        <source src="audios/Sozialistengesetz.mp3" type="audio/mpeg">
        Dein Browser unterstützt die Audiowiedergabe nicht. <a href="audios/Sozialistengesetz.mp3">Audiobeitrag herunterladen</a>.
      </audio>
    `
  },
  'jahr-1881': {
    title: '1881: Kaiserliche Botschaft',
    html: `
      <p>Im Herbst 1881 arbeitete Bismarck ein sozialpolitisches Programm aus, das Kaiser Wilhelm I. im Reichstag vortragen sollte. Der Kaiser weigerte sich, weil Bismarck zu dieser Zeit erwog, das 1878 erlassene Sozialistengesetz wieder aufzuheben. Deshalb hielt Bismarck die Rede am 17. November 1881 selbst. Er machte darin deutlich, dass man die sozialen Missstände nicht allein durch Verbote und Verfolgung der Sozialdemokraten beheben könne, sondern dass der Staat auch aktiv das Wohl der Arbeiter fördern müsse. Sein Konzept sah drei Arten von Sozialversicherung vor, dazu das Prinzip der Selbstverwaltung. Ein Gesetz war die Botschaft noch nicht, sie bildete aber die Grundlage für die Krankenversicherung (1883), die Unfallversicherung (1884) und die Invaliditäts- und Altersversicherung (1889).</p>
      <blockquote class="zitat">„Die Ziele, welche der kaiserlichen Politik vorschweben, sind durch die Kaiserliche Botschaft gekennzeichnet. Es handelt sich nun aber um die Wege, auf welchen sie zu erreichen sind, und die Wahl dieser Wege ist gleich wichtig wie die Festlegung des Zieles überhaupt, denn jeder Weg kann ein richtiger Weg sein, er kann auch ein Irrweg sein. Ich muß sagen: Ich selbst bin meiner Überzeugung über die Wahl der Wege - über die Ziele bin ich mir ganz klar - aber der Wahl der Wege bin ich so unbedingt sicher nicht, daß ich Ihnen heute mit Bestimmtheit amtliche Andeutungen über das machen könnte, was ich hoffe etwa im Monat April dem Reichstage vorlegen zu können auf diesem Gebiete.“<br>Rede des Reichskanzlers Otto Fürst von Bismarck im Deutschen Reichstag Januar 1882</blockquote>
      <p class="quellen"><a href="https://www.quellen-sozialpolitik-kaiserreich.de/fileadmin/user_upload/PDFs_der_Baende/QuellensammlungAbt2Band2Teil1.pdf">Quellensammlung zur Geschichte der deutschen Sozialpolitik 1867 bis 1914 Abt. 2, Band 2, Teil 1, Seite 184f</a></p>
      <p class="quellen"><a href="https://www.digitale-sammlungen.de/de/view/bsb00018436?page=50,51&q=Krankenkassenwesens">Verhandlungen des Reichstages. Stenographische Berichte. 66. 1881/82, Seite 51f in: Bayerische Staatsbibliothek über MDZ-Digitale Bibliothek</a></p>
      <p class="quellen">Quellen: <a href="https://www.bismarck-biografie.de/politik/bismarcks-sozialgesetzgebung-1881-1890">Bismarck-Biografie: Bismarcks Sozialgesetzgebung 1881-1890</a> <a href="https://de.wikipedia.org/wiki/Kaiserliche_Botschaft">Wikipedia: Kaiserliche Botschaft</a></p>
    `
  },
  'jahr-1883': {
    title: '1883: Krankenversicherung',
    html: `
      <div class="unfertig">
        Dieser Abschnitt ist noch nicht fertig. Der Text muss noch geschrieben werden, nur kurzer Überblick wie im Beispiel, keine Erklärung der Funktionsweise
      </div>
      <p>Mit der Krankenversicherung wurde 1883 die erste staatlich geregelte Sozialversicherung eingeführt. Sie deckte ärztliche Behandlung, Medikamente und ein zeitweises Krankengeld ab und stärkte die Bindung der Arbeiter an den Staat.</p>
    `
  },
  'jahr-1884': {
    title: '1884: Unfallversicherung',
    html: `
      <div class="unfertig">
        Dieser Abschnitt ist noch nicht fertig. Der Text muss noch geschrieben werden, nur kurzer Überblick wie im Beispiel, keine Erklärung der Funktionsweise
      </div>
      <p>Die Unfallversicherung sollte Berufsunfälle und deren Folgen absichern. Arbeitgeber trugen die Organisation und die Finanzierung, während die Versicherung den Schutz für Beschäftigte und Familien im Krankheits- und Unfallfall deutlich ausbaute.</p>
    `
  },
  'jahr-1889': {
    title: '1889: Invaliditäts- und Altersversicherung',
    html: `
      <div class="unfertig">
        Dieser Abschnitt ist noch nicht fertig. Der Text muss noch geschrieben werden, nur kurzer Überblick wie im Beispiel, keine Erklärung der Funktionsweise
      </div>
      <p>Die Rentenversicherung war die größte und langfristigste Säule. Sie sicherte bei Invalidität oder im Alter eine Zahlung und sollte die Arbeiter vor Armut im Laufe des Lebens schützen.</p>
    `
  },
  'jahr-1890': {
    title: '1890: Ende einer Ära',
    html: `
      <div class="unfertig">
        Dieser Abschnitt ist noch nicht fertig.  Der Text muss noch geschrieben werden.
      </div>

      <p>Das Sozialistengesetz lief aus, und Bismarck verlor im politischen System schnell an Einfluss. Die Sozialpolitik blieb aber bestehen und war nun ein fester Bestandteil des modernen Staates.</p>
      <p>Weiterer historischer Kontext, wer übernahm die Macht, was ist mit den Sozialismus, ging die Sozialpolitik weiter oder wurde sie vernachlässigt?</p>
      <h4>Karikatur: Der Lotse geht von Bord von John Tenniel (1890) (Im Orginal: Dropping the Pilot)</h4>
      <img class="timeline-image" src="bilder/Bismarcks_Ruecktritt.jpg" alt="Karikatur: Der Lotse geht von Bord">
      <figcaption class="quellen">
        <a href="https://commons.wikimedia.org/wiki/File:1890_Bismarcks_Ruecktritt.jpg">John Tenniel, Public domain, via Wikimedia Commons</a>
      </figcaption>
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

const quizSubmitButton = document.getElementById("quiz-submit");
if (quizSubmitButton) {
  quizSubmitButton.addEventListener("click", function () {
    const resultDiv = document.getElementById("quiz-result");
    const questions = document.querySelectorAll('.quiz-question');
    let score = 0;

    questions.forEach(q => {
      q.querySelectorAll('label').forEach(l => {
        l.classList.remove('correct-answer', 'wrong-selection');
      });
    });

    questions.forEach(q => {
      const correct = q.dataset.correct;
      const firstInput = q.querySelector('input[type="radio"]');
      if (!firstInput) return;
      const name = firstInput.name;
      const selected = q.querySelector(`input[name="${name}"]:checked`);
      const correctInput = q.querySelector(`input[type="radio"][value="${correct}"]`);

      if (selected) {
        if (selected.value === correct) {
          score++;
          const lbl = selected.closest('label');
          if (lbl) lbl.classList.add('correct-answer');
        } else {
          const lblSel = selected.closest('label');
          if (lblSel) lblSel.classList.add('wrong-selection');
          if (correctInput) {
            const lblCorr = correctInput.closest('label');
            if (lblCorr) lblCorr.classList.add('correct-answer');
          }
        }
      } else if (correctInput) {
        const lblCorr = correctInput.closest('label');
        if (lblCorr) lblCorr.classList.add('correct-answer');
      }
    });

    const total = questions.length;
    if (resultDiv) {
      resultDiv.classList.remove('hidden');
      if (score === total) {
        resultDiv.innerHTML = `<p>✅ Perfekt! Du hast alle Fragen richtig beantwortet.</p>`;
      } else {
        resultDiv.innerHTML = `<p>Du hast ${score}/${total} Fragen richtig beantwortet.</p><p>Lies dir die Fragen noch einmal sorgfältig durch.</p>`;
      }
    }

    const resetBtn = document.getElementById('quiz-reset');
    if (resetBtn) resetBtn.classList.remove('hidden');
  });
}

const quizResetButton = document.getElementById('quiz-reset');
if (quizResetButton) {
  quizResetButton.addEventListener('click', function () {
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach(q => {
      q.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      q.querySelectorAll('label').forEach(l => {
        l.classList.remove('correct-answer', 'wrong-selection');
      });
    });

    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
      resultDiv.classList.add('hidden');
      resultDiv.innerHTML = '';
    }

    quizResetButton.classList.add('hidden');
    const firstInput = document.querySelector('.quiz-question input[type="radio"]');
    if (firstInput) firstInput.focus();
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
        throw new Error('Fehler 701: Der Chatdienst ist gerade nicht erreichbar. Bitte versuche es später erneut.');
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
