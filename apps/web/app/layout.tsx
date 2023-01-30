"use client";

import "./globals.css";
import { Fragment } from 'react'
import { Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import {
	Bars3Icon,
	ChevronDownIcon,
	XMarkIcon,
	MagnifyingGlassIcon,
	QueueListIcon,
	GlobeEuropeAfricaIcon
} from '@heroicons/react/24/outline'
import { usePathname } from "next/navigation";
import React from 'react'
import { AuthenticationProvider, useAuthentication } from "../hooks/useAuthentication";
import { HrefOrOnClick, NavigationItem, NavigationSpec, useNavigation } from "../hooks/useNavigation";
import { Navigator } from "../components/navigation/Navigator";

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
	const authenticationContext = useAuthentication();
	const pathname = usePathname();
	const navigation = useNavigation(navigationSpec);


	if (!authenticationContext.authenticated) return (
		<html className="h-full bg-gray-100">
			<head></head>
			<body className="h-full"></body>

		</html>
	);
	const { user, logout } = authenticationContext;

	if (pathname == null) {
		throw new Error("Unexpected empty pathname");
	}

	return (
		<html className="h-full bg-gray-100">
			<head></head>
			<body className="h-full">
				<div className="min-h-full">
					<Navigator logout={logout} navigationSpec={navigationSpec} user={user} />
					{children}
				</div>
			</body>
		</html>
	)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return <AuthenticationProvider>
		<Layout>
			{children}
		</Layout>
	</AuthenticationProvider>
}

