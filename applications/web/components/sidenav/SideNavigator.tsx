import type { User } from "@auth0/auth0-react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { Fragment } from "react";
import { HrefOrOnClick, NavigationSpec, useNavigation } from "../../hooks/useNavigation";
import { SideNavigationButton } from "./SideNavigationButton";

type Props = {
	navigationSpec: NavigationSpec[];
	user: User,
	logout: () => void,
} & React.PropsWithChildren

export function SideNavigator({ navigationSpec, user, logout, children }: Props) {
    const navigation = useNavigation(navigationSpec);
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
                            <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs bg-gray-900">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 pt-2 -mr-12">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                    <div className="flex items-center flex-shrink-0 px-4">
                                        <Image
                                            width={64}
                                            height={64}
                                            className="w-auto h-8"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <nav className="px-2 mt-5 space-y-1">
                                        {navigation.map(item => (
                                            <SideNavigationButton item={item} isPopover key={item.name} />
                                        ))}
                                    </nav>
                                </div>
                                <div className="flex flex-shrink-0 p-4 bg-gray-700">
                                    <a href="/" className="flex-shrink-0 block group">
                                        <div className="flex items-center">
                                            <div>
                                                <Image
                                                    width={64}
                                                    height={64}
                                                    className="inline-block w-10 h-10 rounded-full"
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
                        <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex flex-col flex-1 min-h-0 bg-gray-900">
                    <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <Image
                                width={64}
                                height={64}
                                className="w-auto h-8"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                alt="Your Company"
                            />
                        </div>
                        <nav className="flex-1 px-2 mt-5 space-y-1">
                            {navigation.map(item => (
                                <SideNavigationButton item={item} key={item.name} />
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 p-4 bg-gray-800">

                        <div className="flex items-center flex-shrink-0 w-full group">
                            <a href="/" className="flex items-center w-full pr-10">
                                <Image
                                    width={64}
                                    height={64}
                                    className="inline-block rounded-full h-9 w-9"
                                    src={user.picture ?? ""}
                                    alt=""
                                    referrerPolicy="no-referrer"
                                />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                </div>

                            </a>

                            <button type="button" className="flex items-center h-full pr-2 ml-5 cursor-pointer" onClick={logout}>
                                <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" aria-hidden="true" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 md:pl-64 ">
                <div className="sticky top-0 z-10 pt-1 pl-1 bg-gray-900 sm:pl-3 sm:pt-3 md:hidden">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                    </button>
                </div>

            </div>
        </div>
        <div className="md:ml-64">
            {children}
        </div>
    </>);
}

export type FlatNav = {
	name: string,
	element: React.ReactNode;
	active: boolean;
} & HrefOrOnClick;
