import type { AssetResponse } from "@finance/svc-user-sdk";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { forwardRef, Fragment, useImperativeHandle, useRef, useState, type Dispatch, type ForwardedRef, type SetStateAction } from "react";
import { useApi } from "../../hooks/useFinanceApi";
import { classNames } from "../../util/classNames";

const addAssetSlideOverTabs = ["stock", "realEstate"] as const;
type AddAssetSlideOverTab = typeof addAssetSlideOverTabs[number];
const pretty: Record<AddAssetSlideOverTab, string> = {
    stock: "Stock",
    realEstate: "Real Estate",
};

type RefType = {
	saveAction: () => Promise<AssetResponse>;
}

type TabProps = {
	context: AddAssetSlideOverContextType;
	ref: ForwardedRef<RefType | undefined>
}

export type AddAssetSlideOverContextType = { type: "user" | "group", id: string };


function UnforwardedAddAssetRealEstateTab({ context }: { context: AddAssetSlideOverContextType }, ref: ForwardedRef<RefType | undefined>) {
    const [address, setAddress] = useState<string | undefined>(undefined);
    const { api, isConnected } = useApi();

    const saveAction = async (): Promise<AssetResponse> => {
        if (!isConnected || !context) {
            // show some error
            throw new Error();
        }

        if (!address) {
            // show some error
            throw new Error();
        }

        if (context.type === "user") {
            const res = await api.assetControllerCreateRealEstateAssetForUser(context.id, {
                address
            });

            if (res.data.data === undefined) {
                // show some error
                throw new Error();
            }

            return res.data.data;
        }
        const res = await api.assetControllerCreateRealEstateAssetForGroup(context.id, {
            address
        });

        if (res.data.data === undefined) {
            // show some error
            throw new Error();
        }

        return res.data.data;


    };

    useImperativeHandle(ref, () => ({
        saveAction
    }));

    return (
        <div>
            <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
            >
				Address
                <div className="mt-1">
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={address ?? ""}
                        onChange={(e) => setAddress(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="1600 Pennsylvania Avenue"
                    />
                </div>
            </label>
        </div>
    );
}
const AddAssetRealEstateTab = forwardRef(UnforwardedAddAssetRealEstateTab);

function UnforwardedAddAssetStockTab({ context }: { context: AddAssetSlideOverContextType }, ref: ForwardedRef<RefType | undefined>) {
    const [symbol, setSymbol] = useState<string | undefined>(undefined);
    const [exchange] = useState<string | undefined>("NASDAQ");
    const [amount, setAmount] = useState<string | undefined>(undefined);
    const [price, setPrice] = useState<string | undefined>(undefined);
    const { api, isConnected } = useApi();

    const saveAction = async () => {
        if (!isConnected || !context) {
            // show some error
            throw new Error();
        }

        if (!symbol || !exchange || !amount || !price) {
            // show some error
            throw new Error();
        }

        const { data } = await api.stockControllerGetSearch(exchange, symbol, "CS");
        const stock = data.data.data;

        if (stock.length === 0 || stock[0]?.identity === undefined) {
            // show some error
            throw new Error();
        }

        if (context.type === "user") {
            const res = await api.assetControllerCreateStockAssetForUser(context.id, {
                stockOrders: [
                    {
                        amount: parseFloat(amount),
                        price: parseFloat(price)
                    }
                ],
                stockDataIdentity: stock[0]?.identity
            });

            if (res.data.data === undefined) {
                // show some error
                throw new Error();
            }

            return res.data.data;
        }
        const res = await api.assetControllerCreateStockAssetForGroup(context.id, {
            stockOrders: [
                {
                    amount: parseFloat(amount),
                    price: parseFloat(price)
                }
            ],
            stockDataIdentity: stock[0]?.identity
        });

        if (res.data.data === undefined) {
            // show some error
            throw new Error();
        }

        return res.data.data;

    };

    useImperativeHandle(ref, () => ({
        saveAction
    }));

    return (
        <div className="flex flex-col gap-2">
            <div>
                <label
                    htmlFor="symbol"
                    className="block text-sm font-medium text-gray-700"
                >
					Symbol
                    <div className="mt-1">
                        <input
                            type="text"
                            name="symbol"
                            id="symbol"
                            value={symbol ?? ""}
                            onChange={(event) => {
                                setSymbol(event.target.value.toUpperCase())
                            }}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="GOOG"
                        />
                    </div>
                </label>
            </div>
            <div>
                <label
                    htmlFor="exchange"
                    className="block text-sm font-medium text-gray-700"
                >
					Exchange
                    <div className="mt-1">
                        <input
                            type="text"
                            name="exchange"
                            id="exchange"
                            value={exchange ?? ""}
                            className="block w-full bg-gray-200 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="NASDAQ"
                            disabled
                            readOnly
                        />
                    </div>
                </label>
            </div>
            <div className="flex gap-2">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
						Price
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                value={price ?? ""}
                                onChange={(event) => {
                                    setPrice(event.target.value)
                                }}
                                className="block w-full pr-12 border-gray-300 rounded-md pl-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="0.00"
                                aria-describedby="price-currency"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-gray-500 sm:text-sm" id="price-currency">
									USD
                                </span>
                            </div>
                        </div>
                    </label>
                </div>
                <div>
                    <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700"
                    >
						Amount
                        <div className="mt-1">
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                value={amount ?? ""}
                                onChange={(event) => {
                                    setAmount(event.target.value)
                                }}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="3"
                            />
                        </div>
                    </label>
                </div>
            </div>

        </div>
    );
}
const AddAssetStockTab = forwardRef(UnforwardedAddAssetStockTab);

const tabMap: Record<AddAssetSlideOverTab, (props: TabProps) => JSX.Element> = {
    stock: ({ ref, context }: TabProps) => (<AddAssetStockTab ref={ref} context={context} />),
    realEstate: ({ ref, context }: TabProps) => (<AddAssetRealEstateTab ref={ref} context={context} />),
};

export function AddAssetSlideOver({ open, setOpen, addAssetToGroup, addAssetToUser, context }: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	addAssetToUser: (asset: AssetResponse) => void;
	addAssetToGroup: (asset: AssetResponse, group: string) => void;
	context: AddAssetSlideOverContextType
}) {
    const [currentTab, setCurrentTab] = useState<AddAssetSlideOverTab>("stock");

    const ref = useRef<RefType>();

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="w-screen max-w-xl pointer-events-auto">
                                    <div className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl">
                                        <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-lg font-medium text-gray-900">
														Add asset {context.type === "group" ? `to group` : "to user"}
                                                    </Dialog.Title>
                                                    <div className="flex items-center ml-3 h-7">
                                                        <button
                                                            type="button"
                                                            className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon
                                                                className="w-6 h-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex-1 px-4 mt-6 sm:px-6">
                                                {/* Replace with your content */}
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px" aria-label="Tabs">
                                                        {addAssetSlideOverTabs.map((tab) => (
                                                            <button
                                                                type="button"
                                                                key={tab}
                                                                className={classNames(
                                                                    currentTab === tab
                                                                        ? "border-indigo-500 text-indigo-600"
                                                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                                                    "w-full py-4 px-1 text-center border-b-2 font-medium text-sm"
                                                                )}
                                                                aria-current={
                                                                    currentTab === tab ? "page" : undefined
                                                                }
                                                                onClick={() => setCurrentTab(tab)}
                                                            >
                                                                {pretty[tab]}
                                                            </button>
                                                        ))}
                                                    </nav>
                                                </div>

                                                <div className="mt-4">{tabMap[currentTab]({ context, ref })}</div>

                                                {/* /End replace */}
                                            </div>
                                        </div>
                                        <div className="flex justify-end flex-shrink-0 px-4 py-4">
                                            <button
                                                type="button"
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => setOpen(false)}
                                            >
												Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center px-4 py-2 ml-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => {
                                                    ref?.current?.saveAction().then((data) => {
                                                        if (context.type === "group") {
                                                            addAssetToGroup(data, context.id);
                                                        } else {
                                                            addAssetToUser(data);
                                                        }
                                                    });
                                                }}
                                            >
												Create
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}