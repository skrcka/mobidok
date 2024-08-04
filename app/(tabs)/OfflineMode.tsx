import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useSelector } from 'react-redux';

import { useAuth } from '../../context/AuthProvider';
import { useBleManager } from '../../context/BluetoothProvider';
import {
    Message,
    MessageResult,
    MessageType,
    Response,
} from '../connectors/webConnector';
import {
    APP_URL,
    OFFLINE_URL,
    PRINTER_CHARACTERISTIC_UUID,
    PRINTER_SERVICE_UUID,
} from '../constants/const';
import { RootState } from '../store/store';

const OfflineMode = () => {
    const router = useRouter();
    const auth = useAuth();
    const bleManager = useBleManager();
    const webviewRef = useRef<WebView>(null);
    const typ_ids = useSelector((state: RootState) => state.offline.typ_ids);
    const user_id = useSelector((state: RootState) => state.offline.user_id);
    const INJECTEDJAVASCRIPT = `
        (function() {
            const originalLog = console.log;
            console.log = function(...args) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 0, payload: args }));
                originalLog.apply(console, args);
            };
        })();
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

    const handleMessageFromWeb = (event: WebViewMessageEvent) => {
        const message: Message = JSON.parse(event.nativeEvent.data);
        console.log('Message received from web app:', message);

        switch (message.type) {
            case MessageType.LOG:
                console.log('WebView log:', ...message.payload);
                break;
            case MessageType.PRINT: {
                console.log('Print request:', message.payload);
                bleManager
                    .writeToConnectedDevice(
                        PRINTER_SERVICE_UUID,
                        PRINTER_CHARACTERISTIC_UUID,
                        message.payload
                    )
                    .then(() => {
                        sendMessageToWeb({
                            id: message.id,
                            type: MessageType.PRINT,
                            result: MessageResult.OK,
                        });
                    })
                    .catch((error) => {
                        console.error('Error while writing to printer:', error);
                        sendMessageToWeb({
                            id: message.id,
                            type: MessageType.PRINT,
                            result: MessageResult.ERROR,
                            error: error.message,
                        });
                    });
                break;
            }
            case MessageType.TOKEN: {
                console.log('Token request');
                const token = auth.getToken();
                const payload = { token };
                const response: Response = {
                    id: message.id,
                    type: MessageType.TOKEN,
                    result: MessageResult.OK,
                    payload,
                };
                sendMessageToWeb(response);
                break;
            }
            default:
                console.log('Unknown message type:', message.type);
        }
    };

    const sendMessageToWeb = (response: Response) => {
        const message = JSON.stringify(response);
        console.log('Sending message to web app:', message);
        webviewRef.current.postMessage(message);
    };

    const handleShouldStartLoadWithRequest = (request) => {
        if (request.url.includes(OFFLINE_URL)) {
            return true;
        } else if (request.url.includes(APP_URL)) {
            router.navigate('HomePage');
            return false;
        } else if (!request.url.includes(OFFLINE_URL)) {
            webviewRef.current.stopLoading();
            Linking.openURL(request.url);
            return false;
        }
        return false;
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
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            javaScriptEnabled
            allowFileAccess
            startInLoadingState
            mediaPlaybackRequiresUserAction={false}
            collapsable={false}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
            domStorageEnabled
        />
    );
};
export default OfflineMode;
