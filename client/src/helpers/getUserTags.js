import axios from "axios";


export const getUserTags = async (user) => {
        const axTags = await axios.get(`http://localhost:1337/api/tags/get/${user}`)
        return axTags;
        /*.then(res => {
            const backEnd = res.data;
            console.log(backEnd.data[0].props);
      });*/
};