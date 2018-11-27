import axios from 'axios'

export const sendRegisterData = (data) => {
    return axios.post('/api/register', data)
        .then(resp => resp.data);
};
export const sendSignInData = (data) => {
  return axios.post('/api/signin', data)
      .then(resp => resp);
};
export const confirmUser = (data) => {
    return axios.post('/api/confirm', data)
        .then(resp => resp.data);
};

//with token

export const postCabinet = (data) => {
    return axios.post('/api/cabinet', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)

};

export const getProfile = () => {
    return axios.get('/api/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};

export const updateProfile = (data) => {
    return axios.post('/api/update-profile', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp);
};

export const removeProfileTags = () => {
    return axios.get('/api/remove-tags', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp);
};


export const updateProfileTags = (tags) => {
    return axios.post('/api/update-tags', tags, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp);
};


export const updateProfilePhotos = (formData) => {

    return axios.post('/api/update-photos', formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            'content-type': 'multipart/form-data'
        }
    })
        .then(resp => resp);
};

export const removePhoto = (src) => {

    let source = {'source' : src};

    return axios.post('/api/remove-photo', source, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        }
    })
        .then(resp => resp);
};

export const setNewAvatar = (src) => {

    let source = {'source' : src};

    return axios.post('/api/set-new-avatar', source, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        }
    });
};

export const unsetAvatar = () => {

    return axios.get('/api/unset-avatar', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        }
    });
};

export const checkAccess = () => {
    return axios.get('/api/check-access', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    }).then(resp => resp);
};

export const hasToAccess = () => {
    return axios.get('/api/has-to-access', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    }).then(resp => resp);
};

export const updateAccess = () => {
    return axios.get('/api/update-access', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    }).then(resp => resp);
};

export const getTags = () => {

    return axios.get('/api/tags', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
};

export const postUpdateName = (name) => {
    return axios.post('/api/updateName',{name}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};

export  const getPreSearchData = () => {
    return axios.get('/api/preSearch', {
        headers:{
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    }).then(resp => resp)
};

export  const getSearchData = (data) => {
    return axios.post('/api/search',{data}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export  const getAnotherUser = (data) => {
    return axios.post('/api/anotherUser',{data}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export  const setLogin = (data) => {
    return axios.post('/api/setLogin',{data}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export  const setEmail = (data) => {
    return axios.post('/api/setEmail',{data}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export  const setPassword = (data) => {
    return axios.post('/api/setPassword',{data}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export const likeProfile = (data)=> {
    return axios.post('/api/like',{data}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export const blockProfile = (id)=> {
    return axios.post('/api/block',{id}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export  const updateNotificationsSeen = (myId) => {
    return axios.post('/api/seenNotifications', {myId}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    }).then(resp => resp);
};
export  const setCoords = (myId, coords) => {
    return axios.post('/api/setCoords', {myId, coords}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    }).then(resp => resp);
};
export const reportProfile = (id) => {
    return axios.post('/api/report',{id}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
        .then(resp => resp)
};
export const restorePassword = (data) => {
    return axios.post('/api/restore', data)
        .then(resp => resp);
};

export const restoreChange = (data) => {
    return axios.post('/api/restoreData', data)
        .then(resp => resp);
};