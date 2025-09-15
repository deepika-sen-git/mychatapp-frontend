import { StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './src/AppNavigator';
import React from 'react';
import { persistor, store } from './src/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBarColorProvider, useStatusBarColor } from './src/context';

function Root() {
  const { color } = useStatusBarColor();
  return (
    <>
      <StatusBar backgroundColor={ color } translucent={ false } />
      <View style={ styles.container }>
        <AppNavigator />
      </View>
    </>
  );
}

function App() {

  return (
    <Provider store={ store }>
      <PersistGate loading={ null } persistor={ persistor }>
        <StatusBarColorProvider>
          <Root />
        </StatusBarColorProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create( {
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
} );

export default App;
