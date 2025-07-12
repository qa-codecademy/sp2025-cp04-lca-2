document.addEventListener("DOMContentLoaded", function () {
    const burgerIcons = document.querySelectorAll('#burger-icon');
    const crossIcons = document.querySelectorAll('#cross-icon');
    const sideMenus = document.querySelectorAll('.header_nav_section_mobile_nav');
  
    burgerIcons.forEach((burgerIcon, index) => {
      const sideMenu = sideMenus[index] || sideMenus[0];
      if (burgerIcon && sideMenu) {
        burgerIcon.addEventListener('click', () => {
          sideMenu.classList.toggle('open');
        });
      }
    });
  
    crossIcons.forEach((crossIcon, index) => {
      const sideMenu = sideMenus[index] || sideMenus[0];
      if (crossIcon && sideMenu) {
        crossIcon.addEventListener('click', () => {
          sideMenu.classList.toggle('open');
        });
      }
    });
  });
  