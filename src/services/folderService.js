function getAuthHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function addFolder(folder, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/folders/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify(folder),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function editFolder(folder, token) {
    try {
        // Đảm bảo truyền đúng key folderId cho backend
        const body = {
            folderId: folder.folderId || folder.id || folder._id,
            name: folder.name,
            desc: folder.desc
        };
        const response = await fetch('https://imgtools-be.onrender.com/api/folders/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteFolder(id, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/folders/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify({ folderId: id }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAllFolders(token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/folders/all-admin', {
            method: 'GET',
            headers: {
                ...getAuthHeader(token),
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getFoldersByUserId(token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/folders/all', {
            method: 'GET',
            headers: {
                ...getAuthHeader(token),
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getFoldersByUserIdPostApi(userId, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/folders/folder-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

