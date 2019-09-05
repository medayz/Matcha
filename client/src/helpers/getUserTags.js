import axios from "axios";


export const getUserTags = async (user) => {
        const axTags = await axios.get(`/api/tags/get/${user}`)
        return axTags;
};