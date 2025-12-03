const profile = {
  name: 'Amjad Ullah',
  role: 'Founder · Product Designer',
  githubProfile: 'https://github.com/your-github',
  githubRepo: 'https://github.com/your-github/kreativekick',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  launch: '2024',
  teamSize: 'OSAM & Professional'
};

const teamMembers = [
  {
    name: 'Amjad Ullah',
    role: 'Product Design',
    focus: 'Experience architecture & visual systems',
    tag: 'Founder'
  },
  {
    name: 'Kompass Engineering',
    role: 'Platform Engineering',
    focus: 'Infrastructure, performance, reliability',
    tag: 'Core Team'
  },
  {
    name: 'Product Guild',
    role: 'Research & Strategy',
    focus: 'Discovery, validation, and insights',
    tag: 'Advisory'
  }
];

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
    ghLink.textContent = 'GitHub Profile';
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

    content.appendChild(name);
    content.appendChild(role);
    content.appendChild(focus);
    content.appendChild(badge);
    card.appendChild(content);
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setProfile();
  renderTeam();
});
