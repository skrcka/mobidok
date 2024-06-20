import { WebView } from 'react-native-webview';

const DashBoardPage = () => {
    return (
        <WebView
            source={{ uri: 'https://reactnative.dev/' }}
            scalesPageToFit={true}
        />
    );
};
export default DashBoardPage;
