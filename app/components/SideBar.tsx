import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { closeSidebar } from '../store/sidebar.reducer'; // Make sure this import is correct

const Sidebar = () => {
    const dispatch = useDispatch();

    const handleCloseSidebar = () => {
        dispatch(closeSidebar());
    };

    return (
        <View style={styles.sidebar}>
            <Text style={styles.header}>Sidebar Menu</Text>
            <Button title="Close Sidebar" onPress={handleCloseSidebar} />
            {/* Add other sidebar menu items here */}
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Sidebar;
