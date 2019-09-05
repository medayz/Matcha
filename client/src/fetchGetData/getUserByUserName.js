import axios from "axios";

export const getUserByUserName = async (user) => {
        const axUser = await axios.get(`/api/users/get/${user}`);
        return axUser;
};