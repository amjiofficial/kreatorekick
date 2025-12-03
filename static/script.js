const profile = {
  name: 'Amjad Ullah',
  role: 'Founder · Product Designer',
  githubProfile: 'https://github.com/amjiofficial',
  githubRepo: 'https://github.com/amjiofficial/kreatorekick',
  avatar: 'https://github.com/amjiofficial.png',
  launch: '2024',
  teamSize: 'OSAM & Professional'
};

const teamMembers = [
  {
    name: 'Amjad Ullah',
    role: 'Product Design',
    focus: 'Experience architecture & visual systems',
    tag: 'Founder',
    github: 'https://github.com/amjiofficial',
    avatar: 'https://github.com/amjiofficial.png'
  },
  {
    name: 'Saqib Ullah',
    role: 'Platform Engineering',
    focus: 'APIs, performance, reliability',
    tag: 'Engineer',
    github: 'https://github.com/saqib77official',
    avatar: 'https://github.com/saqib77official.png'
  },
  {
    name: 'Abdul Samad',
    role: 'Product Engineering',
    focus: 'Frontline builds & delivery',
    tag: 'Engineer',
    github: 'https://github.com/abdulsamad255',
    avatar: 'https://github.com/abdulsamad255.png'
  },
  {
    name: 'Fateh Ullah',
    role: 'Product Strategy',
    focus: 'Direction, validation, insights',
    tag: 'Advisor',
    github: 'https://github.com/fatehullah778866',
    avatar: 'https://github.com/fatehullah778866.png'
  }
];

const personalRecords = [];
let editingId = null;

function setProfile() {
  const avatar = document.getElementById('me-avatar');
  const nameEl = document.getElementById('me-name');
  const roleEl = document.getElementById('me-role');
  const ghLink = document.getElementById('me-gh');
  const ghCta = document.getElementById('github-cta');
  const launch = document.getElementById('stat-launch');
  const team = document.getElementById('stat-team');

  if (avatar) {
    avatar.src = profile.avatar;
  }
  if (nameEl) nameEl.textContent = profile.name;
  if (roleEl) roleEl.textContent = profile.role;
  if (ghLink) {
    ghLink.href = profile.githubProfile;
    ghLink.textContent = 'GitHub';
  }
  if (ghCta) {
    ghCta.href = profile.githubRepo;
  }
  if (launch) launch.textContent = profile.launch;
  if (team) team.textContent = profile.teamSize;
}

function renderTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  grid.innerHTML = '';

  teamMembers.forEach((member) => {
    const card = document.createElement('article');
    card.className = 'team-card';

    const content = document.createElement('div');
    content.className = 'team-card-content';

    const avatar = document.createElement('img');
    avatar.className = 'team-avatar';
    avatar.src = member.avatar;
    avatar.alt = member.name;

    const name = document.createElement('h4');
    name.className = 'team-name';
    name.textContent = member.name;

    const role = document.createElement('p');
    role.className = 'team-role';
    role.textContent = member.role;

    const focus = document.createElement('p');
    focus.className = 'team-focus';
    focus.textContent = member.focus;

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = member.tag;

    const link = document.createElement('a');
    link.href = member.github;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'GitHub';
    link.className = 'profile-link';

    content.appendChild(avatar);
    content.appendChild(name);
    content.appendChild(role);
    content.appendChild(focus);
    content.appendChild(badge);
    content.appendChild(link);
    card.appendChild(content);
    grid.appendChild(card);
  });
}

async function renderPersonalTable() {
  const body = document.getElementById('personal-body');
  if (!body) return;

  body.innerHTML = '';

  if (personalRecords.length === 0) {
    const empty = document.createElement('tr');
    empty.className = 'empty-row';
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = 'No records yet. Add a person to see it here.';
    empty.appendChild(cell);
    body.appendChild(empty);
    return;
  }

  personalRecords.forEach((record) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = record.name;

    const fatherCell = document.createElement('td');
    fatherCell.textContent = record.fatherName;

    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions-col';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'action-btn ghost';
    editBtn.dataset.action = 'edit';
    editBtn.dataset.id = record.id?.toString() ?? '';
    editBtn.textContent = 'Update';

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'action-btn danger';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.id = record.id?.toString() ?? '';
    deleteBtn.textContent = 'Delete';

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    row.appendChild(nameCell);
    row.appendChild(fatherCell);
    row.appendChild(actionsCell);
    body.appendChild(row);
  });
}

async function fetchPersonalRecords(statusCb) {
  try {
    const res = await fetch('/api/personal');
    if (!res.ok) {
      throw new Error(`Failed to load: ${res.status}`);
    }
    const data = await res.json();
    personalRecords.splice(0, personalRecords.length, ...data);
    await renderPersonalTable();
    statusCb?.('Loaded records from database.');
  } catch (err) {
    console.error(err);
    statusCb?.('Could not load records from the server.');
  }
}

function setupPersonalForm() {
  const form = document.getElementById('personal-form');
  const nameInput = document.getElementById('person-name');
  const fatherInput = document.getElementById('person-father');
  const statusEl = document.getElementById('form-status');
  const submitBtn = form ? form.querySelector('.form-submit') : null;
  const table = document.getElementById('personal-table');

  if (!form || !nameInput || !fatherInput || !submitBtn) return;

  const setStatus = (message) => {
    if (statusEl) statusEl.textContent = message;
  };

  const resetFormState = () => {
    editingId = null;
    submitBtn.textContent = 'Save person';
  };

  const upsertPerson = async (payload) => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/personal/${editingId}` : '/api/personal';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Save failed with status ${res.status}`);
    }
    return res.json();
  };

  const deletePerson = async (id) => {
    const res = await fetch(`/api/personal/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Delete failed with status ${res.status}`);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const fatherName = fatherInput.value.trim();

    if (!name || !fatherName) {
      setStatus('Please fill in both name fields.');
      return;
    }

    try {
      const wasEditing = Boolean(editingId);
      await upsertPerson({ name, fatherName });
      await fetchPersonalRecords(setStatus);
      form.reset();
      resetFormState();
      setStatus(wasEditing ? 'Person updated.' : 'Person added to the database.');
    } catch (err) {
      console.error(err);
      setStatus('Could not save to the database.');
    }
  });

  table?.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === 'delete') {
      try {
        await deletePerson(id);
        if (editingId && editingId.toString() === id) {
          form.reset();
          resetFormState();
        }
        await fetchPersonalRecords(setStatus);
        setStatus('Person deleted.');
      } catch (err) {
        console.error(err);
        setStatus('Could not delete from the database.');
      }
    }

    if (action === 'edit') {
      const record = personalRecords.find((rec) => rec.id?.toString() === id);
      if (!record) return;
      nameInput.value = record.name;
      fatherInput.value = record.fatherName;
      editingId = record.id;
      submitBtn.textContent = 'Update person';
      setStatus('Editing mode — update the fields and save.');
      nameInput.focus();
    }
  });

  fetchPersonalRecords(setStatus);
}

document.addEventListener('DOMContentLoaded', () => {
  setProfile();
  renderTeam();
  setupPersonalForm();
});
