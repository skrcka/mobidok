import { Image, View, Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { closeSidebar, openSidebar } from '../store/sidebar.reducer';
import Images from '../../assets/index';

const Header = () => {
    const dispatch = useDispatch();

    const onPress = () => {
        dispatch(openSidebar());
    };

    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 100,
                    top: 20,
                    padding: 10,
                }}>
                <View>
                    {/* <TouchableOpacity onPress={onPress}>
                        <SvgXml
                            xml={Images.svgs.hamburger.source}
                            width="20"
                            height="20"
                        />
                    </TouchableOpacity> */}
                </View>
                <View>
                    <Text>Mobidok</Text>
                </View>
                {/* <View>
                    <Image
                        source={Images.header.bell.source}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                    />
                </View> */}
            </View>
        </>
    );
};
export default Header;
