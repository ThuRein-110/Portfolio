const filterButtons = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
const themeToggle = document.querySelector('.theme-toggle');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    projects.forEach((project) => {
      const categories = project.dataset.category.split(' ');
      project.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

themeToggle.addEventListener('click', () => {
  const isActive = document.body.classList.toggle('high-contrast');
  themeToggle.setAttribute('aria-pressed', String(isActive));
});

document.querySelector('#year').textContent = new Date().getFullYear();
