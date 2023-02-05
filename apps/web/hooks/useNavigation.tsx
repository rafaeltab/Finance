import { usePathname } from "next/navigation";
import "react";

export type NavigationSpec = HrefOrOnClick & BaseNavigationSpec;

export type HrefOrOnClick = {
	href: string;
} | {
	onClick: () => void;
}

type BaseNavigationSpec = {
	flyout?: NavigationSpec[];
	name: string;
	icon?: React.ComponentType<{ className: string }>;
}

export type NavigationItem = Omit<BaseNavigationSpec, "flyout"> & HrefOrOnClick & {
	active: boolean;
	flyout?: NavigationItem[];
}

function setActivePath(navigation: NavigationItem[], pathname: string, baseUrl: string = "") {
	for (const nav of navigation) {
		if (!("href" in nav)) continue;

		const url = baseUrl + nav.href;

		if (url === pathname) {
			nav.active = true;
			return navigation;
		}

		if (nav.flyout) {
			nav.flyout = setActivePath(nav.flyout, pathname, url);
		}
	}

	return navigation;
}

function addActive(specs: NavigationSpec[]): NavigationItem[]  {
	const items: NavigationItem[] = [];
	for (const spec of specs) {
		let item: NavigationItem;

		if ("href" in spec) {
			item = {
				name: spec.name,
				icon: spec.icon,
				active: false,
				href: spec.href,
			};
		} else { 
			item = {
				name: spec.name,
				icon: spec.icon,
				active: false,
				onClick: spec.onClick,
			};
		}

		if (spec.flyout) {
			item.flyout = addActive(spec.flyout);
		}

		items.push(item)
	}

	return items;
}

export function useNavigation(navigation: NavigationSpec[]) {
	const pathname = usePathname();
	const navItems = addActive(navigation);

	if(pathname === null) throw new Error("Pathname is null");

	return setActivePath(navItems, pathname)
}