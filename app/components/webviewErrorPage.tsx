import { View, Text, Button, StyleSheet } from 'react-native';

type WebViewErrorPageProps = {
    domain: string;
    code: number;
    desc: string;
    onRefresh: () => void;
};

export const WebViewErrorPage = ({
    domain,
    code,
    desc,
    onRefresh,
}: WebViewErrorPageProps) => (
    <View style={styles.errorContainer}>
        <Text>Cíl: {domain}</Text>
        <Text>
            {code === -6
                ? 'Chyba připojení'
                : code === -2
                  ? 'Chyba připojení (DNS)'
                  : 'Neznámá chyba'}
        </Text>
        <Button
            title="Zkusit znovu"
            onPress={() => {
                onRefresh();
            }}
        />
        <Text style={styles.errorDescription}>{`Detail: ${desc}`}</Text>
    </View>
);

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorDescription: {
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
});
