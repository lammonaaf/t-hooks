/* eslint-disable no-throw-literal */

import { renderHook, act } from '@testing-library/react';
import {
  useGeneratorEffect,
  useGeneratorCallbackState,
  useGeneratorCallback,
  useTaskCallback,
  useGeneratorMemoState,
  useGeneratorMemo,
  useTaskMemo,
  useTaskCallbackState,
  useTaskEffect,
  useTaskMemoState,
} from '../';
import { Task } from 't-tasks';
import { useState } from 'react';
import { setImmediate } from 'timers';

import 'regenerator-runtime/runtime';

const reactStrictMode = false;

describe('useGeneratorEffect', () => {
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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

describe('useTaskEffect', () => {
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
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

    const [running, cancel] = useTaskEffect(
      () => Task.resolved(undefined).chain(() => key ? (
        Task.resolved(undefined)
          .tap(() => setState('start'))
          .chain(() => Task.timeout(1000))
          .tap(() => {
            if (key === 'throw') {
              throw new Error('Thrown');
            }
          })
          .tap(() => setState('end'))
      ) : Task.resolved(undefined)),
      [key, setState],
    );

    return { state, running, cancel };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: 'true' as string | null,
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = ({ data, success, error, done }: {
    data: string,
    success?: (result: string) => void;
    error?: (result: unknown) => void;
    done?: () => void;
  }) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const [callback, running, cancel] = useGeneratorCallbackState(
      function*(prefix: string) {
        try {
          setState('start');

          yield* Task.timeout(1000).generator();

          if (prefix === 'throw') {
            throw 'some-error';
          }

          setState('end');

          success?.(prefix + data);
        } catch (err) {
          error?.(err);
        } finally {
          done?.();
        }
      },
      [setState, data],
    );

    return { state, callback, running, cancel };
  };

  it('scenario1', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario2', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('throw');
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

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('some-error');
  });

  it('scenario3', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, unmount } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(0);
  });

  it('scenario4', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      result.current.callback('goodbye');
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

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye world');
  });

  it('scenario5', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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
      rerender({ data: ' me', success, error, done });
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario6', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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
      rerender({ data: ' me', success, error, done });
    });

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      result.current.callback('goodbye');
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

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye me');
  });

  it('scenario7', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(0);
  });
});

describe('useGeneratorCallback', () => {
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = ({ data, success, error, done }: {
    data: string,
    success?: (result: string) => void;
    error?: (result: unknown) => void;
    done?: () => void;
  }) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const [callback, running, cancel] = useGeneratorCallbackState(
      function*(prefix: string) {
        try {
          setState('start');

          yield* Task.timeout(1000).generator();

          if (prefix === 'throw') {
            throw 'some-error';
          }

          setState('end');

          success?.(prefix + data);
        } catch (err) {
          error?.(err);
        } finally {
          done?.();
        }
      },
      [setState, data],
    );

    return { state, callback, running, cancel };
  };

  it('scenario1', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario2', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('throw');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('start');

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('some-error');
  });

  it('scenario3', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, unmount } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      unmount();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(0);
  });

  it('scenario4', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      result.current.callback('goodbye');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye world');
  });

  it('scenario5', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      rerender({ data: ' me', success, error, done });
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario6', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      rerender({ data: ' me', success, error, done });
    });

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      result.current.callback('goodbye');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye me');
  });
});

describe('useTaskCallbackState', () => {
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = ({ data, success, error, done }: {
    data: string,
    success?: (result: string) => void;
    error?: (result: unknown) => void;
    done?: () => void;
  }) => {
    const [state, setState] = useState<'none' | 'start' | 'end'>('none');

    const [callback, running, cancel] = useTaskCallbackState(
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
          .tap(() => success?.(prefix + data))
          .tapRejected((err) => error?.(err))
          .matchTap({ resolved: () => done?.(), rejected: () => done?.(), canceled: () => void undefined }),
      [setState, data],
    );

    return { state, callback, running, cancel };
  };

  it('scenario1', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario2', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('throw');
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

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('some-error');
  });

  it('scenario3', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, unmount } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(0);
  });

  it('scenario4', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      result.current.callback('goodbye');
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

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye world');
  });

  it('scenario5', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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
      rerender({ data: ' me', success, error, done });
    });

    expect(result.current.state).toBe('start');
    expect(result.current.running).toBeTruthy();

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('end');
    expect(result.current.running).toBeFalsy();

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario6', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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
      rerender({ data: ' me', success, error, done });
    });

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      result.current.callback('goodbye');
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

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye me');
  });

  it('scenario7', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');
    expect(result.current.running).toBeFalsy();

    act(() => {
      result.current.callback('hello');
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

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(0);
  });
});

