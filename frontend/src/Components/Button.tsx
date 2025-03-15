import { useRecoilValue } from "recoil";
import { Loading } from "../StateManagement/Atom";
import { ImSpinner3 } from "react-icons/im";
const Button = ({ tag, ...rest }: any) => {
  const loading = useRecoilValue(Loading);
  return (
    <button
      className="border flex items-center justify-center w-full h-10 mt-5 rounded-md text-white bg-[#7091E6]"
      {...rest}
    >
      {loading ? <ImSpinner3 className="animate-spin" /> : tag}
    </button>
  );
};
export default Button;
