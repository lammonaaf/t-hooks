import { Task, generateTask, TaskCreator, TaskGenerator } from 't-tasks';
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
 * @param creator task creator to be invoked as effect
 * @param deps dependency list
 * @returns current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useEffect hook allowing to perform asynchronous operations as effects
 *
 * Task execution is automatically interrupted in case of effect re-render or unmounting. This way, only one task is running at the given time
 */
export const useTaskEffect = <T>(
  creator: TaskCreator<[], T>,
  deps: DependencyList,
) => {
  const creatorMemo = useCallback(creator, deps);

  const [task, setTask] = useState<Task<T> | null>(null);

  useEffect(() => {
    const innnerTask = creatorMemo()
      .tap(() => {
        setTask(null);
      })
      .tapRejected(() => {
        setTask(null);
      });

    setTask(innnerTask);
  }, [creatorMemo, setTask]);

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    if (task) {
      return () => {
        task.cancel();
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
 * @param generator task generator function
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
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskEffect(() => generateTask(generator), deps);
};

/**
 * Task-based asynchronous memo hook
 * @param defaultValue initial value available immediately
 * @param creator task creator to be invoked to get transformed value
 * @param deps depandency list
 * @returns memorized value, current execution status (running or not) and executed task to be spied on
 *
 * Task equivalent to useMemo hook allowing to perform asynchronous memorized transformations
 *
 * Task execution is automatically interrupted in case of hook re-render or unmounting. This way, only one task is running at the given time
 */
export const useTaskMemoState = <T>(
  defaultValue: T,
  creator: TaskCreator<[], T>,
  deps: DependencyList,
) => {
  const [state, setState] = useState<T>(defaultValue);

  const creatorMemo = useCallback(creator, deps);

  const [task, setTask] = useState<Task<T> | null>(null);

  useEffect(() => {
    const innnerTask = creatorMemo()
      .tap((result) => {
        setState(result);

        setTask(null);
      })
      .tapRejected(() => {
        setTask(null);
      });

    setTask(innnerTask);
  }, [creatorMemo, setTask, setState]);

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    if (task) {
      return () => {
        task.cancel();
      };
    } else {
      return undefined;
    }
  }, [task]);

  const running = !!task;

  return useMemo(() => tuple(state, running, cancel), [state, running, cancel]);
};

/**
 * Task-based asynchronous memo hook (convinience binding)
 * @param defaultValue initial value available immediately
 * @param creator task creator to be invoked to get transformed value
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
  creator: () => Task<T>,
  deps: DependencyList,
) => {
  const [state] = useTaskMemoState(defaultValue, creator, deps);

  return state;
};

/**
 * Generator-based asynchronous memo hook
 * @param defaultValue initial value available immediately
 * @param generator task generator function
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
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  return useTaskMemoState(defaultValue, () => generateTask(generator), deps);
};

/**
 * Generator-based asynchronous memo hook (convinience binding)
 * @param defaultValue initial value available immediately
 * @param generator task generator function
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
  generator: TaskGenerator<[], TT, R>,
  deps: DependencyList,
) => {
  const [state] = useGeneratorMemoState(defaultValue, generator, deps);

  return state;
};

/**
 * Task-based asynchronous callback hook
 * @param creator task creator to be invoked as callback
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
  creator: TaskCreator<A, T>,
  deps: DependencyList,
) => {
  const [task, setTask] = useState<Task<T> | null>(null);

  const creatorMemo = useCallback(creator, deps);

  const callback = useCallback(
    (...args: A) => {
      const innerTask = creatorMemo(...args)
        .tap(() => {
          setTask(null);
        })
        .tapRejected(() => {
          setTask(null);
        });

      setTask(innerTask);

      return innerTask;
    },
    [setTask, creatorMemo],
  );

  const cancel = useCallback(() => setTask(null), [setTask]);

  useEffect(() => {
    if (task) {
      return () => {
        task.cancel();
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
 * @param creator task creator to be invoked as callback
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
  creator: TaskCreator<A, T>,
  deps: DependencyList,
) => {
  const [callback] = useTaskCallbackState(creator, deps);

  return callback;
};

/**
 * Generator-based asynchronous callback hook
 * @param generator task generator function
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
  generator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  return useTaskCallbackState((...args: A) => {
    return generateTask(function*() {
      return yield* generator(...args);
    });
  }, deps);
};

/**
 * Generator-based asynchronous callback hook (convinience binding)
 * @param generator task generator function
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
  generator: TaskGenerator<A, TT, R>,
  deps: DependencyList,
) => {
  const [callback] = useGeneratorCallbackState(generator, deps);

  return callback;
};
