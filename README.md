# simple-steps
A module that facilitates the display of step status and time in the terminal.<br>
一个方便在终端显示步骤状态和花费时间的模块。<br>

![preview](https://user-images.githubusercontent.com/20368649/42366169-20b5ab62-8133-11e8-8bf3-0c3aee8d1d09.gif)

## Getting Started
**Installation**
```
npm install --save-dev simple-steps
yarn add --dev simple-steps
```

**Usage**
```javascript
// import using CommonJS
const Steps = require('simple-steps').Steps;
// import using ESModule
import { Steps } from 'simple-steps';

// example
let steps = new Steps({ stepTotal: 2 });
try {
    steps.step('clear').start();
    // doing
    steps.last.succeed();
} catch (e) {
    steps.fail();
    return;
}
try {
    steps.step('build').start();
    // doing
    steps.last.succeed();
} catch (e) {
    steps.fail();
    return;
}
steps.succeed();
```

## API
### Class Steps
```typescript
new Steps(option?: StepsOption)

interface StepsOption {
    showDuration: boolean;               // default: true, 是否显示花费时间
    splitLine: false | number;           // default: 128, 是否显示分割线, 并指定最大长度 (自动根据终端宽度计算)
    stepTotal: false | number;           // default: false, 是否显示步骤总数, 并指定总数
    handleStepWhenStepsSucceed: boolean; // default: false, 当 Steps.succeed() 时, 是否调用所有 Step.succeed()
    handleStepWhenStepsFail: boolean;    // default: true, 当 Steps.fail() 时, 是否调用所有 Step.fail()
}

step(title?: string): Step    // 创建新步骤 step, title: 指定标题
succeed(handleStep?: boolean) // 输出成功, handleStep: 是否调用所有 Step.succeed()
fail(handleStep?: boolean)    // 输出失败, handleStep: 是否调用所有 Step.fail()
```

### Class Step
```typescript
start(): Step          // 输出开始
succeed(title: string) // 输出成功, title: 指定标题
fail(title: string)    // 输出失败, title: 指定标题
```

## License
[MIT](https://github.com/ZSkycat/simple-steps/blob/master/LICENSE)
