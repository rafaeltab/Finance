import type { NavigationItem } from "../../hooks/useNavigation";
import { classNames } from "../../util/classNames";

type Props = {
	item: NavigationItem,
	isPopover?: boolean,
}

export function SideNavigationButton({ item, isPopover }: Props) {
	let clickAction;

	if ("href" in item && item.href !== undefined) {
		clickAction = { as: "a", href: item.href }
	} else if ("onClick" in item && item.onClick !== undefined) {
		clickAction = { as: "p", onClick: item.onClick }
	}

	if ("flyout" in item && item.flyout !== undefined) {
		return (
			<>
				<div className="flex justify-center w-5/6 pt-6 pb-2 mx-auto text-sm text-gray-400 border-b border-gray-400">
					{item.name}
				</div>
				
				{item.flyout?.map((flyout, index) => (
					<SideNavigationButton item={{
						...flyout,
						..."href" in flyout && "href" in item ? { href: `${item.href}/${flyout.href}` } : undefined,
					}} key={index} isPopover />
				))}
			</>
		);
	}

	return (
		<a
				key={item.name}
				{...clickAction}
				className={classNames(
					item.active
						? 'bg-gray-800 text-white'
						: 'text-gray-300 hover:bg-gray-700 hover:text-white',
					isPopover ? "text-base" : "text-sm",
					'group flex items-center px-2 py-2 font-medium rounded-md'
				)}
			>
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
			</a>
	);
}

SideNavigationButton.defaultProps = {
	isPopover: true
}