// Mini hero bolts next to section eyebrows: non-existent until you are on that specific section
(function () {
  var bolts = Array.prototype.slice.call(document.querySelectorAll('.trace'));
  if (!bolts.length) return;

  var sections = [];
  bolts.forEach(function (bolt) {
    var sec = bolt.closest('section') || bolt.parentElement;
    if (sections.indexOf(sec) === -1) sections.push(sec);
  });

  var activeSection = null;

  function updateActiveSection() {
    var viewportCenter = window.innerHeight * 0.42;
    var bestSec = null;
    var bestDist = Infinity;

    sections.forEach(function (sec) {
      var rect = sec.getBoundingClientRect();
      if (rect.bottom > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.72) {
        var secCenter = (Math.max(0, rect.top) + Math.min(window.innerHeight, rect.bottom)) / 2;
        var dist = Math.abs(secCenter - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestSec = sec;
        }
      }
    });

    if (bestSec !== activeSection) {
      activeSection = bestSec;
      bolts.forEach(function (bolt) {
        var sec = bolt.closest('section') || bolt.parentElement;
        if (sec === activeSection) {
          bolt.classList.remove('is-struck');
          void bolt.getBoundingClientRect();
          bolt.classList.add('is-struck');
        } else {
          bolt.classList.remove('is-struck');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection, { passive: true });
  updateActiveSection();
})();

// Staggered bit-by-bit reveal for Qualifications & Standards (.trust__row)
(function () {
  // Service-page card grids use inline styles, so tag them here
  document.querySelectorAll('.services .wrap > div[style*="grid-template-columns"], .service-cards').forEach(function (g) {
    g.classList.add('card-grid');
  });

  var rows = document.querySelectorAll('.trust__row, .coverage__line, .process__steps, .card-grid, .service-steps');
  if (!rows.length || !('IntersectionObserver' in window)) return;

  rows.forEach(function (row) {
    row.classList.add('has-reveal');
    var kids = row.classList.contains('process__steps') ? row.querySelectorAll('.step') :
      row.classList.contains('card-grid') ? row.children : row.children;
    Array.prototype.forEach.call(kids, function (k, i) { k.style.setProperty('--i', i % 4); });
  });

  var rowObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.18 });

  rows.forEach(function (row) { rowObserver.observe(row); });
})();

// Interactive 3-Step Quote Builder -> Sleek Structured Email & WhatsApp Job Sheet
(function () {
  var form = document.getElementById('quote-form');
  if (!form || form.hasAttribute('data-service-form')) return;

  var SERVICES = [
    {
      id: 'rewire',
      num: '01',
      name: 'Full / Partial Rewire',
      desc: 'House rewires, extensions & renovations',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z"/><path d="M13 10l-2.5 4h3L11 18"/></svg>',
      questions: [
        { key: 'Scope of work', options: ['Full house rewire', 'Partial / Extension', 'Not sure — need advice'] },
        { key: 'Property size', options: ['1–2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms'] },
        { key: 'Occupancy', options: ['Empty / Before moving in', 'Currently lived in', 'Tenanted property'] }
      ]
    },
    {
      id: 'consumer-unit',
      num: '02',
      name: 'Consumer Unit Upgrade',
      desc: 'Modern metal RCBO & SPD fuseboards',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M7 9v6M11 9v6M15 9v6M18 9v6"/><path d="M6 12h2M10 11h2M14 13h2"/></svg>',
      questions: [
        { key: 'Reason for upgrade', options: ['Old fuse box', 'RCD / Fuse tripping', 'For EV / Solar / Kitchen', 'EICR recommendation'] },
        { key: 'Property size', options: ['1–2 Bedrooms', '3 Bedrooms', '4+ Bedrooms'] },
        { key: 'Include full EICR test?', options: ['Yes — fuseboard + EICR', 'Fuseboard upgrade only', 'Unsure — advise me'] }
      ]
    },
    {
      id: 'fault-finding',
      num: '03',
      name: 'Fault Finding & Repairs',
      desc: 'Tripping fuses, dead sockets & callouts',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 10-12h-7l0-8z"/></svg>',
      questions: [
        { key: 'What is happening?', options: ['Fuse / RCD keeps tripping', 'Loss of power or lights', 'Burning smell / sparking', 'Other electrical fault'] },
        { key: 'Affected circuit', options: ['Sockets', 'Lighting', 'Shower / Cooker', 'Whole property'] },
        { key: 'Urgency', options: ['Urgent — Today', 'Next 2–3 days', 'This week'] }
      ]
    },
    {
      id: 'eicr',
      num: '04',
      name: 'EICR & Landlord Test',
      desc: 'Safety certificates, rentals & homebuyers',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 13l2 2 4-4"/></svg>',
      questions: [
        { key: 'Purpose of EICR', options: ['Landlord / Rental let', 'Buying or selling home', 'Homeowner peace of mind', 'Commercial / Holiday let'] },
        { key: 'Property size', options: ['1–2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms'] },
        { key: 'When is report needed?', options: ['ASAP / This week', 'Within 2–4 weeks', 'Flexible'] }
      ]
    },
    {
      id: 'ev-charger',
      num: '05',
      name: 'EV Charger Install',
      desc: '7kW home driveway & garage chargers',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="10" height="16" rx="1.5"/><path d="M15 9h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0v-5l-2-2"/><path d="M10.5 8.5L8.5 12h3l-1 3.5"/></svg>',
      questions: [
        { key: 'Parking setup', options: ['Driveway next to house', 'Detached garage', 'Longer cable run (>10m)'] },
        { key: 'Charger unit', options: ['Supply & fit charger', 'I already have the unit', 'Need advice on unit'] },
        { key: 'Main fuseboard location', options: ['Near driveway / garage', 'Middle or back of house', 'Not sure'] }
      ]
    },
    {
      id: 'garden-power',
      num: '06',
      name: 'Garden & Outbuilding',
      desc: 'Armoured SWA cable to sheds & offices',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16"/><path d="M6 20v-8l6-5 6 5v8"/><rect x="10" y="13" width="4" height="4"/><path d="M12 11v2"/></svg>',
      questions: [
        { key: 'What are you powering?', options: ['Garden room / Office', 'Garage / Workshop', 'Hot tub / Heat pump', 'Outdoor sockets & lights'] },
        { key: 'Distance from house', options: ['Under 10 metres', '10–25 metres', 'Over 25 metres'] },
        { key: 'Timeframe', options: ['Ready now', 'Next 2–4 weeks', 'Planning ahead'] }
      ]
    },
    {
      id: 'kitchen',
      num: '07',
      name: 'Kitchen Electrics',
      desc: 'First & second fix for new kitchens',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1.5"/><circle cx="8.5" cy="9.5" r="2"/><circle cx="15.5" cy="9.5" r="2"/><circle cx="8.5" cy="15.5" r="2"/><circle cx="15.5" cy="15.5" r="2"/></svg>',
      questions: [
        { key: 'Project type', options: ['Full new kitchen', 'Cooker / Induction hob circuit', 'Kitchen + extension'] },
        { key: 'Kitchen layout plans', options: ['Plans ready now', 'Awaiting kitchen supplier', 'Need initial estimate'] },
        { key: 'Target start timeframe', options: ['Within 2 weeks', '1–2 months', '3+ months'] }
      ]
    },
    {
      id: 'lighting',
      num: '08',
      name: 'Lighting / Other Job',
      desc: 'Downlights, extra sockets & upgrades',
      icon: '<svg class="qb-srv-btn__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M15.5 14.5A5.5 5.5 0 1 0 8.5 14.5c.7.6 1.5 1.5 1.5 2.5h4c0-1 .8-1.9 1.5-2.5z"/></svg>',
      questions: [
        { key: 'Work required', options: ['LED downlights / Feature lights', 'Outdoor / Security lighting', 'Extra sockets / Switches', 'Other domestic job'] },
        { key: 'Number of rooms / areas', options: ['Single room / area', '2–3 rooms', 'Whole property'] },
        { key: 'Timeframe', options: ['ASAP / This week', 'Next few weeks', 'Flexible'] }
      ]
    }
  ];

  var state = {
    step: 1,
    service: SERVICES[0],
    answers: {},
    autoAdvanced: false
  };

  var STEP_LABELS = {
    1: 'STEP 1 OF 3',
    2: 'STEP 2 OF 3',
    3: 'STEP 3 OF 3',
    4: 'JOB SHEET GENERATED'
  };

  form.innerHTML = [
    '<div class="qb">',
    '  <div class="qb__top">',
    '    <span class="qb__step-label" id="qb-step-label">' + STEP_LABELS[1] + '</span>',
    '    <div class="qb__progress" aria-hidden="true">',
    '      <span class="qb__bar is-active" data-bar="1"></span>',
    '      <span class="qb__bar" data-bar="2"></span>',
    '      <span class="qb__bar" data-bar="3"></span>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- STEP 1: SERVICE SELECTION -->',
    '  <div class="qb-panel is-active" data-panel="1">',
    '    <div class="qb__head">',
    '      <h3 class="qb__title">Start your enquiry</h3>',
    '      <p class="qb__sub">Tap a service to start. Then answer a few quick questions and leave your contact details.</p>',
    '    </div>',
    '    <div class="qb-service-grid" id="qb-service-grid"></div>',
    '  </div>',
    '',
    '  <!-- STEP 2: TAILORED QUESTIONS -->',
    '  <div class="qb-panel" data-panel="2">',
    '    <div class="qb-nav-bar">',
    '      <span class="qb-badge"><span class="qb-badge__dot"></span><span id="qb-active-srv-name"></span></span>',
    '      <button type="button" class="qb-back" data-goto="1">&larr; Change service</button>',
    '    </div>',
    '    <div class="qb__head">',
    '      <h3 class="qb__title">A few quick details</h3>',
    '      <p class="qb__sub">Tap the options that best match your property.</p>',
    '    </div>',
    '    <div class="qb-q-list" id="qb-q-list"></div>',
    '    <button type="button" class="btn btn--red btn--lg btn--block" id="qb-next-to-3">Continue to Contact Details &rarr;</button>',
    '  </div>',
    '',
    '  <!-- STEP 3: CONTACT & JOB SHEET PREVIEW -->',
    '  <div class="qb-panel" data-panel="3">',
    '    <div class="qb-nav-bar">',
    '      <span class="qb-badge"><span class="qb-badge__dot"></span><span id="qb-step3-srv-name"></span></span>',
    '      <button type="button" class="qb-back" data-goto="2">&larr; Edit answers</button>',
    '    </div>',
    '    <div class="qb-sheet-preview">',
    '      <div class="qb-sheet-preview__head">',
    '        <span>Job Sheet Summary</span>',
    '        <span>Ready to attach</span>',
    '      </div>',
    '      <div class="qb-sheet-preview__items" id="qb-summary-chips"></div>',
    '    </div>',
    '    <div class="field-row">',
    '      <div class="field">',
    '        <label for="qb-name">Your Name</label>',
    '        <input id="qb-name" name="name" type="text" autocomplete="name" placeholder="e.g. Sarah Bell" required>',
    '      </div>',
    '      <div class="field">',
    '        <label for="qb-phone">Phone number</label>',
    '        <input id="qb-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="07xxx xxxxxx" required>',
    '      </div>',
    '    </div>',
    '    <div class="field">',
    '      <label for="qb-postcode">Postcode or Town in Cumbria</label>',
    '      <input id="qb-postcode" name="postcode" type="text" autocomplete="postal-code" placeholder="e.g. CA1, Carlisle, Penrith..." required>',
    '    </div>',
    '    <div class="field">',
    '      <label for="qb-notes">Anything else Finn should know? <span style="opacity:.55;font-weight:400;">(Optional)</span></label>',
    '      <textarea id="qb-notes" name="message" rows="2" placeholder="Any extra details, preferred callback times, or access notes..."></textarea>',
    '    </div>',
    '    <button class="btn btn--red btn--lg btn--block" type="submit">Generate &amp; Send Job Sheet &rarr;</button>',
    '    <p class="form__status" id="form-status" role="status" aria-live="polite"></p>',
    '  </div>',
    '',
    '  <!-- STEP 4: SLEEK EMAIL PREVIEW & DISPATCH -->',
    '  <div class="qb-panel" data-panel="4">',
    '    <div class="qb-nav-bar">',
    '      <span class="qb-badge"><span class="qb-badge__dot"></span>JOB SHEET READY FOR FINN GRAHAM</span>',
    '      <button type="button" class="qb-back" data-goto="1">&larr; Start another enquiry</button>',
    '    </div>',
    '    <div class="qb-email-card">',
    '      <div class="qb-email-card__meta" id="qb-email-meta"></div>',
    '      <pre class="qb-email-card__body" id="qb-email-body"></pre>',
    '    </div>',
    '    <div class="qb-done-actions">',
    '      <a class="btn btn--red btn--lg btn--block" id="qb-mailto-btn" href="#">Open in Email App</a>',
    '      <a class="btn btn--wa-red btn--lg btn--block" id="qb-wa-btn" href="#" target="_blank" rel="noopener">Send via WhatsApp</a>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  var serviceGrid = document.getElementById('qb-service-grid');
  var qList = document.getElementById('qb-q-list');
  var stepLabel = document.getElementById('qb-step-label');
  var activeSrvName = document.getElementById('qb-active-srv-name');
  var step3SrvName = document.getElementById('qb-step3-srv-name');
  var summaryChips = document.getElementById('qb-summary-chips');
  var statusEl = document.getElementById('form-status');

  function renderServices() {
    serviceGrid.innerHTML = SERVICES.map(function (srv) {
      return [
        '<button type="button" class="qb-srv-btn" data-srv="' + srv.id + '">',
        '  <span class="qb-srv-btn__top"><span class="qb-srv-btn__id">' + srv.icon + '</span></span>',
        '  <span class="qb-srv-btn__name">' + srv.name + '</span>',
        '  <span class="qb-srv-btn__desc">' + srv.desc + '</span>',
        '  <span class="qb-srv-btn__start">Start enquiry <span class="qb-srv-btn__arrow" aria-hidden="true">&rarr;</span></span>',
        '</button>'
      ].join('');
    }).join('');

    serviceGrid.querySelectorAll('.qb-srv-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var srvId = btn.getAttribute('data-srv');
        var found = SERVICES.filter(function (s) { return s.id === srvId; })[0];
        if (found) {
          selectService(found, true);
        }
      });
    });
  }

  function selectService(srv, advanceToStep2) {
    if (state.service.id !== srv.id) {
      state.answers = {};
      state.autoAdvanced = false;
    }
    state.service = srv;

    serviceGrid.querySelectorAll('.qb-srv-btn').forEach(function (b) {
      b.classList.toggle('is-selected', b.getAttribute('data-srv') === srv.id);
    });

    activeSrvName.textContent = srv.name;
    step3SrvName.textContent = srv.name;
    renderQuestions();
    if (advanceToStep2) {
      goToStep(2);
    }
  }

  function renderQuestions() {
    var srv = state.service;
    qList.innerHTML = srv.questions.map(function (q) {
      var currentVal = state.answers[q.key] || '';
      var pillsHtml = q.options.map(function (opt) {
        var sel = currentVal === opt ? ' is-selected' : '';
        return '<button type="button" class="qb-pill' + sel + '" data-qkey="' + q.key + '" data-qval="' + opt + '">' +
          '<span>' + opt + '</span><span class="qb-pill__check"></span></button>';
      }).join('');

      return [
        '<div class="qb-q">',
        '  <p class="qb-q__label">' + q.key + '</p>',
        '  <div class="qb-pills">' + pillsHtml + '</div>',
        '</div>'
      ].join('');
    }).join('');

    qList.querySelectorAll('.qb-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var key = pill.getAttribute('data-qkey');
        var val = pill.getAttribute('data-qval');
        state.answers[key] = val;

        var parent = pill.closest('.qb-pills');
        parent.querySelectorAll('.qb-pill').forEach(function (p) {
          p.classList.toggle('is-selected', p === pill);
        });

        // If all 3 questions have been answered for the first time, smoothly advance to Step 3
        var answeredCount = srv.questions.filter(function (q) { return Boolean(state.answers[q.key]); }).length;
        if (answeredCount === srv.questions.length && !state.autoAdvanced) {
          state.autoAdvanced = true;
          setTimeout(function () {
            goToStep(3);
          }, 220);
        }
      });
    });
  }

  function renderSummaryChips() {
    var srv = state.service;
    var chips = ['<span class="qb-chip"><strong>Service:</strong> ' + srv.name + '</span>'];
    srv.questions.forEach(function (q) {
      var ans = state.answers[q.key] || 'Not specified';
      chips.push('<span class="qb-chip"><strong>' + q.key + ':</strong> ' + ans + '</span>');
    });
    summaryChips.innerHTML = chips.join('');
  }

  function goToStep(stepNum) {
    state.step = stepNum;
    if (stepNum === 3) {
      renderSummaryChips();
    }
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form__status';
    }

    stepLabel.textContent = STEP_LABELS[stepNum] || STEP_LABELS[1];

    form.querySelectorAll('.qb-panel').forEach(function (panel) {
      var pNum = parseInt(panel.getAttribute('data-panel'), 10);
      panel.classList.toggle('is-active', pNum === stepNum);
    });

    form.querySelectorAll('.qb__bar').forEach(function (bar) {
      var bNum = parseInt(bar.getAttribute('data-bar'), 10);
      bar.classList.toggle('is-active', bNum <= Math.min(stepNum, 3));
    });
  }

  form.querySelectorAll('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = parseInt(btn.getAttribute('data-goto'), 10);
      goToStep(target);
    });
  });

  var nextTo3Btn = document.getElementById('qb-next-to-3');
  if (nextTo3Btn) {
    nextTo3Btn.addEventListener('click', function () {
      goToStep(3);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (state.step !== 3) return;

    var nameInput = document.getElementById('qb-name');
    var phoneInput = document.getElementById('qb-phone');
    var postcodeInput = document.getElementById('qb-postcode');
    var notesInput = document.getElementById('qb-notes');

    var missing = null;
    [nameInput, phoneInput, postcodeInput].forEach(function (input) {
      var ok = input.value.trim() !== '';
      var wrapper = input.closest('.field');
      if (wrapper) wrapper.classList.toggle('is-invalid', !ok);
      if (!ok && !missing) missing = input;
    });

    if (missing) {
      statusEl.className = 'form__status is-err';
      statusEl.textContent = 'Please enter your name, phone number, and postcode/town in Cumbria.';
      missing.focus();
      return;
    }

    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var postcode = postcodeInput.value.trim();
    var notes = notesInput.value.trim();
    var srv = state.service;

    var specLines = srv.questions.map(function (q) {
      return '  • ' + q.key + ': ' + (state.answers[q.key] || 'Not specified');
    }).join('\n');

    var subjectText = 'FG Electrical Job Sheet: ' + srv.name + ' — ' + postcode.toUpperCase() + ' (' + name + ')';
    var bodyText = [
      'FG ELECTRICAL — NEW WEBSITE JOB ENQUIRY',
      '==================================================',
      '',
      'CUSTOMER DETAILS',
      '  • Name:      ' + name,
      '  • Phone:     ' + phone,
      '  • Location:  ' + postcode + ' (Cumbria)',
      '',
      'JOB SPECIFICATION (' + srv.name.toUpperCase() + ')',
      specLines,
      '',
      'ADDITIONAL CUSTOMER NOTES',
      '  ' + (notes || 'None added.'),
      '',
      '==================================================',
      'Sent via FG Electrical Online Quote Builder'
    ].join('\n');

    var mailtoUrl = 'mailto:finngraham87@gmail.com?subject=' + encodeURIComponent(subjectText) + '&body=' + encodeURIComponent(bodyText);
    var waText = [
      'Hi Finn, I\'ve just filled in a job sheet on your website:',
      '',
      '*Service:* ' + srv.name,
      srv.questions.map(function (q) { return '*' + q.key + ':* ' + (state.answers[q.key] || 'Not specified'); }).join('\n'),
      '*Location:* ' + postcode,
      '*Name:* ' + name + ' (' + phone + ')',
      notes ? '*Notes:* ' + notes : ''
    ].filter(Boolean).join('\n');
    var waUrl = 'https://wa.me/447495333990?text=' + encodeURIComponent(waText);

    document.getElementById('qb-email-meta').innerHTML =
      '<div><strong>TO:</strong> finngraham87@gmail.com (Finn Graham &middot; FG Electrical)</div>' +
      '<div><strong>SUBJECT:</strong> ' + subjectText + '</div>';
    document.getElementById('qb-email-body').textContent = bodyText;
    document.getElementById('qb-mailto-btn').setAttribute('href', mailtoUrl);
    document.getElementById('qb-wa-btn').setAttribute('href', waUrl);

    goToStep(4);
    window.location.href = mailtoUrl;
  });

  renderServices();
})();
