const profile = {
  name: 'Amjad Ullah',
  role: 'Founder · Product Designer',
  githubProfile: 'https://github.com/amjiofficial',
  githubRepo: 'https://github.com/amjiofficial/kreatorekick',
  avatar: 'https://avatars.githubusercontent.com/u/66307277?v=4',
  launch: '2024',
  teamSize: 'OSAM & Professional'
};

const teamMembers = [
  {
    name: 'Amjad Ullah',
    role: 'Product Design',
    focus: 'Experience architecture & visual systems',
    tag: 'Founder',
    github: 'https://github.com/amjiofficial'
  },
  {
    name: 'Saqib Ullah',
    role: 'Platform Engineering',
    focus: 'APIs, performance, reliability',
    tag: 'Engineer',
    github: 'https://github.com/saqib77official'
  },
  {
    name: 'Abdul Samad',
    role: 'Product Engineering',
    focus: 'Frontline builds & delivery',
    tag: 'Engineer',
    github: 'https://github.com/abdulsamad255'
  },
  {
    name: 'Fateh Ullah',
    role: 'Product Strategy',
    focus: 'Direction, validation, insights',
    tag: 'Advisor',
    github: 'https://github.com/fatehullah778866'
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
    link.className = 'me-links';

    content.appendChild(name);
    content.appendChild(role);
    content.appendChild(focus);
    content.appendChild(badge);
    content.appendChild(link);
    card.appendChild(content);
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setProfile();
  renderTeam();
});
