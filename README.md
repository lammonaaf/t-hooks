[t-hooks](README.md) › [Globals](globals.md)

# t-hooks

![CI](https://github.com/lammonaaf/t-hooks/workflows/CI/badge.svg)

# T-Hooks task-based React hook library

T-Hooks provides a set of react hooks built upon T-Tasks library. Using task hooks instead of conventional lifecycle hooks alows easier usage of asynchronous operations withing hooks and provides automatic operation cancelation in case of hook unmounting or re-render.

## Examples

* [Task memo](examples/memo/README.md)
* [Task callback](examples/callback/README.md)

### Task-based useEffect

In this scenario, every time ```arg``` updates an asynchronous operation is started, resulting in a side effect. If hook is unmonted before the operation finishes no side effect is performed, preventing modification of state of unmounted component. Moreover, if ```arg``` changes before the operation finishes another operation in started instead, canceling the previous one.

```ts
const taskCreator = (arg: string) => liftResult(someAsyncOperation(arg)).tap((result) => {
  setSomething(result); // side effects
});

useTaskEffect(() => taskCreator(arg), [arg]);
```

### Generator-based useEffect

In this scenario a generator syntax is used to achieve the same result. Generator syntax allows for more natural task chaining, however every ```yield``` requires to be wrapped to some form of type cast. T-Tasks library provides a bunch of convinience casts, but even a simple ```() as Something``` works too.

```ts
useGeneratorEffect(function*() {
  const result = castResultCreator<typeof someAsyncOperation>(yield liftResult(someAsyncOperation(arg)));

  setSomething(result); // side effects
}, [arg]);
```

### Chaining multiple effects

In this scenario a generator syntax is used to chain two consequtive async operations with two side-effects. In case of unmounting or re-render during execution of the first operation, the second one would not be started and both side effects would not be performed. In case of unmounting or re-render during execution of the second operation, only the second side-effect would be prevented. 

```ts
useGeneratorEffect(function*() {
  const result1 = castResultCreator<typeof someAsyncOperation>(yield liftResult(someAsyncOperation(arg)));

  setSomething(result1); // side effect 1

  const result2 = castResultCreator<typeof otherAsyncOperation>(yield liftResult(otherAsyncOperation(resilt1)));

  setSomethingElse(result2); // side effect 2
}, [arg]);
```

### Task-based useMemo

In this scenario, every time ```arg``` updates an asynchronous operation is started, updating ```remoteData``` asynchronously. In case of hook unmounting or updating ```arg``` again before the previous operation finishes, another operation in started instead, canceling the previous one.

```ts
const userData = useTaskMemo(null, () => liftResult(getUserDataAsync(userId)), [userId]);
```

### Generator-based useMemo

In this scenario a generator syntax is used to achieve the same result. Generator syntax allows for more natural task chaining, however every ```yield``` requires to be wrapped to some form of type cast. T-Tasks library provides a bunch of convinience casts, but even a simple ```() as Something``` works too.

```ts
const userData = useGeneratorMemo(null, function*() {
  return castResultCreator<typeof getUserDataAsync>(yield liftTask(getUserDataAsync(userId)));
}, [userId]);
```

### Chaining multiple transformations

In this scenario a generator syntax is used to chain two consequtive async operations in a single task memo.

```ts
const usageStats = useGeneratorMemo(null, function*() {
  const userData = castResultCreator<typeof getUserDataAsync>(yield liftTask(getUserDataAsync(userId)));

  castResult<void>(yield timeoutTask(100)); // one may add delays easily

  return castResultCreator<typeof getUsageStats>(yield liftTask(getUsageStats(userData)));
}, [userId]);
```

### Task-based useCallback

In this scenario an asynchrounous callback is created, performing side-effects only if the hook is not unmounted. Callback is also interrupted if invoked again

```tsx
const taskCreator = (userId: string) => liftResult(getUserDataAsync(arg)).tap((userData) => {
  setUserData(userData); // side effects
});

const onClick = useTaskCallback(() => taskCreator(userId)), [userId]);

return <button onClick={onClick}>Click me</button>
```

### Generator-based useCallback

In this scenario an asynchrounous callback is created via generator syntax

```tsx
const onClick = useGeneratorCallback(function*() {
  const userData = castResultCreator<typeof getUserDataAsync>(yield liftTask(getUserDataAsync(userId)));

  castResult<void>(yield timeoutTask(100)); // one may add delays easily

  setUserData(userData); // side-effects
}), [userId]);

return <button onClick={onClick}>Click me</button>
```
