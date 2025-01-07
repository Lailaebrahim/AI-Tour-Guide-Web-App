import axios from "axios";

export const text_input_mock = async (user_input: string, responseType: string) => {

    console.log("mocking AI response");

    if (responseType === "audio") {
        try {
            const ai_res = await axios.post("https://api.soundoftext.com/sounds", {
                "engine": "Google",
                "data": {
                    "text": user_input,
                    "voice": "en-US"
                }
            });

            console.log(`AI response status: ${ai_res.status}`);
            if (ai_res.status === 200) {
                const audioId = ai_res.data.id;
                console.log(`Audio ID: ${audioId}`);

                const audio = await axios.get(`https://api.soundoftext.com/sounds/${audioId}`);
                console.log(`Audio response status: ${audio.status}`);
                
                if (audio.status === 200) {
                    console.log(`Audio location: ${audio.data.location}`);
                    if (audio.data.location) return audio.data.location;
                    else {
                        return "Failed to get audio";
                    }
                } else {
                    console.error("Failed to get audio");
                    throw Error("Failed to get audio");
                }
            } else {
                console.error("Failed to generate audio");
                throw Error("Failed to generate audio");
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    } else {
        const ai_res = `Ancient Egypt's pharaohs ruled for 3,000 years, creating wonders like the pyramids and temples, leaving a legacy of art, science, and spirituality.`;
        console.log(`AI response: ${ai_res}`);
        return ai_res;
    }
}