import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AuthContext } from '../store/auth-context';
import Button from '../components/ui/Button';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { arrayUnion } from 'firebase/firestore';

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
			<Text style={styles.title}>Your Group Code</Text>
			{fetchedUser && (
				<Pressable
					onPress={async () => {
						const { ownerDetails, membersDetails } = await getMapDetails();

						navigation.navigate('MapsScreen', {
							ownerDetails: ownerDetails,
							membersDetails: membersDetails,
						});
					}}>
					<QRCode value={fetchedUser.get('code')} size={250} />
				</Pressable>
			)}
			{fetchedUser && (
				<Text style={styles.title}>{fetchedUser.get('code')}</Text>
			)}
			<Button
				onPress={() => {
					navigation.navigate('Barcode');
				}}>
				Scan code
			</Button>
		</View>
	);
}

export default HomeScreen;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		padding: 32,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 8,
	},
});
