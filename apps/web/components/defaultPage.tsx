type Props = {
	title: string
} & React.PropsWithChildren

export function DefaultPage(props: Props) {
	return (
		<>
			<header className="bg-gray-800 shadow">
				<div className="px-2 py-6 pb-32 max-w-7xl sm:px-4 lg:px-6">
					<h1 className="text-3xl font-bold tracking-tight text-gray-200">{props.title}</h1>
				</div>
			</header>
			<main className='-mt-32'>
				<div className="w-full px-2 py-6 sm:px-4 lg:px-6">
					<div className="py-6">
						<div className="h-auto p-10 bg-white rounded-lg shadow-md" >
							{props.children}
						</div>
					</div>
				</div>
			</main>
		</>
	)
}