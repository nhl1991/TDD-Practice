export function execute(callback: (value: string) => void) {
  callback("hello");
}

export function notify(
  callback: (message: string) => void
) {
  callback("done");
}