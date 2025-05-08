import { useState } from "react";
import { useMutation } from "@tanstack/react-query"; // Updated import
import fetcher from "../../dataProvider";

const usePayment = () => {
  const [isGoogleLoginSuccess, setIsGoogleLoginSuccess] = useState(false);

  const initiatePayment = useMutation({
    mutationFn: async (body) => {
      return fetcher.post(`/create-checkout-session`, body);
    },
    onSuccess: (res) => {
      window.location.href = res.url;
    },
    onError: (err) => {
      console.log("🚀 ~ usePayment ~ err:", err);
    },
  });

  return [isGoogleLoginSuccess, initiatePayment.mutate];
};

export default usePayment;
