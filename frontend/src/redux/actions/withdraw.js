import axios from "axios";
import { server } from "../../server";

export const getAllWithdrawRequests = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllWithdrawRequestsRequest" });
    const { data } = await axios.get(`${server}/withdraw/get-all-withdraw-request`, { withCredentials: true });
    dispatch({ type: "getAllWithdrawRequestsSuccess", payload: data.withdraws });
  } catch (error) {
    dispatch({ type: "getAllWithdrawRequestsFailed", payload: error.response.data.message });
  }
};
