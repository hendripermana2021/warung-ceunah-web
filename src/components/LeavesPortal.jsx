import { createPortal } from "react-dom";
import FallingLeaves from "./FallingLeaves";

const LeavesPortal = () => {
  return createPortal(<FallingLeaves />, document.body);
};

export default LeavesPortal;
