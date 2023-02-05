import type { User } from "@auth0/auth0-react";
import { Disclosure, Transition, Menu } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import { HrefOrOnClick, NavigationItem, NavigationSpec, useNavigation } from "../../hooks/useNavigation";
import { classNames } from "../../util/classNames";
import { FlatNavigationButton } from "./FlatNavigationButton";
import { NavigationButton } from "./NavigationButton";
import { NavigationWithFlyoutButton } from "./NavigationWithFlyoutButton";

type Props = {
	navigationSpec: NavigationSpec[];
	user: User,
	logout: () => void
}

export function Navigator(props: Props) {
	const navigation = useNavigation(props.navigationSpec);

	const userNavigation = [
		{
			name: 'Logout', onClick: props.logout, current: false
		}
	]

	return (<Disclosure as="nav" className="bg-gray-800">
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
									{navigation.map((item, index) => {
										if (item.flyout !== undefined) {
											return (<NavigationWithFlyoutButton item={item} key={index} />);
										} else {
											return (
												<NavigationButton item={item} key={index} />
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
											<img className="h-8 w-8 rounded-full" src={props.user.picture} referrerPolicy="no-referrer" alt="" />
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
														<p
															onClick={item.onClick}
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}
														>
															{item.name}
														</p>
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

				<Disclosure.Panel className="md:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="space-y-1 pt-2">
						{flattenNavigation(navigation).map((item, index) => (
							<FlatNavigationButton item={item} key={index} />
						))}
					</div>
					<div className="pb-3">
						<div className="inset-x-0 bottom-0 h-px bg-white/5 my-3" />
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<img className="h-10 w-10 rounded-full" src={props.user.picture} alt="" />
							</div>
							<div className="ml-3">
								<div className="text-base font-medium leading-none text-white">{props.user.name}</div>
							</div>
						</div>
						<div className="mt-3 space-y-1">
							{userNavigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									onClick={item.onClick}
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
	</Disclosure>);
}

export type FlatNav = {
	name: string,
	element: React.ReactNode;
	active: boolean;
} & HrefOrOnClick;

function createFlatNav(name: string, element: React.ReactNode, active: boolean, href: string | undefined, onClick: (() => void) | undefined): FlatNav {
	if (href !== undefined) {
		return {
			name: name,
			element: element,
			active: active,
			href: href,
		}
	} else if (onClick !== undefined) {
		return {
			name: name,
			element: name,
			active: active,
			onClick: onClick,
		}
	}

	throw new Error("href or onClick must be defined");
}

function flattenNavigation(navigation: NavigationItem[]) {
	let flat: FlatNav[] = []
	for (const nav of navigation) {
		if (nav.flyout === undefined) {
			let navElement = (
				<>
					{nav.name}
				</>
			);
			
			let flattened: FlatNav = createFlatNav(
				nav.name,
				navElement,
				nav.active,
				("href" in nav) ? nav.href : undefined,
				("onClick" in nav) ? nav.onClick : undefined);

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

			let flattened: FlatNav = createFlatNav(
				`${nav.name}/${flyout.name}`,
				navElement,
				nav.active,
				("href" in flyout && "href" in nav) ? `${nav.href}${flyout.href}` : undefined,
				("onClick" in flyout) ? flyout.onClick : undefined);

			flat.push(flattened);
			continue;
		}
	}

	return flat;
}