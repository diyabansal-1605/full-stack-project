import React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

export default function ScrollToTop() {
    
    const location = useLocation();

    // scrolling window to top-left corner
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
}