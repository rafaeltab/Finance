import React from "react";
import type { NavigationItem } from "../../hooks/useNavigation";
import { classNames } from "../../util/classNames";

type Props = { item: NavigationItem }

export function NavigationButton({ item }: Props) {
	return (
		<a
			key={item.name}
			{...("href" in item && item.href !== undefined ? { as: "a", href: item.href } : {})}
			{...("onClick" in item && item.onClick !== undefined ? { as: "p", onClick: item.onClick } : {})}
			className={classNames(
				item.active
					? 'bg-gray-900 text-white'
					: 'text-gray-300 hover:bg-gray-700 hover:text-white',
				'px-3 py-2 rounded-md text-sm font-medium'
			)}
			aria-current={item.active ? 'page' : undefined}
		>
			{item.name}
		</a>
	);
}