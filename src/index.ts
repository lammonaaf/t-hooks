import { Task, TaskFunction, TaskGeneratorFunction } from 't-tasks';
import {
  DependencyList,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';

/**
 * Task-invoking hook
 *
 * Task equivalent to useEffect hook allowing to perform asynchronous operations as effects
 *
 * Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at any given time
 *
 * @template T resulting task resolve type
 * @param taskFunction task function to be invoked as effect
 * @param deps dependency list
 * @returns current execution status and cancellation function, as [running, cancel]
 */
export const useTaskEffect = <T>(
  taskFunction: TaskFunction<[], T>,
  deps: DependencyList,
) => {
  const [running, setRunning] = useState(false);
  
  const activeTaskRef = useRef<Task<T> | null>(null);

  const taskFnRef = useRef(taskFunction);
  taskFnRef.current = taskFunction;

  useEffect(() => {
    activeTaskRef.current?.cancel();

    const task = taskFnRef.current();
    activeTaskRef.current = task;
    setRunning(true);

    task
      .tap(() => {
        if (activeTaskRef.current === task) setRunning(false);
      })
      .tapRejected(() => {
        if (activeTaskRef.current === task) setRunning(false);
      });

    return () => {
      task.cancel();
      if (activeTaskRef.current === task) {
        activeTaskRef.current = null;
      }
    };
  // eslint-disable-next-deps relies on standard hook caller rules
  }, deps);

  const cancel = useCallback(() => {
    if (activeTaskRef.current) {
      activeTaskRef.current.cancel();
      activeTaskRef.current = null;
      setRunning(false);
    }
  }, []);

  return [running, cancel] as const;
};

/**
 * Generator-invoking hook
 *
 * Generator version of task-effect converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at any given time
 *
 * @template T yielded underlying type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns current execution status and cancellation function, as [running, cancel]
 *
 * @see useTaskEffect
 */
export const useGeneratorEffect = <T, TT extends Task<T>, R>(
  taskGeneratorFunction: TaskGeneratorFunction<[], T, TT, R>,
  deps: DependencyList,
) => {
  return useTaskEffect(() => Task.generate(taskGeneratorFunction), deps);
};

/**
 * Task-based asynchronous memo hook
 *
 * Task-based hook for asynchronous memoized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at any given time
 *
 * @template T resulting task resolve type
 * @param initialValue initial value available immediately
 * @param taskFunction task function to be invoked to get the transformed value
 * @param deps dependency list
 * @returns memoized value, current execution status, and cancellation function, as [state, running, cancel]
 */
export const useTaskMemoState = <T>(
  initialValue: T,
  taskFunction: TaskFunction<[], T>,
  deps: DependencyList,
) => {
  const [state, setState] = useState<T>(initialValue);
  const [running, setRunning] = useState(false);

  const activeTaskRef = useRef<Task<T> | null>(null);

  const taskFnRef = useRef(taskFunction);
  taskFnRef.current = taskFunction;

  useEffect(() => {
    activeTaskRef.current?.cancel();

    const task = taskFnRef.current();
    activeTaskRef.current = task;
    setRunning(true);

    task
      .tap((result) => {
        if (activeTaskRef.current === task) {
          setState(result);
          setRunning(false);
        }
      })
      .tapRejected(() => {
        if (activeTaskRef.current === task) {
          setRunning(false);
        }
      });

    return () => {
      task.cancel();
      if (activeTaskRef.current === task) {
        activeTaskRef.current = null;
      }
    };
  }, deps);

  const cancel = useCallback(() => {
    if (activeTaskRef.current) {
      activeTaskRef.current.cancel();
      activeTaskRef.current = null;
      setRunning(false);
    }
  }, []);

  return [state, running, cancel] as const;
};

/**
 * Task-based asynchronous memo hook (convenience binding)
 *
 * Task-based hook for asynchronous memoized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at any given time
 *
 * @template T resulting task resolve type
 * @param initialValue initial value available immediately
 * @param taskFunction task function to be invoked to get the transformed value
 * @param deps dependency list
 * @returns memoized value
 *
 * @see useTaskMemoState
 */
export const useTaskMemo = <T>(
  initialValue: T,
  taskFunction: () => Task<T>,
  deps: DependencyList,
) => {
  const [state] = useTaskMemoState(initialValue, taskFunction, deps);

  return state;
};

/**
 * Generator-based asynchronous memo hook
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at any given time
 *
 * @template T yielded underlying type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param initialValue initial value of type R, available immediately
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns memoized value, current execution status, and cancellation function, as [state, running, cancel]
 *
 * @see useTaskMemoState
 */
export const useGeneratorMemoState = <T, TT extends Task<T>, R>(
  initialValue: R,
  taskGeneratorFunction: TaskGeneratorFunction<[], T, TT, R>,
  deps: DependencyList,
) => {
  return useTaskMemoState(
    initialValue,
    () => Task.generate(taskGeneratorFunction),
    deps,
  );
};

/**
 * Generator-based asynchronous memo hook (convenience binding)
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at any given time
 *
 * @template T yielded underlying type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param initialValue initial value of type R, available immediately
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns memoized value
 *
 * @see useGeneratorMemoState
 */
export const useGeneratorMemo = <T, TT extends Task<T>, R>(
  initialValue: R,
  taskGeneratorFunction: TaskGeneratorFunction<[], T, TT, R>,
  deps: DependencyList,
) => {
  const [state] = useGeneratorMemoState(
    initialValue,
    taskGeneratorFunction,
    deps,
  );

  return state;
};

/**
 * Task-based asynchronous callback hook
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at any given time
 *
 * @template A callback argument types
 * @param taskFunction task function to be invoked as callback; the task resolves to void
 * @param deps dependency list
 * @returns callback, current execution status, and cancellation function, as [callback, running, cancel]
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallbackState = <A extends any[]>(
  taskFunction: TaskFunction<A, void>,
  deps: DependencyList,
) => {
  const [running, setRunning] = useState(false);
  const activeTaskRef = useRef<Task<void> | null>(null);

  const taskFnRef = useRef(taskFunction);
  taskFnRef.current = taskFunction;

  useEffect(() => {
    return () => {
      activeTaskRef.current?.cancel();
    };
  }, []);

  const cancel = useCallback(() => {
    if (activeTaskRef.current) {
      activeTaskRef.current.cancel();
      activeTaskRef.current = null;
      setRunning(false);
    }
  }, []);

  const callback = useCallback((...args: A): void => {
    activeTaskRef.current?.cancel();

    const task = taskFnRef.current(...args);
    activeTaskRef.current = task;
    setRunning(true);

    task
      .tap(() => {
        if (activeTaskRef.current === task) {
          activeTaskRef.current = null;
          setRunning(false);
        }
      })
      .tapRejected(() => {
        if (activeTaskRef.current === task) {
          activeTaskRef.current = null;
          setRunning(false);
        }
      });
  }, deps);

  return [callback, running, cancel] as const;
};

/**
 * @deprecated Use {@link useTaskCallbackState} when the callback task resolves to void. This hook remains for callbacks whose task resolves to a result.
 *
 * Task-based asynchronous callback hook that returns the started task
 *
 * Each call starts a task and returns it. A later call or unmount cancels the previous task asynchronously, from an effect cleanup via setTimeout. cancel() clears the running flag immediately and schedules that same cancellation.
 *
 * @template A callback argument types
 * @template R resulting task resolve type
 * @param taskFunction task function to be invoked as callback
 * @param deps dependency list; the task function is memoized with these dependencies
 * @returns callback returning the started task, current execution status, and cancellation function, as [callback, running, cancel]
 */
export const useCompatTaskCallbackState = <A extends any[], R>(
  taskFunction: TaskFunction<A, R>,
  deps: DependencyList,
) => {
  const [task, setTask] = useState<Task<R> | null>(null);

  const taskFunctionMemo = useCallback(taskFunction, deps);

  const callback = useCallback((...args: A): Task<R> => {
    const innerTask = taskFunctionMemo(...args);

    innerTask
      .tap(() => {
        setTask((current) => (current === innerTask ? null : current));
      })
      .tapRejected(() => {
        setTask((current) => (current === innerTask ? null : current));
      });

    setTask(innerTask);

    return innerTask;
  }, [setTask, taskFunctionMemo]);

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    const innerTask = task;

    if (innerTask) {
      return () => {
        setTimeout(() => innerTask.cancel());
      };
    } else {
      return undefined;
    }
  }, [task]);

  const running = !!task;

  return useMemo(() => [callback, running, cancel] as const, [
    callback,
    running,
    cancel,
  ]);
};

