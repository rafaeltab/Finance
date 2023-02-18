import type { User } from "@auth0/auth0-react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import { HrefOrOnClick, NavigationItem, NavigationSpec, useNavigation } from "../../hooks/useNavigation";
import { SideNavigationButton } from "./SideNavigationButton";

type Props = {
	navigationSpec: NavigationSpec[];
	user: User,
	logout: () => void
}

export function SideNavigator(props: Props) {
	const navigation = useNavigation(props.navigationSpec);
	const [sidebarOpen, setSidebarOpen] = React.useState(false);


	// const userNavigation = [
	// 	{
	// 		name: 'Logout', onClick: props.logout, current: false
	// 	}
	// ]

	return (<>
		<div>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute top-0 right-0 -mr-12 pt-2">
										<button
											type="button"
											className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
											onClick={() => setSidebarOpen(false)}
										>
											<span className="sr-only">Close sidebar</span>
											<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>
								<div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
									<div className="flex flex-shrink-0 items-center px-4">
										<img
											className="h-8 w-auto"
											src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
											alt="Your Company"
										/>
									</div>
									<nav className="mt-5 space-y-1 px-2">
										{navigation.map((item) => (
											<SideNavigationButton item={item} isPopover />
										))}
									</nav>
								</div>
								<div className="flex flex-shrink-0 bg-gray-700 p-4">
									<a href="#" className="group block flex-shrink-0">
										<div className="flex items-center">
											<div>
												<img
													className="inline-block h-10 w-10 rounded-full"
													src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
													alt=""
												/>
											</div>
											<div className="ml-3">
												<p className="text-base font-medium text-white">Tom Cook</p>
												<p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">View profile</p>
											</div>
										</div>
									</a>
								</div>
							</Dialog.Panel>
						</Transition.Child>
						<div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className="flex min-h-0 flex-1 flex-col bg-gray-900">
					<div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
						<div className="flex flex-shrink-0 items-center px-4">
							<img
								className="h-8 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
								alt="Your Company"
							/>
						</div>
						<nav className="mt-5 flex-1 space-y-1 px-2">
							{navigation.map((item) => (
								<SideNavigationButton item={item} />
							))}
						</nav>
					</div>
					<div className="flex flex-shrink-0 bg-gray-800 p-4">

						<div className="flex items-center group w-full flex-shrink-0">
							<a href="#" className="w-full flex items-center pr-10">
								<img
									className="inline-block h-9 w-9 rounded-full"
									src={props.user.picture}
									alt=""
								/>
								<div className="ml-3">
									<p className="text-sm font-medium text-white">{props.user.name}</p>
								</div>

							</a>

							<div className="ml-5 items-center flex pr-2 h-full cursor-pointer" onClick={props.logout}>
								<ArrowRightOnRectangleIcon className="h-6 w-6 text-white" aria-hidden="true" />
							</div>
						</div>

					</div>
				</div>
			</div>
			<div className="flex flex-1 flex-col md:pl-64 ">
				<div className="sticky top-0 z-10 bg-gray-900 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
					<button
						type="button"
						className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
						onClick={() => setSidebarOpen(true)}
					>
						<span className="sr-only">Open sidebar</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>

			</div>
		</div>
	</>);
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