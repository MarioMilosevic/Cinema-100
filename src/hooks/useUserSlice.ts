import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

export const useUserSlice = () => {
  const user = useSelector((state: RootState) => state.user);
  return user;
};