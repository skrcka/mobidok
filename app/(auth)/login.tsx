import { View, Text, TouchableOpacity } from 'react-native';

import { useAuth } from '../../context/AuthProvider';

export default function Login() {
    const { setUser } = useAuth();

    const login = () => {
        setUser({
            name: 'John Doe',
        });
    };

    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity onPress={login}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
}
