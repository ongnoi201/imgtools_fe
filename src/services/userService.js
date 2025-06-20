function getAuthHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function addUser(user) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: user.name,
                username: user.username,
                password: user.password
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function editUser(user, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/users/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteUser(token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/users/delete', {
            method: 'DELETE',
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

export async function deleteUserById(userId, token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/users/admin-delete', {
            method: 'DELETE',
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

export async function getUser(token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/users/get', {
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

export async function login(username, password) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function logout() {
    return { success: true };
}

export async function getAllUsers(token) {
    try {
        const response = await fetch('https://imgtools-be.onrender.com/api/users/all', {
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
