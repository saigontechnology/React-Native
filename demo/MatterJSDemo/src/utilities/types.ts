interface IDataRefs {
  eventName: string
  callback: (param: any) => void
}

export type IRefs = {[key: string]: IDataRefs}

export type EmitterListener = {
  count: number
  refs: IRefs
}

export type MatterBodyProps = {
  body: Matter.Body
  size: number[]
  color?: string
  renderer: React.ReactElement
}

export type BodyPosition = {
  x: number
  y: number
}
