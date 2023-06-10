import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import IconButton from './components/ui/IconButton';
import BarcodeScreen from './screens/BarcodeScreen';
import GroupsListScreen from './screens/GroupsListScreen';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import GroupsMapScreen from './screens/GroupsMapScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const BottomTab = createMaterialBottomTabNavigator();

function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: 'white',
				contentStyle: { backgroundColor: Colors.primary100 },
			}}>
			<Stack.Screen name='Login' component={LoginScreen} />
			<Stack.Screen name='Signup' component={SignupScreen} />
		</Stack.Navigator>
	);
}

function AuthenticatedStack() {
	const authCtx = useContext(AuthContext);
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: 'white',
				contentStyle: { backgroundColor: Colors.primary100 },
			}}>
			<Stack.Screen
				name='Home'
				component={HomeScreen}
				options={{
					headerRight: ({ tintColor }) => (
						<IconButton
							icon='exit'
							color={tintColor}
							size={24}
							onPress={authCtx.logout}
						/>
					),
				}}
			/>
			<Stack.Screen name='Barcode' component={BarcodeScreen} />
		</Stack.Navigator>
	);
}

function AuthenticatedBottomTab() {
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen
				name='HomeTab'
				component={AuthenticatedStack}
				options={{
					title: 'Home',
					tabBarIcon: ({ focused, color, size }) => {
						return <FontAwesome name='home' size={24} color='black' />;
					},
				}}
			/>
			<BottomTab.Screen
				name='GroupsTab'
				component={AuthencatedGroupsStack}
				options={{
					title: 'Groups',
					tabBarIcon: ({ focused, color, size }) => {
						return <MaterialIcons name='groups' size={24} color='black' />;
					},
				}}
			/>
		</BottomTab.Navigator>
	);
}

function AuthencatedGroupsStack() {
	const authCtx = useContext(AuthContext);

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: 'white',
				contentStyle: { backgroundColor: Colors.primary100 },
			}}>
			<Stack.Screen
				name='GroupsScreen'
				component={GroupsListScreen}
				options={{
					headerTitle: 'Groups',
					headerRight: ({ tintColor }) => (
						<IconButton
							icon='exit'
							color={tintColor}
							size={24}
							onPress={authCtx.logout}
						/>
					),
				}}
			/>
		</Stack.Navigator>
	);
}

function Navigation() {
	const authCtx = useContext(AuthContext);

	return (
		<NavigationContainer>
			{!authCtx.isAuthenticated && <AuthStack />}
			{authCtx.isAuthenticated && <MainStack />}
		</NavigationContainer>
	);
}

function MainStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='BottomTab'
				component={AuthenticatedBottomTab}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='MapsScreen'
				component={GroupsMapScreen}
				options={{
					headerStyle: { backgroundColor: Colors.primary500 },
					headerTintColor: 'white',
					contentStyle: { backgroundColor: Colors.primary100 },
				}}
			/>
		</Stack.Navigator>
	);
}

function Root() {
	const authCtx = useContext(AuthContext);

	useEffect(() => {
		async function fetchToken() {
			const storedToken = await AsyncStorage.getItem('token');

			if (storedToken) {
				authCtx.setToken(storedToken);
			}
			SplashScreen.hideAsync();
		}

		fetchToken();
	}, []);

	return <Navigation />;
}

SplashScreen.preventAutoHideAsync();
export default function App() {
	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.log('Permission to access location was denied');
				return;
			}
		})();
	}, []);

	return (
		<>
			<StatusBar style='light' />
			<AuthContextProvider>
				<Root />
			</AuthContextProvider>
		</>
	);
}
