import type { NavigationItem } from "../../hooks/useNavigation";
import { classNames } from "../../util/classNames";

type Props = {
	item: NavigationItem,
	isPopover?: boolean,
}

export function SideNavigationButton({ item, isPopover }: Props) {
	if ("flyout" in item && item.flyout !== undefined) {
		return (
			<>
				<div className="flex justify-center w-5/6 pt-6 pb-2 mx-auto text-sm text-gray-400 border-b border-gray-400">
					{item.name}
				</div>

				{item.flyout?.map(flyout => (
					<SideNavigationButton item={{
						...flyout,
						..."href" in flyout && "href" in item ? { href: `${item.href}/${flyout.href}` } : undefined,
					}} key={flyout.name} isPopover />
				))}
			</>
		);
	}

	const child = (
		<>
			{item.icon ? (
				<item.icon
					className={classNames(
						item.active ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
						isPopover ? 'mr-3' : 'mr-4',
						'flex-shrink-0 h-6 w-6'
					)}
					aria-hidden="true"
				/>) : undefined}
			{item.name}
		</>
	)

	const classes = classNames(
		item.active
			? 'bg-gray-800 text-white'
			: 'text-gray-300 hover:bg-gray-700 hover:text-white',
		isPopover ? "text-base" : "text-sm",
		'group flex items-center px-2 py-2 font-medium rounded-md'
	)

	if ("href" in item && item.href !== undefined) {
		return (
			<a
				href={item.href}
				key={item.name}
				className={classes}
			>
				{child}
			</a>
		)
	}

	if ("onClick" in item && item.onClick !== undefined) {
		return (
			<button
				type="button"
				onClick={item.onClick}
				key={item.name}
				className={classes}
			>
				{child}
			</button>
		);
	}

	throw new Error("Expected either href or onclick to be present");
}

SideNavigationButton.defaultProps = {
	isPopover: true
}