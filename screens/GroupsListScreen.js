import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import GroupList from '../components/Groups/GroupList';
import { Colors } from '../constants/styles';
import { AuthContext } from '../store/auth-context';

export default function GroupsListScreen({ route, navigation }) {
	const [groupsList, setGroupList] = useState([]);
	const authCtx = useContext(AuthContext);

	useEffect(() => {
		async function getUserDetails() {
			const userString = await AsyncStorage.getItem('user');

			if (userString) {
				const arrayData = JSON.parse(userString);
				const userMap = new Map(arrayData);

				const user = (await authCtx.fetchUsersById([userMap.get('id')]))[0];

				const userGroupsList = user.groups;

				const groupsData = await authCtx.fetchGroupsById(userGroupsList);

				setGroupList(groupsData);
			}
		}

		getUserDetails();
	}, []);

	async function getMapDetails(group) {
		const groupDetails = group;

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

	return (
		<View
			style={{
				flex: 1,
			}}>
			{groupsList.length == 0 && (
				<View
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Text
						style={{
							color: Colors.primary500,
							fontSize: 30,
							fontWeight: 'bold',
						}}>
						No groups
					</Text>
				</View>
			)}
			{groupsList.length > 0 && (
				<GroupList
					data={groupsList}
					onPressHandler={async (group) => {
						const { ownerDetails, membersDetails } = await getMapDetails(group);
						navigation.navigate('MapsScreen', {
							ownerDetails: ownerDetails,
							membersDetails: membersDetails,
						});
					}}
				/>
			)}
		</View>
	);
}
