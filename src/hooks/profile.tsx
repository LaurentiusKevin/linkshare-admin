import {useQuery} from "react-query";
import {getProfile, ProfileParams} from "../api/profile";

export const useProfileList = (host: string, payload: ProfileParams) => {
  return useQuery(
    ['profile-list', payload],
    async () => await getProfile(host, payload),
    {keepPreviousData: true}
  )
}
