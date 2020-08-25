/* eslint-disable no-throw-literal */
import { renderHook, act } from '@testing-library/react-hooks';
import {
  useGeneratorEffect,
  useGeneratorCallbackState,
  useGeneratorCallback,
  useTaskCallback,
  useGeneratorMemoState,
  useGeneratorMemo,
  useTaskMemo,
} from '../';
import { Task, Maybe, Either } from 't-tasks';
import { useState } from 'react';

import 'regenerator-runtime/runtime';

describe('useTaskEffect', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (key: string | null) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const [running, cancel] = useGeneratorEffect(
      function*() {
        if (key) {
          setState('start');

          yield* Task.timeout(1000).generator();

          if (key === 'throw') {
            throw new Error('Thrown');
          }

          setState('end');
        }
      },
      [key, setState],
    );

    return { state, running, cancel };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: 'true' as string | null,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: 'throw' as string | null,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();
  });

  it('scenario3', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      rerender('true');
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();
  });

  it('scenario4', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      rerender('true');
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      rerender(null);
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();
  });

  it('scenario5', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      rerender('true');
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    act(() => {
      rerender('thru');
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();
  });

  it('scenario6', async () => {
    const { result, rerender, unmount } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      rerender('true');
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    act(() => {
      unmount();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();
  });

  it('scenario7', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: null as string | null,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      rerender('true');
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    act(() => {
      result.current.cancel();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();
  });
});

describe('useGeneratorCallbackState', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (data: string) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const [callback, running, cancel] = useGeneratorCallbackState(
      function*(prefix: string) {
        setState('start');

        yield* Task.timeout(1000).generator();

        if (prefix === 'throw') {
          throw 'some-error';
        }

        setState('end');

        return prefix + data;
      },
      [setState, data],
    );

    return { state, callback, running, cancel };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn();

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello').tap((r) => {
        callback(r);
        expect(r).toStrictEqual('hello world');
      });
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith('hello world');
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn();

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('throw').tapRejected((r) => {
        callback(r);
        expect(r).toStrictEqual('some-error');
      });
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith('some-error');
  });

  it('scenario3', async () => {
    const { result, unmount } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn();

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello').tapCanceled(() => {
        callback();
      });
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      unmount();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith();
  });

  it('scenario4', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello').tapCanceled(() => {
        callback1();
      });
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      result.current.callback('goodbye').tap((r) => {
        callback2(r);
        expect(r).toStrictEqual('goodbye world');
      });
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();

    expect(callback1).toBeCalledTimes(1);
    expect(callback1).toBeCalledWith();
    expect(callback2).toBeCalledTimes(1);
    expect(callback2).toBeCalledWith('goodbye world');
  });

  it('scenario5', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn();

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello').tap((r) => {
        callback(r);
        expect(r).toStrictEqual('hello world');
      });
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      rerender(' me');
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith('hello world');
  });

  it('scenario6', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello').tapCanceled(() => {
        callback1();
      });
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      rerender(' me');
    });

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      result.current.callback('goodbye').tap((r) => {
        callback2(r);
        expect(r).toStrictEqual('goodbye me');
      });
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();

    expect(callback1).toBeCalledTimes(1);
    expect(callback1).toBeCalledWith();
    expect(callback2).toBeCalledTimes(1);
    expect(callback2).toBeCalledWith('goodbye me');
  });

  it('scenario7', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn();

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello').tapCanceled(() => {
        callback();
      });
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      result.current.cancel();
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeFalsy();

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith();
  });
});

describe('useGeneratorCallback', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (data: string) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const callback = useGeneratorCallback(
      function*(prefix: string) {
        setState('start');

        yield* Task.timeout(1000).generator();

        if (prefix === 'throw') {
          throw 'some-error';
        }

        setState('end');

        return prefix + data;
      },
      [setState, data],
    );

    return { state, callback };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, { initialProps: ' world' });

    const callback = jest.fn();

    await act(async () => {
      expect(result.current.state).toBe('none');

      const task = result.current.callback('hello');

      await flushPromises();

      expect(result.current.state).toBe('start');

      await advanceTime(1000);

      expect(result.current.state).toBe('end');

      const r = await task.resolve();

      callback(r);

      expect(r).toStrictEqual(Maybe.just(Either.right('hello world')));
    });

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(Maybe.just(Either.right('hello world')));
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, { initialProps: ' world' });

    const callback = jest.fn();

    await act(async () => {
      expect(result.current.state).toBe('none');

      const task = result.current.callback('throw');

      await flushPromises();

      expect(result.current.state).toBe('start');

      await advanceTime(1000);

      expect(result.current.state).toBe('start');

      const r = await task.resolve();

      callback(r);

      expect(r).toStrictEqual(Maybe.just(Either.left('some-error')));
    });

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(Maybe.just(Either.left('some-error')));
  });

  it('scenario3', async () => {
    const { result, unmount } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn();

    await act(async () => {
      expect(result.current.state).toBe('none');

      const task = result.current.callback('hello');

      await flushPromises();

      expect(result.current.state).toBe('start');

      await advanceTime(500);

      unmount();

      await advanceTime(500);

      expect(result.current.state).toBe('start');

      const r = await task.resolve();

      callback(r);

      expect(r).toStrictEqual(Maybe.nothing());
    });

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(Maybe.nothing());
  });
});

