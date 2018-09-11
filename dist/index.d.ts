/// <reference types="node" />
export interface StepsOptions {
    stream: NodeJS.WriteStream;
    duration: boolean;
    splitLine: false | number;
    stepTotal: false | number;
    handleStepWhenStepsSucceed: boolean;
    handleStepWhenStepsFail: boolean;
}
export declare class Steps {
    static defaultOptions: StepsOptions;
    constructor(option?: Partial<StepsOptions>);
    options: StepsOptions;
    stream: NodeJS.WriteStream;
    isStarted: boolean;
    stepList: Step[];
    private _tickBegin;
    private _tickEnd;
    readonly last: Step;
    readonly duration: number;
    private readonly _formatDuration;
    step(title?: string): Step;
    stop(): void;
    succeed(handleStep?: boolean): void;
    fail(handleStep?: boolean): void;
}
export declare type StepState = 'initial' | 'start' | 'stop' | 'succeed' | 'fail';
export declare class Step {
    constructor(context: Steps, title?: string);
    context: Steps;
    title: string;
    state: StepState;
    private _tickBegin;
    private _tickEnd;
    readonly index: number;
    readonly duration: number;
    readonly isComplete: boolean;
    private readonly _formatIndex;
    private readonly _formatDuration;
    start(): this;
    stop(): void;
    succeed(title?: string): void;
    fail(title?: string): void;
}
