import { useSegments, useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';

// type User = {
//     name: string;
// };

// type AuthType = {
//     user: User | null;
//     setUser: (user: User | null) => void;
// };

type AuthType = {
    getToken: () => string;
};

// const AuthContext = createContext<AuthType>({
//     user: null,
//     setUser: () => {},
// });

const AuthContext = createContext<AuthType>({
    getToken: () => '',
});

export const useAuth = () => useContext(AuthContext);

// function useProtectedRoute(user: User | null) {
//     const segments = useSegments();
//     const router = useRouter();

//     useEffect(() => {
//         const inAuthGroup = segments[0] === '(auth)';

//         if (
//             // If the user is not signed in and the initial segment is not anything in the auth group.
//             !user &&
//             !inAuthGroup
//         ) {
//             // Redirect to the sign-in page.
//             router.replace('/login');
//         } else if (user && inAuthGroup) {
//             // Redirect away from the sign-in page.
//             router.replace('/HomePage');
//         }
//     }, [user, segments, router]);
// }

export function AuthProvider({
    children,
}: {
    children: JSX.Element;
}): JSX.Element {
    const router = useRouter();
    // const [user, setUser] = useState<User | null>(null);

    // useProtectedRoute(user);

    // const authContext: AuthType = {
    //     user,
    //     setUser,
    // };

    useEffect(() => {
        router.navigate('/HomePage');
    }, [router]);

    const authContext: AuthType = {
        getToken: () => {
            const date = new Date();
            const ticks = 621355968e9 + date.getTime() * 1e4;
            return (ticks * (date.getDay() + 1)).toString();
        },
    };

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
}
