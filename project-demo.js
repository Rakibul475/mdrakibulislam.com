(() => {
  const projects = window.RIFATH_PROJECTS;
  const id = new URLSearchParams(location.search).get('project');
  const project = projects[id];
  const demo = document.getElementById('demo');
  const links = document.getElementById('project-links');
  Object.entries(projects).forEach(([key, item]) => {
    if (key === id) return;
    const a = document.createElement('a'); a.href = 'project.html?project=' + key; a.textContent = item.title; links.append(a);
  });
  if (!project) { demo.textContent = 'Choose a project below to explore its demonstration.'; return; }
  document.title = project.title + ' — Rifath';
  document.querySelector('meta[name="description"]').content = project.copy;
  for (const key of ['title', 'type', 'copy', 'tags']) document.getElementById('project-' + key).textContent = project[key];
  function result() { const el = document.createElement('div'); el.className = 'demo-result'; el.setAttribute('aria-live', 'polite'); demo.append(el); return el; }
  function controls(options, update) {
    const row = document.createElement('div'); row.className = 'demo-controls'; demo.append(row);
    options.forEach((name, index) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = name; b.setAttribute('aria-pressed', String(index === 0)); row.append(b); b.addEventListener('click', () => { row.querySelectorAll('button').forEach(btn => btn.setAttribute('aria-pressed', String(btn === b))); update(index); }); });
  }
  function note(text) { const p = document.createElement('p'); p.textContent = text; demo.append(p); }
  if (id === 'transfer-checklist' || id === 'freshman-documents') {
    note('Explore how an applicant checklist can surface outstanding documents. These fictional records illustrate the workflow; this is not a live Slate connection.');
    const records = id === 'transfer-checklist' ? [['T-1001','College transcript','Missing'],['T-1002','College transcript','Received'],['T-1003','English proficiency','Missing']] : [['F-2001','High school transcript','Missing'],['F-2002','English proficiency','Received'],['F-2003','High school transcript','Received']];
    let box; const update = index => { box.replaceChildren(); const table = document.createElement('table'); table.className = 'demo-table'; const head = table.createTHead().insertRow(); ['Applicant','Document','Status'].forEach(t => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = t; head.append(th); }); const body = table.createTBody(); const visible = records.filter(r => index === 0 || r[2] === 'Missing'); visible.forEach(r => { const row = body.insertRow(); r.forEach(v => row.insertCell().textContent = v); }); box.append(table); const p = document.createElement('p'); p.textContent = visible.length + ' sample records shown'; box.append(p); };
    controls(['All documents','Outstanding only'], update); box = result(); update(0);
  } else if (id === 'transcript-communication') {
    note('Select a missing document to see a sample applicant message change. Submission instructions here are illustrative.');
    let box; const update = i => { box.textContent = 'Hello Sample Applicant, your ' + ['college transcript','high school transcript','graduate transcript'][i] + ' is still outstanding. Please review the official submission instructions in your university application portal and monitor your checklist for updates.'; };
    controls(['College','High school','Graduate'], update); box = result(); update(0);
  } else if (id === 'applicant-journey') {
    note('Step through a sample communication journey, from account setup to application monitoring.');
    const stages = [['Set up your account','Activate your university account using the instructions in your official welcome message.'],['Review your checklist','Check your application portal for outstanding items and published deadlines.'],['Submit documents','Follow the institution’s official document submission requirements.'],['Monitor your application','Return to the portal to review updates and any additional requests.']];
    let box; const update = i => { box.replaceChildren(); const h = document.createElement('h3'); h.textContent = stages[i][0]; const p = document.createElement('p'); p.textContent = stages[i][1]; box.append(h,p); };
    controls(['Account','Checklist','Documents','Status'], update); box = result(); update(0);
  } else if (id === 'message-qa') {
    note('Compare a deliberately flawed sample message with a corrected version. Checks operate on these local examples.');
    const samples = ['Hello {{name}}, visit our portal: http://example.invalid/apply', 'Hello Sample Applicant, visit our portal: https://example.com/apply'];
    let box; const update = i => { const message = samples[i]; box.replaceChildren(); const p = document.createElement('p'); p.textContent = message; const ul = document.createElement('ul'); [message.includes('{{') ? 'Needs review: unresolved placeholder' : 'Pass: greeting resolved', message.includes('https://') ? 'Pass: HTTPS format' : 'Needs review: insecure URL', 'Destination availability not tested'].forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.append(li); }); box.append(p,ul); };
    controls(['Before QA','After QA'], update); box = result(); update(0);
  } else if (id === 'immersive-portfolio') {
    document.querySelector('.demo-label').textContent = 'LIVE PROJECT · PORTFOLIO EXPERIENCE';
    note('Explore the actual portfolio: a WebGL background, scroll-driven camera movement, and continuously orbiting project links.');
    const globe = document.createElement('div'); globe.className = 'demo-sphere'; globe.setAttribute('aria-hidden','true'); demo.append(globe);
    const a = document.createElement('a'); a.href = 'index.html'; a.className = 'demo-link'; a.textContent = 'Launch the immersive portfolio ↗'; demo.append(a);
  } else {
    note('Explore a sample repeatable process for configuring and validating an applicant query.');
    const steps = [['Define the population','Specify applicant type and term before selecting fields.'],['Select fields','Include a unique applicant identifier, document name, and checklist status.'],['Validate results','Compare a small sample with the source records; investigate blanks and duplicate rows.'],['Document the workflow','Record assumptions, field definitions, validation steps, and known limitations.']];
    let box; const update = i => { box.replaceChildren(); const h = document.createElement('h3'); h.textContent = steps[i][0]; const p = document.createElement('p'); p.textContent = steps[i][1]; box.append(h,p); };
    controls(['Population','Fields','Validation','Documentation'], update); box = result(); update(0);
  }
})();
