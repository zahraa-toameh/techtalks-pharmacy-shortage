import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Force the window to scroll to the very top (0,0) immediately
        window.scrollTo(0, 0);
    }, [pathname]); // This triggers every time the URL path changes

    return null;
};

export default ScrollToTop;