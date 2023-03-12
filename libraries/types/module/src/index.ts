import type { DependencyContainer } from "tsyringe";

export interface Module {
	init(): Promise<void>;
	register(container: DependencyContainer): void;
	dispose(): Promise<void>;
}