/* eslint-disable react-refresh/only-export-components */
import { onSnapshot, snapshot } from "firebase/firestore"
import { auth, provider, storage } from "../firebase"
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionType"
import db from "../firebase"

export const setUser = (payload) => ({
    type: SET_USER,
    user: payload,
})

export const setLoading = (status) => ({
    type: SET_LOADING_STATUS,
    status: status,
})

export const getArticles = (payload) => ({
    type: GET_ARTICLES,
    payload: payload,

})

export function SignInAPI() {
    return (dispatch) => {
        auth.SignInWithPopUp(provider).then((payload) => {
            console.log(payload)
            dispatch(setUser(payload.user));
        }).catch((error) =>
            alert(error.message))
    }
}

export const getUserAuth = () => {
    return (dispatch) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                dispatch(setUser(user));
            }
        });
    };
};

//payload=user information

export function signOutAPI() {
    return (dispatch) => {
        auth.signOut().then(() => {
            dispatch(setUser(null))
        }).catch((error) => {
            console.log(error.message)
        })
    }
}

export function postArticleAPI(payload) {
    return (dispatch) => {
        dispatch(setLoading(true));

        if (payload.image !== '') {
            const upload = storage.ref(`images/${payload.image.name}`).put(payload.image);
            upload.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Progress: ${progress}%`);
                if (snapshot.state === 'running') {
                    console.log(`Progress: ${progress}%`);
                }
            }, error => console.log(error.code),
                async () => {
                    try {
                        const downloadURL = await upload.snapshot.ref.getDownloadURL();
                        db.collection('articles').add({
                            actor: {
                                description: payload.user.email,
                                title: payload.user.displayName,
                                date: payload.user.timestamp,
                                image: payload.photoURL
                            },
                            video: payload.video,
                            sharedImg: downloadURL,
                            comments: 0,
                            description: payload.description,
                        });
                    } catch (error) {
                        console.error('Error uploading image:', error);
                    }
                });
        } else if (payload.video) {
            db.collection('articles').add({
                actor: {
                    description: payload.user.email,
                    title: payload.user.displayName,
                    date: payload.user.timestamp,
                    image: payload.photoURL
                },
                video: payload.video,
                sharedImg: '',
                comments: 0,
                description: payload.description,
            });
            dispatch(setLoading(false));
        }
    };
}

export function postArticlesAPI() {
    return (dispatch) => {
        let payload;
        db.collection('articles').orderBy('actor.date', 'desc')
        onSnapshot((snapshot) => {
            payload = snapshot.docs.map((doc) => doc.date());
            console.log(payload)
            dispatch(getArticles(payload));
        })
    }
} 