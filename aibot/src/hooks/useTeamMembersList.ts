import { useQuery } from "@tanstack/react-query";
import { getTeamMembersList } from "@/api/teamApi";

export const useTeamMembersList = (enabled: boolean = true) => {
  const { data, isLoading } = useQuery({
    queryKey: ["team-members-list"],
    queryFn: getTeamMembersList,
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    members: data?.data?.members || [],
    isLoading,
  };
};
