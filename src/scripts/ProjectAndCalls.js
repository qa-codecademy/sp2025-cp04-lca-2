const ADMIN_PASSWORD = "admin123";
let projects = JSON.parse(localStorage.getItem('projects') || '[]');
let calls = JSON.parse(localStorage.getItem('calls') || '[]');
let isAdmin = false;
let currentFilter = 'all';
let loginStep = 0;
let currentGalleryImages = [];
let currentImageIndex = 0;

function handleLoginClick(language = 'en') {
  const passwordField = document.getElementById(language === 'mk' ? 'admin-password-mk' : 'admin-password');
  const loginButton = document.getElementById(language === 'mk' ? 'login-button-mk' : 'login-button');

  if (loginStep === 0) {
    passwordField.classList.remove('hidden');
    loginButton.textContent = language === 'mk' ? 'Потврди' : 'Confirm';
    loginStep = 1;
  } else {
    loginAdmin(language);
    loginStep = 0;
    loginButton.textContent = language === 'mk' ? 'Логирај Се' : 'Log In';
  }
}

function loginAdmin(language = 'en') {
  const password = document.getElementById(language === 'mk' ? 'admin-password-mk' : 'admin-password').value;
  const panel = document.getElementById(language === 'mk' ? 'admin-panel-mk' : 'admin-panel');
  const loginSection = document.getElementById(language === 'mk' ? 'login-section-mk' : 'login-section-en');

  if (password === ADMIN_PASSWORD) {
    isAdmin = true;
    panel.classList.remove('hidden');
    loginSection.classList.add('hidden');
    renderProjects();
    renderCalls();
  } else {
    alert(language === 'mk' ? 'Неточна лозинка' : 'Wrong Password');
  }
}

function logoutAdmin(language = 'en') {
  isAdmin = false;
  const panel = document.getElementById(language === 'mk' ? 'admin-panel-mk' : 'admin-panel');
  const passwordInput = document.getElementById(language === 'mk' ? 'admin-password-mk' : 'admin-password');
  const loginButton = document.getElementById(language === 'mk' ? 'login-button-mk' : 'login-button');
  const loginSection = document.getElementById(language === 'mk' ? 'login-section-mk' : 'login-section-en');

  panel.classList.add('hidden');
  loginSection.classList.remove('hidden');
  passwordInput.value = '';
  passwordInput.classList.add('hidden');
  loginButton.textContent = language === 'mk' ? 'Логирај Се' : 'Log In';
  renderProjects();
  renderCalls();
}

function saveToLocalStorage() {
  localStorage.setItem('projects', JSON.stringify(projects));
  localStorage.setItem('calls', JSON.stringify(calls));
}

function renderProjects() {
  const listEn = document.getElementById('project-list');
  const listMk = document.getElementById('project-list-mk');

  if (listEn) listEn.innerHTML = '';
  if (listMk) listMk.innerHTML = '';

  projects
    .filter(p => currentFilter === 'all' || p.status === currentFilter)
    .forEach((p, index) => {
      const createProjectItem = () => {
        const item = document.createElement('div');
        item.className = 'project-item';

        const profileImg = document.createElement('img');
        profileImg.src = p.images[0] || '';
        profileImg.className = 'profile-img';
        profileImg.onclick = () => showFullImageGallery(p.images, 0);
        item.appendChild(profileImg);

        const title = document.createElement('h3');
        title.textContent = p.title;
        item.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = p.description;
        item.appendChild(desc);

        const galleryWrapper = document.createElement('div');
        galleryWrapper.className = 'project-gallery-wrapper';

        const gallery = document.createElement('div');
        gallery.className = 'project-gallery';
        p.images.slice(1).forEach((imgUrl, imgIndex) => {
          const img = document.createElement('img');
          img.src = imgUrl;
          img.onclick = () => showFullImageGallery(p.images, imgIndex + 1);
          gallery.appendChild(img);
        });

        galleryWrapper.appendChild(gallery);
        item.appendChild(galleryWrapper);

        if (isAdmin) {
          if (p.status === 'current') {
            const convertBtn = document.createElement('button');
            convertBtn.textContent = 'Означи како завршен';
            convertBtn.onclick = () => {
              p.status = 'completed';
              saveToLocalStorage();
              renderProjects();
            };
            item.appendChild(convertBtn);
          }

          const addImagesInput = document.createElement('input');
          addImagesInput.type = 'file';
          addImagesInput.multiple = true;
          addImagesInput.onchange = () => {
            const files = addImagesInput.files;
            const newImages = [];
            let loadedCount = 0;
            for (let file of files) {
              const reader = new FileReader();
              reader.onload = function(e) {
                newImages.push(e.target.result);
                loadedCount++;
                if (loadedCount === files.length) {
                  projects[index].images.push(...newImages);
                  saveToLocalStorage();
                  renderProjects();
                }
              };
              reader.readAsDataURL(file);
            }
          };
          item.appendChild(addImagesInput);

          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Избриши проект';
          deleteBtn.onclick = () => deleteProject(index);
          item.appendChild(deleteBtn);
        }

        return item;
      };

      if (listEn) listEn.appendChild(createProjectItem());
      if (listMk) listMk.appendChild(createProjectItem());
    });
}

