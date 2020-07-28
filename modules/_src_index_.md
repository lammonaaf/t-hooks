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

▸ **useGeneratorCallback**‹**TT**, **R**, **A**›(`taskGenerator`: TaskGeneratorFunction‹A, TT, R›, `deps`: DependencyList): *(Anonymous function)*

*Defined in [src/index.ts:341](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L341)*

Generator-based asynchronous callback hook (convinience binding)

**`see`** useTaskCallbackState

Generator version of task-callback converting generator to compound task first

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **TT**: *Task‹any›*

▪ **R**

▪ **A**: *any[]*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskGenerator` | TaskGeneratorFunction‹A, TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *(Anonymous function)*

callback to be invoked

___

### `Const` useGeneratorCallbackState

▸ **useGeneratorCallbackState**‹**TT**, **R**, **A**›(`taskGenerator`: TaskGeneratorFunction‹A, TT, R›, `deps`: DependencyList): *[(Anonymous function), boolean, (Anonymous function)]*

*Defined in [src/index.ts:312](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L312)*

Generator-based asynchronous callback hook

**`see`** useTaskCallbackState

Generator version of task-callback converting generator to compound task first

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **TT**: *Task‹any›*

▪ **R**

▪ **A**: *any[]*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskGenerator` | TaskGeneratorFunction‹A, TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *[(Anonymous function), boolean, (Anonymous function)]*

callback to be invoked, current execution status (running or not) and cancellation function

___

### `Const` useGeneratorEffect

▸ **useGeneratorEffect**‹**TT**, **R**›(`taskGenerator`: TaskGeneratorFunction‹[], TT, R›, `deps`: DependencyList): *[boolean, (Anonymous function)]*

*Defined in [src/index.ts:80](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L80)*

Generator-invoking hook

**`see`** useTaskEffect

Generator version of task-effect converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**Type parameters:**

▪ **TT**: *Task‹any›*

▪ **R**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskGenerator` | TaskGeneratorFunction‹[], TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *[boolean, (Anonymous function)]*

current execution status (running or not) and cancellation function

___

### `Const` useGeneratorMemo

▸ **useGeneratorMemo**‹**TT**, **R**›(`defaultValue`: R, `taskGenerator`: TaskGeneratorFunction‹[], TT, R›, `deps`: DependencyList): *R*

*Defined in [src/index.ts:205](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L205)*

Generator-based asynchronous memo hook (convinience binding)

**`see`** useGeneratorMemoState

Generator version of task-memo converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**Type parameters:**

▪ **TT**: *Task‹any›*

▪ **R**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`defaultValue` | R | initial value available immediately |
`taskGenerator` | TaskGeneratorFunction‹[], TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *R*

memorized value

___

### `Const` useGeneratorMemoState

▸ **useGeneratorMemoState**‹**TT**, **R**›(`defaultValue`: R, `taskGenerator`: TaskGeneratorFunction‹[], TT, R›, `deps`: DependencyList): *[R, boolean, (Anonymous function)]*

*Defined in [src/index.ts:180](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L180)*

Generator-based asynchronous memo hook

**`see`** useTaskMemoState

Generator version of task-memo converting generator to compound task first

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**Type parameters:**

▪ **TT**: *Task‹any›*

▪ **R**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`defaultValue` | R | initial value available immediately |
`taskGenerator` | TaskGeneratorFunction‹[], TT, R› | task generator function |
`deps` | DependencyList | dependency list |

**Returns:** *[R, boolean, (Anonymous function)]*

memorized value, current execution status (running or not) and cancellation function

___

### `Const` useTaskCallback

▸ **useTaskCallback**‹**A**, **T**›(`taskFunction`: TaskFunction‹A, T›, `deps`: DependencyList): *(Anonymous function)*

*Defined in [src/index.ts:289](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L289)*

Task-based asynchronous callback hook (convinience binding)

**`see`** useTaskCallbackState

Task equivalent to useCallback hook allowing to perform asynchronous callbacks

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **A**: *any[]*

▪ **T**

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

*Defined in [src/index.ts:227](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L227)*

Task-based asynchronous callback hook

**`note`** Task is not cancelled on hook re-render, but is cancelled on the next call instead

**Type parameters:**

▪ **A**: *any[]*

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskFunction` | TaskFunction‹A, T› | task taskFunction to be invoked as callback |
`deps` | DependencyList | dependency list |

**Returns:** *[(Anonymous function), boolean, (Anonymous function)]*

callback to be invoked, current execution status (running or not) and cancellation function

Task equivalent to useCallback hook allowing to perform asynchronous callbacks

Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time

___

### `Const` useTaskEffect

▸ **useTaskEffect**‹**T**›(`taskFunction`: TaskFunction‹[], T›, `deps`: DependencyList): *[boolean, (Anonymous function)]*

*Defined in [src/index.ts:29](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L29)*

Task-invoking hook

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`taskFunction` | TaskFunction‹[], T› | task taskFunction to be invoked as effect |
`deps` | DependencyList | dependency list |

**Returns:** *[boolean, (Anonymous function)]*

current execution status (running or not) and cancellation function

Task equivalent to useEffect hook allowing to perform asynchronous operations as effects

Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at the given time

___

### `Const` useTaskMemo

▸ **useTaskMemo**‹**T**›(`defaultValue`: T, `taskFunction`: function, `deps`: DependencyList): *T*

*Defined in [src/index.ts:157](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L157)*

Task-based asynchronous memo hook (convinience binding)

**`see`** useTaskMemoState

Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time

**Type parameters:**

▪ **T**

**Parameters:**

▪ **defaultValue**: *T*

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

▸ **useTaskMemoState**‹**T**›(`defaultValue`: T, `taskFunction`: TaskFunction‹[], T›, `deps`: DependencyList): *[T, boolean, (Anonymous function)]*

*Defined in [src/index.ts:98](https://github.com/lammonaaf/t-hooks/blob/9b76d66/src/index.ts#L98)*

Task-based asynchronous memo hook

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`defaultValue` | T | initial value available immediately |
`taskFunction` | TaskFunction‹[], T› | task taskFunction to be invoked to get transformed value |
`deps` | DependencyList | depandency list |

**Returns:** *[T, boolean, (Anonymous function)]*

memorized value, current execution status (running or not) and cancellation function

Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations

Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
