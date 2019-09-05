import axios from "axios";


export const addPic = async (fd) => {
  const axTags = await axios.post(`/api/users/add/picture`, fd)
  return axTags;
};