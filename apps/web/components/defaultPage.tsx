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
				<div className="w-full py-6 sm:px-0 md:px-0 lg:px-4 xl:px-6 2xl:px-8">
					<div className="py-6">
						<div className="h-auto p-8 bg-white shadow-md lg:rounded-lg xl:rounded-lg 2xl:rounded-lg" >
							{props.children}
						</div>
					</div>
				</div>
			</main>
		</>
	)
}