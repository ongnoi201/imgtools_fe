export const ROUTERS = {
    USER: {
        HOME: '',
        PICTURE: (folderId) => `picture/${folderId}`,
        SETTING: 'setting',
        PERSONAL: 'personal',
    },
    ADMIN: {
        LOGIN: '/login',
        REGISTER: '/register',
        MANAGE: '/manage', 
    }
}