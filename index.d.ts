declare const withDerivedProp: ({
  source,
  handler,
  options,
}: {
  source: string
  handler: (prop: any) => any
  options?: { target?: string }
}) => (component: any) => any

declare const withDerivedProps: ({
  keys,
  derivationObjOrFn,
  options,
}: {
  keys: string[]
  derivationObjOrFn:
    | { [prop: string]: (props: object) => any }
    | ((props: object) => any)
  options?: { passAllProps?: boolean }
}) => (component: any) => any

export = withDerivedProps
