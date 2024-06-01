import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

export const useAppSlice = () => {
  const app = useSelector((state: RootState) => state.app);
  return app;
};