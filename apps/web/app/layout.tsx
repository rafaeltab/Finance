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

const user = {
	name: 'Tom Cook',
	email: 'tom@example.com',
	imageUrl:
		'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
	{ name: 'Dashboard', href: '/dashboard', current: false },
	{ name: 'Assets', href: '/assets', current: false },
	{
		name: 'Stock',
		href: '/stock',
		current: false,
		flyout: [
			{
				name: "List",
				href: "/list",
				icon: QueueListIcon,
				current: false
			},
			{
				name: "Search",
				href: "/search",
				icon: MagnifyingGlassIcon,
				current: false
			},
			{
				name: "Discover",
				href: "/discover",
				icon: GlobeEuropeAfricaIcon,
				current: false
			}
		]
	} // Should be a flyout with search, discover, list
];

const userNavigation = [
	{ name: 'Change user', href: '/user-select' }
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function setActivePath(pathname: string) {
	for (const nav of navigation) {
		if (pathname.startsWith(nav.href)) {
			nav.current = true;
			if (nav.flyout !== undefined) {
				for (const flyout of nav.flyout) {
					const flyoutpath = `${nav.href}${flyout.href}`;
					console.log(flyoutpath, pathname)
					if (pathname.startsWith(flyoutpath)) flyout.current = true;
					else flyout.current = false;
				}
			}
			continue;
		} else { 
			nav.current = false;
			if (nav.flyout !== undefined) {
				for (const flyout of nav.flyout) {
					flyout.current = false;
				}
			}
		}
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	if (pathname == null) {
		throw new Error("Unexpected empty pathname");
	}

	setActivePath(pathname);

	return (
		<html className="h-full bg-gray-100">
			<body className="h-full">
				<div className="min-h-full">
					<Disclosure as="nav" className="bg-gray-800">
						{({ open: disclosureOpen }) => (
							<>
								<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
									<div className="relative flex h-16 items-center justify-between">
										<div className="absolute inset-x-0 bottom-0 h-px bg-white/5" />
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<img
													className="h-8 w-8"
													src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
													alt="Your Company"
												/>
											</div>
											<div className="hidden md:block">
												<div className="ml-10 flex items-baseline space-x-4">
													{navigation.map((item) => {
														if (item.flyout !== undefined) {
															return (
																<Popover className="relative" key={item.name}>
																	{({ open: popoverOpen }) => (
																		<>
																			<Popover.Button className={classNames(
																				item.current
																					? 'bg-gray-900 text-white'
																					: 'text-gray-300 hover:bg-gray-700 hover:text-white',
																				'group inline-flex items-center px-3 py-2 rounded-md text-sm font-medium'
																			)}>
																				{item.name}
																				<ChevronDownIcon
																					className={classNames(popoverOpen ? "rotate-90 transform" : "",
																						"ml-2 h-5 w-5 text-gray-300 transition duration-150 ease-in-out group-hover:text-opacity-80")}
																					aria-hidden="true"
																				/>
																			</Popover.Button>
																			<Transition
																				enter="transition duration-100 ease-out"
																				enterFrom="transform scale-95 opacity-0"
																				enterTo="transform scale-100 opacity-100"
																				leave="transition duration-75 ease-out"
																				leaveFrom="transform scale-100 opacity-100"
																				leaveTo="transform scale-95 opacity-0"
																			>
																				<Popover.Panel className="absolute z-10 mt-3 w-screen max-w-sm 3xl:-translate-x-1/2 3xl:transform px-4 sm:px-0 lg:max-w-md">
																					<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
																						<div className="relative grid gap-8 bg-white p-7">
																							{item.flyout.map((flyout) => (
																								<a
																									key={flyout.name}
																									href={`${item.href}/${flyout.href}`}
																									className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
																								>
																									<div className="flex h-10 w-10 shrink-0 items-center justify-center text-white bg-indigo-500 rounded-md">
																										<flyout.icon aria-hidden="true" className="h-7 w-7" />
																									</div>
																									<div className="ml-4">
																										<p className="text-sm font-medium text-gray-900">
																											{flyout.name}
																										</p>
																									</div>
																								</a>
																							))}
																						</div>
																					</div>
																				</Popover.Panel>
																			</Transition>
																		</>
																	)}

																</Popover>
															);
														} else {
															return (
																<a
																	key={item.name}
																	href={item.href}
																	className={classNames(
																		item.current
																			? 'bg-gray-900 text-white'
																			: 'text-gray-300 hover:bg-gray-700 hover:text-white',
																		'px-3 py-2 rounded-md text-sm font-medium'
																	)}
																	aria-current={item.current ? 'page' : undefined}
																>
																	{item.name}
																</a>
															);
														}
													})}
												</div>
											</div>
										</div>
										<div className="hidden md:block">
											<div className="ml-4 flex items-center md:ml-6">

												{/* Profile dropdown */}
												<Menu as="div" className="relative ml-3">
													<div>
														<Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
															<span className="sr-only">Open user menu</span>
															<img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
														</Menu.Button>
													</div>
													<Transition
														as={Fragment}
														enter="transition ease-out duration-100"
														enterFrom="transform opacity-0 scale-95"
														enterTo="transform opacity-100 scale-100"
														leave="transition ease-in duration-75"
														leaveFrom="transform opacity-100 scale-100"
														leaveTo="transform opacity-0 scale-95"
													>
														<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
															{userNavigation.map((item) => (
																<Menu.Item key={item.name}>
																	{({ active }) => (
																		<a
																			href={item.href}
																			className={classNames(
																				active ? 'bg-gray-100' : '',
																				'block px-4 py-2 text-sm text-gray-700'
																			)}
																		>
																			{item.name}
																		</a>
																	)}
																</Menu.Item>
															))}
														</Menu.Items>
													</Transition>
												</Menu>
											</div>
										</div>
										<div className="-mr-2 flex md:hidden">
											{/* Mobile menu button */}
											<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
												<span className="sr-only">Open main menu</span>
												{disclosureOpen ? (
													<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
												) : (
													<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
												)}
											</Disclosure.Button>
										</div>
									</div>
								</div>

								{/* TODO make good layout for small with stocks */}
								<Disclosure.Panel className="md:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
									<div className="space-y-1 pt-2">
										{flattenNavigation().map((item) => (
											<Disclosure.Button
												key={item.name}
												as="a"
												href={item.href}
												className={classNames(
													item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'block px-3 py-2 rounded-md text-base font-medium'
												)}
												aria-current={item.current ? 'page' : undefined}
											>
												{item.element}
											</Disclosure.Button>
										))}
									</div>
									<div className="pb-3">
										<div className="inset-x-0 bottom-0 h-px bg-white/5 my-3" />
										<div className="flex items-center">
											<div className="flex-shrink-0">
												<img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
											</div>
											<div className="ml-3">
												<div className="text-base font-medium leading-none text-white">{user.name}</div>
												<div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
											</div>
										</div>
										<div className="mt-3 space-y-1">
											{userNavigation.map((item) => (
												<Disclosure.Button
													key={item.name}
													as="a"
													href={item.href}
													className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
												>
													{item.name}
												</Disclosure.Button>
											))}
										</div>
										<div className="inset-x-0 bottom-0 h-px bg-white/5 my-3" />
									</div>
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
					{children}

				</div>

			</body>

		</html>

	)
}

type FlatNav = {
	name: string,
	element: React.ReactNode;
	href: string;
	current: boolean;
}

function flattenNavigation() {
	let flat: FlatNav[] = []
	for (const nav of navigation) {
		if (nav.flyout === undefined) {
			let navElement = (
				<>
					{nav.name}
				</>
			);

			let flattened: FlatNav = {
				name: nav.name,
				href: nav.href,
				element: navElement,
				current: nav.current,
			}

			flat.push(flattened);
			continue;
		}

		for (const flyout of nav.flyout) {
			let navElement = (
				<div className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out">
					{flyout.icon === undefined ? undefined : (
						<div className="flex h-7 w-7 shrink-0 items-center justify-center text-white bg-indigo-500 rounded-md mr-3">
							<flyout.icon aria-hidden="true" className="h-5 w-5" />
						</div>)} {nav.name} {flyout.name}
				</div>
			);

			let flattened: FlatNav = {
				name: `${nav.name}/${flyout.name}`,
				href: `${nav.href}${flyout.href}`,
				element: navElement,
				current: flyout.current,
			}

			flat.push(flattened);
			continue;
		}
	}

	return flat;
}