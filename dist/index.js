"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const help_1 = require("./help");
class Steps {
    constructor(option) {
        this.isStarted = false;
        this.stepList = [];
        this.tickBegin = 0;
        this.tickEnd = 0;
        if (option)
            this.option = Object.assign({}, Steps.defaultOption, option);
        else
            this.option = Object.assign({}, Steps.defaultOption);
    }
    get last() {
        return this.stepList[this.stepList.length - 1];
    }
    get duration() {
        if (this.isStarted)
            this.tickEnd = Date.now();
        return (this.tickEnd - this.tickBegin) / 1000;
    }
    get durationOutput() {
        return this.option.showDuration ? ` in ${this.duration}s` : '';
    }
    step(title) {
        if (this.stepList.length === 0) {
            this.isStarted = true;
            this.tickBegin = Date.now();
        }
        let step = new Step(this, title);
        this.stepList.push(step);
        return step;
    }
    stop() {
        if (this.isStarted) {
            this.isStarted = false;
            this.tickEnd = Date.now();
        }
    }
    succeed(handleStep = this.option.handleStepWhenStepsSucceed) {
        this.stop();
        if (handleStep)
            this.stepList.forEach(x => x.succeed());
        // _succeed_ in 0.XXXs
        console.log(chalk_1.default.black.bgGreen(' succeed ') + chalk_1.default.green(this.durationOutput));
    }
    fail(handleStep = this.option.handleStepWhenStepsFail) {
        this.stop();
        if (handleStep)
            this.stepList.forEach(x => x.fail());
        // _fail_ in 0.XXXs
        console.log(chalk_1.default.black.bgRed(' fail ') + chalk_1.default.red(this.durationOutput));
    }
}
Steps.defaultOption = {
    showDuration: true,
    splitLine: 128,
    stepTotal: false,
    handleStepWhenStepsSucceed: false,
    handleStepWhenStepsFail: true,
};
exports.Steps = Steps;
class Step {
    constructor(context, title = '') {
        this.state = 'initial';
        this.tickBegin = 0;
        this.tickEnd = 0;
        this.context = context;
        this.title = title;
    }
    get ordinal() {
        return this.context.stepList.findIndex(x => x === this) + 1;
    }
    get duration() {
        if (this.isStarted)
            this.tickEnd = Date.now();
        return (this.tickEnd - this.tickBegin) / 1000;
    }
    get isStarted() {
        return this.state === 'initial' ? false : true;
    }
    get isResult() {
        return this.state === 'succeed' || this.state === 'fail';
    }
    get ordinalOutput() {
        return `[${this.ordinal}${this.context.option.stepTotal ? '/' + this.context.option.stepTotal : ''}]`;
    }
    get durationOutput() {
        return this.context.option.showDuration ? chalk_1.default.gray(`(${this.duration}s)`) : '';
    }
    start() {
        if (this.isStarted === false) {
            this.tickBegin = Date.now();
            this.state = 'start';
            // [0/0] > {title} ----------
            let msg = `${chalk_1.default.cyan(this.ordinalOutput)} ${chalk_1.default.cyan('>')} ${this.title}`;
            if (this.context.option.splitLine) {
                let columns = this.context.option.splitLine;
                if (process.stdout.columns && process.stdout.columns < columns)
                    columns = process.stdout.columns;
                let length = columns - help_1.parseDisplayLength(msg) - 5;
                msg += ' ' + chalk_1.default.gray('-'.repeat(length));
            }
            console.log(msg);
        }
        return this;
    }
    stop() {
        if (this.isStarted) {
            this.state = 'stop';
            this.tickEnd = Date.now();
        }
    }
    succeed(title = this.title) {
        if (this.isResult)
            return;
        this.stop();
        this.state = 'succeed';
        // [0/0] √ {title} (0.XXXs)
        console.log(`${chalk_1.default.green(this.ordinalOutput)} ${chalk_1.default.green('√')} ${title} ${this.durationOutput}`);
    }
    fail(title = this.title) {
        if (this.isResult)
            return;
        this.stop();
        this.state = 'fail';
        // [0/0] × {title} (0.XXXs)
        console.log(`${chalk_1.default.red(this.ordinalOutput)} ${chalk_1.default.red('×')} ${title} ${this.durationOutput}`);
    }
}
exports.Step = Step;
//# sourceMappingURL=index.js.map