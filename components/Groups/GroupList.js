import { FlatList, Pressable, View, Text } from 'react-native';
import { Colors } from '../../constants/styles';

export default function GroupList({ data, onPressHandler }) {
	function GroupTile({ item }) {
		return (
			<Pressable
				onPress={() => {
					onPressHandler(item);
				}}>
				<View
					style={{
						backgroundColor: Colors.primary500,
						borderRadius: 10,
						padding: 20,
						marginVertical: 10,
						margin: 10,
						justifyContent: 'space-evenly',
					}}>
					<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20,marginBottom: 5 }}>
						Group code: {item.code}
					</Text>
					<Text style={{ color: 'yellow', fontWeight: 'bold',marginBottom: 5 }}>
						Group Owner: {item.owner}
					</Text>
					<Text style={{ color: 'white', fontWeight: 'bold' }}>
						Total Members: {item.members.length}
					</Text>
				</View>
			</Pressable>
		);
	}

	return (
		<FlatList
			data={data}
			renderItem={GroupTile}
			keyExtractor={(item, index) => item.code}
		/>
	);
}