/**
 * Task-based asynchronous callback hook (convenience binding)
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at any given time
 *
 * @template A callback argument types
 * @param taskFunction task function to be invoked as callback; the task resolves to void
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useTaskCallbackState
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallback = <A extends any[]>(
  taskFunction: TaskFunction<A, void>,
  deps: DependencyList,
) => {
  const [callback] = useTaskCallbackState(taskFunction, deps);

  return callback;
};

/**
 * @deprecated Use {@link useTaskCallback} when the callback task resolves to void. This hook remains for callbacks whose task resolves to a result.
 *
 * Convenience binding of {@link useCompatTaskCallbackState}
 *
 * The returned callback yields the started task. Running status and cancel are omitted; cancel that task from the callback result.
 *
 * @template A callback argument types
 * @template R resulting task resolve type
 * @param taskFunction task function to be invoked as callback
 * @param deps dependency list; the task function is memoized with these dependencies
 * @returns callback returning the started task
 *
 * @see useCompatTaskCallbackState
 */
export const useCompatTaskCallback = <A extends any[], R>(
  taskFunction: TaskFunction<A, R>,
  deps: DependencyList,
) => {
  const [callback] = useCompatTaskCallbackState(taskFunction, deps);

  return callback;
};

/**
 * Generator-based asynchronous callback hook
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at any given time
 *
 * @template A callback argument types
 * @template T yielded underlying type
 * @template TT yielded task type
 * @param taskGeneratorFunction task generator function; the generator returns void
 * @param deps dependency list
 * @returns callback, current execution status, and cancellation function, as [callback, running, cancel]
 *
 * @see useTaskCallbackState
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallbackState = <A extends any[], T, TT extends Task<T>>(
  taskGeneratorFunction: TaskGeneratorFunction<A, T, TT, void>,
  deps: DependencyList,
) => {
  return useTaskCallbackState(Task.generateFunction(taskGeneratorFunction), deps);
};

/**
 * @deprecated Use {@link useGeneratorCallbackState} when the generator returns void. This hook remains for generators that return a result.
 *
 * Generator-based asynchronous callback hook that returns the started task
 *
 * Generator version of {@link useCompatTaskCallbackState}, converting the generator to a compound task first
 *
 * @template A callback argument types
 * @template T yielded underlying type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns callback returning the started task, current execution status, and cancellation function, as [callback, running, cancel]
 *
 * @see useCompatTaskCallbackState
 */
