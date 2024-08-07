import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Linking, View, Text, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';

import { useAuth } from '../../context/AuthProvider';
import { APP_URL, OFFLINE_URL } from '../constants/const';
import { setState } from '../store/offline.reducer';

const HomePage = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const router = useRouter();
    const webviewRef = useRef<WebView>(null);

    const handleShouldStartLoadWithRequest = (request) => {
        if (request.url.includes(OFFLINE_URL)) {
            const ids = new URL(request.url).searchParams.get('typ_id');
            const user_id = new URL(request.url).searchParams.get('uzivatelId');
            const typ_ids = ids ? ids.split(',') : null;
            dispatch(
                setState({
                    typ_ids,
                    user_id,
                })
            );
            router.navigate('OfflineMode');
            return false;
        } else if (!request.url.includes(APP_URL)) {
            Linking.openURL(request.url);
            return false;
        }
        return true;
    };

    return (
        <WebView
            source={{ uri: `${APP_URL}?token=${auth.getToken()}` }}
            ref={webviewRef}
            scalesPageToFit
            allowsBackForwardNavigationGestures
            setDisplayZoomControls={false}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            javaScriptEnabled
            domStorageEnabled
            allowFileAccess
            startInLoadingState
            mediaPlaybackRequiresUserAction={false}
            renderError={(_, code, desc) => (
                <View style={styles.errorContainer}>
                    <Text>
                        {code === -6 ? 'Chyba připojení' : 'Neznámá chyba'}
                    </Text>
                    <Button
                        title="Zkusit znovu"
                        onPress={() => {
                            webviewRef.current.reload();
                        }}
                    />
                    <Text
                        style={
                            styles.errorDescription
                        }>{`Detail: ${desc}`}</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
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

export default HomePage;
