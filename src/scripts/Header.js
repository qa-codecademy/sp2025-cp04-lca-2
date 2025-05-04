const burgerIcon = document.querySelector('#burger-icon')
const crossIcon = document.querySelector('#cross-icon')
const sideMenu = document.querySelector('.header_nav_section_mobile_nav')

burgerIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});
crossIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
});