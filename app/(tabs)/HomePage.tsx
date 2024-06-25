import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Linking } from 'react-native';
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
    const INJECTEDJAVASCRIPT = `
        const meta = document.createElement('meta');
        meta.setAttribute('content', initial-scale=0.5, maximum-scale=0.5, user-scalable=0');
        meta.setAttribute('name', 'viewport');
        document.getElementsByTagName('head')[0].appendChild(meta);
    `;

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
            injectedJavaScript={INJECTEDJAVASCRIPT}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            domStorageEnabled
            allowFileAccess
            startInLoadingState
            mediaPlaybackRequiresUserAction={false}
        />
    );
};
export default HomePage;
