
export function runCallback(cb: (value: string) => void) {
  cb("hello");
}

export function runCallbackWithReturn(cb: (value: string) => string) {
  return cb("hello");
}


export function runCallbackWithError(cb: (value: string) => void) {
  
    cb("hello");
}