import axios from "axios";


export const addTags = async (user, Tags, head) => {
        const axTags = await axios.post(`http://localhost:1337/api/users/add/tag/${user}`, Tags, {
            headers: head
          })
        return axTags;
        /*.then(res => {
            const backEnd = res.data;
            console.log(backEnd.data[0].props);
      });*/
};