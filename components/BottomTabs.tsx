import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';

export default function BottomTabs() {
  const path = usePathname();
  const isActive = (href: string) => path === href;

  const Item = ({
    href, label, icon,
  }: { href: '/menu' | '/chat-list' | '/profile'; label: string; icon: keyof typeof Ionicons.glyphMap }) => (
    <Link href={href} asChild>
      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 12,
          gap: 4,
          backgroundColor: isActive(href) ? '#9E86B9' : 'transparent',
          borderRadius: 12,
          marginHorizontal: 4,
        }}
      >
        <Ionicons 
          name={icon} 
          size={22} 
          color={isActive(href) ? '#fff' : '#2B2B2B'} 
        />
        <Text style={{ 
          fontSize: 12, 
          fontWeight: isActive(href) ? '700' : '600',
          color: isActive(href) ? '#fff' : '#2B2B2B',
        }}>{label}</Text>
      </Pressable>
    </Link>
  );

  return (
    <View
      style={{
        position: Platform.select({ web: 'fixed', default: 'absolute' }) as any,
        left: 16,
        right: 16,
        bottom: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        borderWidth: 1,
        borderColor: 'rgba(158, 134, 185, 0.1)',
        zIndex: 1000,
        elevation: 10,
        pointerEvents: 'auto',
      }}
    >
      <Item href="/menu" label="Startseite" icon="home" />
      <Item href="/chat-list" label="Chat" icon="chatbubble-ellipses" />
      <Item href="/profile" label="Profil" icon="person" />
    </View>
  );
}