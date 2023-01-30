import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React from "react";
import { NavigationItem } from "../../hooks/useNavigation";
import { classNames } from "../../util/classNames";

type Props = { item: NavigationItem }

export function NavigationWithFlyoutButton({ item }: Props) {
	return (
		<Popover className="relative" key={item.name}>
			{({ open: popoverOpen }) => (
				<>
					<Popover.Button className={classNames(
						item.active
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
									{item.flyout?.map((flyout) => (
										<a
											key={flyout.name}
											{...("href" in item && item.href !== undefined && "href" in flyout && flyout.href !== undefined ? { as: "a", href: `${item.href}/${flyout.href}` } : {})}
											{...("onClick" in item && item.onClick !== undefined ? { as: "p", onClick: item.onClick } : {})}
											className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
										>
											{flyout.icon && (
												<div className="flex h-10 w-10 shrink-0 items-center justify-center text-white bg-indigo-500 rounded-md">
													<flyout.icon aria-hidden="true" className="h-7 w-7" />
												</div>
											)}

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
}