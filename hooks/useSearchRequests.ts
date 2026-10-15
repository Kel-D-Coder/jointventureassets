import { useState } from "react";
import { useAppSelector } from "@/hooks/hooks";
import { searchRequests as searchRequestsApi } from "@/lib/api/requests";
import { errorMessage } from "@/lib/api/mock";
import type { PartnerRequest, RequestType } from "@/types";

interface UseSearchRequestsResult {
  data: PartnerRequest[] | null;
  loading: boolean;
  error: string | null;
  searchRequests: (type?: string) => Promise<void>;
}

export const useSearchRequests = (): UseSearchRequestsResult => {
  const [data, setData] = useState<PartnerRequest[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAppSelector((state) => state.auth.token);

  const searchRequests = async (type?: string) => {
    try {
      setLoading(true);
      setError(null);
      setData(await searchRequestsApi(token, type as RequestType | undefined));
    } catch (err: unknown) {
      setError(errorMessage(err, "An error occurred while fetching requests"));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, searchRequests };
};
