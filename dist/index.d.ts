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
    options: StepsOptions;
    stream: NodeJS.WriteStream;
    isStarted: boolean;
    stepList: Step[];
    tickBegin: number;
    tickEnd: number;
    readonly last: Step;
    readonly duration: number;
    private readonly formatDuration;
    constructor(option?: Partial<StepsOptions>);
    step(title?: string): Step;
    stop(): void;
    succeed(handleStep?: boolean): void;
    fail(handleStep?: boolean): void;
}
export declare type StepState = 'initial' | 'start' | 'stop' | 'succeed' | 'fail';
export declare class Step {
    context: Steps;
    title: string;
    state: StepState;
    tickBegin: number;
    tickEnd: number;
    readonly index: number;
    readonly duration: number;
    readonly isComplete: boolean;
    private readonly formatIndex;
    private readonly formatDuration;
    constructor(context: Steps, title?: string);
    start(): this;
    stop(): void;
    succeed(title?: string): void;
    fail(title?: string): void;
}
