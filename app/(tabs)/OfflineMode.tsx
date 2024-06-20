import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Linking } from 'react-native';
import WebView from 'react-native-webview';

import { APP_URL, OFFLINE_URL } from '../constants/const';

const OfflineMode = () => {
    const router = useRouter();
    const webviewRef = useRef<WebView>(null);
    // const INJECTEDJAVASCRIPT = `
    //     const meta = document.createElement('meta');
    //     meta.setAttribute('content', initial-scale=0.5, maximum-scale=0.5, user-scalable=0');
    //     meta.setAttribute('name', 'viewport');
    //     document.getElementsByTagName('head')[0].appendChild(meta);
    // `;

    return (
        <WebView
            source={{ uri: OFFLINE_URL }}
            ref={webviewRef}
            scalesPageToFit
            allowsBackForwardNavigationGestures
            setDisplayZoomControls={false}
            // injectedJavaScript={INJECTEDJAVASCRIPT}
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
        />
    );
};
export default OfflineMode;
