/**
 * Mind Map State Handler
 *
 * Manages view state and data persistence
 */

import { MindMapStateHandler, MindMapData } from '../interfaces/mindmap-interfaces';

export interface ViewState {
    file: string | null;
    zoomTransform?: any;
    scrollPosition?: { x: number; y: number };
}

/**
 * State handler implementation
 */
export class MindMapStateHandlerImpl implements MindMapStateHandler {
    private filePath: string | null = null;
    private stateLoaded = false;
    private mindMapData: MindMapData | null = null;
    private viewState: ViewState = { file: null };

    /**
     * Get current view state
     */
    getViewState(): any {
        return {
            file: this.filePath,
            zoomTransform: this.viewState.zoomTransform,
            scrollPosition: this.viewState.scrollPosition
        };
    }

    /**
     * Set view state
     */
    async setViewState(state: any): Promise<void> {
        this.filePath = state.file || null;
        this.viewState = {
            file: this.filePath,
            zoomTransform: state.zoomTransform,
            scrollPosition: state.scrollPosition
        };
        this.stateLoaded = true;
    }

    /**
     * Check if state is loaded
     */
    isStateLoaded(): boolean {
        return this.stateLoaded;
    }

    /**
     * Get current file path
     */
    getFilePath(): string | null {
        return this.filePath;
    }

    /**
     * Set current file path
     */
    setFilePath(filePath: string | null): void {
        this.filePath = filePath;
        this.viewState.file = filePath;
    }

    /**
     * Get mind map data
     */
    getMindMapData(): MindMapData | null {
        return this.mindMapData;
    }

    /**
     * Set mind map data
     */
    setMindMapData(data: MindMapData): void {
        this.mindMapData = data;
    }

    /**
     * Clear all state
     */
    clearState(): void {
        this.filePath = null;
        this.stateLoaded = false;
        this.mindMapData = null;
        this.viewState = { file: null };
    }

    /**
     * Update zoom transform in state
     */
    updateZoomTransform(transform: any): void {
        this.viewState.zoomTransform = transform;
    }

    /**
     * Update scroll position in state
     */
    updateScrollPosition(x: number, y: number): void {
        this.viewState.scrollPosition = { x, y };
    }

    /**
     * Get zoom transform from state
     */
    getZoomTransform(): any {
        return this.viewState.zoomTransform;
    }

    /**
     * Get scroll position from state
     */
    getScrollPosition(): { x: number; y: number } | undefined {
        return this.viewState.scrollPosition;
    }
}