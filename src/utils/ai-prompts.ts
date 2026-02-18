/**
 * AI Prompts utility
 * Handles prompt template variable replacement for node suggestions
 */

export interface NodeContext {
	nodeText: string;
	level: number;
	parent?: string;
	siblings?: string[];
	existingChildren: string[];
	centralTopic?: string; // Central topic (root node text)
}

export class AIPrompts {
	/**
	 * Build user prompt by replacing variables in template
	 * @param template Prompt template with variables
	 * @param context Node context information
	 * @returns Formatted prompt with variables replaced
	 */
	static buildUserPrompt(template: string, context: NodeContext): string {

		const result = template
			.replace('{nodeText}', context.nodeText)
			.replace('{level}', String(context.level))
			.replace('{parentContext}', this.formatParentContext(context.parent))
			.replace('{siblingsContext}', this.formatSiblingsContext(context.siblings))
			.replace('{existingChildren}', this.formatExistingChildren(context.existingChildren))
			.replace('{centralTopic}', this.formatCentralTopic(context.centralTopic));


		return result;
	}

	/**
	 * Format central topic (root node)
	 * @param centralTopic Root node text
	 * @returns Formatted central topic string
	 */
	private static formatCentralTopic(centralTopic?: string): string {
		if (!centralTopic) return '';
		return `Central topic: ${centralTopic}\n`;
	}

	/**
	 * Format parent node context
	 * @param parent Parent node text
	 * @returns Formatted parent context string
	 */
	private static formatParentContext(parent?: string): string {
		if (!parent) return '';
		return `Parent node: ${parent}\n`;
	}

	/**
	 * Format siblings context
	 * @param siblings Array of sibling node texts
	 * @returns Formatted siblings context string
	 */
	private static formatSiblingsContext(siblings?: string[]): string {
		if (!siblings || siblings.length === 0) return '';
		return `Sibling nodes: ${siblings.join(', ')}\n`;
	}

	/**
	 * Format existing children
	 * @param children Array of existing child node texts
	 * @returns Formatted children string
	 */
	private static formatExistingChildren(children?: string[]): string {
		if (!children || children.length === 0) {
			return 'Current children: (none)';
		}
		return `Current children: ${children.join(', ')}`;
	}
}