export const useCompatGeneratorCallbackState = <A extends any[], T, TT extends Task<T>, R>(
  taskGeneratorFunction: TaskGeneratorFunction<A, T, TT, R>,
  deps: DependencyList,
) => {
  return useCompatTaskCallbackState(Task.generateFunction(taskGeneratorFunction), deps);
};

/**
 * Generator-based asynchronous callback hook (convenience binding)
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at any given time
 *
 * @template A callback argument types
 * @template T yielded underlying type
 * @template TT yielded task type
 * @param taskGeneratorFunction task generator function; the generator returns void
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useGeneratorCallbackState
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallback = <A extends any[], T, TT extends Task<T>>(
  taskGeneratorFunction: TaskGeneratorFunction<A, T, TT, void>,
  deps: DependencyList,
) => {
  const [callback] = useGeneratorCallbackState(taskGeneratorFunction, deps);

  return callback;
};

/**
 * @deprecated Use {@link useGeneratorCallback} when the generator returns void. This hook remains for generators that return a result.
 *
 * Convenience binding of {@link useCompatGeneratorCallbackState}
 *
 * The returned callback yields the started task. Running status and cancel are omitted; cancel that task from the callback result.
 *
 * @template A callback argument types
 * @template T yielded underlying type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns callback returning the started task
 *
 * @see useCompatGeneratorCallbackState
 */
