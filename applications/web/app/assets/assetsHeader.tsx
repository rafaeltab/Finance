import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dispatch, Fragment, SetStateAction } from "react";


export function AddDropDown({ addAssetSetOpen, addAssetGroupOpen }: { addAssetSetOpen: Dispatch<SetStateAction<boolean>>, addAssetGroupOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
					Create
                    <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>

                            <button
                                type="button"
                                onClick={() => addAssetSetOpen(true)}
                                className='block px-4 py-2 text-sm text-gray-700'
                            >
								Create asset
                            </button>

                        </Menu.Item>
                        <Menu.Item>

                            <button
                                type="button"
                                onClick={() => addAssetGroupOpen(true)}
                                className='block px-4 py-2 text-sm text-gray-700'
                            >
								Create asset group
                            </button>

                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export function Header({ addAssetSetOpen, addAssetGroupOpen }: { addAssetSetOpen: Dispatch<SetStateAction<boolean>>, addAssetGroupOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
                <p className="mt-2 text-sm text-gray-700">
					A list of all the assets in your account
                </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <AddDropDown addAssetSetOpen={addAssetSetOpen} addAssetGroupOpen={addAssetGroupOpen} />
            </div>
        </div>
    );
}