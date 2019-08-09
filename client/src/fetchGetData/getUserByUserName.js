import axios from "axios";

export const getUserByUserName = async (user) => {
        const axUser = await axios.get(`http://localhost:1337/api/users/get/${user}`);
        return axUser;
};