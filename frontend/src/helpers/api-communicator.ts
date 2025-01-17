import axios from 'axios';

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:5000/api/v1';


export const checkSession = async () => {
    const res = await axios.get('/chat/session-status');
    if (res.status !== 200)
    {
        throw new Error(res.data.error);
    }
    return res.data;
}

export const sendTextMessage = async(user_input: string, responseType: string) =>{
    const res = await axios.post('/chat/send-text-message', {user_input, responseType});
    if (res.status !== 200)
    {
        throw new Error(res.data.error);
    }
    return res.data;
}

export const clearChatHistory = async() =>{
    const res = await axios.delete('/chat/clear-chat');
    if (res.status !== 200)
    {
        throw new Error(res.data.error);
    }
    return res.data;
}

export const sendAudioMessage = async(index: number, responseType: string) =>{
    const res = await axios.post('/chat/send-audio-message', {index, responseType});
    if (res.status !== 200)
    {
        throw new Error(res.data.error);
    }
    return res.data;
}

export const saveAudioMessage = async(audio: Blob) =>{
    const formData = new FormData();
    formData.append('audio', audio);
    const res = await axios.post('/chat/save-audio-message', formData);
    if (res.status !== 200)
    {
        throw new Error(res.data.error);
    }
    return res.data;
}

export const toAudio = async(index: number) =>{
    const res = await axios.post(`/chat/to-audio/${index}`);
    if (res.status !== 200)
    {
        throw new Error(res.data.error);
    }
    return res.data;
}

export const retryMessage = async(index: number) =>{
    const res = await axios.post(`/chat/retry-message/${index}`);
    if (res.status !== 200)
    {
        throw new Error(res.data.error);
    }
    return res.data;
}
