import axios from "axios";

export const addTags = async (tags, head) => {
  const axTags = await axios.post(
    `/api/users/add/tag`,
    tags
  );
  return axTags;
};