function deleteProject(index) {
  if (!isAdmin) return;
  projects.splice(index, 1);
  saveToLocalStorage();
  renderProjects();
}

function addProject(language = 'en') {
  const title = document.getElementById(language === 'mk' ? 'project-title-mk' : 'project-title').value;
  const description = document.getElementById(language === 'mk' ? 'project-description-mk' : 'project-description').value;
  const status = document.getElementById(language === 'mk' ? 'project-status-mk' : 'project-status').value;
  const files = document.getElementById(language === 'mk' ? 'project-images-mk' : 'project-images').files;
  const images = [];

  for (let file of files) {
    const reader = new FileReader();
    reader.onload = function(e) {
      images.push(e.target.result);
      if (images.length === files.length) {
        projects.push({ title, description, status, images });
        saveToLocalStorage();
        renderProjects();
        alert(language === 'mk' ? 'Проектот е успешно додаден!' : 'Project successfully added!');
      }
    };
    reader.readAsDataURL(file);
  }
}

function addCall(language = 'en') {
  const text = document.getElementById(language === 'mk' ? 'call-text-mk' : 'call-text').value;
  const file = document.getElementById(language === 'mk' ? 'call-image-mk' : 'call-image').files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    calls.push({ text, image: e.target.result });
    saveToLocalStorage();
    renderCalls();
    alert(language === 'mk' ? 'Јавниот повик е успешно објавен!' : 'Public call successfully added!');
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    calls.push({ text, image: null });
    saveToLocalStorage();
    renderCalls();
    alert(language === 'mk' ? 'Јавниот повик е успешно објавен!' : 'Public call successfully added!');
  }
}

function deleteCall(index) {
  if (!isAdmin) return;
  calls.splice(index, 1);
  saveToLocalStorage();
  renderCalls();
}

function renderCalls() {
  const listEn = document.getElementById('call-list');
  const listMk = document.getElementById('call-list-mk');

  if (listEn) listEn.innerHTML = '';
  if (listMk) listMk.innerHTML = '';

  calls.forEach((c, index) => {
    const createItem = () => {
      const item = document.createElement('div');
      item.className = 'call-item';

      const p = document.createElement('p');
      p.textContent = c.text;
      item.appendChild(p);

      if (c.image) {
        const img = document.createElement('img');
        img.src = c.image;
        img.onclick = () => showFullImageGallery([c.image], 0);
        item.appendChild(img);
      }

      if (isAdmin) {
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Избриши';
        delBtn.onclick = () => deleteCall(index);
        item.appendChild(delBtn);
      }

      return item;
    };

    if (listEn) listEn.appendChild(createItem());
    if (listMk) listMk.appendChild(createItem());
  });
}

function setFilter(filter) {
  currentFilter = filter;
  renderProjects();
}

function showFullImageGallery(images, startIndex) {
  currentGalleryImages = images;
  currentImageIndex = startIndex;
  document.getElementById('full-image').src = images[startIndex];
  document.getElementById('image-viewer').classList.remove('hidden');
}

function nextImage(event) {
  event.stopPropagation();
  if (currentGalleryImages.length > 0) {
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    document.getElementById('full-image').src = currentGalleryImages[currentImageIndex];
  }
}

function prevImage(event) {
  event.stopPropagation();
  if (currentGalleryImages.length > 0) {
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    document.getElementById('full-image').src = currentGalleryImages[currentImageIndex];
  }
}

function closeImageViewer(event) {
  event.stopPropagation();
  document.getElementById('image-viewer').classList.add('hidden');
}

// Почетно вчитување
renderProjects();
renderCalls();
