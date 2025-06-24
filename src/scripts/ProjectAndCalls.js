const ADMIN_PASSWORD = "admin123"; // лозинка за пристап
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    let calls = JSON.parse(localStorage.getItem('calls') || '[]');
    let isAdmin = false;
    let currentFilter = 'all';
    let loginStep = 0;
    let currentGalleryImages = [];
    let currentImageIndex = 0;

    // Клик на копчето за најава
    function handleLoginClick() {
      const passwordField = document.getElementById('admin-password');
      const loginButton = document.getElementById('login-button');
      if (loginStep === 0) {
        passwordField.classList.remove('hidden');
        loginButton.textContent = 'Confirm';
        loginStep = 1;
      } else {
        loginAdmin();
        loginStep = 0;
        loginButton.textContent = 'Log In';
      }
    }

    // Логика за проверка на лозинка
    function loginAdmin() {
      const password = document.getElementById('admin-password').value;
      if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById('admin-panel').classList.remove('hidden');
        document.getElementById('login-section').classList.add('hidden');
        renderProjects();
        renderCalls();
      } else {
        alert('Wrong Password');
      }
    }

    // Одјава
    function logoutAdmin() {
      isAdmin = false;
      document.getElementById('admin-panel').classList.add('hidden');
      document.getElementById('login-section').classList.remove('hidden');
      document.getElementById('admin-password').value = '';
      document.getElementById('admin-password').classList.add('hidden');
      document.getElementById('login-button').textContent = 'Log In';
      renderProjects();
      renderCalls();
    }

    // Снимање во локална меморија
    function saveToLocalStorage() {
      localStorage.setItem('projects', JSON.stringify(projects));
      localStorage.setItem('calls', JSON.stringify(calls));
    }

    // Прикажување на проекти
    function renderProjects() {
      const list = document.getElementById('project-list');
      list.innerHTML = '';
      projects
        .filter(p => currentFilter === 'all' || p.status === currentFilter)
        .forEach((p, index) => {
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

          list.appendChild(item);
        });
    }

    function deleteProject(index) {
      if (!isAdmin) return;
      projects.splice(index, 1);
      saveToLocalStorage();
      renderProjects();
    }

    function addProject() {
      const title = document.getElementById('project-title').value;
      const description = document.getElementById('project-description').value;
      const status = document.getElementById('project-status').value;
      const files = document.getElementById('project-images').files;
      const images = [];
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
          images.push(e.target.result);
          if (images.length === files.length) {
            projects.push({ title, description, status, images });
            saveToLocalStorage();
            renderProjects();
          }
        };
        reader.readAsDataURL(file);
      }
    }

    function setFilter(filter) {
      currentFilter = filter;
      renderProjects();
    }

    function addCall() {
      const text = document.getElementById('call-text').value;
      const file = document.getElementById('call-image').files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        calls.push({ text, image: e.target.result });
        saveToLocalStorage();
        renderCalls();
      };
      if (file) reader.readAsDataURL(file);
      else {
        calls.push({ text, image: null });
        saveToLocalStorage();
        renderCalls();
      }
    }

    function deleteCall(index) {
      if (!isAdmin) return;
      calls.splice(index, 1);
      saveToLocalStorage();
      renderCalls();
    }

    function renderCalls() {
      const list = document.getElementById('call-list');
      list.innerHTML = '';
      calls.forEach((c, index) => {
        const item = document.createElement('div');
        item.className = 'call-item';
        item.innerHTML = `<p>${c.text}</p>`;
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
        list.appendChild(item);
      });
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

    // Почетно прикажување
    renderProjects();
    renderCalls();
  