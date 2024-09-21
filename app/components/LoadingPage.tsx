import { ActivityIndicator, View, StyleSheet } from 'react-native';

const LoadingPage = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingPage;
