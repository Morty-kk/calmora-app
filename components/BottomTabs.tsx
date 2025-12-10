import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';
import React from 'react';
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
          flex: 1, alignItems: 'center', paddingVertical: 10, gap: 2,
          opacity: isActive(href) ? 1 : 0.7,
        }}
      >
        <Ionicons name={icon} size={18} color="#111827" />
        <Text style={{ fontSize: 12, fontWeight: isActive(href) ? '800' : '500' }}>{label}</Text>
      </Pressable>
    </Link>
  );

  return (
    <View
      style={{
        position: Platform.select({ web: 'fixed', default: 'absolute' }) as any, // web fix
        left: 16, right: 16, bottom: 16,
        backgroundColor: '#F5D8C9',
        borderRadius: 16,
        flexDirection: 'row',
        shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
        borderWidth: 1, borderColor: '#00000010',
        zIndex: 1,          // über allen Karten
        elevation: 8,         // Android
        pointerEvents: 'auto', // sicher klicken
      }}
    >
      <Item href="/menu" label="Startseite" icon="home" />
      <Item href="/chat-list" label="Chat" icon="chatbubble-ellipses" />
      <Item href="/profile" label="Profil" icon="person" />
    </View>
  );
}