let token = '';

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const statusEl = document.getElementById('loginStatus');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            token = data.token;
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('uploadSection').style.display = 'block';
            loadFiles();
        } else {
            statusEl.textContent = data.message || 'Login failed';
            statusEl.className = 'status-message error';
        }
    } catch (error) {
        statusEl.textContent = 'Login failed';
        statusEl.className = 'status-message error';
    }
}

function logout() {
    token = '';
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadStatus = document.getElementById('uploadStatus');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

async function handleFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
        try {

            const content = String(reader.result);

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    filename: file.name,
                    content: reader.result
                })
            });

            const data = await response.json();

            if (!token) {
                uploadStatus.textContent = 'Please login first';
                uploadStatus.className = 'status-message error';
                uploadStatus.style.display = 'block';
                return;
            }

            if (response.ok) {
                uploadStatus.textContent = 'File uploaded successfully!';
                uploadStatus.className = 'status-message success';
                uploadStatus.style.display = 'block';
                loadFiles();
            } else {
                uploadStatus.textContent = `Upload failed: ${data.message || 'Unknown error'}`;
                uploadStatus.className = 'status-message error';
                uploadStatus.style.display = 'block';
                console.error('Upload error:', data);
            }
        } catch (error) {
            uploadStatus.textContent = `Upload failed: ${error.message}`;
            uploadStatus.className = 'status-message error';
            uploadStatus.style.display = 'block';
            console.error('Upload error:', error);
        }

        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 3000);
    };

    reader.onerror = (error) => {
        uploadStatus.textContent = `File reading failed: ${error}`;
        uploadStatus.className = 'status-message error';
        uploadStatus.style.display = 'block';
    };

    reader.readAsText(file, 'UTF-8');
}

async function loadFiles() {
    const response = await fetch('/api/files/list', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const files = await response.json();
    const fileList = document.getElementById('fileList');

    if (files.length === 0) {
        fileList.innerHTML = '<p class="upload-text">No files uploaded yet</p>';
        return;
    }

    fileList.innerHTML = files.map(file => `
                <div class="file-item">
                    <span class="file-name">${file.filename}</span>
                    <div class="file-actions">
                        <button onclick="downloadFile(${file.id}, '${file.filename}')">Download</button>
                        <button class="delete-btn" onclick="deleteFile(${file.id})">Delete</button>
                    </div>
                </div>
            `).join('');
}

async function downloadFile(fileId, filename) {
    try {
        const response = await fetch(`/api/files/download/${fileId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        const content = await response.text();

        // Create download link
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        // Success message
        uploadStatus.textContent = 'File downloaded successfully';
        uploadStatus.className = 'status-message success';
        uploadStatus.style.display = 'block';
    } catch (error) {
        console.error('Download error:', error);
        uploadStatus.textContent = 'Error downloading file';
        uploadStatus.className = 'status-message error';
        uploadStatus.style.display = 'block';
    }

    setTimeout(() => {
        uploadStatus.style.display = 'none';
    }, 3000);
}

async function clearFiles() {
    try {
        await fetch('/api/files/clear', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadFiles();
        uploadStatus.textContent = 'All files cleared successfully';
        uploadStatus.className = 'status-message success';
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 3000);
    } catch (error) {
        uploadStatus.textContent = 'Error clearing files';
        uploadStatus.className = 'status-message error';
    }
}

async function deleteFile(fileId) {
    try {
        const response = await fetch(`/api/files/${fileId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            uploadStatus.textContent = 'File deleted successfully';
            uploadStatus.className = 'status-message success';
            uploadStatus.style.display = 'block';
            loadFiles();
        } else {
            const data = await response.json();
            uploadStatus.textContent = `Delete failed: ${data.message || 'Unknown error'}`;
            uploadStatus.className = 'status-message error';
            uploadStatus.style.display = 'block';
        }
    } catch (error) {
        uploadStatus.textContent = 'Error deleting file';
        uploadStatus.className = 'status-message error';
        uploadStatus.style.display = 'block';
    }

    setTimeout(() => {
        uploadStatus.style.display = 'none';
    }, 3000);
}