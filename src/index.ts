import { Task, generateTask, TaskFunction, TaskGenerator } from 't-tasks';
import {
  DependencyList,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

function tuple<Args extends any[]>(...args: Args): Args {
  return args as Args;
}

/**
 * Task-invoking hook
 * @param taskFunction task taskFunction to be invoked as effect
 * @param deps dependency list
 * @returns current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useEffect hook allowing to perform asynchronous operations as effects
 *
 * Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at the given time
 */
export const useTaskEffect = <T>(
  taskFunction: TaskFunction<[], T>,
  deps: DependencyList,
) => {
  const taskFunctionMemo = useCallback(taskFunction, deps);

  const [task, setTask] = useState<Task<T> | null>(null);

  useEffect(() => {
    const innerTask = taskFunctionMemo()
      .tap(() => {
        setTask((current) => (current === innerTask ? null : current));
      })
      .tapRejected(() => {
        setTask((current) => (current === innerTask ? null : current));
      });

    setTask(innerTask);
  }, [taskFunctionMemo, setTask]);

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    const innerTask = task;

    if (innerTask) {
      return () => {
        innerTask.cancel();
      };
    } else {
      return undefined;
    }
  }, [task]);

  const running = !!task;

  return useMemo(() => tuple(running, cancel), [running, cancel]);
};

/**
 * Generator-invoking hook
 * @param taskGenerator task generator function
 * @param deps dependency list
 * @returns current execution status (running or not) and executed task to be spied on
 *
 * @see useTaskEffect
 *
 * Generator version of task-effect converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useGeneratorEffect = <TT extends Task<any>, R>(
  taskGenerator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskEffect(() => generateTask(taskGenerator), deps);
};

/**
 * Task-based asynchronous memo hook
 * @param defaultValue initial value available immediately
 * @param taskFunction task taskFunction to be invoked to get transformed value
 * @param deps depandency list
 * @returns memorized value, current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useTaskMemoState = <T>(
  defaultValue: T,
  taskFunction: TaskFunction<[], T>,
  deps: DependencyList,
) => {
  const inst = useMemo(() => Math.trunc(Math.random() * 100), []);

  const [state, setState] = useState<T>(defaultValue);

  const taskFunctionMemo = useCallback(taskFunction, deps);

  const [task, setTask] = useState<Task<T> | null>(null);

  useEffect(() => {
    const innerTask = taskFunctionMemo()
      .tap((result) => {
        setState(result);

        setTask((current) => (current === innerTask ? null : current));
      })
      .tapRejected(() => {
        setTask((current) => (current === innerTask ? null : current));
      });

    setTask(innerTask);
  }, [taskFunctionMemo, setTask, setState, inst]);

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    const innerTask = task;

    if (innerTask) {
      return () => {
        innerTask.cancel();
      };
    } else {
      return undefined;
    }
  }, [task, inst]);

  const running = !!task;

  return useMemo(() => tuple(state, running, cancel), [state, running, cancel]);
};

/**
 * Task-based asynchronous memo hook (convinience binding)
 * @param defaultValue initial value available immediately
 * @param taskFunction task taskFunction to be invoked to get transformed value
 * @param deps depandency list
 * @returns memorized value
 *
 * @see useTaskMemoState
 *
 * Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useTaskMemo = <T>(
  defaultValue: T,
  taskFunction: () => Task<T>,
  deps: DependencyList,
) => {
  const [state] = useTaskMemoState(defaultValue, taskFunction, deps);

  return state;
};

/**
 * Generator-based asynchronous memo hook
 * @param defaultValue initial value available immediately
 * @param taskGenerator task generator function
 * @param deps dependency list
 * @returns memorized value, current execution status (running or not) and executed task to be spied on
 *
 * @see useTaskMemoState
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useGeneratorMemoState = <TT extends Task<any>, R>(
  defaultValue: R,
  taskGenerator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskMemoState(
    defaultValue,
    () => generateTask(taskGenerator),
    deps,
  );
};

/**
 * Generator-based asynchronous memo hook (convinience binding)
 * @param defaultValue initial value available immediately
 * @param taskGenerator task generator function
 * @param deps dependency list
 * @returns memorized value
 *
 * @see useGeneratorMemoState
 *
 * Generator version of task-memo converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useGeneratorMemo = <TT extends Task<any>, R>(
  defaultValue: R,
  taskGenerator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  const [state] = useGeneratorMemoState(defaultValue, taskGenerator, deps);

  return state;
};

/**
 * Task-based asynchronous callback hook
 * @param taskFunction task taskFunction to be invoked as callback
 * @param deps dependency list
 * @returns callback to be invoked, current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallbackState = <A extends any[], T>(
  taskFunction: TaskFunction<A, T>,
  deps: DependencyList,
) => {
  const [task, setTask] = useState<Task<T> | null>(null);

  const taskFunctionMemo = useCallback(taskFunction, deps);

  const callback = useCallback(
    (...args: A) => {
      const innerTask = taskFunctionMemo(...args)
        .tap(() => {
          setTask((current) => (current === innerTask ? null : current));
        })
        .tapRejected(() => {
          setTask((current) => (current === innerTask ? null : current));
        });

      setTask(innerTask);

      return innerTask;
    },
    [setTask, taskFunctionMemo],
  );

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    const innerTask = task;

    if (innerTask) {
      return () => {
        innerTask.cancel();
      };
    } else {
      return undefined;
    }
  }, [task]);

  const running = !!task;

  return useMemo(() => tuple(callback, running, cancel), [
    callback,
    running,
    cancel,
  ]);
};

/**
 * Task-based asynchronous callback hook (convinience binding)
 * @param taskFunction task taskFunction to be invoked as callback
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useTaskCallbackState
 *
 * Task equivalent to useCallback hook allowing to perform asynchronous callbacks
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useTaskCallback = <A extends any[], T>(
  taskFunction: TaskFunction<A, T>,
  deps: DependencyList,
) => {
  const [callback] = useTaskCallbackState(taskFunction, deps);

  return callback;
};

/**
 * Generator-based asynchronous callback hook
 * @param taskGenerator task generator function
 * @param deps dependency list
 * @returns callback to be invoked, current execution status (running or not) and executed task to be spied on
 *
 * @see useTaskCallbackState
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallbackState = <
  TT extends Task<any>,
  R,
  A extends any[]
>(
  taskGenerator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  return useTaskCallbackState((...args: A) => {
    return generateTask(function*() {
      return yield* taskGenerator(...args);
    });
  }, deps);
};

/**
 * Generator-based asynchronous callback hook (convinience binding)
 * @param taskGenerator task generator function
 * @param deps dependency list
 * @returns callback to be invoked
 *
 * @see useTaskCallbackState
 *
 * Generator version of task-callback converting generator to compound task first
 *
 * Task execution is automatically interrupted in case of additional calls or unmounting. This way, only one task is running at the given time
 *
 * @note Task is not cancelled on hook re-render, but is cancelled on the next call instead
 */
export const useGeneratorCallback = <TT extends Task<any>, R, A extends any[]>(
  taskGenerator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  const [callback] = useGeneratorCallbackState(taskGenerator, deps);

  return callback;
};
