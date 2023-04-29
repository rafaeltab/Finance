export interface IConfigurationSource {
	getConfiguration(context: Record<string, string>): Promise<Record<string, unknown>>;
}
