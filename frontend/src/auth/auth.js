const TOKEN_KEY = "token";

export const saveToken = (token) => {
localStorage.setItem(TOKEN_KEY,token);
};

export const getToken= () => {
return localStorage.getItem(TOKEN_KEY);};

export const isAuthenticated = () => {
  if(getToken()){
    return true;
  }
  return false;
};
export const logout = () => {
localStorage.removeItem(TOKEN_KEY);
};