describe('useTaskCallback', () => {
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = ({ data, success, error, done }: {
    data: string,
    success?: (result: string) => void;
    error?: (result: unknown) => void;
    done?: () => void;
  }) => {
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
          .tap(() => success?.(prefix + data))
          .tapRejected((err) => error?.(err))
          .matchTap({ resolved: () => done?.(), rejected: () => done?.(), canceled: () => void undefined }),
      [setState, data],
    );

    return { state, callback };
  };

  it('scenario1', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario2', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('throw');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('start');

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('some-error');
  });

  it('scenario3', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, unmount } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      unmount();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('start');

    expect(success).toHaveBeenCalledTimes(0);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(0);
  });

  it('scenario4', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      result.current.callback('goodbye');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye world');
  });

  it('scenario5', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(500);
    });

    act(() => {
      rerender({ data: ' me', success, error, done });
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(500);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('hello world');
  });

  it('scenario6', async () => {
    const success = jest.fn();
    const error = jest.fn();
    const done = jest.fn();

    const { result, rerender } = renderHook(useTestCase, {
      initialProps: { data: ' world', success, error, done },
      reactStrictMode,
    });

    expect(result.current.state).toBe('none');

    act(() => {
      result.current.callback('hello');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      rerender({ data: ' me', success, error, done });
    });

    await act(async () => {
      await advanceTime(250);
    });

    act(() => {
      result.current.callback('goodbye');
    });

    await act(async () => {
      await flushPromises();
    });

    expect(result.current.state).toBe('start');

    await act(async () => {
      await advanceTime(1000);
    });

    expect(result.current.state).toBe('end');

    expect(success).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith('goodbye me');
  });
});

describe('useGeneratorMemoState', () => {
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
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
    const { result } = renderHook(useTestCase, {
      initialProps: 'hello',
      reactStrictMode,
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
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: 'throw',
      reactStrictMode,
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

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario3', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: 'hello',
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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

describe('useTaskMemoState', () => {
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
  afterEach(() => jest.useRealTimers());

  const flushPromises = async () => {
    return new Promise((resolve) => setImmediate(resolve));
  };

  const advanceTime = async (by: number) => {
    jest.advanceTimersByTime(by);

    return flushPromises();
  };

  const useTestCase = (data: string) => {
    const [length, running, cancel] = useTaskMemoState(
      0,
      () => Task.resolved(undefined)
        .chain(() => Task.timeout(1000))
        .tap(() => {
          if (data === 'throw') {
            throw 'some-error';
          }
        })
        .map(() => data.length),
      [data],
    );

    return { length, running, cancel };
  };

  it('scenario1', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: 'hello',
      reactStrictMode,
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
  });

  it('scenario2', async () => {
    const { result } = renderHook(useTestCase, {
      initialProps: 'throw',
      reactStrictMode,
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

    expect(result.current.length).toBe(0);
    expect(result.current.running).toBeFalsy();
  });

  it('scenario3', async () => {
    const { result, rerender } = renderHook(useTestCase, {
      initialProps: 'hello',
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
      reactStrictMode,
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
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
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
    const { result } = renderHook(useTestCase, {
      initialProps: 'hello',
      reactStrictMode,
    });

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
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
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
    const { result } = renderHook(useTestCase, {
      initialProps: 'hello',
      reactStrictMode,
    });

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
  beforeEach(() => jest.useFakeTimers({ legacyFakeTimers: true }));
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
    const { result } = renderHook(useTestCase, {
      reactStrictMode,
    });

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
