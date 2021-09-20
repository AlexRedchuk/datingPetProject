import datingBase from "../APIs/datingBase";

export const login = async (user) => {
    console.log(user);
     await datingBase.post('/api/users/login', user).then(data => {
        console.log(data)
    })
}

export const googleLogin = async (googleId) => {
    return await datingBase.post('/api/users/googleAuth', { googleId: googleId});
}