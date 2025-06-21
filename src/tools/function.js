import { getAllImageByUser, getFavoriteImagesByUser } from '@services/pictureService';
import { getUser } from '@services/userService';


// cập nhật localstorage để fetch lại avatar
export const updateAvatarLocalStorage = (imgUrl, setUser, dispatch) => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUserInfo) return;
    const { user, token } = storedUserInfo;
    const updatedUser = {
        ...user,
        avatar: imgUrl
    };
    dispatch(setUser({ user: updatedUser, token }));
    localStorage.setItem('userInfo', JSON.stringify({ user: updatedUser, token }));
}


//set lại state avatar_frame
export const updateAvatarFrameState = (imgUrl, user, setUser) => {
    const newUser = {
        ...user,
        avatar_frame: imgUrl,
    };
    setUser(newUser);
}


//===========================================================================================================================
//==========USER METHOD FUNCTION=============================================================================================
//===========================================================================================================================

export const fetchUser = async (token, setUserData, setMessage, setMessageType) => {
    try {
        const res = await getUser(token);
        if (res && res.status === 'success') {
            setUserData(res.data);
        } else {
            setMessage(res.message);
            setMessageType('error');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};


//===========================================================================================================================
//==========PICTURE METHOD FUNCTION=============================================================================================
//===========================================================================================================================

export const fetchPictures = async (token, picturePage, PICTURES_PAGE_SIZE, setPictures, setPictureHasMore, setMessage, setMessageType, setLoading) => {
    setLoading(true);
    try {
        const res = await getAllImageByUser(token, picturePage, PICTURES_PAGE_SIZE);
        if (res && res.status === 'success') {
            if (picturePage === 1) {
                setPictures(res.data);
            } else {
                setPictures(prev => [...prev, ...res.data]);
            }
            if (!res.data || res.data.length < PICTURES_PAGE_SIZE) {
                setPictureHasMore(false);
            }
        } else {
            setMessage(res.message || 'Không thể tải ảnh');
            setMessageType('error');
            setPictureHasMore(false);
        }
    } catch (error) {
        setPictureHasMore(false);
    }
    setLoading(false);
};

export const fetchFavoritePictures = async (token, setFavoritePictures, setFavoriteLoading) => {
    try {
        const res = await getFavoriteImagesByUser(token);
        if (res && res.status === 'success') {
            setFavoritePictures(res.data);
        } else {
            setFavoritePictures([]);
        }
    } catch (error) {
        console.log('Error fetch favorite picture', error);
        
    }
    setFavoriteLoading(false);
};

//===========================================================================================================================
//==========OTHER METHOD FUNCTION=============================================================================================
//===========================================================================================================================

export const formatDateTime = (dateString) =>{
    if (!dateString) return '';
    const d = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${pad(d.getFullYear())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}