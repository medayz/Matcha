import { getter } from './tokenOperation'

export const isLogged = () => {
    if (getter('token'))
        return true;
    else
        return false;
};
