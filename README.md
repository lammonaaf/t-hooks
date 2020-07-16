# T-Hooks task-based Readct hook library

This project is intended to solve the issue of promise canceling && external failing in a semi-functional way.
Sometimes (for example, within React hooks) you need to cancel any ongoing asynchronous operation to prevent side-effects. Switching from async functions to chained tasks one can simply cancel current task execution ensuring that the operation will be cancelled at the nearest spot, preventing any unwanted side efects afterwards.

## Examples

Below are some prominent examples
