import * as React from 'react';
import { useGeneratorMemoState } from '../../.';
import { castResultCreator, liftResult } from 't-tasks';
import { v4 as randomUuid } from 'uuid';

// Simulate a long fetch operation
const fetchUserData = async (userId: string) => {
  return new Promise<{
    userId: string;
    name: string;
  }>((resolve) => {
    setTimeout(() => {
      resolve({ userId, name: 'some-random-name' });
    }, 2000);
  });
};

// One may also want to lift async function straight to task creator in order to later call it without mandatory liftResult
// const fetchUserDataTask = liftResultCreator(fetchUserData);

export const Example = () => {
  const [userId, setUserId] = React.useState<string | null>(null);

  const [userData, running, cancel] = useGeneratorMemoState(
    null,
    function*() {
      if (!userId) {
        return null;
      }

      return castResultCreator<typeof fetchUserData>(
        yield liftResult(fetchUserData(userId)),
      );
    },
    [userId],
  );

  const callback = React.useCallback(() => {
    setUserId(randomUuid());
  }, [setUserId]);

  return (
    <div style={{ fontFamily: 'Arial' }}>
      Press this button to update userId and start a new operation to get
      userData
      <div
        style={{ background: 'gray', padding: 10, margin: 5 }}
        onClick={callback}
      >
        {userData ? JSON.stringify(userData) : '(null)'}{' '}
        {running && `...fetching ${userId}`}
      </div>
      Press this button to cancel current operation (if any)
      <div
        style={{ background: 'gray', padding: 10, margin: 5 }}
        onClick={cancel}
      >
        Cancel
      </div>
    </div>
  );
};
