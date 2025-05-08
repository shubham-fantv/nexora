import cookie from "js-cookie";
import eventBus from "./eventBus";
const loginData = async (accessToken, userName, email, userId) => {
  cookie.remove("aToken");
  cookie.set("aToken", accessToken, { expires: 360 });

  localStorage.setItem("userId", userId);
  localStorage.setItem("userName", userName);
  localStorage.setItem("userEmailID", email);
  localStorage.setItem("aToken", accessToken);

  // window.location.reload();
  // window.location.href='/'
  eventBus.dispatch("userLoggedIn", {
    accessToken,
    userName,
    email,
    userId,
  });
};
export default loginData;
