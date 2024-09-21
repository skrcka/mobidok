import { Text, View, StyleSheet } from 'react-native';

type Props = {
    message: string;
};

const ErrorPage = ({ message }: Props) => (
    <View style={styles.container}>
        <Text>{message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ErrorPage;
