import axios from "axios";


export const getAllTags = async () => {
        const axTags = await axios.get(`/api/tags/get`)
        return axTags;
};