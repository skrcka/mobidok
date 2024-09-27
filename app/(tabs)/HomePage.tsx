import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Linking, ScrollView } from 'react-native';
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';

import { useAuth } from '../../context/AuthProvider';
import { useConnectionStatus } from '../../context/ConnectionStatusProvider';
import { WebViewErrorPage } from '../components/webviewErrorPage';
import { APP_URL, OFFLINE_URL } from '../constants/const';
import { setState } from '../store/offline.reducer';

const HomePage = () => {
    const dispatch = useDispatch();
    const auth = useAuth();
    const router = useRouter();
    const webviewRef = useRef<WebView>(null);
    const { isInternetReachable } = useConnectionStatus();

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
        } else if (!isInternetReachable) {
            Notifier.showNotification({
                title: 'Nejste připojeni k internetu',
                description:
                    'Bez internetu lze fungovat pouze v záložce OFFLINE',
                duration: 3,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'error',
                },
                showAnimationDuration: 800,
                showEasing: Easing.bounce,
                hideOnPress: true,
            });
            return false;
        } else if (!request.url.includes(APP_URL)) {
            Linking.openURL(request.url);
            return false;
        }
        return true;
    };

    const onRefresh = () => {
        if (!isInternetReachable) {
            Notifier.showNotification({
                title: 'Nepodařilo se obnovit stránku',
                description: 'Nejste připojeni k internetu',
                duration: 3,
                Component: NotifierComponents.Alert,
                componentProps: {
                    alertType: 'error',
                },
                showAnimationDuration: 800,
                showEasing: Easing.bounce,
                hideOnPress: true,
            });
            return;
        }
        if (webviewRef.current) {
            webviewRef.current.reload();
        }
    };

    const uri = `${APP_URL}?token=${auth.getToken()}`;

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
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
                mediaPlaybackRequiresUserAction={false}
                cacheEnabled
                startInLoadingState
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
