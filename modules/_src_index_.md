[t-hooks](../README.md) › [Globals](../globals.md) › ["src/index"](_src_index_.md)

# Module: "src/index"

## Index

### Functions

* [useGeneratorCallback](_src_index_.md#const-usegeneratorcallback)
* [useGeneratorCallbackState](_src_index_.md#const-usegeneratorcallbackstate)
* [useGeneratorEffect](_src_index_.md#const-usegeneratoreffect)
* [useGeneratorMemo](_src_index_.md#const-usegeneratormemo)
* [useGeneratorMemoState](_src_index_.md#const-usegeneratormemostate)
* [useTaskCallback](_src_index_.md#const-usetaskcallback)
* [useTaskCallbackState](_src_index_.md#const-usetaskcallbackstate)
* [useTaskEffect](_src_index_.md#const-usetaskeffect)
* [useTaskMemo](_src_index_.md#const-usetaskmemo)
* [useTaskMemoState](_src_index_.md#const-usetaskmemostate)

## Functions

### `Const` useGeneratorCallback

▸ **useGeneratorCallback**‹**A**, **TT**, **R**›(`taskGeneratorFunction`: TaskGeneratorFunction‹A, TT, R›, `deps`: DependencyList): *(Anonymous function)*

*Defined in [src/index.ts:374](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L374)*

Generator-based asynchronous callback hook (convinience binding)

Generator version of task-callback converting generator to compound task first

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`see`** useTaskCallbackState

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **A**: *any[]*

callback arguments type

▪ **TT**: *Task‹any›*

yielded task type

▪ **R**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskGeneratorFunction` | TaskGeneratorFunction‹A, TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *(Anonymous function)*

callback to be invoked

___

### `Const` useGeneratorCallbackState

▸ **useGeneratorCallbackState**‹**A**, **TT**, **R**›(`taskGeneratorFunction`: TaskGeneratorFunction‹A, TT, R›, `deps`: DependencyList): *[(Anonymous function), boolean, (Anonymous function)]*

*Defined in [src/index.ts:341](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L341)*

Generator-based asynchronous callback hook

Generator version of task-callback converting generator to compound task first

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`see`** useTaskCallbackState

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **A**: *any[]*

callback arguments type

▪ **TT**: *Task‹any›*

yielded task type

▪ **R**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskGeneratorFunction` | TaskGeneratorFunction‹A, TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *[(Anonymous function), boolean, (Anonymous function)]*

callback to be invoked, current execution status (running or not) and cancellation function

___

### `Const` useGeneratorEffect

▸ **useGeneratorEffect**‹**TT**, **R**›(`taskGeneratorFunction`: TaskGeneratorFunction‹[], TT, R›, `deps`: DependencyList): *[boolean, (Anonymous function)]*

*Defined in [src/index.ts:85](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L85)*

Generator-invoking hook

Generator version of task-effect converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useTaskEffect

**Type parameters:**

▪ **TT**: *Task‹any›*

yielded task type

▪ **R**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskGeneratorFunction` | TaskGeneratorFunction‹[], TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *[boolean, (Anonymous function)]*

current execution status (running or not) and cancellation function

___

### `Const` useGeneratorMemo

▸ **useGeneratorMemo**‹**TT**, **R**›(`initialValue`: R, `taskGeneratorFunction`: TaskGeneratorFunction‹[], TT, R›, `deps`: DependencyList): *R*

*Defined in [src/index.ts:220](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L220)*

Generator-based asynchronous memo hook (convinience binding)

Generator version of task-memo converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useGeneratorMemoState

**Type parameters:**

▪ **TT**: *Task‹any›*

yielded task type

▪ **R**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initialValue` | R | initial value available immediately |
`taskGeneratorFunction` | TaskGeneratorFunction‹[], TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *R*

memorized value

___

### `Const` useGeneratorMemoState

▸ **useGeneratorMemoState**‹**TT**, **R**›(`initialValue`: R, `taskGeneratorFunction`: TaskGeneratorFunction‹[], TT, R›, `deps`: DependencyList): *[R, boolean, (Anonymous function)]*

*Defined in [src/index.ts:192](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L192)*

Generator-based asynchronous memo hook

Generator version of task-memo converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useTaskMemoState

**Type parameters:**

▪ **TT**: *Task‹any›*

yielded task type

▪ **R**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initialValue` | R | initial value available immediately |
`taskGeneratorFunction` | TaskGeneratorFunction‹[], TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *[R, boolean, (Anonymous function)]*

memorized value, current execution status (running or not) and cancellation function

___

### `Const` useTaskCallback

▸ **useTaskCallback**‹**A**, **T**›(`taskFunction`: TaskFunction‹A, T›, `deps`: DependencyList): *(Anonymous function)*

*Defined in [src/index.ts:314](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L314)*

Task-based asynchronous callback hook (convinience binding)

Task equivalent to useCallback hook allowing to perform asynchronous callbacks

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`see`** useTaskCallbackState

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **A**: *any[]*

callback arguments type

▪ **T**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskFunction` | TaskFunction‹A, T› | task taskFunction to be invoked as callback |
`deps` | DependencyList | dependency list |

**Returns:** *(Anonymous function)*

callback to be invoked

___

### `Const` useTaskCallbackState

▸ **useTaskCallbackState**‹**A**, **T**›(`taskFunction`: TaskFunction‹A, T›, `deps`: DependencyList): *[(Anonymous function), boolean, (Anonymous function)]*

*Defined in [src/index.ts:249](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L249)*

Task-based asynchronous callback hook

Task equivalent to useCallback hook allowing to perform asynchronous callbacks

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **A**: *any[]*

callback arguments type

▪ **T**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskFunction` | TaskFunction‹A, T› | task taskFunction to be invoked as callback |
`deps` | DependencyList | dependency list |

**Returns:** *[(Anonymous function), boolean, (Anonymous function)]*

callback to be invoked, current execution status (running or not) and cancellation function

___

### `Const` useTaskEffect

▸ **useTaskEffect**‹**T**›(`taskFunction`: TaskFunction‹[], T›, `deps`: DependencyList): *[boolean, (Anonymous function)]*

*Defined in [src/index.ts:31](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L31)*

Task-invoking hook

Task equivalent to useEffect hook allowing to perform asynchronous operations as effects

Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at the given time

**Type parameters:**

▪ **T**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskFunction` | TaskFunction‹[], T› | task taskFunction to be invoked as effect |
`deps` | DependencyList | dependency list |

**Returns:** *[boolean, (Anonymous function)]*

current execution status (running or not) and cancellation function

___

### `Const` useTaskMemo

▸ **useTaskMemo**‹**T**›(`initialValue`: T, `taskFunction`: function, `deps`: DependencyList): *T*

*Defined in [src/index.ts:166](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L166)*

Task-based asynchronous memo hook (convinience binding)

Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**`see`** useTaskMemoState

**Type parameters:**

▪ **T**

resulting task resolve type

**Parameters:**

▪ **initialValue**: *T*

initial value available immediately

▪ **taskFunction**: *function*

task taskFunction to be invoked to get transformed value

▸ (): *Task‹T›*

▪ **deps**: *DependencyList*

depandency list

**Returns:** *T*

memorized value

___

### `Const` useTaskMemoState

▸ **useTaskMemoState**‹**T**›(`initialValue`: T, `taskFunction`: TaskFunction‹[], T›, `deps`: DependencyList): *[T, boolean, (Anonymous function)]*

*Defined in [src/index.ts:105](https://github.com/lammonaaf/t-hooks/blob/f554f12/src/index.ts#L105)*

Task-based asynchronous memo hook

Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**Type parameters:**

▪ **T**

resulting task resolve type

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`initialValue` | T | initial value available immediately |
`taskFunction` | TaskFunction‹[], T› | task taskFunction to be invoked to get transformed value |
`deps` | DependencyList | depandency list |

**Returns:** *[T, boolean, (Anonymous function)]*

memorized value, current execution status (running or not) and cancellation function
