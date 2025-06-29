import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom';

type Props = {
    isAuthenticated: boolean;
    children: React.ReactNode;
    isLoading: boolean
}

function AuthMiddleware({ isAuthenticated, children, isLoading }: Props) {
    const location = useLocation();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isLoading) {
            setLoading(false)
        }
    }, [isLoading])

    if (loading) {
        return (
            <div>loading</div>
        );
    }

    if (isAuthenticated && location.pathname.startsWith("/api/auth")) {
        return <Navigate to={"/"} />
    }
    if (!isAuthenticated && !location.pathname.startsWith("/api/auth")) {
        return <Navigate to={"/api/auth"} />
    }
    return (
        <>
            {children}
        </>
    )
}

export default AuthMiddleware