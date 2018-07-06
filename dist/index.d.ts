export interface StepsOption {
    showDuration: boolean;
    splitLine: false | number;
    stepTotal: false | number;
    handleStepWhenStepsSucceed: boolean;
    handleStepWhenStepsFail: boolean;
}
export declare class Steps {
    static defaultOption: StepsOption;
    option: StepsOption;
    isStarted: boolean;
    stepList: Step[];
    tickBegin: number;
    tickEnd: number;
    readonly last: Step;
    readonly duration: number;
    private readonly durationOutput;
    constructor(option?: Partial<StepsOption>);
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
    readonly ordinal: number;
    readonly duration: number;
    readonly isStarted: boolean;
    readonly isResult: boolean;
    private readonly ordinalOutput;
    private readonly durationOutput;
    constructor(context: Steps, title?: string);
    start(): this;
    stop(): void;
    succeed(title?: string): void;
    fail(title?: string): void;
}
