import axios from "axios";


export const getAllTags = async () => {
        const axTags = await axios.get(`http://localhost:1337/api/tags/get`)
        return axTags;
        /*.then(res => {
            const backEnd = res.data;
            console.log(backEnd.data[0].props);
      });*/
};