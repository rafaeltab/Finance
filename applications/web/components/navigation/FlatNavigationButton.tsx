import { Disclosure } from "@headlessui/react";
import React from "react";
import { classNames } from "../../util/classNames";
import type { FlatNav } from "./Navigator";

type Props = {
	item: FlatNav
}

export function FlatNavigationButton({ item }: Props) {
	let as: "a" | "p" | undefined;
	let href: string | undefined;
	let onClick: (() => void) | undefined;

	if ("href" in item && item.href !== undefined) {
		as = "a";
		href = item.href;
	} else if("onClick" in item && item.onClick !== undefined) {
		as = "p";
		onClick = item.onClick
	}

	return (<Disclosure.Button
		key={item.name}
		as={as}
		href={href}
		onClick={onClick}
		className={classNames(
			item.active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
			'block px-3 py-2 rounded-md text-base font-medium'
		)}
		aria-current={item.active ? 'page' : undefined}
	>
		{item.element}
	</Disclosure.Button>);
}