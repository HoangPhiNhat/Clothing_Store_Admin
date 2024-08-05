import { useEffect, useRef } from "react";

const useAutoFocus = (isVisible) => {
  const ref = useRef(null);

  useEffect(() => {
    if (isVisible && ref.current) {
      const timer = setTimeout(() => {
        ref.current.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return ref;
};

export default useAutoFocus;
