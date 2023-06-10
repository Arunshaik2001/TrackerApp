import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { arrayUnion } from 'firebase/firestore';
import { Colors } from '../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';

function HomeScreen({ route, navigation }) {
	const [fetchedUser, setFetchedUser] = useState(null);

	const authCtx = useContext(AuthContext);

	useEffect(() => {
		async function getUserDetails() {
			const userString = await AsyncStorage.getItem('user');

			if (userString) {
				const arrayData = JSON.parse(userString);
				const user = new Map(arrayData);
				setFetchedUser(user);
			}
		}

		getUserDetails();
	}, []);

	async function getMapDetails() {
		const userId = await AsyncStorage.getItem('userId');
		const userMap = (await authCtx.fetchUsersById([userId]))[0];
		const joinedGroups = userMap.groups;

		const groupDetails = (await authCtx.fetchGroupsById(joinedGroups))[0];

		const memberInGroupDetails = await authCtx.fetchUsersById(
			groupDetails.members
		);

		const mapData = {
			ownerDetails: null,
			membersDetails: [],
		};

		memberInGroupDetails.forEach((member) => {
			if (member.id === groupDetails.owner) {
				mapData.ownerDetails = member;
			}
			mapData.membersDetails.push(member);
		});
		return mapData;
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
			if (route.params) {
				const userString = await AsyncStorage.getItem('user');
				if (userString) {
					const arrayData = JSON.parse(userString);
					const user = new Map(arrayData);

					authCtx.updateGroupById(route.params.data, {
						members: arrayUnion(user.get('id')),
					});
					authCtx.updateUserById(user.get('id'), {
						groups: arrayUnion(route.params.data),
					});
				}
			}
		});

		return unsubscribe;
	}, [navigation, fetchedUser]);

	return (
		<View style={styles.rootContainer}>
			<LinearGradient
				colors={[Colors.primary300, Colors.primary500]}
				style={styles.gradientContainer}>
				<Text style={styles.title}>Your Group Code</Text>
				{fetchedUser && (
					<Pressable
						onPress={async () => {
							const { ownerDetails, membersDetails } = await getMapDetails();

							navigation.navigate('MapsScreen', {
								ownerDetails: ownerDetails,
								membersDetails: membersDetails,
							});
						}}
						style={styles.qrCodeContainer}>
						<QRCode value={fetchedUser.get('code')} size={250} />
					</Pressable>
				)}
				{fetchedUser && (
					<Text style={styles.groupCodeText}>{fetchedUser.get('code')}</Text>
				)}
				<Pressable
					onPress={() => {
						navigation.navigate('Barcode');
					}}
					style={styles.scanButton}>
					<Text style={styles.scanButtonText}>Scan Code</Text>
				</Pressable>
			</LinearGradient>
		</View>
	);
}

export default HomeScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	gradientContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	title: {
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	qrCodeContainer: {
		marginBottom: 20,
	},
	groupCodeText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	scanButton: {
		backgroundColor: Colors.primary700,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
	},
	scanButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});
