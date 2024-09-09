import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, ScrollView, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';

import { useAuth } from '../../context/AuthProvider';
import { WebViewErrorPage } from '../components/webviewErrorPage';
import { APP_URL, OFFLINE_URL } from '../constants/const';
import { setState } from '../store/offline.reducer';

const HomePage = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const router = useRouter();
    const webviewRef = useRef<WebView>(null);
    const [refreshing, setRefreshing] = useState(false);

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

    const onRefresh = () => {
        setRefreshing(true);
        if (webviewRef.current) {
            webviewRef.current.reload();
        }
        setRefreshing(false);
    };

    const uri = `${APP_URL}?token=${auth.getToken()}`;

    return (
        <ScrollView
            contentContainerStyle={{ flex: 1 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <WebView
                source={{ uri }}
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
                cacheEnabled
                renderError={(_, code, desc) => (
                    <WebViewErrorPage
                        domain={uri}
                        code={code}
                        desc={desc}
                        onRefresh={onRefresh}
                    />
                )}
            />
        </ScrollView>
    );
};

export default HomePage;
