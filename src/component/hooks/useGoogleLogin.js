import { useState } from "react";
import { useMutation } from "@tanstack/react-query"; // Updated import
import fetcher from "../../dataProvider";
import login from "../../utils/login";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/actions";
import { setUserData } from "../../redux/slices/user";

const useGoogleLoginHook = () => {
  const [loginData, setLoginData] = useState("");
  const dispatch = useDispatch();

  const loginGoogle = useMutation({
    mutationFn: async ({ access_token }) => {
      return fetcher.post(`/api/v1/auth/login-google`, { access_token });
    },
    onSuccess: (res) => {
      setLoginData(res);
      login(res.data.token, res.data.user.name, res.data.user.email, res.data.user.id);
      dispatch(setUserData(res?.data?.user));
      dispatch(
        setToken({
          accessToken: res.data.token,
          refreshToken: res.data.token,
          isLoggedIn: true,
        })
      );
    },
    onError: (err) => {
      console.log("🚀 ~ useGoogleLogin ~ err:", err);
    },
  });

  return [loginData, loginGoogle.mutate];
};

export default useGoogleLoginHook;
