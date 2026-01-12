document.addEventListener('DOMContentLoaded', function() {
    const saveOptions = document.getElementById('Saveoptions');
    const privacyDropdown = document.getElementById('PrivacyOptions');
    const editor = document.getElementById('editor');
    
    console.log('Script loaded', saveOptions, privacyDropdown);
    
    saveOptions.addEventListener('change', function(e) {
      const action = this.value;
      console.log('Selected:', action);
      
      if (action === 'save') {
        const editorContent = editor.innerHTML; 
        
        const filename = prompt('Enter filename:', 'my-notes');
        
        if (filename) {
          const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
            line-height: 1.6;
            color: #333;
        }
    </style>
</head>
<body>
    ${editorContent}
</body>
</html>`;
          
          const blob = new Blob([htmlContent], { type: 'text/html' });
          
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename + '.html';
          
          link.click();
          
          URL.revokeObjectURL(link.href);
          
          console.log('Saved as:', filename + '.html');
        }
      } 
      else if (action === 'share') {
        const shareUrl = window.location.href;
        prompt('Share this URL:', shareUrl);
      } 
      else if (action === 'privacy') {
        console.log('Showing privacy dropdown');
        privacyDropdown.style.display = 'inline-block';
      }
      
      this.value = '';
    });
    
    privacyDropdown.addEventListener('change', function() {
      const privacySetting = this.value;
      console.log('Privacy set to:', privacySetting);
      alert('Privacy set to ' + privacySetting);
      
      this.value = '';
      this.style.display = 'none';
    });

    const fontStyle = document.getElementById('fontStyle');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');
    const bgColor = document.getElementById('bgColor');

    function format(command, value = null) {
        document.execCommand(command, false, value);
        editor.focus();
    }

    window.format = format;

    fontStyle.addEventListener('change', function() {
        format('fontName', this.value);
    });

    fontSize.addEventListener('change', function() {
        editor.style.fontSize = this.value;
    });

    textColor.addEventListener('input', function() {
        format('foreColor', this.value);
    });

    bgColor.addEventListener('input', function() {
        format('backColor', this.value);
    });

    editor.addEventListener('input', function() {
        if (currentNotebook && currentPage) {
            saveCurrentPage();
        }
    });

    loadNotebooksFromStorage();
    renderNotebooks();
});

// Menu toggle functionality
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    const allMenus = document.querySelectorAll('.dropdown-menu');
    
    // Close all other menus
    allMenus.forEach(m => {
        if (m.id !== menuId) {
            m.classList.remove('active');
        }
    });
    
    // Toggle the clicked menu
    menu.classList.toggle('active');
}

// Close menus when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.menu-item')) {
        const allMenus = document.querySelectorAll('.dropdown-menu');
        allMenus.forEach(m => m.classList.remove('active'));
    }
});

// Insert functions
function insertImage() {
    const url = prompt('Enter image URL:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
    document.getElementById('insert-menu').classList.remove('active');
}

function insertLink() {
    const url = prompt('Enter link URL:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
    document.getElementById('insert-menu').classList.remove('active');
}

function insertFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const editor = document.getElementById('editor');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = '📎 ' + file.name;
            link.style.color = '#0078d4';
            link.style.textDecoration = 'underline';
            editor.appendChild(link);
            editor.appendChild(document.createElement('br'));
        }
    };
    input.click();
    document.getElementById('insert-menu').classList.remove('active');
}

function insertCodeBlock() {
    const code = prompt('Enter code:');
    if (code) {
        const editor = document.getElementById('editor');
        const pre = document.createElement('pre');
        pre.style.backgroundColor = '#f5f5f5';
        pre.style.padding = '10px';
        pre.style.borderRadius = '5px';
        pre.style.fontFamily = 'Courier New, monospace';
        pre.style.overflow = 'auto';
        const codeElement = document.createElement('code');
        codeElement.textContent = code;
        pre.appendChild(codeElement);
        editor.appendChild(pre);
        editor.appendChild(document.createElement('br'));
    }
    document.getElementById('code-menu').classList.remove('active');
}

function contactUs() {
    alert('Contact us at: support@classnoteshare.com');
    document.getElementById('help-menu').classList.remove('active');
}

function showHelp() {
    alert('Help Guide:\n\n1. Use the toolbar to format text\n2. Click Insert to add images, links, or files\n3. Use the sidebar to organize notebooks and pages\n4. Your work auto-saves as you type');
    document.getElementById('help-menu').classList.remove('active');
}

// Sidebar functionality
let activeSidebar = null;
let activeNotebook = null;
let currentNotebook = null;
let currentPage = null;

function loadNotebooksFromStorage() {
    const saved = localStorage.getItem('notebooksData');
    if (saved) {
        try {
            window.notebooksData = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading notebooks:', e);
            window.notebooksData = getDefaultNotebooks();
        }
    } else {
        window.notebooksData = getDefaultNotebooks();
    }
}

function getDefaultNotebooks() {
    return {
        'my-notebook': {
            name: 'My Notebook',
            pages: {
                'page-1': { name: 'Page 1', content: '<h2>Page 1</h2><p>Start writing...</p>' },
                'page-2': { name: 'Page 2', content: '<h2>Page 2</h2><p>Start writing...</p>' },
                'page-3': { name: 'Page 3', content: '<h2>Page 3</h2><p>Start writing...</p>' }
            }
        },
        'school-notes': {
            name: 'School Notes',
            pages: {
                'math': { name: 'Math - Chapter 1', content: '<h2>Math Notes</h2><p>Start writing...</p>' },
                'science': { name: 'Science - Lab Notes', content: '<h2>Science Notes</h2><p>Start writing...</p>' }
            }
        }
    };
}

function saveNotebooksToStorage() {
    localStorage.setItem('notebooksData', JSON.stringify(window.notebooksData));
}

function renderNotebooks() {
    const notebooksList = document.getElementById('notebooks-list');
    notebooksList.innerHTML = '';
    
    // Render each notebook
    Object.keys(window.notebooksData).forEach(notebookId => {
        const notebook = window.notebooksData[notebookId];
        const li = document.createElement('li');
        li.innerHTML = `
            <span onclick="showPages('${notebookId}')">${notebook.name}</span>
            <button onclick="renameNotebook('${notebookId}')" style="float: right; margin-left: 5px;">✏️</button>
            <button onclick="deleteNotebook('${notebookId}')" style="float: right;">🗑️</button>
        `;
        notebooksList.appendChild(li);
    });
    
    const addBtn = document.createElement('li');
    addBtn.innerHTML = '<span style="color: #0078d4; font-weight: bold;">+ New Notebook</span>';
    addBtn.onclick = addNewNotebook;
    addBtn.style.border = '2px dashed #0078d4';
    notebooksList.appendChild(addBtn);
}

function addNewNotebook() {
    const name = prompt('Enter notebook name:');
    if (name && name.trim()) {
        const id = 'notebook-' + Date.now();
        window.notebooksData[id] = {
            name: name.trim(),
            pages: {
                'page-1': { name: 'New Page', content: '<h2>New Page</h2><p>Start writing...</p>' }
            }
        };
        saveNotebooksToStorage();
        renderNotebooks();
    }
}

function renameNotebook(notebookId) {
    const notebook = window.notebooksData[notebookId];
    const newName = prompt('Rename notebook:', notebook.name);
    if (newName && newName.trim()) {
        notebook.name = newName.trim();
        saveNotebooksToStorage();
        renderNotebooks();
        
        if (activeNotebook === notebookId) {
            document.getElementById('pages-title').textContent = newName + ' - Pages';
        }
    }
}

function deleteNotebook(notebookId) {
    const notebook = window.notebooksData[notebookId];
    if (confirm(`Delete "${notebook.name}" and all its pages?`)) {
        delete window.notebooksData[notebookId];
        saveNotebooksToStorage();
        renderNotebooks();
        
        if (activeNotebook === notebookId) {
            document.getElementById('pages-panel').classList.remove('active');
            activeNotebook = null;
            const mainSections = document.querySelectorAll('.section3, .section4');
            mainSections.forEach(section => {
                section.classList.remove('shifted-two');
                section.classList.add('shifted-one');
            });
        }
    }
}

function toggleSidebar(panelName) {
    const panel = document.getElementById(panelName + '-panel');
    const allButtons = document.querySelectorAll('.icon-btn');
    const mainSections = document.querySelectorAll('.section3, .section4');
    const pagesPanel = document.getElementById('pages-panel');
    
    if (activeSidebar === panelName) {
        panel.classList.remove('active');
        pagesPanel.classList.remove('active');
        activeSidebar = null;
        activeNotebook = null;
        
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        mainSections.forEach(section => {
            section.classList.remove('shifted-one');
            section.classList.remove('shifted-two');
        });
    } else {
        panel.classList.add('active');
        activeSidebar = panelName;
        
        event.target.classList.add('active');
        
        mainSections.forEach(section => {
            section.classList.remove('shifted-two');
            section.classList.add('shifted-one');
        });
    }
}

function showPages(notebookId) {
    const pagesPanel = document.getElementById('pages-panel');
    const pagesList = document.getElementById('pages-list');
    const pagesTitle = document.getElementById('pages-title');
    const mainSections = document.querySelectorAll('.section3, .section4');
    const notebook = window.notebooksData[notebookId];
    
    activeNotebook = notebookId;
    
    pagesTitle.textContent = notebook.name + ' - Pages';
    
    pagesList.innerHTML = '';
    
    Object.keys(notebook.pages).forEach(pageId => {
        const page = notebook.pages[pageId];
        const li = document.createElement('li');
        li.innerHTML = `
            <span onclick="loadPage('${notebookId}', '${pageId}')">${page.name}</span>
            <button onclick="renamePage('${notebookId}', '${pageId}')" style="float: right; margin-left: 5px;">✏️</button>
            <button onclick="deletePage('${notebookId}', '${pageId}')" style="float: right;">🗑️</button>
        `;
        pagesList.appendChild(li);
    });
    
    const addBtn = document.createElement('li');
    addBtn.innerHTML = '<span style="color: #0078d4; font-weight: bold;">+ New Page</span>';
    addBtn.onclick = () => addNewPage(notebookId);
    addBtn.style.border = '2px dashed #0078d4';
    pagesList.appendChild(addBtn);
    
    pagesPanel.classList.add('active');
    
    mainSections.forEach(section => {
        section.classList.remove('shifted-one');
        section.classList.add('shifted-two');
    });
}

function addNewPage(notebookId) {
    const name = prompt('Enter page name:');
    if (name && name.trim()) {
        const pageId = 'page-' + Date.now();
        const notebook = window.notebooksData[notebookId];
        notebook.pages[pageId] = {
            name: name.trim(),
            content: `<h2>${name.trim()}</h2><p>Start writing...</p>`
        };
        saveNotebooksToStorage();
        showPages(notebookId);
    }
}

function renamePage(notebookId, pageId) {
    const page = window.notebooksData[notebookId].pages[pageId];
    const newName = prompt('Rename page:', page.name);
    if (newName && newName.trim()) {
        page.name = newName.trim();
        saveNotebooksToStorage();
        showPages(notebookId);
    }
}

function deletePage(notebookId, pageId) {
    const page = window.notebooksData[notebookId].pages[pageId];
    if (confirm(`Delete "${page.name}"?`)) {
        delete window.notebooksData[notebookId].pages[pageId];
        saveNotebooksToStorage();
        showPages(notebookId);
        
        if (currentNotebook === notebookId && currentPage === pageId) {
            document.getElementById('editor').innerHTML = '';
            currentNotebook = null;
            currentPage = null;
        }
    }
}

function loadPage(notebookId, pageId) {
    if (currentNotebook && currentPage) {
        saveCurrentPage();
    }
    
    const editor = document.getElementById('editor');
    const page = window.notebooksData[notebookId].pages[pageId];
    
    currentNotebook = notebookId;
    currentPage = pageId;
    
    editor.innerHTML = page.content;
    
    console.log('Loaded page:', page.name);
}

function saveCurrentPage() {
    if (currentNotebook && currentPage) {
        const editor = document.getElementById('editor');
        window.notebooksData[currentNotebook].pages[currentPage].content = editor.innerHTML;
        saveNotebooksToStorage();
        console.log('Auto-saved page');
    }
}