import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https'

export interface CallableContext {
  auth?: {
    uid: string
    token: Record<string, any>
  }
}

export function defineCallable<T = any, R = any>(
  handler: (data: T, context: CallableContext) => Promise<R>
) {
  return onCall(async (request: CallableRequest<T>) => {
    const context: CallableContext = {
      auth: request.auth
        ? {
            uid: request.auth.uid,
            token: request.auth.token || {},
          }
        : undefined,
    }
    return handler(request.data, context)
  })
}

export { HttpsError }
