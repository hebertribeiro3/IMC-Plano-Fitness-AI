import { Tabs } from 'expo-router';
import { LayoutDashboard, Calendar, CheckSquare } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#10b981',
      headerShown: true,
      headerStyle: { backgroundColor: '#fff' },
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendário',
          tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: 'Checklist',
          tabBarIcon: ({ color }) => <CheckSquare color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
