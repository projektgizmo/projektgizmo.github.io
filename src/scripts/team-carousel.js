const teamCarousel = document.querySelector('[data-team-carousel]');

if (teamCarousel) {
  const members = [...teamCarousel.querySelectorAll('[data-team-member]')];
  const details = [...teamCarousel.querySelectorAll('[data-team-detail]')];
  const identityName = teamCarousel.querySelector('[data-team-name]');
  const identityRole = teamCarousel.querySelector('[data-team-role]');
  let activeIndex = 0;

  const showMember = (index) => {
    activeIndex = (index + members.length) % members.length;
    identityName.textContent = members[activeIndex].dataset.teamName;
    identityRole.textContent = members[activeIndex].dataset.teamRole;
    members.forEach((member, memberIndex) => {
      const active = memberIndex === activeIndex;
      let position = memberIndex - activeIndex;
      if (position > members.length / 2) position -= members.length;
      if (position < -members.length / 2) position += members.length;
      member.classList.toggle('team-carousel__member--active', active);
      member.setAttribute('aria-selected', String(active));
      member.setAttribute('tabindex', active ? '0' : '-1');
      member.style.setProperty('--team-position', position);
      member.classList.toggle('team-carousel__member--offscreen', Math.abs(position) > 2);
      member.setAttribute('aria-hidden', String(Math.abs(position) > 2));
    });
    details.forEach((detail, detailIndex) => {
      const active = detailIndex === activeIndex;
      detail.hidden = !active;
      detail.classList.toggle('team-carousel__detail--active', active);
    });
  };

  members.forEach((member, index) => {
    member.addEventListener('click', () => showMember(index));
    member.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        showMember(index + 1);
        members[activeIndex].focus();
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        showMember(index - 1);
        members[activeIndex].focus();
      }
    });
  });

  teamCarousel.querySelector('[data-team-prev]').addEventListener('click', () => showMember(activeIndex - 1));
  teamCarousel.querySelector('[data-team-next]').addEventListener('click', () => showMember(activeIndex + 1));
  showMember(0);
}
