"use client";

import { useAuth0 } from '@auth0/auth0-react';
import {
	GlobeEuropeAfricaIcon, MagnifyingGlassIcon,
	QueueListIcon
} from '@heroicons/react/24/outline';
import { usePathname } from "next/navigation";
import React from 'react';
import { Navigator } from "../components/navigation/Navigator";
import { AuthenticationProvider, useLogout } from "../hooks/useAuthentication";
import { FinanceApiProvider } from '../hooks/useFinanceApi';
import type { NavigationSpec } from "../hooks/useNavigation";
import { useApiUser } from '../hooks/useUserExists';
import "./globals.css";

const navigationSpec: NavigationSpec[] = [
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Assets', href: '/assets' },
	{
		name: 'Stock',
		href: '/stock',
		flyout: [
			{
				name: "List",
				href: "/list",
				icon: QueueListIcon
			},
			{
				name: "Search",
				href: "/search",
				icon: MagnifyingGlassIcon
			},
			{
				name: "Discover",
				href: "/discover",
				icon: GlobeEuropeAfricaIcon
			}
		]
	} // Should be a flyout with search, discover, list
];

function Layout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, user } = useAuth0();
	const logout = useLogout();
	const pathname = usePathname();

	useApiUser(pathname?.includes("/user-create"));
	
	if (!isAuthenticated || !user || !user.sub || !logout) {
		return (
			<html className="h-full bg-gray-100">
				<head></head>
				<body className="h-full"></body>
			</html>
		)
	};

	if (pathname == null) {
		throw new Error("Unexpected empty pathname");
	}

	return (
		<html className="h-full bg-gray-100">
			<head>
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
			</head>
			<body className="h-full">
				<div className="min-h-full">
					<Navigator logout={logout} navigationSpec={navigationSpec} user={user} />
					{children}
				</div>
			</body>
		</html>
	)
}

function Authentication({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, loginWithPopup, isLoading } = useAuth0();

	if (!isAuthenticated && !isLoading) {
		loginWithPopup();
	}

	return (
		<>
			{children}
		</>
	);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return <AuthenticationProvider>
		<Authentication>
			<FinanceApiProvider>
				<Layout>
					{children}
				</Layout>
			</FinanceApiProvider>
		</Authentication>
	</AuthenticationProvider>
}

