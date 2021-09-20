import datingBase from "../APIs/datingBase";

export const getAllUsers = async () => {
    return await datingBase.get('/api/users');
}

export const createUser = async (user) => {    
     return await datingBase.post('/api/users/register', user, { headers: {
        'Content-Type': 'multipart/form-data'
    }});
}

export const createUserGoogle = async (user) => {    
    return await datingBase.post('/api/users/registerGoogle', user, { headers: {
       'Content-Type': 'multipart/form-data'
   }});
}

export const getUserPool = async () => {
    return await datingBase.get('/api/users/userpool')
}

export const getSymphaties = async (id) => {
    return await datingBase.get(`/api/likes/getSymphaties`)
}