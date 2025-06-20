function getAuthHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadImage(formData, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/pictures/upload', {
            method: 'POST',
            headers: {
                ...getAuthHeader(token),
            },
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAllImageByUserAndFolder(folderId, token, page = 1, pageSize = 30) {
    try {
        const response = await fetch(`https://imgtools-be.onrender.com/api/pictures/get/${folderId}?page=${page}&pageSize=${pageSize}`, {
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

export async function getAllImageDetails(token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/pictures/all', {
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

export async function getAllImageByUser(token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/pictures/get', {
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

export async function deleteImage(imageId, publicId, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/pictures/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify({ imageId, publicId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateFavoriteStatus(imageId, favorite, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/pictures/favorite', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify({ imageId, favorite }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getFavoriteImagesByUser(token, page = 1) {
    try {
        const response = await fetch(`https://imgtools-be.onrender.com/api/pictures/favorite?page=${page}`, {
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

export async function getImagesByUserAndFolderApi(userId, folderId, token, page = 1, pageSize = 30) {
    try {
        const response = await fetch(`https://imgtools-be.onrender.com/api/pictures/image-user-folder?page=${page}&pageSize=${pageSize}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify({ userId, folderId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}