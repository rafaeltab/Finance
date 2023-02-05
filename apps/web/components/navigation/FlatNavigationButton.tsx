import { Disclosure } from "@headlessui/react";
import { classNames } from "../../util/classNames";
import type { FlatNav } from "./Navigator";
import React from "react";

type Props = {
	item: FlatNav
}

export function FlatNavigationButton({ item }: Props) {
	return (<Disclosure.Button
		key={item.name}
		{...("href" in item && item.href !== undefined ? { as: "a", href: item.href } : {})}
		{...("onClick" in item && item.onClick !== undefined ? { as: "p", onClick: item.onClick } : {})}
		className={classNames(
			item.active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
			'block px-3 py-2 rounded-md text-base font-medium'
		)}
		aria-current={item.active ? 'page' : undefined}
	>
		{item.element}
	</Disclosure.Button>);
}