describe('useTaskCallback', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (data: string) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const callback = useTaskCallback(
      (prefix: string) =>
        Task.resolved(undefined)
          .tap(() => setState('start'))
          .chain(() => Task.timeout(1000))
          .tap(() => {
            if (prefix === 'throw') {
              throw 'some-error';
            }
          })
          .tap(() => setState('end'))
          .map(() => prefix + data),
      [setState, data],
    );

    return { state, callback };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, { initialProps: ' world' });

    const callback = jest.fn();

    await act(async () => {
      expect(result.current.state).toBe('none');

      const task = result.current.callback('hello');

      await flushPromises();

      expect(result.current.state).toBe('start');

      await advanceTime(1000);

      expect(result.current.state).toBe('end');

      const r = await task.resolve();

      callback(r);

      expect(r).toStrictEqual(Maybe.just(Either.right('hello world')));
    });

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(Maybe.just(Either.right('hello world')));
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, { initialProps: ' world' });

    const callback = jest.fn();

    await act(async () => {
      expect(result.current.state).toBe('none');

      const task = result.current.callback('throw');

      await flushPromises();

      expect(result.current.state).toBe('start');

      await advanceTime(1000);

      expect(result.current.state).toBe('start');

      const r = await task.resolve();

      callback(r);

      expect(r).toStrictEqual(Maybe.just(Either.left('some-error')));
    });

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(Maybe.just(Either.left('some-error')));
  });

  it('scenario3', async () => {
    const { result, unmount } = renderHook(useTestCase, {
      initialProps: ' world',
    });

    const callback = jest.fn();

    await act(async () => {
      expect(result.current.state).toBe('none');

      const task = result.current.callback('hello');

      await flushPromises();

      expect(result.current.state).toBe('start');

      await advanceTime(500);

      unmount();

      await advanceTime(500);

      expect(result.current.state).toBe('start');

      const r = await task.resolve();

      callback(r);

      expect(r).toStrictEqual(Maybe.nothing());
    });

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(Maybe.nothing());
  });
});

describe('useGeneratorMemoState', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (data: string) => {
    const [length, running, cancel] = useGeneratorMemoState(
      0,
      function*() {
        yield* Task.timeout(1000).generator();

        if (data === 'throw') {
          throw 'some-error';
        }

        return data.length;
      },
      [data],
    );

    return { length, running, cancel };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, { initialProps: 'hello' });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, { initialProps: 'throw' });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario3', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: 'hello',
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeFalsy();

    act(() => {
      rerender('myaa');
    });

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(5);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(4);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario4', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: 'hello',
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    act(() => {
      rerender('myaa');
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(4);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario5', async () => {
    const { result, unmount } = renderHook(useTestCase, {
      initialProps: 'hello',
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    act(() => {
      unmount();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();
  });

  it('scenario6', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: 'hello',
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeTruthy();

    act(() => {
      result.current.cancel();
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();
  });
});

describe('useGeneratorMemo', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (data: string) => {
    const length = useGeneratorMemo(
      0,
      function*() {
        yield* Task.timeout(1000).generator();

        return data.length;
      },
      [data],
    );

    return { length };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, { initialProps: 'hello' });

    expect(result.current.length).toBe(0);

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(5);
  });
});

describe('useTaskMemo', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (data: string) => {
    const length = useTaskMemo(
      0,
      () => Task.timeout(1000).map(() => data.length),
      [data],
    );

    return { length };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, { initialProps: 'hello' });

    expect(result.current.length).toBe(0);

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(5);
  });
});

describe('useGeneratorMemo', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = () => {
    const data = useGeneratorMemo(
      null,
      // eslint-disable-next-line require-yield
      function*() {
        return 'hello';
      },
      [],
    );

    const length = useGeneratorMemo(
      0,
      function*() {
        if (!data) {
          return 0;
        }

        yield* Task.timeout(1000).generator();

        return data.length;
      },
      [data],
    );

    return { length };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase);

    expect(result.current.length).toBe(0);

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.length).toBe(0);

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.length).toBe(5);
  });
});
