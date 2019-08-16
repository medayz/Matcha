import axios from "axios";


export const addPic = async (fd, head) => {
  const axTags = await axios.post(`http://localhost:1337/api/users/add/picture`, fd, {
    headers: head
  })
  return axTags;
  /*.then(res => {
            const backEnd = res.data;
            console.log(backEnd.data[0].props);
      });*/
};