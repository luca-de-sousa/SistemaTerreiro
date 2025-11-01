import { createNativeStackNavigator } from '@react-navigation/native-stack'
import PainelScreen from '../screens/PainelScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return(
        <Stack.Navigator initialRouteName='Painel'>
            <Stack.Screen
                name='Painel'
                component={PainelScreen}
                options={{title: 'Painel'}}
            />
        </Stack.Navigator>
    );
}