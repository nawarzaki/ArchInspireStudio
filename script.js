(function() {
    'use strict';
  
    // Debounce function
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    };
  
    // Global Data & Admin State
    const sectionSubsections = {
      section1: [
        { 
          title: 'Modern Living Room',
          description: '<h3>Living Room Overview</h3><p>This living room design features an open floor plan with minimalist furniture, a neutral palette, and <strong>bold accents</strong>. You can include lists, tables, and more.</p>',
          images: [
            'https://via.placeholder.com/800x600?text=Living+Room+1',
            'https://via.placeholder.com/800x600?text=Living+Room+2',
            'https://via.placeholder.com/800x600?text=Living+Room+3'
          ]
        },
        { 
          title: 'Contemporary Bedroom',
          description: '<h3>Bedroom Features</h3><ul><li>Soft Colors</li><li>Innovative Storage</li></ul>',
          images: [
            'https://via.placeholder.com/800x600?text=Bedroom+1',
            'https://via.placeholder.com/800x600?text=Bedroom+2'
          ]
        }
      ],
      section2: [
        { 
          title: 'Futuristic Office Building',
          description: '<h2>Design Concept</h2><p>This design showcases a futuristic office building with sleek curves and glass facades. Detailed design and sustainability features are described here.</p>',
          images: [
            'https://via.placeholder.com/800x600?text=Office+Building+1',
            'https://via.placeholder.com/800x600?text=Office+Building+2'
          ]
        },
        { 
          title: 'Modern Museum',
          description: '<h2>Exhibit Spaces</h2><p>The modern museum is designed with interactive spaces and open galleries. Use tables, lists, or any HTML formatting as needed.</p>',
          images: [
            'https://via.placeholder.com/800x600?text=Museum+1',
            'https://via.placeholder.com/800x600?text=Museum+2',
            'https://via.placeholder.com/800x600?text=Museum+3'
          ]
        }
      ]
    };
  
    let currentEdit = null;
    let editorInstance;
  
    // Initialize GLightbox
    const lightbox = GLightbox({ selector: '.glightbox' });
  
    // Render the Manage Subsections list in the Admin Panel
    const renderManageSubsections = () => {
      const manageList = document.getElementById('manage-list');
      manageList.innerHTML = '';
      Object.keys(sectionSubsections).forEach(section => {
        const sectionHeader = document.createElement('h4');
        sectionHeader.textContent = section === 'section1' ? 'Interior Design' :
                                    section === 'section2' ? 'Architectural Design' : section;
        manageList.appendChild(sectionHeader);
        const list = document.createElement('ul');
        sectionSubsections[section].forEach((item, index) => {
          const li = document.createElement('li');
          li.style.marginBottom = '10px';
          li.innerHTML = `<strong>${item.title}</strong>`;
          // Edit button
          const editBtn = document.createElement('button');
          editBtn.textContent = "Edit";
          editBtn.style.marginLeft = "10px";
          editBtn.addEventListener('click', () => {
            document.getElementById('admin-section').value = section;
            document.getElementById('admin-title').value = item.title;
            document.getElementById('admin-image').value = item.images.join(', ');
            editorInstance.setData(item.description);
            document.getElementById('admin-submit').textContent = "Save Changes";
            document.getElementById('admin-cancel').style.display = "inline-block";
            currentEdit = { section, index };
          });
          li.appendChild(editBtn);
          // Delete button
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = "Delete";
          deleteBtn.style.marginLeft = "5px";
          deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
              sectionSubsections[section].splice(index, 1);
              renderManageSubsections();
            }
          });
          li.appendChild(deleteBtn);
          list.appendChild(li);
        });
        manageList.appendChild(list);
      });
    };
  
    // Open modal overlay for a subsection
    const openFullPage = (item) => {
      const overlay = document.getElementById('fullpage-overlay');
      const fullpageContent = document.getElementById('fullpage-content');
      let thumbnailsHtml = '';
      if (item.images && item.images.length) {
        item.images.forEach((url, index) => {
          thumbnailsHtml += `<a href="${url}" class="glightbox" data-title="${item.title}"><img src="${url}" alt="${item.title} Thumbnail ${index+1}" data-index="${index}" loading="lazy"></a>`;
        });
      }
      const mainImageHtml = `<a href="${item.images[0]}" class="glightbox" data-title="${item.title}"><img id="main-image" src="${item.images[0]}" alt="${item.title}" loading="lazy"></a>`;
      fullpageContent.innerHTML = `
        <h2 id="fullpage-heading">${item.title}</h2>
        <div id="main-image-display">${mainImageHtml}</div>
        <div id="subsection-description">${item.description}</div>
        <div id="image-thumbnails">${thumbnailsHtml}</div>
      `;
      lightbox.reload();
      overlay.style.display = 'block';
      overlay.offsetHeight; // Force reflow
      overlay.classList.add('active');
    };
  
    // Global Search Functionality
    const globalSearchData = [
      "Section 1", "Section 2", "Section 3", "Section 4",
      "Modern Living Room", "Contemporary Bedroom", "Futuristic Office Building", "Modern Museum"
    ];
    const updateSearchSuggestions = () => {
      const query = document.getElementById('global-search').value.toLowerCase();
      const suggestionsList = document.getElementById('search-suggestions');
      suggestionsList.innerHTML = '';
      if (query.trim() !== "") {
        globalSearchData
          .filter(item => item.toLowerCase().includes(query))
          .forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.addEventListener('click', () => {
              document.getElementById('global-search').value = item;
              suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(li);
          });
      }
    };
    const debouncedUpdate = debounce(updateSearchSuggestions, 300);
  
    // Handle Admin Form Submission
    const handleAdminSubmit = (e) => {
      e.preventDefault();
      const sectionValue = document.getElementById('admin-section').value;
      const titleValue = document.getElementById('admin-title').value;
      const imageValue = document.getElementById('admin-image').value;
      const infoValue = editorInstance.getData();
      const imagesArray = imageValue.split(',').map(url => url.trim());
      if (currentEdit) {
        sectionSubsections[currentEdit.section][currentEdit.index] = {
          title: titleValue,
          description: infoValue,
          images: imagesArray
        };
        alert("Subsection updated!");
        currentEdit = null;
        document.getElementById('admin-submit').textContent = "Add Subsection";
        document.getElementById('admin-cancel').style.display = "none";
      } else {
        const newSubsection = { title: titleValue, description: infoValue, images: imagesArray };
        if (sectionSubsections[sectionValue]) {
          sectionSubsections[sectionValue].push(newSubsection);
        } else {
          sectionSubsections[sectionValue] = [newSubsection];
        }
        alert("Subsection added!");
      }
      document.getElementById('admin-form').reset();
      editorInstance.setData('');
      renderManageSubsections();
    };
  
    // Initialize draggable admin panel
    const initDraggableAdminPanel = () => {
      const adminPanel = document.getElementById('admin-panel');
      const header = document.getElementById('admin-panel-header');
      let offsetX = 0, offsetY = 0, dragging = false;
      header.addEventListener('mousedown', (e) => {
        dragging = true;
        const rect = adminPanel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
      const onMouseMove = (e) => {
        if (!dragging) return;
        adminPanel.style.left = `${e.clientX - offsetX}px`;
        adminPanel.style.top = `${e.clientY - offsetY}px`;
        adminPanel.style.right = 'auto';
      };
      const onMouseUp = () => {
        dragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    };
  
    // Initialization on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize CKEditor
      ClassicEditor.create(document.querySelector('#admin-info'))
        .then(editor => {
          editorInstance = editor;
          document.querySelector('#admin-info').removeAttribute('required');
        })
        .catch(error => console.error(error));
  
      // Bind click events for main sections
      document.querySelectorAll('.main-section').forEach(sectionEl => {
        sectionEl.addEventListener('click', function() {
          const sectionId = this.getAttribute('data-section');
          const subsections = sectionSubsections[sectionId] || [];
          const sidebarList = document.getElementById('sidebar-list');
          sidebarList.innerHTML = '';
          subsections.forEach(item => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = "#";
            const box = document.createElement('div');
            box.classList.add('subsection-box');
            const img = document.createElement('img');
            img.src = item.images[0] || '';
            img.alt = item.title;
            img.loading = 'lazy';
            box.appendChild(img);
            const title = document.createElement('span');
            title.classList.add('subsection-title');
            title.textContent = item.title;
            link.appendChild(box);
            link.appendChild(title);
            link.addEventListener('click', (e) => {
              e.preventDefault();
              openFullPage(item);
            });
            li.appendChild(link);
            sidebarList.appendChild(li);
          });
          document.getElementById('dynamic-sidebar').classList.add('active');
        });
      });
  
      // Bind sidebar close button
      document.getElementById('close-sidebar').addEventListener('click', () => {
        document.getElementById('dynamic-sidebar').classList.remove('active');
      });
  
      // Bind modal overlay close button
      document.getElementById('close-fullpage').addEventListener('click', () => {
        const overlay = document.getElementById('fullpage-overlay');
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 300);
      });
  
      // Bind global search input event
      document.getElementById('global-search').addEventListener('input', debouncedUpdate);
  
      // Admin login button
      document.getElementById('admin-login-button').addEventListener('click', () => {
        const password = prompt("Enter admin password:");
        if (password === "admin") {
          document.getElementById('admin-panel').style.display = 'block';
        } else {
          alert("Incorrect password!");
        }
      });
  
      // Close Admin Panel button
      document.getElementById('admin-close').addEventListener('click', () => {
        document.getElementById('admin-panel').style.display = 'none';
      });
  
      // Bind Admin Form submission and cancel events
      document.getElementById('admin-form').addEventListener('submit', handleAdminSubmit);
      document.getElementById('admin-cancel').addEventListener('click', () => {
        currentEdit = null;
        document.getElementById('admin-form').reset();
        editorInstance.setData('');
        document.getElementById('admin-submit').textContent = "Add Subsection";
        document.getElementById('admin-cancel').style.display = "none";
      });
  
      // Render the manage subsections list initially
      renderManageSubsections();
  
      // Initialize draggable functionality for the admin panel
      initDraggableAdminPanel();
    });
  })();
  
