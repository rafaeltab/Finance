type Props = {
	title: string
} & React.PropsWithChildren

export function DefaultPage(props: Props) {
	return (
		<>
			<header className="bg-gray-800 shadow">
				<div className="max-w-7xl py-6 px-2 sm:px-4 lg:px-6 pb-32">
					<h1 className="text-3xl font-bold tracking-tight text-gray-200">{props.title}</h1>
				</div>
			</header>
			<main className='-mt-32'>
				<div className="w-full py-6 px-2 sm:px-4 lg:px-6">
					<div className="py-6">
						<div className="h-96 rounded-lg bg-white p-10 shadow-md" >
							{props.children}
						</div>
					</div>
				</div>
			</main>
		</>
	)
}