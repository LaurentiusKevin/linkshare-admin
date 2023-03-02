import axios from "axios";

export type ProfileParams = {
  orderColumn?: string
  orderDirection?: 'desc' | 'asc'
  startData?: number
  limit?: number
}

export async function getProfile(host: string, props: ProfileParams) {
  let nextDataNumber = ((props.startData ?? 0) * (props.limit ?? 10))
  nextDataNumber = nextDataNumber === 0 ? 0 : nextDataNumber + 1
  return await axios
    .get(host+'/api/profile', {
      params: {
        ...props,
        startData: nextDataNumber
      }
    })
}
