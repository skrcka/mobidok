import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';

import { APP_URL, OFFLINE_URL } from '../constants/const';
import { RootState } from '../store/store';

const OfflineMode = () => {
    const router = useRouter();
    const webviewRef = useRef<WebView>(null);
    const typ_ids = useSelector((state: RootState) => state.offline.typ_ids);
    const user_id = useSelector((state: RootState) => state.offline.user_id);
    const INJECTEDJAVASCRIPT = `
        const meta = document.createElement('meta');
        meta.setAttribute('content', initial-scale=0.5, maximum-scale=0.5, user-scalable=0');
        meta.setAttribute('name', 'viewport');
        document.getElementsByTagName('head')[0].appendChild(meta);
    `;

    const [uri, setUri] = useState<string>(OFFLINE_URL);

    useEffect(() => {
        const url = new URL(OFFLINE_URL);
        if (typ_ids) url.searchParams.append('typ_id', typ_ids.join(','));
        url.searchParams.append('uzivatelId', user_id);
        const uri = url.toString();
        setUri(uri);
    }, [typ_ids, user_id]);

    const handleMessageFromWeb = (event) => {
        const message = event.nativeEvent.data;
        console.log('Message received from web app:', message);
    };

    const sendMessageToWeb = () => {
        const message = JSON.stringify({
            type: 'greeting',
            payload: 'Hello from React Native!',
        });
        webviewRef.current.postMessage(message);
    };

    return (
        <WebView
            source={{ uri }}
            ref={webviewRef}
            scalesPageToFit
            allowsBackForwardNavigationGestures
            setDisplayZoomControls={false}
            injectedJavaScript={INJECTEDJAVASCRIPT}
            onMessage={handleMessageFromWeb} // window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'greeting', payload: 'Hello from Web App!' }));
            onNavigationStateChange={(event) => {
                if (event.url.includes(OFFLINE_URL)) {
                } else if (event.url.includes(APP_URL)) {
                    webviewRef.current.stopLoading();
                    router.navigate('HomePage');
                } else if (!event.url.includes(OFFLINE_URL)) {
                    webviewRef.current.stopLoading();
                    Linking.openURL(event.url);
                }
            }}
            domStorageEnabled
            allowFileAccess
            startInLoadingState
            mediaPlaybackRequiresUserAction={false}
        />
    );
};
export default OfflineMode;
