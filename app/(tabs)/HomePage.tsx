import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import { Notifier, Easing, NotifierComponents } from 'react-native-notifier';
import { WebView } from 'react-native-webview';
import { WebViewErrorEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent';
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

    const [intitialRender, setInitialRender] = useState(true);
    const [error, setError] = useState<WebViewErrorEvent | null>(null);

    useEffect(() => {
        if (intitialRender) {
            setInitialRender(false);
            return;
        }
        if (error === null && webviewRef.current) {
            webviewRef.current.reload();
        }
    }, [error]);

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
        setError(null);
    };

    const uri = `${APP_URL}?token=${auth.getToken()}`;

    if (error) {
        console.log('WebView error:', error);

        return (
            <WebViewErrorPage
                domain={error.url}
                code={error.code}
                desc={error.description}
                onRefresh={onRefresh}
            />
        );
    }

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
                onError={(event) => {
                    setError(event.nativeEvent);
                }}
            />
        </ScrollView>
    );
};

export default HomePage;
