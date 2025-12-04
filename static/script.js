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
let filterTerm = '';

function avatarFallback(name) {
  const initials = (name || 'K K')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4fe3c1"/>
          <stop offset="100%" stop-color="#f6c452"/>
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="32" fill="url(#g)"/>
      <text x="50%" y="55%" text-anchor="middle" fill="#061020" font-family="Inter, Arial" font-size="64" font-weight="800" dy=".35em">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function loadAvatar(imgEl, name, url) {
  if (!imgEl) return;
  imgEl.src = url;
  imgEl.onerror = () => {
    imgEl.src = avatarFallback(name);
  };
}

function setProfile() {
  const avatar = document.getElementById('me-avatar');
  const nameEl = document.getElementById('me-name');
  const roleEl = document.getElementById('me-role');
  const ghLink = document.getElementById('me-gh');
  const ghCta = document.getElementById('github-cta');
  const launch = document.getElementById('stat-launch');
  const team = document.getElementById('stat-team');
  const navAvatar = document.getElementById('nav-avatar');

  loadAvatar(avatar, profile.name, profile.avatar);
  loadAvatar(navAvatar, profile.name, profile.avatar);
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
    card.className = 'team-card card-client';

    const content = document.createElement('div');
    content.className = 'team-card-content';

    const avatar = document.createElement('img');
    avatar.className = 'team-avatar';
    avatar.alt = member.name;
    loadAvatar(avatar, member.name, member.avatar);

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

    const social = document.createElement('div');
    social.className = 'social-media';

    const link = document.createElement('a');
    link.href = member.github;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.ariaLabel = `${member.name} on GitHub`;
    link.title = 'GitHub';
    link.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56l-.01-2.03c-3.2.69-3.88-1.37-3.88-1.37-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.75.41-1.26.74-1.55-2.55-.29-5.24-1.28-5.24-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.44.11-3 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.56.23 2.71.11 3 .74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.41-5.27 5.7.42.37.8 1.1.8 2.22l-.01 3.29c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
      </svg>
      <span class="tooltip-social">GitHub</span>
    `;

    content.appendChild(avatar);
    content.appendChild(name);
    content.appendChild(role);
    content.appendChild(focus);
    content.appendChild(badge);
    social.appendChild(link);
    content.appendChild(social);
    card.appendChild(content);
    grid.appendChild(card);
  });
}

function setupNavActions() {
  const recordsBtn = document.getElementById('records-btn');
  const tableCard = document.getElementById('personal-table-card');
  const personalSection = document.getElementById('personal-info');
  const statusEl = document.getElementById('form-status');
  const navToggle = document.getElementById('nav-toggle');
  const overlay = document.getElementById('nav-overlay');
  const drawer = document.getElementById('mobile-drawer');
  const drawerClose = drawer ? drawer.querySelector('.drawer-close') : null;
  const drawerLinks = drawer ? drawer.querySelector('.drawer-links') : null;
  let drawerOpen = false;

  if (!recordsBtn) return;

  recordsBtn.addEventListener('click', async () => {
    personalSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    await fetchPersonalRecords((message) => {
      if (statusEl) statusEl.textContent = 'Records refreshed.';
      return message;
    });
    if (tableCard) {
      tableCard.classList.add('pulse');
      setTimeout(() => tableCard.classList.remove('pulse'), 1200);
    }
  });

  const getFocusable = () =>
    drawer?.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');

  const setDrawerState = (isOpen) => {
    drawerOpen = isOpen;
    drawer?.classList.toggle('open', isOpen);
    overlay?.classList.toggle('open', isOpen);
    navToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      const focusable = getFocusable();
      focusable && focusable[0]?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      navToggle?.focus();
    }
  };

  navToggle?.addEventListener('click', () => setDrawerState(true));
  overlay?.addEventListener('click', () => setDrawerState(false));
  drawerClose?.addEventListener('click', () => setDrawerState(false));
  drawerLinks?.addEventListener('click', (e) => {
    if (e.target instanceof HTMLAnchorElement) {
      setDrawerState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!drawerOpen) return;
    if (e.key === 'Escape') {
      setDrawerState(false);
      return;
    }
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

async function renderPersonalTable() {
  const body = document.getElementById('personal-body');
  if (!body) return;

  body.innerHTML = '';

  const term = filterTerm.trim().toLowerCase();
  const rows = term
    ? personalRecords.filter(
        (rec) =>
          rec.name?.toLowerCase().includes(term) || rec.fatherName?.toLowerCase().includes(term)
      )
    : personalRecords;

  if (rows.length === 0) {
    const empty = document.createElement('tr');
    empty.className = 'empty-row';
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = term ? 'No matching records.' : 'No records yet. Add a person to see it here.';
    empty.appendChild(cell);
    body.appendChild(empty);
    return;
  }

  rows.forEach((record) => {
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

function setupSearchBar() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  if (!searchInput || !searchBtn) return;

  const applySearch = () => {
    filterTerm = searchInput.value || '';
    renderPersonalTable();
  };

  searchBtn.addEventListener('click', applySearch);
  searchInput.addEventListener('input', applySearch);
}

document.addEventListener('DOMContentLoaded', () => {
  setProfile();
  renderTeam();
  setupNavActions();
  setupPersonalForm();
  setupSearchBar();
});
