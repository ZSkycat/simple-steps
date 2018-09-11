import c from 'chalk';
import { parseDisplayLength } from './help';

export interface StepsOptions {
    stream: NodeJS.WriteStream;
    duration: boolean;
    splitLine: false | number;
    stepTotal: false | number;
    handleStepWhenStepsSucceed: boolean;
    handleStepWhenStepsFail: boolean;
}

export class Steps {
    static defaultOptions: StepsOptions = {
        stream: process.stdout,
        duration: true,
        splitLine: 128,
        stepTotal: false,
        handleStepWhenStepsSucceed: false,
        handleStepWhenStepsFail: true,
    };

    constructor(option?: Partial<StepsOptions>) {
        if (option) this.options = Object.assign({}, Steps.defaultOptions, option);
        else this.options = Object.assign({}, Steps.defaultOptions);
        this.stream = this.options.stream;
    }

    options: StepsOptions;
    stream: NodeJS.WriteStream;
    isStarted = false;
    stepList: Step[] = [];
    private _tickBegin = 0;
    private _tickEnd = 0;

    get last() {
        return this.stepList[this.stepList.length - 1];
    }

    get duration() {
        if (this.isStarted) this._tickEnd = Date.now();
        return (this._tickEnd - this._tickBegin) / 1000;
    }

    private get _formatDuration() {
        return this.options.duration ? ` in ${this.duration}s` : '';
    }

    step(title?: string) {
        if (this.stepList.length === 0) {
            this.isStarted = true;
            this._tickBegin = Date.now();
        }
        let step = new Step(this, title);
        this.stepList.push(step);
        return step;
    }

    stop() {
        if (this.isStarted) {
            this.isStarted = false;
            this._tickEnd = Date.now();
        }
    }

    // format:
    // █succeed█ in 0.XXXs
    succeed(handleStep: boolean = this.options.handleStepWhenStepsSucceed) {
        this.stop();
        if (handleStep) this.stepList.forEach(x => x.succeed());
        this.stream.write(c.black.bgGreen(' succeed ') + c.green(this._formatDuration) + '\n');
    }

    // format:
    // █fail█ in 0.XXXs
    fail(handleStep: boolean = this.options.handleStepWhenStepsFail) {
        this.stop();
        if (handleStep) this.stepList.forEach(x => x.fail());
        this.stream.write(c.black.bgRed(' fail ') + c.red(this._formatDuration) + '\n');
    }
}

export type StepState = 'initial' | 'start' | 'stop' | 'succeed' | 'fail';

export class Step {
    constructor(context: Steps, title: string = '') {
        this.context = context;
        this.title = title;
    }

    context: Steps;
    title: string;
    state: StepState = 'initial';
    private _tickBegin = 0;
    private _tickEnd = 0;

    get index() {
        return this.context.stepList.findIndex(x => x === this) + 1;
    }

    get duration() {
        if (this.state === 'start') this._tickEnd = Date.now();
        return (this._tickEnd - this._tickBegin) / 1000;
    }

    get isComplete() {
        return this.state === 'succeed' || this.state === 'fail';
    }

    private get _formatIndex() {
        return `[${this.index}${this.context.options.stepTotal ? '/' + this.context.options.stepTotal : ''}]`;
    }

    private get _formatDuration() {
        return this.context.options.duration ? c.gray(`(${this.duration}s)`) : '';
    }

    // format:
    // [0/0] > {title} ----------
    start() {
        if (this.state === 'initial') {
            this._tickBegin = Date.now();
            this.state = 'start';
            let msg = `${c.cyan(this._formatIndex)} ${c.cyan('>')} ${this.title}`;
            if (this.context.options.splitLine) {
                let columns = this.context.options.splitLine;
                if (process.stdout.columns && process.stdout.columns < columns) columns = process.stdout.columns;
                let length = columns - parseDisplayLength(msg) - 1;
                if (length > 0) msg += ' ' + c.gray('-'.repeat(length));
            }
            this.context.stream.write(msg + '\n');
        }
        return this;
    }

    stop() {
        if (this.state === 'start') {
            this.state = 'stop';
            this._tickEnd = Date.now();
        }
    }

    // format:
    // [0/0] √ {title} (0.XXXs)
    succeed(title: string = this.title) {
        if (this.isComplete) return;
        this.stop();
        this.state = 'succeed';
        this.context.stream.write(`${c.green(this._formatIndex)} ${c.green('√')} ${title} ${this._formatDuration}` + '\n');
    }

    // format:
    // [0/0] × {title} (0.XXXs)
    fail(title: string = this.title) {
        if (this.isComplete) return;
        this.stop();
        this.state = 'fail';
        this.context.stream.write(`${c.red(this._formatIndex)} ${c.red('×')} ${title} ${this._formatDuration}` + '\n');
    }
}