export const useCompatGeneratorCallback = <A extends any[], T, TT extends Task<T>, R>(
  taskGeneratorFunction: TaskGeneratorFunction<A, T, TT, R>,
  deps: DependencyList,
) => {
  const [callback] = useCompatGeneratorCallbackState(taskGeneratorFunction, deps);

  return callback;
};

/**
 * Task-based callback hook that allows concurrent tasks
 *
 * Each call starts a new task and leaves tasks already running in place. Every in-flight task is cancelled on unmount. Dependency changes do not cancel work already started.
 *
 * @template A callback argument types
 * @param taskFunction task function to be invoked as callback; the task resolves to void
 * @param deps dependency list; the task function is memoized with these dependencies
 * @returns callback to be invoked
 */
export const useMultiTaskCallback = <A extends any[]>(
  taskFunction: TaskFunction<A, void>,
  deps: DependencyList,
) => {
  const tasks = useRef<Task<void>[]>([]);

  const taskFunctionMemo = useCallback(taskFunction, deps);

  const callback = useCallback((...args: A): void => {
    const innerTask = taskFunctionMemo(...args);

    innerTask
      .tap(() => {
        tasks.current = tasks.current.filter((task) => task !== innerTask);
      })
      .tapRejected(() => {
        tasks.current = tasks.current.filter((task) => task !== innerTask);
      });

    tasks.current.push(innerTask);
  }, [taskFunctionMemo]);

  useEffect(() => {
    return () => {
      tasks.current.forEach((task) => task.cancel());
    };
  }, []);

  return callback;
};

/**
 * Generator-based callback hook that allows concurrent tasks
 *
 * Generator version of {@link useMultiTaskCallback}, converting the generator to a compound task first
 *
 * Each call starts a new task and leaves tasks already running in place. Every in-flight task is cancelled on unmount. Dependency changes do not cancel work already started.
 *
 * @template A callback argument types
 * @template T yielded underlying type
 * @template TT yielded task type
 * @param taskGeneratorFunction task generator function; the generator returns void
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useMultiTaskCallback
 */
export const useMultiGeneratorCallback = <A extends any[], T, TT extends Task<T>>(
  taskGeneratorFunction: TaskGeneratorFunction<A, T, TT, void>,
  deps: DependencyList,
) => {
  return useMultiTaskCallback(Task.generateFunction(taskGeneratorFunction), deps);
};

/**
 * Unmanaged task callback hook
 *
 * Memoizes a task function with useCallback. The hook does not cancel the returned task on unmount, dependency change, or a later call. The caller owns that task.
 *
 * @template A callback argument types
 * @template R resulting task resolve type
 * @param taskFunction task function to memoize as a callback
 * @param deps dependency list
 * @returns memoized task function
 */
export const useFreeTaskCallback = <A extends any[], R>(
  taskFunction: TaskFunction<A, R>,
  deps: DependencyList,
) => {
  return useCallback(taskFunction, deps);
};

/**
 * Unmanaged generator callback hook
 *
 * Memoizes a generator function as a task function. The hook does not cancel the returned task on unmount, dependency change, or a later call. The caller owns that task.
 *
 * @template A callback argument types
 * @template T yielded underlying type
 * @template TT yielded task type
 * @template R resulting task resolve type
 * @param taskGeneratorFunction task generator function
 * @param deps dependency list
 * @returns memoized task function
 *
 * @see useFreeTaskCallback
 */
export const useFreeGeneratorCallback = <A extends any[], T, TT extends Task<T>, R>(
  taskGeneratorFunction: TaskGeneratorFunction<A, T, TT, R>,
  deps: DependencyList,
) => {
  return useCallback(Task.generateFunction(taskGeneratorFunction), deps);
};
